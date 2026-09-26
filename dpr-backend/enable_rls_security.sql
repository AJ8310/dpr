-- ==========================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) HARDENING SCRIPT (PRODUCTION READY)
-- Project: Vision Karnataka Foundation DPR Studio (Supabase PostgreSQL)
-- Description: Enables Row Level Security (RLS) on all public base tables,
--              removing all red 'UNRESTRICTED' badges in Supabase Table Editor.
-- ==========================================================================

-- 1. Enable RLS on all 29 core application tables
ALTER TABLE IF EXISTS public."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_submissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."document_metadata" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_sectors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_activities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_project_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_geographies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_blueprints" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_responses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_agent_tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_agent_results" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_research_sources" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_schemes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_intelligence_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_research_cache" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_risks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_content_packages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_content_sections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_content_snapshots" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_prompt_templates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_compiled_documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_system_metrics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_alerts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_incidents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_operational_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."dpr_feature_flags" ENABLE ROW LEVEL SECURITY;

-- 2. Safely apply RLS Policies for BASE TABLES ONLY (ignoring views like report_summary)
DO $$ 
DECLARE 
    tbl record;
BEGIN
    FOR tbl IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl.table_name);
            EXECUTE format('DROP POLICY IF EXISTS "service_role_all_%I" ON public.%I;', tbl.table_name, tbl.table_name);
            EXECUTE format('CREATE POLICY "service_role_all_%I" ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true);', tbl.table_name, tbl.table_name);
        EXCEPTION WHEN OTHERS THEN
            -- Safely catch and ignore any non-table views or permission notices
            NULL;
        END;
    END LOOP;
END $$;
