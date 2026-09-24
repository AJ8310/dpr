import os
import shutil
import uuid
from typing import Dict, Any, Optional
from database import SessionLocal
from models.database_models import DocumentMetadataDB
from config import settings

class StorageService:

    UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    @classmethod
    def save_document(
        cls,
        file_bytes: bytes,
        filename: str,
        document_type: str = "pdf",
        user_id: Optional[str] = None,
        mime_type: str = "application/pdf"
    ) -> Dict[str, Any]:
        doc_id = str(uuid.uuid4())
        safe_filename = f"{doc_id}_{filename}"
        local_path = os.path.join(cls.UPLOAD_DIR, safe_filename)

        with open(local_path, "wb") as f:
            f.write(file_bytes)

        file_size = len(file_bytes)
        relative_url = f"/uploads/{safe_filename}"

        # Persist metadata to database
        db = SessionLocal()
        try:
            doc_meta = DocumentMetadataDB(
                id=doc_id,
                user_id=user_id,
                document_name=filename,
                document_type=document_type,
                storage_path=relative_url,
                file_size_bytes=file_size,
                mime_type=mime_type,
                version=1
            )
            db.add(doc_meta)
            db.commit()
            db.refresh(doc_meta)
        except Exception as e:
            print(f"Warning: Could not save document metadata for {filename}: {e}")
            db.rollback()
        finally:
            db.close()

        return {
            "document_id": doc_id,
            "document_name": filename,
            "storage_path": relative_url,
            "file_size_bytes": file_size,
            "mime_type": mime_type
        }
