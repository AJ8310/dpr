from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from models.database_models import DPRAlertDB

class AlertEngine:
    """
    Evaluates real-time operational thresholds and manages system alert lifecycle (OPEN, ACKNOWLEDGED, RESOLVED).
    """

    @staticmethod
    def trigger_alert(db: Session, rule_id: str, metric_name: str, threshold: float, current_value: float, severity: str, message: str) -> DPRAlertDB:
        alert = DPRAlertDB(
            rule_id=rule_id,
            metric_name=metric_name,
            threshold=threshold,
            current_value=current_value,
            severity=severity,
            status="OPEN",
            message=message
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        return alert

    @staticmethod
    def acknowledge_alert(db: Session, alert_id: str) -> DPRAlertDB:
        alert = db.query(DPRAlertDB).filter(DPRAlertDB.id == alert_id).first()
        if alert:
            alert.status = "ACKNOWLEDGED"
            db.commit()
            db.refresh(alert)
        return alert

    @staticmethod
    def resolve_alert(db: Session, alert_id: str) -> DPRAlertDB:
        alert = db.query(DPRAlertDB).filter(DPRAlertDB.id == alert_id).first()
        if alert:
            alert.status = "RESOLVED"
            db.commit()
            db.refresh(alert)
        return alert
