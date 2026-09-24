from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from models.database_models import DPRIncidentDB

class IncidentEngine:
    """
    Manages production incident workflows (DETECTED, ACKNOWLEDGED, INVESTIGATING, MITIGATING, RESOLVED, CLOSED).
    """

    @staticmethod
    def create_incident(db: Session, title: str, component: str, severity: str = "WARNING", description: Optional[str] = None) -> DPRIncidentDB:
        incident = DPRIncidentDB(
            title=title,
            affected_component=component,
            severity=severity,
            description=description,
            status="DETECTED"
        )
        db.add(incident)
        db.commit()
        db.refresh(incident)
        return incident

    @staticmethod
    def resolve_incident(db: Session, incident_id: str, root_cause: str, resolution: str) -> DPRIncidentDB:
        incident = db.query(DPRIncidentDB).filter(DPRIncidentDB.id == incident_id).first()
        if incident:
            incident.status = "RESOLVED"
            incident.root_cause = root_cause
            incident.resolution = resolution
            db.commit()
            db.refresh(incident)
        return incident
