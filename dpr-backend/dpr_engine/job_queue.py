import os
import uuid
import datetime
from typing import Dict, Any, Optional
from database import SessionLocal
from models.database_models import DPRJobDB

class DPRJobQueueManager:

    _jobs_cache: Dict[str, Dict[str, Any]] = {}

    @classmethod
    def create_job(cls, dpr_type: str, dpr_depth: str, user_id: Optional[str] = None, dpr_id: Optional[str] = None) -> str:
        job_id = f"job_{uuid.uuid4().hex[:10]}"
        job_dict = {
            "job_id": job_id,
            "dpr_id": dpr_id,
            "user_id": user_id,
            "dpr_type": dpr_type,
            "dpr_depth": dpr_depth,
            "status": "QUEUED",  # QUEUED -> PROCESSING -> COMPLETED / FAILED / CANCELLED
            "progress_percent": 5,
            "step_name": "Job Enqueued",
            "pdf_filename": None,
            "docx_filename": None,
            "error": None,
            "retry_count": 0,
            "started_at": datetime.datetime.utcnow(),
            "completed_at": None
        }
        cls._jobs_cache[job_id] = job_dict

        # Persist to database
        db = SessionLocal()
        try:
            db_job = DPRJobDB(
                id=job_id,
                dpr_id=dpr_id,
                user_id=user_id,
                dpr_type=dpr_type,
                dpr_depth=dpr_depth,
                status="QUEUED",
                progress_percent=5,
                step_name="Job Enqueued",
                started_at=datetime.datetime.utcnow()
            )
            db.add(db_job)
            db.commit()
        except Exception as e:
            print(f"Warning: Failed to persist job {job_id} to DB: {e}")
            db.rollback()
        finally:
            db.close()

        return job_id

    @classmethod
    def update_progress(cls, job_id: str, progress: int, step_name: str):
        prog = min(100, max(0, progress))
        status = "PROCESSING" if prog < 100 else "COMPLETED"

        if job_id in cls._jobs_cache:
            cls._jobs_cache[job_id]["progress_percent"] = prog
            cls._jobs_cache[job_id]["step_name"] = step_name
            cls._jobs_cache[job_id]["status"] = status

        db = SessionLocal()
        try:
            db_job = db.query(DPRJobDB).filter(DPRJobDB.id == job_id).first()
            if db_job:
                db_job.progress_percent = prog
                db_job.step_name = step_name
                db_job.status = status
                db.commit()
        except Exception as e:
            print(f"Warning: Failed to update job progress for {job_id}: {e}")
            db.rollback()
        finally:
            db.close()

    @classmethod
    def set_completed(cls, job_id: str, pdf_filename: str, docx_filename: str):
        now = datetime.datetime.utcnow()
        if job_id in cls._jobs_cache:
            cls._jobs_cache[job_id]["status"] = "COMPLETED"
            cls._jobs_cache[job_id]["progress_percent"] = 100
            cls._jobs_cache[job_id]["step_name"] = "DPR Generation Complete"
            cls._jobs_cache[job_id]["pdf_filename"] = pdf_filename
            cls._jobs_cache[job_id]["docx_filename"] = docx_filename
            cls._jobs_cache[job_id]["completed_at"] = now

        db = SessionLocal()
        try:
            db_job = db.query(DPRJobDB).filter(DPRJobDB.id == job_id).first()
            if db_job:
                db_job.status = "COMPLETED"
                db_job.progress_percent = 100
                db_job.step_name = "DPR Generation Complete"
                db_job.pdf_filename = pdf_filename
                db_job.docx_filename = docx_filename
                db_job.completed_at = now
                db.commit()
        except Exception as e:
            print(f"Warning: Failed to mark job completed for {job_id}: {e}")
            db.rollback()
        finally:
            db.close()

    @classmethod
    def set_failed(cls, job_id: str, error_msg: str):
        now = datetime.datetime.utcnow()
        if job_id in cls._jobs_cache:
            cls._jobs_cache[job_id]["status"] = "FAILED"
            cls._jobs_cache[job_id]["error"] = error_msg
            cls._jobs_cache[job_id]["completed_at"] = now

        db = SessionLocal()
        try:
            db_job = db.query(DPRJobDB).filter(DPRJobDB.id == job_id).first()
            if db_job:
                db_job.status = "FAILED"
                db_job.error = error_msg
                db_job.completed_at = now
                db.commit()
        except Exception as e:
            print(f"Warning: Failed to set job failed state for {job_id}: {e}")
            db.rollback()
        finally:
            db.close()

    @classmethod
    def get_job_status(cls, job_id: str) -> Optional[Dict[str, Any]]:
        if job_id in cls._jobs_cache:
            return cls._jobs_cache[job_id]

        db = SessionLocal()
        try:
            db_job = db.query(DPRJobDB).filter(DPRJobDB.id == job_id).first()
            if db_job:
                job_data = {
                    "job_id": db_job.id,
                    "dpr_id": db_job.dpr_id,
                    "user_id": db_job.user_id,
                    "dpr_type": db_job.dpr_type,
                    "dpr_depth": db_job.dpr_depth,
                    "status": db_job.status,
                    "progress_percent": db_job.progress_percent,
                    "step_name": db_job.step_name,
                    "pdf_filename": db_job.pdf_filename,
                    "docx_filename": db_job.docx_filename,
                    "error": db_job.error,
                    "retry_count": db_job.retry_count,
                    "started_at": db_job.started_at,
                    "completed_at": db_job.completed_at
                }
                cls._jobs_cache[job_id] = job_data
                return job_data
        except Exception as e:
            print(f"Warning: Failed to query job status for {job_id}: {e}")
        finally:
            db.close()

        return None
