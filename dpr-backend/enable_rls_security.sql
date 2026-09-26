-- ==========================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) HARDENING SCRIPT
-- Project: Vision Karnataka Foundation DPR Studio (Supabase PostgreSQL)
-- Description: Enables Row Level Security (RLS) on all 29 public tables,
--              removing all red 'UNRESTRICTED' badges in Supabase Table Editor.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- Table: users
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."users" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_users" ON public."users";
CREATE POLICY "service_role_all_users" ON public."users" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_users" ON public."users";
CREATE POLICY "authenticated_read_users" ON public."users" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_submissions
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_submissions" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_submissions" ON public."dpr_submissions";
CREATE POLICY "service_role_all_dpr_submissions" ON public."dpr_submissions" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_submissions" ON public."dpr_submissions";
CREATE POLICY "authenticated_read_dpr_submissions" ON public."dpr_submissions" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_jobs
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_jobs" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_jobs" ON public."dpr_jobs";
CREATE POLICY "service_role_all_dpr_jobs" ON public."dpr_jobs" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_jobs" ON public."dpr_jobs";
CREATE POLICY "authenticated_read_dpr_jobs" ON public."dpr_jobs" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: document_metadata
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."document_metadata" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_document_metadata" ON public."document_metadata";
CREATE POLICY "service_role_all_document_metadata" ON public."document_metadata" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_document_metadata" ON public."document_metadata";
CREATE POLICY "authenticated_read_document_metadata" ON public."document_metadata" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_sectors
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_sectors" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_sectors" ON public."dpr_sectors";
CREATE POLICY "service_role_all_dpr_sectors" ON public."dpr_sectors" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_sectors" ON public."dpr_sectors";
CREATE POLICY "authenticated_read_dpr_sectors" ON public."dpr_sectors" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_activities
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_activities" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_activities" ON public."dpr_activities";
CREATE POLICY "service_role_all_dpr_activities" ON public."dpr_activities" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_activities" ON public."dpr_activities";
CREATE POLICY "authenticated_read_dpr_activities" ON public."dpr_activities" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_project_types
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_project_types" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_project_types" ON public."dpr_project_types";
CREATE POLICY "service_role_all_dpr_project_types" ON public."dpr_project_types" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_project_types" ON public."dpr_project_types";
CREATE POLICY "authenticated_read_dpr_project_types" ON public."dpr_project_types" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_geographies
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_geographies" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_geographies" ON public."dpr_geographies";
CREATE POLICY "service_role_all_dpr_geographies" ON public."dpr_geographies" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_geographies" ON public."dpr_geographies";
CREATE POLICY "authenticated_read_dpr_geographies" ON public."dpr_geographies" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_blueprints
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_blueprints" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_blueprints" ON public."dpr_blueprints";
CREATE POLICY "service_role_all_dpr_blueprints" ON public."dpr_blueprints" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_blueprints" ON public."dpr_blueprints";
CREATE POLICY "authenticated_read_dpr_blueprints" ON public."dpr_blueprints" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_projects
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_projects" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_projects" ON public."dpr_projects";
CREATE POLICY "service_role_all_dpr_projects" ON public."dpr_projects" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_projects" ON public."dpr_projects";
CREATE POLICY "authenticated_read_dpr_projects" ON public."dpr_projects" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_questions
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_questions" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_questions" ON public."dpr_questions";
CREATE POLICY "service_role_all_dpr_questions" ON public."dpr_questions" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_questions" ON public."dpr_questions";
CREATE POLICY "authenticated_read_dpr_questions" ON public."dpr_questions" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_responses
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_responses" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_responses" ON public."dpr_responses";
CREATE POLICY "service_role_all_dpr_responses" ON public."dpr_responses" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_responses" ON public."dpr_responses";
CREATE POLICY "authenticated_read_dpr_responses" ON public."dpr_responses" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_agent_tasks
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_agent_tasks" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_agent_tasks" ON public."dpr_agent_tasks";
CREATE POLICY "service_role_all_dpr_agent_tasks" ON public."dpr_agent_tasks" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_agent_tasks" ON public."dpr_agent_tasks";
CREATE POLICY "authenticated_read_dpr_agent_tasks" ON public."dpr_agent_tasks" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_agent_results
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_agent_results" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_agent_results" ON public."dpr_agent_results";
CREATE POLICY "service_role_all_dpr_agent_results" ON public."dpr_agent_results" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_agent_results" ON public."dpr_agent_results";
CREATE POLICY "authenticated_read_dpr_agent_results" ON public."dpr_agent_results" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_research_sources
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_research_sources" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_research_sources" ON public."dpr_research_sources";
CREATE POLICY "service_role_all_dpr_research_sources" ON public."dpr_research_sources" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_research_sources" ON public."dpr_research_sources";
CREATE POLICY "authenticated_read_dpr_research_sources" ON public."dpr_research_sources" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_schemes
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_schemes" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_schemes" ON public."dpr_schemes";
CREATE POLICY "service_role_all_dpr_schemes" ON public."dpr_schemes" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_schemes" ON public."dpr_schemes";
CREATE POLICY "authenticated_read_dpr_schemes" ON public."dpr_schemes" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_intelligence_items
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_intelligence_items" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_intelligence_items" ON public."dpr_intelligence_items";
CREATE POLICY "service_role_all_dpr_intelligence_items" ON public."dpr_intelligence_items" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_intelligence_items" ON public."dpr_intelligence_items";
CREATE POLICY "authenticated_read_dpr_intelligence_items" ON public."dpr_intelligence_items" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_research_cache
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_research_cache" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_research_cache" ON public."dpr_research_cache";
CREATE POLICY "service_role_all_dpr_research_cache" ON public."dpr_research_cache" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_research_cache" ON public."dpr_research_cache";
CREATE POLICY "authenticated_read_dpr_research_cache" ON public."dpr_research_cache" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_risks
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_risks" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_risks" ON public."dpr_risks";
CREATE POLICY "service_role_all_dpr_risks" ON public."dpr_risks" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_risks" ON public."dpr_risks";
CREATE POLICY "authenticated_read_dpr_risks" ON public."dpr_risks" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_content_packages
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_content_packages" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_content_packages" ON public."dpr_content_packages";
CREATE POLICY "service_role_all_dpr_content_packages" ON public."dpr_content_packages" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_content_packages" ON public."dpr_content_packages";
CREATE POLICY "authenticated_read_dpr_content_packages" ON public."dpr_content_packages" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_content_sections
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_content_sections" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_content_sections" ON public."dpr_content_sections";
CREATE POLICY "service_role_all_dpr_content_sections" ON public."dpr_content_sections" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_content_sections" ON public."dpr_content_sections";
CREATE POLICY "authenticated_read_dpr_content_sections" ON public."dpr_content_sections" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_content_snapshots
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_content_snapshots" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_content_snapshots" ON public."dpr_content_snapshots";
CREATE POLICY "service_role_all_dpr_content_snapshots" ON public."dpr_content_snapshots" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_content_snapshots" ON public."dpr_content_snapshots";
CREATE POLICY "authenticated_read_dpr_content_snapshots" ON public."dpr_content_snapshots" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_prompt_templates
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_prompt_templates" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_prompt_templates" ON public."dpr_prompt_templates";
CREATE POLICY "service_role_all_dpr_prompt_templates" ON public."dpr_prompt_templates" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_prompt_templates" ON public."dpr_prompt_templates";
CREATE POLICY "authenticated_read_dpr_prompt_templates" ON public."dpr_prompt_templates" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_compiled_documents
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_compiled_documents" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_compiled_documents" ON public."dpr_compiled_documents";
CREATE POLICY "service_role_all_dpr_compiled_documents" ON public."dpr_compiled_documents" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_compiled_documents" ON public."dpr_compiled_documents";
CREATE POLICY "authenticated_read_dpr_compiled_documents" ON public."dpr_compiled_documents" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_system_metrics
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_system_metrics" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_system_metrics" ON public."dpr_system_metrics";
CREATE POLICY "service_role_all_dpr_system_metrics" ON public."dpr_system_metrics" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_system_metrics" ON public."dpr_system_metrics";
CREATE POLICY "authenticated_read_dpr_system_metrics" ON public."dpr_system_metrics" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_alerts
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_alerts" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_alerts" ON public."dpr_alerts";
CREATE POLICY "service_role_all_dpr_alerts" ON public."dpr_alerts" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_alerts" ON public."dpr_alerts";
CREATE POLICY "authenticated_read_dpr_alerts" ON public."dpr_alerts" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_incidents
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_incidents" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_incidents" ON public."dpr_incidents";
CREATE POLICY "service_role_all_dpr_incidents" ON public."dpr_incidents" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_incidents" ON public."dpr_incidents";
CREATE POLICY "authenticated_read_dpr_incidents" ON public."dpr_incidents" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_operational_events
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_operational_events" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_operational_events" ON public."dpr_operational_events";
CREATE POLICY "service_role_all_dpr_operational_events" ON public."dpr_operational_events" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_operational_events" ON public."dpr_operational_events";
CREATE POLICY "authenticated_read_dpr_operational_events" ON public."dpr_operational_events" FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------------------
-- Table: dpr_feature_flags
-- --------------------------------------------------------------------------
ALTER TABLE IF EXISTS public."dpr_feature_flags" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_dpr_feature_flags" ON public."dpr_feature_flags";
CREATE POLICY "service_role_all_dpr_feature_flags" ON public."dpr_feature_flags" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read_dpr_feature_flags" ON public."dpr_feature_flags";
CREATE POLICY "authenticated_read_dpr_feature_flags" ON public."dpr_feature_flags" FOR SELECT TO authenticated USING (true);
