from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, JSON, Boolean, Float
from sqlalchemy.sql import func
from database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class UserDB(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="PROMOTER", nullable=False)  # ADMIN, PROMOTER, REVIEWER, SUPER_ADMIN
    company = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    service_type = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login_at = Column(DateTime(timezone=True), nullable=True)

class DPRSubmissionDB(Base):
    __tablename__ = "dpr_submissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    dpr_type = Column(String(100), nullable=False)
    business_name = Column(String(255), nullable=False)
    full_form_json = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class DPRJobDB(Base):
    __tablename__ = "dpr_jobs"

    id = Column(String(64), primary_key=True)
    dpr_id = Column(String(36), nullable=True)
    user_id = Column(String(36), nullable=True)
    dpr_type = Column(String(100), nullable=False)
    dpr_depth = Column(String(50), nullable=False, default="standard")
    status = Column(String(50), nullable=False, default="QUEUED")  # QUEUED, PROCESSING, RETRYING, COMPLETED, FAILED, CANCELLED
    progress_percent = Column(Integer, default=0)
    step_name = Column(String(255), default="Job Enqueued")
    pdf_filename = Column(String(255), nullable=True)
    docx_filename = Column(String(255), nullable=True)
    error = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DocumentMetadataDB(Base):
    __tablename__ = "document_metadata"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    document_name = Column(String(255), nullable=False)
    document_type = Column(String(50), nullable=False)  # pdf, docx, image, chart
    storage_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    mime_type = Column(String(100), default="application/pdf")
    version = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# ==========================================
# PHASE 2: DYNAMIC DPR BLUEPRINT ENTITIES
# ==========================================

class DPRSectorDB(Base):
    __tablename__ = "dpr_sectors"

    id = Column(String(50), primary_key=True)  # e.g. manufacturing, food_processing
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="fa-industry")
    is_active = Column(Boolean, default=True)

class DPRBusinessActivityDB(Base):
    __tablename__ = "dpr_activities"

    id = Column(String(50), primary_key=True)  # e.g. spice_processing, cnc_machining
    sector_id = Column(String(50), ForeignKey("dpr_sectors.id"), nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    hsn_code = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)

class DPRProjectTypeDB(Base):
    __tablename__ = "dpr_project_types"

    id = Column(String(50), primary_key=True)  # new_project, expansion, modernization, startup
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

class DPRGeographyDB(Base):
    __tablename__ = "dpr_geographies"

    id = Column(String(50), primary_key=True)  # e.g. IN-KA
    country = Column(String(100), default="India")
    state = Column(String(100), default="Karnataka")
    districts_json = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)

class DPRBlueprintDB(Base):
    __tablename__ = "dpr_blueprints"

    id = Column(String(64), primary_key=True)  # e.g. blueprint_bank_loan_v1.0
    dpr_type = Column(String(100), nullable=False, index=True)  # "Bank Loan DPR", "Govt Subsidy DPR", "Investor / Business Pitch DPR"
    sector_id = Column(String(50), nullable=True)
    version = Column(String(20), nullable=False, default="1.0.0")
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    sections_json = Column(JSON, nullable=False)
    questions_json = Column(JSON, nullable=False)
    rules_json = Column(JSON, nullable=True)
    documents_json = Column(JSON, nullable=True)
    research_json = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class DPRProjectDB(Base):
    __tablename__ = "dpr_projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    business_name = Column(String(255), nullable=False)
    dpr_type = Column(String(100), nullable=False)
    sector_id = Column(String(50), nullable=False)
    activity_id = Column(String(50), nullable=False)
    project_type_id = Column(String(50), nullable=False, default="new_project")
    geography_id = Column(String(50), nullable=False, default="IN-KA")
    project_scale = Column(String(50), nullable=False, default="medium")
    blueprint_id = Column(String(64), ForeignKey("dpr_blueprints.id"), nullable=False)
    blueprint_version = Column(String(20), nullable=False, default="1.0.0")
    form_data_json = Column(JSON, nullable=True)
    status = Column(String(50), nullable=False, default="DRAFT")  # DRAFT, IN_PROGRESS, VALIDATED, GENERATING, COMPLETED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

# ==========================================
# PHASE 3: DYNAMIC QUESTION ENGINE ENTITIES
# ==========================================

class DPRQuestionDB(Base):
    __tablename__ = "dpr_questions"

    id = Column(String(64), primary_key=True)  # e.g. q_bank_loan_amt
    blueprint_id = Column(String(64), ForeignKey("dpr_blueprints.id"), nullable=True, index=True)
    section_id = Column(String(50), nullable=False)
    key = Column(String(100), nullable=False, index=True)
    label = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    help_text = Column(Text, nullable=True)
    field_type = Column(String(50), nullable=False, default="TEXT")  # TEXT, TEXTAREA, NUMBER, CURRENCY, PERCENTAGE, DATE, SELECT, MULTI_SELECT, RADIO, CHECKBOX, BOOLEAN, FILE, TABLE, REPEATABLE_GROUP
    data_type = Column(String(50), nullable=False, default="string")  # string, integer, decimal, boolean, date, currency, percentage, array, object
    required = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    placeholder = Column(String(255), nullable=True)
    default_value_json = Column(JSON, nullable=True)
    options_json = Column(JSON, nullable=True)
    validation_rules_json = Column(JSON, nullable=True)
    conditions_json = Column(JSON, nullable=True)
    dependencies_json = Column(JSON, nullable=True)
    source = Column(String(50), default="SYSTEM_CONFIGURED")
    version = Column(String(20), default="1.0.0")
    is_active = Column(Boolean, default=True)

class DPRResponseDB(Base):
    __tablename__ = "dpr_responses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("dpr_projects.id"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    question_id = Column(String(64), nullable=False, index=True)
    question_key = Column(String(100), nullable=False, index=True)
    question_version = Column(String(20), default="1.0.0")
    value_json = Column(JSON, nullable=True)  # Stores value (string, number, list, or dict)
    source = Column(String(50), default="USER_PROVIDED")  # USER_PROVIDED, AI_SUGGESTED, SYSTEM_CALCULATED, IMPORTED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

# ==========================================
# PHASE 5: DPR AGENT ARCHITECTURE ENTITIES
# ==========================================

class DPRAgentTaskDB(Base):
    __tablename__ = "dpr_agent_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("dpr_projects.id"), nullable=False, index=True)
    agent_id = Column(String(50), nullable=False, index=True)  # intake_agent, research_agent, market_agent, scheme_agent, financial_agent, validation_agent, content_agent
    agent_version = Column(String(20), nullable=False, default="1.0.0")
    status = Column(String(50), nullable=False, default="QUEUED")  # QUEUED, RUNNING, COMPLETED, FAILED, RETRYING, CANCELLED
    priority = Column(Integer, default=1)
    input_reference_json = Column(JSON, nullable=True)
    output_reference_json = Column(JSON, nullable=True)
    error = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DPRAgentResultDB(Base):
    __tablename__ = "dpr_agent_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    task_id = Column(String(36), ForeignKey("dpr_agent_tasks.id"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("dpr_projects.id"), nullable=False, index=True)
    agent_id = Column(String(50), nullable=False, index=True)
    agent_version = Column(String(20), nullable=False, default="1.0.0")
    confidence = Column(Float, default=0.95)
    findings_json = Column(JSON, nullable=True)
    recommendations_json = Column(JSON, nullable=True)
    sources_json = Column(JSON, nullable=True)
    warnings_json = Column(JSON, nullable=True)
    approval_status = Column(String(50), nullable=False, default="NOT_REQUIRED")  # NOT_REQUIRED, PENDING_APPROVAL, APPROVED, REJECTED
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DPRResearchSourceDB(Base):
    __tablename__ = "dpr_research_sources"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("dpr_projects.id"), nullable=False, index=True)
    url = Column(String(500), nullable=True)
    source_name = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    retrieved_at = Column(DateTime(timezone=True), server_default=func.now())
    summary = Column(Text, nullable=True)
    confidence = Column(Float, default=0.90)

class DPRSchemeRuleDB(Base):
    __tablename__ = "dpr_schemes"

    id = Column(String(50), primary_key=True)  # pmegp_scheme_v1.0
    scheme_name = Column(String(255), nullable=False)
    authority = Column(String(255), default="KVIC / MSME")
    version = Column(String(20), default="1.0.0")
    applicable_sectors_json = Column(JSON, nullable=True)
    eligibility_rules_json = Column(JSON, nullable=True)
    subsidy_formula_json = Column(JSON, nullable=True)
    source_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)

# ==========================================
# PHASE 6: DPR INTELLIGENCE & RESEARCH ENTITIES
# ==========================================

class DPRIntelligenceItemDB(Base):
    __tablename__ = "dpr_intelligence_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("dpr_projects.id"), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)  # MARKET, INDUSTRY, COMPETITION, GEOGRAPHY, RAW_MATERIAL, CUSTOMER, TECHNOLOGY, SCHEME, REGULATION, FINANCIAL, RISK
    sub_category = Column(String(50), nullable=True)
    value_json = Column(JSON, nullable=True)
    unit = Column(String(50), nullable=True)
    source = Column(String(255), nullable=True)
    source_url = Column(String(500), nullable=True)
    source_title = Column(String(255), nullable=True)
    classification = Column(String(50), nullable=False, default="AI_INFERENCE")  # USER_PROVIDED, VERIFIED_EXTERNAL, SYSTEM_CALCULATED, AI_INFERENCE, AI_ASSUMPTION, UNVERIFIED
    confidence = Column(Float, default=0.90)
    agent_id = Column(String(50), nullable=True)
    agent_version = Column(String(20), default="1.0.0")
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DPRResearchCacheDB(Base):
    __tablename__ = "dpr_research_cache"

    id = Column(String(64), primary_key=True)
    cache_key = Column(String(255), unique=True, index=True, nullable=False)
    sector_id = Column(String(50), index=True)
    activity_id = Column(String(50), index=True)
    geography_id = Column(String(50), index=True)
    topic = Column(String(100), nullable=False)
    result_json = Column(JSON, nullable=False)
    freshness_days = Column(Integer, default=30)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DPRRiskItemDB(Base):
    __tablename__ = "dpr_risks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("dpr_projects.id"), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)  # MARKET, FINANCIAL, OPERATIONAL, TECHNICAL, REGULATORY, SUPPLY_CHAIN, LOCATION, MANPOWER, COMPETITION
    description = Column(Text, nullable=False)
    severity = Column(String(20), default="MEDIUM")  # HIGH, MEDIUM, LOW
    likelihood = Column(String(20), default="MEDIUM")  # HIGH, MEDIUM, LOW
    impact = Column(Text, nullable=True)
    mitigation = Column(Text, nullable=True)
    source = Column(String(100), default="AI_INFERENCE")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# ==========================================
# PHASE 7: DPR CONTENT GENERATION ENTITIES
# ==========================================

class DPRContentPackageDB(Base):
    __tablename__ = "dpr_content_packages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("dpr_projects.id"), nullable=False, index=True, unique=True)
    dpr_type = Column(String(100), nullable=False)
    blueprint_id = Column(String(64), nullable=False)
    blueprint_version = Column(String(20), default="1.0.0")
    content_version = Column(String(20), default="1.0.0")
    target_depth = Column(String(50), default="STANDARD")  # MINIMUM, STANDARD, DETAILED, COMPREHENSIVE
    overall_completeness = Column(Integer, default=0)
    validation_status = Column(String(50), default="NOT_STARTED")  # NOT_STARTED, VALIDATING, VALIDATED, VALIDATION_FAILED
    global_warnings_json = Column(JSON, nullable=True)
    global_assumptions_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class DPRContentSectionDB(Base):
    __tablename__ = "dpr_content_sections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    package_id = Column(String(36), ForeignKey("dpr_content_packages.id"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("dpr_projects.id"), nullable=False, index=True)
    section_key = Column(String(100), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    display_order = Column(Integer, default=0)
    status = Column(String(50), default="NOT_STARTED")  # NOT_STARTED, QUEUED, GENERATING, GENERATED, VALIDATING, VALIDATION_FAILED, NEEDS_REVIEW, APPROVED, REJECTED
    content_blocks_json = Column(JSON, nullable=True)
    tables_json = Column(JSON, nullable=True)
    metrics_json = Column(JSON, nullable=True)
    chart_references_json = Column(JSON, nullable=True)
    image_references_json = Column(JSON, nullable=True)
    source_references_json = Column(JSON, nullable=True)
    warnings_json = Column(JSON, nullable=True)
    approval_status = Column(String(50), default="NOT_REQUIRED")  # NOT_REQUIRED, PENDING_APPROVAL, APPROVED, REJECTED
    user_feedback = Column(Text, nullable=True)
    version = Column(String(20), default="1.0.0")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class DPRContentSnapshotDB(Base):
    __tablename__ = "dpr_content_snapshots"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("dpr_projects.id"), nullable=False, index=True)
    package_id = Column(String(36), ForeignKey("dpr_content_packages.id"), nullable=False, index=True)
    snapshot_version = Column(String(20), default="1.0.0")
    project_data_version = Column(String(20), default="1.0.0")
    blueprint_version = Column(String(20), default="1.0.0")
    financial_model_version = Column(String(20), default="1.0.0")
    research_version = Column(String(20), default="1.0.0")
    scheme_version = Column(String(20), default="1.0.0")
    sections_snapshot_json = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DPRPromptTemplateDB(Base):
    __tablename__ = "dpr_prompt_templates"

    id = Column(String(64), primary_key=True)  # e.g. prompt_exec_summary_v1.0
    section_key = Column(String(100), nullable=False, index=True)
    dpr_type = Column(String(100), nullable=False, index=True)
    version = Column(String(20), default="1.0.0")
    system_instruction = Column(Text, nullable=False)
    input_schema_json = Column(JSON, nullable=True)
    output_schema_json = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)

# ==========================================
# PHASE 8: DPR DOCUMENT COMPILER ENTITIES
# ==========================================

class DPRCompiledDocumentDB(Base):
    __tablename__ = "dpr_compiled_documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("dpr_projects.id"), nullable=False, index=True)
    snapshot_id = Column(String(36), ForeignKey("dpr_content_snapshots.id"), nullable=False, index=True)
    dpr_type = Column(String(100), nullable=False)
    format = Column(String(10), nullable=False)  # PDF, DOCX, HTML
    status = Column(String(50), nullable=False, default="QUEUED")  # QUEUED, PROCESSING, ASSEMBLING, RENDERING, VALIDATING, COMPLETED, FAILED
    progress_percent = Column(Integer, default=0)
    step_name = Column(String(255), default="Job Enqueued")
    page_count = Column(Integer, default=0)
    quality_score = Column(Float, default=100.0)
    checksum_sha256 = Column(String(64), nullable=True)
    storage_path = Column(String(500), nullable=True)
    file_size_bytes = Column(Integer, default=0)
    manifest_json = Column(JSON, nullable=True)
    error = Column(Text, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# ==========================================
# PHASE 12: DPR PRODUCTION OPERATIONS ENTITIES
# ==========================================

class DPRSystemMetricDB(Base):
    __tablename__ = "dpr_system_metrics"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    category = Column(String(50), nullable=False, index=True)  # API, DATABASE, QUEUE, AI, RESEARCH, CONTENT, DOCUMENT
    metric_name = Column(String(100), nullable=False, index=True)
    metric_value = Column(Float, nullable=False)
    environment = Column(String(20), default="production")
    metadata_json = Column(JSON, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)

class DPRAlertDB(Base):
    __tablename__ = "dpr_alerts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rule_id = Column(String(100), nullable=False, index=True)
    metric_name = Column(String(100), nullable=False)
    threshold = Column(Float, nullable=False)
    current_value = Column(Float, nullable=False)
    severity = Column(String(20), nullable=False, default="WARNING")  # INFO, WARNING, CRITICAL
    status = Column(String(20), nullable=False, default="OPEN")  # OPEN, ACKNOWLEDGED, RESOLVED, SUPPRESSED
    message = Column(Text, nullable=False)
    triggered_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

class DPRIncidentDB(Base):
    __tablename__ = "dpr_incidents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    severity = Column(String(20), nullable=False, default="WARNING")
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(30), nullable=False, default="DETECTED")  # DETECTED, ACKNOWLEDGED, INVESTIGATING, MITIGATING, RESOLVED, CLOSED
    affected_component = Column(String(100), nullable=False)
    detected_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    root_cause = Column(Text, nullable=True)
    resolution = Column(Text, nullable=True)

class DPRSystemEventDB(Base):
    __tablename__ = "dpr_operational_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    event_type = Column(String(100), nullable=False, index=True)
    severity = Column(String(20), default="INFO")
    actor_id = Column(String(36), nullable=True)
    target_id = Column(String(36), nullable=True)
    description = Column(Text, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

class DPRFeatureFlagDB(Base):
    __tablename__ = "dpr_feature_flags"

    id = Column(String(100), primary_key=True)  # e.g. enable_vector_charts
    feature_name = Column(String(255), nullable=False)
    status = Column(String(20), nullable=False, default="ENABLED")  # ENABLED, DISABLED, ROLLOUT, CANARY
    rollout_percentage = Column(Float, default=100.0)
    metadata_json = Column(JSON, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

