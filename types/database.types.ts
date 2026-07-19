export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      application_files: {
        Row: {
          application_id: string
          created_at: string
          extracted_text: string | null
          extraction_status: string
          file_type: string
          id: string
          mime_type: string | null
          organization_id: string
          original_filename: string | null
          size_bytes: number | null
          storage_bucket: string
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          application_id: string
          created_at?: string
          extracted_text?: string | null
          extraction_status?: string
          file_type: string
          id?: string
          mime_type?: string | null
          organization_id: string
          original_filename?: string | null
          size_bytes?: number | null
          storage_bucket: string
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string
          extracted_text?: string | null
          extraction_status?: string
          file_type?: string
          id?: string
          mime_type?: string | null
          organization_id?: string
          original_filename?: string | null
          size_bytes?: number | null
          storage_bucket?: string
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_files_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_files_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          activated_at: string | null
          company_id: string
          company_name_submitted: string | null
          created_at: string
          created_by_user_id: string | null
          founder_message: string | null
          id: string
          offered_ownership: number | null
          organization_id: string
          primary_founder_id: string | null
          requested_amount: number | null
          requested_currency: string | null
          source: Database["public"]["Enums"]["application_source"]
          status: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          company_id: string
          company_name_submitted?: string | null
          created_at?: string
          created_by_user_id?: string | null
          founder_message?: string | null
          id?: string
          offered_ownership?: number | null
          organization_id: string
          primary_founder_id?: string | null
          requested_amount?: number | null
          requested_currency?: string | null
          source: Database["public"]["Enums"]["application_source"]
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          company_id?: string
          company_name_submitted?: string | null
          created_at?: string
          created_by_user_id?: string | null
          founder_message?: string | null
          id?: string
          offered_ownership?: number | null
          organization_id?: string
          primary_founder_id?: string | null
          requested_amount?: number | null
          requested_currency?: string | null
          source?: Database["public"]["Enums"]["application_source"]
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "applications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_primary_founder_id_fkey"
            columns: ["primary_founder_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_type: string
          actor_user_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          id: number
          ip_address: unknown
          organization_id: string | null
          record_id: string | null
          request_id: string | null
          table_name: string | null
        }
        Insert: {
          action: string
          actor_type?: string
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: number
          ip_address?: unknown
          organization_id?: string | null
          record_id?: string | null
          request_id?: string | null
          table_name?: string | null
        }
        Update: {
          action?: string
          actor_type?: string
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: number
          ip_address?: unknown
          organization_id?: string | null
          record_id?: string | null
          request_id?: string | null
          table_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_signals: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          observed_at: string | null
          organization_id: string
          signal_score: number | null
          signal_type: string
          signal_value: Json
          source_url: string | null
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          observed_at?: string | null
          organization_id: string
          signal_score?: number | null
          signal_type: string
          signal_value?: Json
          source_url?: string | null
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          observed_at?: string | null
          organization_id?: string
          signal_score?: number | null
          signal_type?: string
          signal_value?: Json
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_signals_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "sourcing_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_signals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cap_table_entries: {
        Row: {
          created_at: string
          currency: string | null
          holder_name: string
          holder_type: string
          id: string
          investment_amount: number | null
          memo_id: string
          organization_id: string
          ownership_post: number | null
          ownership_pre: number | null
          shares: number | null
          source_record_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          holder_name: string
          holder_type: string
          id?: string
          investment_amount?: number | null
          memo_id: string
          organization_id: string
          ownership_post?: number | null
          ownership_pre?: number | null
          shares?: number | null
          source_record_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          holder_name?: string
          holder_type?: string
          id?: string
          investment_amount?: number | null
          memo_id?: string
          organization_id?: string
          ownership_post?: number | null
          ownership_pre?: number | null
          shares?: number | null
          source_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cap_table_entries_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "investment_memos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cap_table_entries_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["latest_memo_id"]
          },
          {
            foreignKeyName: "cap_table_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cap_table_entries_source_record_id_fkey"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_evidence: {
        Row: {
          claim_id: string
          created_at: string
          evidence_id: string
          id: string
          organization_id: string
          relation: string
          weight: number | null
        }
        Insert: {
          claim_id: string
          created_at?: string
          evidence_id: string
          id?: string
          organization_id: string
          relation: string
          weight?: number | null
        }
        Update: {
          claim_id?: string
          created_at?: string
          evidence_id?: string
          id?: string
          organization_id?: string
          relation?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_evidence_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_evidence_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_evidence_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          application_id: string | null
          claim_type: string
          claimed_by: string | null
          confidence: number | null
          created_at: string
          id: string
          normalized_value: Json
          opportunity_id: string
          organization_id: string
          statement: string
          status: Database["public"]["Enums"]["verification_status"]
          trust_score: number | null
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          claim_type: string
          claimed_by?: string | null
          confidence?: number | null
          created_at?: string
          id?: string
          normalized_value?: Json
          opportunity_id: string
          organization_id: string
          statement: string
          status?: Database["public"]["Enums"]["verification_status"]
          trust_score?: number | null
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          claim_type?: string
          claimed_by?: string | null
          confidence?: number | null
          created_at?: string
          id?: string
          normalized_value?: Json
          opportunity_id?: string
          organization_id?: string
          statement?: string
          status?: Database["public"]["Enums"]["verification_status"]
          trust_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "claims_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          founded_on: string | null
          geography: string | null
          id: string
          legal_entity_country: string | null
          legal_name: string | null
          name: string
          organization_id: string
          registration_number: string | null
          sector: string | null
          stage: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          founded_on?: string | null
          geography?: string | null
          id?: string
          legal_entity_country?: string | null
          legal_name?: string | null
          name: string
          organization_id: string
          registration_number?: string | null
          sector?: string | null
          stage?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          founded_on?: string | null
          geography?: string | null
          id?: string
          legal_entity_country?: string | null
          legal_name?: string | null
          name?: string
          organization_id?: string
          registration_number?: string | null
          sector?: string | null
          stage?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      company_facts: {
        Row: {
          company_id: string
          confidence: number | null
          created_at: string
          field_key: string
          field_value: Json
          id: string
          organization_id: string
          source_record_id: string | null
          status: Database["public"]["Enums"]["verification_status"]
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          company_id: string
          confidence?: number | null
          created_at?: string
          field_key: string
          field_value: Json
          id?: string
          organization_id: string
          source_record_id?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          company_id?: string
          confidence?: number | null
          created_at?: string
          field_key?: string
          field_value?: Json
          id?: string
          organization_id?: string
          source_record_id?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_facts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_facts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_facts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_facts_source_record_id_fkey"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      company_founders: {
        Row: {
          company_id: string
          created_at: string
          founder_id: string
          id: string
          is_primary: boolean
          joined_on: string | null
          left_on: string | null
          organization_id: string
          ownership_percent: number | null
          role: string
        }
        Insert: {
          company_id: string
          created_at?: string
          founder_id: string
          id?: string
          is_primary?: boolean
          joined_on?: string | null
          left_on?: string | null
          organization_id: string
          ownership_percent?: number | null
          role?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          founder_id?: string
          id?: string
          is_primary?: boolean
          joined_on?: string | null
          left_on?: string | null
          organization_id?: string
          ownership_percent?: number | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_founders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_founders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_founders_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_founders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      company_timeline_events: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          event_type: string | null
          id: string
          occurred_on: string | null
          organization_id: string
          source_record_id: string | null
          title: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          event_type?: string | null
          id?: string
          occurred_on?: string | null
          organization_id: string
          source_record_id?: string | null
          title: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          event_type?: string | null
          id?: string
          occurred_on?: string | null
          organization_id?: string
          source_record_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_timeline_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_timeline_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_timeline_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_timeline_source_record_fk"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          cluster: string | null
          created_at: string
          difference_from_company: string | null
          future_threat: string | null
          id: string
          memo_id: string
          name: string
          organization_id: string
          source_record_id: string | null
          threat_level: string | null
          website: string | null
        }
        Insert: {
          cluster?: string | null
          created_at?: string
          difference_from_company?: string | null
          future_threat?: string | null
          id?: string
          memo_id: string
          name: string
          organization_id: string
          source_record_id?: string | null
          threat_level?: string | null
          website?: string | null
        }
        Update: {
          cluster?: string | null
          created_at?: string
          difference_from_company?: string | null
          future_threat?: string | null
          id?: string
          memo_id?: string
          name?: string
          organization_id?: string
          source_record_id?: string | null
          threat_level?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitors_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "investment_memos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitors_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["latest_memo_id"]
          },
          {
            foreignKeyName: "competitors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitors_source_record_id_fkey"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_logs: {
        Row: {
          action: string
          actor_type: string
          actor_user_id: string | null
          amount: number | null
          created_at: string
          currency: string | null
          id: string
          memo_id: string | null
          metadata: Json
          opportunity_id: string
          organization_id: string
          rationale: string | null
        }
        Insert: {
          action: string
          actor_type?: string
          actor_user_id?: string | null
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          memo_id?: string | null
          metadata?: Json
          opportunity_id: string
          organization_id: string
          rationale?: string | null
        }
        Update: {
          action?: string
          actor_type?: string
          actor_user_id?: string | null
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          memo_id?: string | null
          metadata?: Json
          opportunity_id?: string
          organization_id?: string
          rationale?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decision_logs_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "investment_memos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_logs_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["latest_memo_id"]
          },
          {
            foreignKeyName: "decision_logs_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_logs_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "decision_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      due_diligence_checks: {
        Row: {
          assigned_to: string | null
          category: string
          check_name: string
          checked_at: string | null
          created_at: string
          finding: string | null
          id: string
          open_questions: string[]
          opportunity_id: string
          organization_id: string
          source_record_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          check_name: string
          checked_at?: string | null
          created_at?: string
          finding?: string | null
          id?: string
          open_questions?: string[]
          opportunity_id: string
          organization_id: string
          source_record_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          check_name?: string
          checked_at?: string | null
          created_at?: string
          finding?: string | null
          id?: string
          open_questions?: string[]
          opportunity_id?: string
          organization_id?: string
          source_record_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "due_diligence_checks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "due_diligence_checks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "due_diligence_checks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "due_diligence_checks_source_record_id_fkey"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          captured_at: string
          created_at: string
          evidence_type: string
          excerpt: string | null
          id: string
          opportunity_id: string
          organization_id: string
          reliability_score: number | null
          source_locator: string | null
          source_record_id: string | null
          source_url: string | null
          storage_path: string | null
        }
        Insert: {
          captured_at?: string
          created_at?: string
          evidence_type: string
          excerpt?: string | null
          id?: string
          opportunity_id: string
          organization_id: string
          reliability_score?: number | null
          source_locator?: string | null
          source_record_id?: string | null
          source_url?: string | null
          storage_path?: string | null
        }
        Update: {
          captured_at?: string
          created_at?: string
          evidence_type?: string
          excerpt?: string | null
          id?: string
          opportunity_id?: string
          organization_id?: string
          reliability_score?: number | null
          source_locator?: string | null
          source_record_id?: string | null
          source_url?: string | null
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "evidence_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_source_record_id_fkey"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      exit_paths: {
        Row: {
          acquirer_or_buyer: string | null
          comparable_company: string | null
          confidence: number | null
          created_at: string
          exit_type: string
          horizon_years: number | null
          id: string
          memo_id: string
          organization_id: string
          premium_reason: string | null
          rationale: string
        }
        Insert: {
          acquirer_or_buyer?: string | null
          comparable_company?: string | null
          confidence?: number | null
          created_at?: string
          exit_type: string
          horizon_years?: number | null
          id?: string
          memo_id: string
          organization_id: string
          premium_reason?: string | null
          rationale: string
        }
        Update: {
          acquirer_or_buyer?: string | null
          comparable_company?: string | null
          confidence?: number | null
          created_at?: string
          exit_type?: string
          horizon_years?: number | null
          id?: string
          memo_id?: string
          organization_id?: string
          premium_reason?: string | null
          rationale?: string
        }
        Relationships: [
          {
            foreignKeyName: "exit_paths_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "investment_memos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exit_paths_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["latest_memo_id"]
          },
          {
            foreignKeyName: "exit_paths_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_periods: {
        Row: {
          cash_balance: number | null
          cogs: number | null
          created_at: string
          currency: string
          data_type: string
          ebitda: number | null
          id: string
          memo_id: string
          opex: number | null
          organization_id: string
          period_end: string | null
          period_label: string
          period_start: string | null
          revenue: number | null
          runway_months: number | null
          source_record_id: string | null
        }
        Insert: {
          cash_balance?: number | null
          cogs?: number | null
          created_at?: string
          currency?: string
          data_type: string
          ebitda?: number | null
          id?: string
          memo_id: string
          opex?: number | null
          organization_id: string
          period_end?: string | null
          period_label: string
          period_start?: string | null
          revenue?: number | null
          runway_months?: number | null
          source_record_id?: string | null
        }
        Update: {
          cash_balance?: number | null
          cogs?: number | null
          created_at?: string
          currency?: string
          data_type?: string
          ebitda?: number | null
          id?: string
          memo_id?: string
          opex?: number | null
          organization_id?: string
          period_end?: string | null
          period_label?: string
          period_start?: string | null
          revenue?: number | null
          runway_months?: number | null
          source_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_periods_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "investment_memos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_periods_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["latest_memo_id"]
          },
          {
            foreignKeyName: "financial_periods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_periods_source_record_id_fkey"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      first_pass_screenings: {
        Row: {
          checks: Json
          failed_checks: Json
          id: string
          missing_information: Json
          opportunity_id: string
          organization_id: string
          outcome: string
          rationale: string | null
          screened_at: string
        }
        Insert: {
          checks?: Json
          failed_checks?: Json
          id?: string
          missing_information?: Json
          opportunity_id: string
          organization_id: string
          outcome: string
          rationale?: string | null
          screened_at?: string
        }
        Update: {
          checks?: Json
          failed_checks?: Json
          id?: string
          missing_information?: Json
          opportunity_id?: string
          organization_id?: string
          outcome?: string
          rationale?: string | null
          screened_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "first_pass_screenings_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "first_pass_screenings_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "first_pass_screenings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      founder_aliases: {
        Row: {
          alias_type: string
          alias_value: string
          created_at: string
          founder_id: string
          id: string
          organization_id: string
          source_url: string | null
        }
        Insert: {
          alias_type: string
          alias_value: string
          created_at?: string
          founder_id: string
          id?: string
          organization_id: string
          source_url?: string | null
        }
        Update: {
          alias_type?: string
          alias_value?: string
          created_at?: string
          founder_id?: string
          id?: string
          organization_id?: string
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "founder_aliases_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "founder_aliases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      founder_events: {
        Row: {
          created_at: string
          description: string | null
          event_type: string
          founder_id: string
          id: string
          occurred_at: string | null
          organization_id: string
          source_record_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_type: string
          founder_id: string
          id?: string
          occurred_at?: string | null
          organization_id: string
          source_record_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_type?: string
          founder_id?: string
          id?: string
          occurred_at?: string | null
          organization_id?: string
          source_record_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "founder_events_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "founder_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "founder_events_source_record_fk"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      founder_facts: {
        Row: {
          confidence: number | null
          created_at: string
          field_key: string
          field_value: Json
          founder_id: string
          id: string
          organization_id: string
          source_record_id: string | null
          status: Database["public"]["Enums"]["verification_status"]
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          field_key: string
          field_value: Json
          founder_id: string
          id?: string
          organization_id: string
          source_record_id?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          field_key?: string
          field_value?: Json
          founder_id?: string
          id?: string
          organization_id?: string
          source_record_id?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "founder_facts_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "founder_facts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "founder_facts_source_record_id_fkey"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      founder_score_dimensions: {
        Row: {
          confidence: number | null
          created_at: string
          dimension_key: string
          dimension_label: string
          evidence_ids: string[]
          explanation: string | null
          id: string
          organization_id: string
          score: number
          snapshot_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          dimension_key: string
          dimension_label: string
          evidence_ids?: string[]
          explanation?: string | null
          id?: string
          organization_id: string
          score: number
          snapshot_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          dimension_key?: string
          dimension_label?: string
          evidence_ids?: string[]
          explanation?: string | null
          id?: string
          organization_id?: string
          score?: number
          snapshot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "founder_score_dimensions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "founder_score_dimensions_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "founder_score_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      founder_score_snapshots: {
        Row: {
          calculated_at: string
          calculated_by: string
          confidence: number | null
          founder_id: string
          id: string
          organization_id: string
          rationale: string | null
          score: number
          trend: Database["public"]["Enums"]["trend_direction"]
        }
        Insert: {
          calculated_at?: string
          calculated_by?: string
          confidence?: number | null
          founder_id: string
          id?: string
          organization_id: string
          rationale?: string | null
          score: number
          trend?: Database["public"]["Enums"]["trend_direction"]
        }
        Update: {
          calculated_at?: string
          calculated_by?: string
          confidence?: number | null
          founder_id?: string
          id?: string
          organization_id?: string
          rationale?: string | null
          score?: number
          trend?: Database["public"]["Enums"]["trend_direction"]
        }
        Relationships: [
          {
            foreignKeyName: "founder_score_snapshots_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "founder_score_snapshots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      founder_user_links: {
        Row: {
          created_at: string
          founder_id: string
          id: string
          is_verified: boolean
          organization_id: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          founder_id: string
          id?: string
          is_verified?: boolean
          organization_id: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          founder_id?: string
          id?: string
          is_verified?: boolean
          organization_id?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "founder_user_links_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "founder_user_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      founders: {
        Row: {
          biography: string | null
          created_at: string
          current_founder_score: number | null
          full_name: string
          geography: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          organization_id: string
          personal_website: string | null
          phone: string | null
          primary_email: string | null
          score_trend: Database["public"]["Enums"]["trend_direction"]
          updated_at: string
        }
        Insert: {
          biography?: string | null
          created_at?: string
          current_founder_score?: number | null
          full_name: string
          geography?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          organization_id: string
          personal_website?: string | null
          phone?: string | null
          primary_email?: string | null
          score_trend?: Database["public"]["Enums"]["trend_direction"]
          updated_at?: string
        }
        Update: {
          biography?: string | null
          created_at?: string
          current_founder_score?: number | null
          full_name?: string
          geography?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          organization_id?: string
          personal_website?: string | null
          phone?: string | null
          primary_email?: string | null
          score_trend?: Database["public"]["Enums"]["trend_direction"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "founders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_theses: {
        Row: {
          check_size_max: number | null
          check_size_min: number | null
          created_at: string
          created_by: string | null
          dealbreakers: string[]
          founder_patterns: string[]
          fund_id: string
          geographies: string[]
          hard_filters: Json
          id: string
          is_active: boolean
          name: string
          organization_id: string
          ownership_target_max: number | null
          ownership_target_min: number | null
          risk_appetite: string
          scoring_weights: Json
          sectors: string[]
          stages: string[]
          style_anchors: string[]
          thresholds: Json
          updated_at: string
          version: number
        }
        Insert: {
          check_size_max?: number | null
          check_size_min?: number | null
          created_at?: string
          created_by?: string | null
          dealbreakers?: string[]
          founder_patterns?: string[]
          fund_id: string
          geographies?: string[]
          hard_filters?: Json
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          ownership_target_max?: number | null
          ownership_target_min?: number | null
          risk_appetite?: string
          scoring_weights?: Json
          sectors?: string[]
          stages?: string[]
          style_anchors?: string[]
          thresholds?: Json
          updated_at?: string
          version?: number
        }
        Update: {
          check_size_max?: number | null
          check_size_min?: number | null
          created_at?: string
          created_by?: string | null
          dealbreakers?: string[]
          founder_patterns?: string[]
          fund_id?: string
          geographies?: string[]
          hard_filters?: Json
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          ownership_target_max?: number | null
          ownership_target_min?: number | null
          risk_appetite?: string
          scoring_weights?: Json
          sectors?: string[]
          stages?: string[]
          style_anchors?: string[]
          thresholds?: Json
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "fund_theses_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fund_theses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_rounds: {
        Row: {
          amount: number | null
          created_at: string
          currency: string
          id: string
          memo_id: string
          next_round_expected_at: string | null
          organization_id: string
          post_money_valuation: number | null
          pre_money_valuation: number | null
          round_name: string
          round_status: string
          target_close_date: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string
          id?: string
          memo_id: string
          next_round_expected_at?: string | null
          organization_id: string
          post_money_valuation?: number | null
          pre_money_valuation?: number | null
          round_name: string
          round_status: string
          target_close_date?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string
          id?: string
          memo_id?: string
          next_round_expected_at?: string | null
          organization_id?: string
          post_money_valuation?: number | null
          pre_money_valuation?: number | null
          round_name?: string
          round_status?: string
          target_close_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funding_rounds_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "investment_memos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funding_rounds_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["latest_memo_id"]
          },
          {
            foreignKeyName: "funding_rounds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      funds: {
        Row: {
          available_capital: number | null
          committed_capital: number | null
          created_at: string
          currency: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          updated_at: string
          vintage_year: number | null
        }
        Insert: {
          available_capital?: number | null
          committed_capital?: number | null
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          updated_at?: string
          vintage_year?: number | null
        }
        Update: {
          available_capital?: number | null
          committed_capital?: number | null
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          updated_at?: string
          vintage_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "funds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_memos: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          currency: string
          generated_at: string | null
          generated_by: string
          generated_by_model: string | null
          id: string
          opportunity_id: string
          organization_id: string
          overall_confidence: number | null
          recommendation:
            | Database["public"]["Enums"]["investment_decision"]
            | null
          recommended_amount: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["memo_status"]
          updated_at: string
          version: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          currency?: string
          generated_at?: string | null
          generated_by?: string
          generated_by_model?: string | null
          id?: string
          opportunity_id: string
          organization_id: string
          overall_confidence?: number | null
          recommendation?:
            | Database["public"]["Enums"]["investment_decision"]
            | null
          recommended_amount?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["memo_status"]
          updated_at?: string
          version?: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          currency?: string
          generated_at?: string | null
          generated_by?: string
          generated_by_model?: string | null
          id?: string
          opportunity_id?: string
          organization_id?: string
          overall_confidence?: number | null
          recommendation?:
            | Database["public"]["Enums"]["investment_decision"]
            | null
          recommended_amount?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["memo_status"]
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "investment_memos_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_memos_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "investment_memos_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_snapshots: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          memo_id: string
          metric_key: string
          metric_name: string
          metric_value: number | null
          organization_id: string
          period_end: string | null
          period_start: string | null
          source_record_id: string | null
          text_value: string | null
          unit: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          memo_id: string
          metric_key: string
          metric_name: string
          metric_value?: number | null
          organization_id: string
          period_end?: string | null
          period_start?: string | null
          source_record_id?: string | null
          text_value?: string | null
          unit?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          memo_id?: string
          metric_key?: string
          metric_name?: string
          metric_value?: number | null
          organization_id?: string
          period_end?: string | null
          period_start?: string | null
          source_record_id?: string | null
          text_value?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_snapshots_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "investment_memos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_snapshots_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["latest_memo_id"]
          },
          {
            foreignKeyName: "kpi_snapshots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_snapshots_source_record_id_fkey"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      market_sizing_estimates: {
        Row: {
          amount: number | null
          approach: string
          assumptions: Json
          confidence: number | null
          created_at: string
          currency: string
          estimate_year: number | null
          id: string
          level: string
          memo_id: string
          organization_id: string
          source_record_id: string | null
        }
        Insert: {
          amount?: number | null
          approach: string
          assumptions?: Json
          confidence?: number | null
          created_at?: string
          currency?: string
          estimate_year?: number | null
          id?: string
          level: string
          memo_id: string
          organization_id: string
          source_record_id?: string | null
        }
        Update: {
          amount?: number | null
          approach?: string
          assumptions?: Json
          confidence?: number | null
          created_at?: string
          currency?: string
          estimate_year?: number | null
          id?: string
          level?: string
          memo_id?: string
          organization_id?: string
          source_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_sizing_estimates_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "investment_memos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_sizing_estimates_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["latest_memo_id"]
          },
          {
            foreignKeyName: "market_sizing_estimates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_sizing_estimates_source_record_id_fkey"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      memo_item_evidence: {
        Row: {
          created_at: string
          evidence_id: string
          id: string
          memo_item_id: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          evidence_id: string
          id?: string
          memo_item_id: string
          organization_id: string
        }
        Update: {
          created_at?: string
          evidence_id?: string
          id?: string
          memo_item_id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memo_item_evidence_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memo_item_evidence_memo_item_id_fkey"
            columns: ["memo_item_id"]
            isOneToOne: false
            referencedRelation: "memo_section_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memo_item_evidence_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      memo_section_items: {
        Row: {
          confidence: number | null
          content: string
          created_at: string
          id: string
          item_type: string
          label: string | null
          numeric_value: number | null
          organization_id: string
          section_id: string
          sort_order: number
          status: Database["public"]["Enums"]["verification_status"]
          unit: string | null
        }
        Insert: {
          confidence?: number | null
          content: string
          created_at?: string
          id?: string
          item_type?: string
          label?: string | null
          numeric_value?: number | null
          organization_id: string
          section_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["verification_status"]
          unit?: string | null
        }
        Update: {
          confidence?: number | null
          content?: string
          created_at?: string
          id?: string
          item_type?: string
          label?: string | null
          numeric_value?: number | null
          organization_id?: string
          section_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["verification_status"]
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memo_section_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memo_section_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "memo_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      memo_sections: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          memo_id: string
          organization_id: string
          section_key: string
          sort_order: number
          status: string
          structured_data: Json
          summary_markdown: string | null
          title: string
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          memo_id: string
          organization_id: string
          section_key: string
          sort_order: number
          status?: string
          structured_data?: Json
          summary_markdown?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          memo_id?: string
          organization_id?: string
          section_key?: string
          sort_order?: number
          status?: string
          structured_data?: Json
          summary_markdown?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memo_sections_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "investment_memos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memo_sections_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["latest_memo_id"]
          },
          {
            foreignKeyName: "memo_sections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          body: string | null
          channel: string
          created_at: string
          id: string
          organization_id: string
          read_at: string | null
          sent_at: string | null
          status: string
          title: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          channel: string
          created_at?: string
          id?: string
          organization_id: string
          read_at?: string | null
          sent_at?: string | null
          status?: string
          title: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          body?: string | null
          channel?: string
          created_at?: string
          id?: string
          organization_id?: string
          read_at?: string | null
          sent_at?: string | null
          status?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          application_id: string | null
          assigned_to: string | null
          company_id: string
          created_at: string
          current_step: string
          fund_id: string
          id: string
          momentum: Database["public"]["Enums"]["trend_direction"]
          organization_id: string
          requested_amount: number | null
          requested_currency: string | null
          source: Database["public"]["Enums"]["application_source"]
          source_channel: string | null
          sourcing_candidate_id: string | null
          status: Database["public"]["Enums"]["opportunity_status"]
          thesis_id: string | null
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          assigned_to?: string | null
          company_id: string
          created_at?: string
          current_step?: string
          fund_id: string
          id?: string
          momentum?: Database["public"]["Enums"]["trend_direction"]
          organization_id: string
          requested_amount?: number | null
          requested_currency?: string | null
          source: Database["public"]["Enums"]["application_source"]
          source_channel?: string | null
          sourcing_candidate_id?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          thesis_id?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          assigned_to?: string | null
          company_id?: string
          created_at?: string
          current_step?: string
          fund_id?: string
          id?: string
          momentum?: Database["public"]["Enums"]["trend_direction"]
          organization_id?: string
          requested_amount?: number | null
          requested_currency?: string | null
          source?: Database["public"]["Enums"]["application_source"]
          source_channel?: string | null
          sourcing_candidate_id?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          thesis_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "opportunities_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_sourcing_candidate_id_fkey"
            columns: ["sourcing_candidate_id"]
            isOneToOne: false
            referencedRelation: "sourcing_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "fund_theses"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_scores: {
        Row: {
          calculated_at: string
          founder_axis: number | null
          founder_confidence: number | null
          founder_trend: Database["public"]["Enums"]["trend_direction"]
          id: string
          idea_market_axis: number | null
          idea_market_confidence: number | null
          idea_market_trend: Database["public"]["Enums"]["trend_direction"]
          market_axis: number | null
          market_confidence: number | null
          market_trend: Database["public"]["Enums"]["trend_direction"]
          opportunity_id: string
          organization_id: string
          rationale: Json
          thesis_fit: number | null
        }
        Insert: {
          calculated_at?: string
          founder_axis?: number | null
          founder_confidence?: number | null
          founder_trend?: Database["public"]["Enums"]["trend_direction"]
          id?: string
          idea_market_axis?: number | null
          idea_market_confidence?: number | null
          idea_market_trend?: Database["public"]["Enums"]["trend_direction"]
          market_axis?: number | null
          market_confidence?: number | null
          market_trend?: Database["public"]["Enums"]["trend_direction"]
          opportunity_id: string
          organization_id: string
          rationale?: Json
          thesis_fit?: number | null
        }
        Update: {
          calculated_at?: string
          founder_axis?: number | null
          founder_confidence?: number | null
          founder_trend?: Database["public"]["Enums"]["trend_direction"]
          id?: string
          idea_market_axis?: number | null
          idea_market_confidence?: number | null
          idea_market_trend?: Database["public"]["Enums"]["trend_direction"]
          market_axis?: number | null
          market_confidence?: number | null
          market_trend?: Database["public"]["Enums"]["trend_direction"]
          opportunity_id?: string
          organization_id?: string
          rationale?: Json
          thesis_fit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_scores_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_scores_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "opportunity_scores_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          organization_id: string
          revoked_at: string | null
          role: Database["public"]["Enums"]["app_role"]
          token_hash: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          organization_id: string
          revoked_at?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          token_hash: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string
          revoked_at?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          invited_by: string | null
          joined_at: string | null
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["membership_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          logo_url: string | null
          name: string
          organization_type: string
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          logo_url?: string | null
          name: string
          organization_type?: string
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          organization_type?: string
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          job_title: string | null
          last_seen_at: string | null
          locale: string
          onboarding_completed: boolean
          phone: string | null
          timezone: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          job_title?: string | null
          last_seen_at?: string | null
          locale?: string
          onboarding_completed?: boolean
          phone?: string | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          last_seen_at?: string | null
          locale?: string
          onboarding_completed?: boolean
          phone?: string | null
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string
          created_by: string | null
          fund_id: string
          id: string
          is_active: boolean
          name: string
          natural_language_query: string
          organization_id: string
          parsed_filters: Json
          schedule_cron: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          fund_id: string
          id?: string
          is_active?: boolean
          name: string
          natural_language_query: string
          organization_id: string
          parsed_filters?: Json
          schedule_cron?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          fund_id?: string
          id?: string
          is_active?: boolean
          name?: string
          natural_language_query?: string
          organization_id?: string
          parsed_filters?: Json
          schedule_cron?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_searches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      score_components: {
        Row: {
          axis: string
          component_key: string
          component_label: string
          confidence: number | null
          created_at: string
          evidence_ids: string[]
          explanation: string | null
          id: string
          opportunity_score_id: string
          organization_id: string
          score: number | null
          weight: number | null
        }
        Insert: {
          axis: string
          component_key: string
          component_label: string
          confidence?: number | null
          created_at?: string
          evidence_ids?: string[]
          explanation?: string | null
          id?: string
          opportunity_score_id: string
          organization_id: string
          score?: number | null
          weight?: number | null
        }
        Update: {
          axis?: string
          component_key?: string
          component_label?: string
          confidence?: number | null
          created_at?: string
          evidence_ids?: string[]
          explanation?: string | null
          id?: string
          opportunity_score_id?: string
          organization_id?: string
          score?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "score_components_opportunity_score_id_fkey"
            columns: ["opportunity_score_id"]
            isOneToOne: false
            referencedRelation: "opportunity_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "score_components_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      search_runs: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          natural_language_query: string | null
          organization_id: string
          parsed_filters: Json
          result_count: number
          saved_search_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["workflow_status"]
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          natural_language_query?: string | null
          organization_id: string
          parsed_filters?: Json
          result_count?: number
          saved_search_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          natural_language_query?: string | null
          organization_id?: string
          parsed_filters?: Json
          result_count?: number
          saved_search_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
        }
        Relationships: [
          {
            foreignKeyName: "search_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_runs_saved_search_id_fkey"
            columns: ["saved_search_id"]
            isOneToOne: false
            referencedRelation: "saved_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      source_records: {
        Row: {
          application_id: string | null
          captured_at: string
          company_id: string | null
          confidence: number | null
          content_hash: string | null
          created_at: string
          embedding: string | null
          founder_id: string | null
          id: string
          opportunity_id: string | null
          organization_id: string
          raw_json: Json
          raw_text: string | null
          source_name: string | null
          source_type: string
          source_url: string | null
          title: string | null
        }
        Insert: {
          application_id?: string | null
          captured_at?: string
          company_id?: string | null
          confidence?: number | null
          content_hash?: string | null
          created_at?: string
          embedding?: string | null
          founder_id?: string | null
          id?: string
          opportunity_id?: string | null
          organization_id: string
          raw_json?: Json
          raw_text?: string | null
          source_name?: string | null
          source_type: string
          source_url?: string | null
          title?: string | null
        }
        Update: {
          application_id?: string | null
          captured_at?: string
          company_id?: string | null
          confidence?: number | null
          content_hash?: string | null
          created_at?: string
          embedding?: string | null
          founder_id?: string | null
          id?: string
          opportunity_id?: string | null
          organization_id?: string
          raw_json?: Json
          raw_text?: string | null
          source_name?: string | null
          source_type?: string
          source_url?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_records_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "source_records_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_records_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_records_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "source_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sourcing_candidates: {
        Row: {
          candidate_name: string
          company_id: string | null
          company_name: string | null
          created_at: string
          external_id: string | null
          founder_id: string | null
          fund_id: string
          id: string
          momentum: Database["public"]["Enums"]["trend_direction"]
          organization_id: string
          preliminary_score: number | null
          source_channel: string
          source_url: string | null
          status: string
          surfaced_reason: string | null
          thesis_fit: number | null
          thesis_id: string | null
          updated_at: string
        }
        Insert: {
          candidate_name: string
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          external_id?: string | null
          founder_id?: string | null
          fund_id: string
          id?: string
          momentum?: Database["public"]["Enums"]["trend_direction"]
          organization_id: string
          preliminary_score?: number | null
          source_channel: string
          source_url?: string | null
          status?: string
          surfaced_reason?: string | null
          thesis_fit?: number | null
          thesis_id?: string | null
          updated_at?: string
        }
        Update: {
          candidate_name?: string
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          external_id?: string | null
          founder_id?: string | null
          fund_id?: string
          id?: string
          momentum?: Database["public"]["Enums"]["trend_direction"]
          organization_id?: string
          preliminary_score?: number | null
          source_channel?: string
          source_url?: string | null
          status?: string
          surfaced_reason?: string | null
          thesis_fit?: number | null
          thesis_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sourcing_candidates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sourcing_candidates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "sourcing_candidates_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sourcing_candidates_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sourcing_candidates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sourcing_candidates_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "fund_theses"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          background: string | null
          company_id: string
          created_at: string
          founder_id: string | null
          full_name: string
          fund_comfort_rationale: string | null
          id: string
          joined_on: string | null
          left_on: string | null
          memo_id: string | null
          organization_id: string
          pedigree: string | null
          red_flags: string | null
          role: string | null
        }
        Insert: {
          background?: string | null
          company_id: string
          created_at?: string
          founder_id?: string | null
          full_name: string
          fund_comfort_rationale?: string | null
          id?: string
          joined_on?: string | null
          left_on?: string | null
          memo_id?: string | null
          organization_id: string
          pedigree?: string | null
          red_flags?: string | null
          role?: string | null
        }
        Update: {
          background?: string | null
          company_id?: string
          created_at?: string
          founder_id?: string | null
          full_name?: string
          fund_comfort_rationale?: string | null
          id?: string
          joined_on?: string | null
          left_on?: string | null
          memo_id?: string | null
          organization_id?: string
          pedigree?: string | null
          red_flags?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "team_members_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "investment_memos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["latest_memo_id"]
          },
          {
            foreignKeyName: "team_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_discovery_sessions: {
        Row: {
          channel: string
          confirmed_thesis_id: string | null
          created_at: string
          extracted_thesis: Json
          fund_id: string
          id: string
          investor_user_id: string | null
          organization_id: string
          status: string
          transcript: string | null
          updated_at: string
        }
        Insert: {
          channel?: string
          confirmed_thesis_id?: string | null
          created_at?: string
          extracted_thesis?: Json
          fund_id: string
          id?: string
          investor_user_id?: string | null
          organization_id: string
          status?: string
          transcript?: string | null
          updated_at?: string
        }
        Update: {
          channel?: string
          confirmed_thesis_id?: string | null
          created_at?: string
          extracted_thesis?: Json
          fund_id?: string
          id?: string
          investor_user_id?: string | null
          organization_id?: string
          status?: string
          transcript?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "thesis_discovery_sessions_confirmed_thesis_id_fkey"
            columns: ["confirmed_thesis_id"]
            isOneToOne: false
            referencedRelation: "fund_theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_discovery_sessions_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_discovery_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_evaluations: {
        Row: {
          calculated_at: string
          confidence: number | null
          decision: string
          disqualifying_criteria: Json
          explanation: string | null
          id: string
          matched_criteria: Json
          missing_information: Json
          opportunity_id: string
          organization_id: string
          score: number
          thesis_id: string
          unmatched_criteria: Json
        }
        Insert: {
          calculated_at?: string
          confidence?: number | null
          decision: string
          disqualifying_criteria?: Json
          explanation?: string | null
          id?: string
          matched_criteria?: Json
          missing_information?: Json
          opportunity_id: string
          organization_id: string
          score: number
          thesis_id: string
          unmatched_criteria?: Json
        }
        Update: {
          calculated_at?: string
          confidence?: number | null
          decision?: string
          disqualifying_criteria?: Json
          explanation?: string | null
          id?: string
          matched_criteria?: Json
          missing_information?: Json
          opportunity_id?: string
          organization_id?: string
          score?: number
          thesis_id?: string
          unmatched_criteria?: Json
        }
        Relationships: [
          {
            foreignKeyName: "thesis_evaluations_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_evaluations_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "thesis_evaluations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_evaluations_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "fund_theses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          appearance: string
          created_at: string
          dashboard_preferences: Json
          default_currency: string
          email_notifications: boolean
          updated_at: string
          user_id: string
          whatsapp_notifications: boolean
        }
        Insert: {
          appearance?: string
          created_at?: string
          dashboard_preferences?: Json
          default_currency?: string
          email_notifications?: boolean
          updated_at?: string
          user_id: string
          whatsapp_notifications?: boolean
        }
        Update: {
          appearance?: string
          created_at?: string
          dashboard_preferences?: Json
          default_currency?: string
          email_notifications?: boolean
          updated_at?: string
          user_id?: string
          whatsapp_notifications?: boolean
        }
        Relationships: []
      }
      whatsapp_contacts: {
        Row: {
          contact_role: Database["public"]["Enums"]["app_role"] | null
          created_at: string
          display_name: string | null
          founder_id: string | null
          id: string
          last_message_at: string | null
          opted_in: boolean
          opted_in_at: string | null
          organization_id: string
          phone_number: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_role?: Database["public"]["Enums"]["app_role"] | null
          created_at?: string
          display_name?: string | null
          founder_id?: string | null
          id?: string
          last_message_at?: string | null
          opted_in?: boolean
          opted_in_at?: string | null
          organization_id: string
          phone_number: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_role?: Database["public"]["Enums"]["app_role"] | null
          created_at?: string
          display_name?: string | null
          founder_id?: string | null
          id?: string
          last_message_at?: string | null
          opted_in?: boolean
          opted_in_at?: string | null
          organization_id?: string
          phone_number?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_contacts_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversations: {
        Row: {
          application_id: string | null
          closed_at: string | null
          contact_id: string
          current_step: string | null
          id: string
          opened_at: string
          opportunity_id: string | null
          organization_id: string
          state_data: Json
          status: string
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          closed_at?: string | null
          contact_id: string
          current_step?: string | null
          id?: string
          opened_at?: string
          opportunity_id?: string | null
          organization_id: string
          state_data?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          closed_at?: string | null
          contact_id?: string
          current_step?: string | null
          id?: string
          opened_at?: string
          opportunity_id?: string | null
          organization_id?: string
          state_data?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          body: string | null
          conversation_id: string
          created_at: string
          delivered_at: string | null
          direction: Database["public"]["Enums"]["message_direction"]
          failed_reason: string | null
          id: string
          media_id: string | null
          media_storage_path: string | null
          message_type: string
          meta_message_id: string | null
          organization_id: string
          payload: Json
          read_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["message_status"]
        }
        Insert: {
          body?: string | null
          conversation_id: string
          created_at?: string
          delivered_at?: string | null
          direction: Database["public"]["Enums"]["message_direction"]
          failed_reason?: string | null
          id?: string
          media_id?: string | null
          media_storage_path?: string | null
          message_type: string
          meta_message_id?: string | null
          organization_id: string
          payload?: Json
          read_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"]
        }
        Update: {
          body?: string | null
          conversation_id?: string
          created_at?: string
          delivered_at?: string | null
          direction?: Database["public"]["Enums"]["message_direction"]
          failed_reason?: string | null
          id?: string
          media_id?: string | null
          media_storage_path?: string | null
          message_type?: string
          meta_message_id?: string | null
          organization_id?: string
          payload?: Json
          read_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"]
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_runs: {
        Row: {
          application_id: string | null
          completed_at: string | null
          created_at: string
          current_step: string | null
          error_message: string | null
          external_execution_id: string | null
          id: string
          input_payload: Json
          opportunity_id: string | null
          organization_id: string
          output_payload: Json
          progress_percent: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["workflow_status"]
          updated_at: string
          workflow_name: string
        }
        Insert: {
          application_id?: string | null
          completed_at?: string | null
          created_at?: string
          current_step?: string | null
          error_message?: string | null
          external_execution_id?: string | null
          id?: string
          input_payload?: Json
          opportunity_id?: string | null
          organization_id: string
          output_payload?: Json
          progress_percent?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
          updated_at?: string
          workflow_name: string
        }
        Update: {
          application_id?: string | null
          completed_at?: string | null
          created_at?: string
          current_step?: string | null
          error_message?: string | null
          external_execution_id?: string | null
          id?: string
          input_payload?: Json
          opportunity_id?: string | null
          organization_id?: string
          output_payload?: Json
          progress_percent?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
          updated_at?: string
          workflow_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_runs_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_runs_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_dashboard"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "workflow_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          completed_at: string | null
          confidence: number | null
          created_at: string
          error_message: string | null
          evidence_ids: string[]
          id: string
          input_summary: Json
          organization_id: string
          output_summary: Json
          sequence_number: number
          started_at: string | null
          status: Database["public"]["Enums"]["workflow_step_status"]
          step_key: string
          step_name: string
          warnings: string[]
          workflow_run_id: string
        }
        Insert: {
          completed_at?: string | null
          confidence?: number | null
          created_at?: string
          error_message?: string | null
          evidence_ids?: string[]
          id?: string
          input_summary?: Json
          organization_id: string
          output_summary?: Json
          sequence_number: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["workflow_step_status"]
          step_key: string
          step_name: string
          warnings?: string[]
          workflow_run_id: string
        }
        Update: {
          completed_at?: string | null
          confidence?: number | null
          created_at?: string
          error_message?: string | null
          evidence_ids?: string[]
          id?: string
          input_summary?: Json
          organization_id?: string
          output_summary?: Json
          sequence_number?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["workflow_step_status"]
          step_key?: string
          step_name?: string
          warnings?: string[]
          workflow_run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_steps_workflow_run_id_fkey"
            columns: ["workflow_run_id"]
            isOneToOne: false
            referencedRelation: "workflow_runs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      opportunity_dashboard: {
        Row: {
          company_id: string | null
          company_name: string | null
          created_at: string | null
          founder_axis: number | null
          geography: string | null
          idea_market_axis: number | null
          latest_memo_id: string | null
          market_axis: number | null
          momentum: Database["public"]["Enums"]["trend_direction"] | null
          opportunity_id: string | null
          organization_id: string | null
          overall_confidence: number | null
          recommendation:
            | Database["public"]["Enums"]["investment_decision"]
            | null
          recommended_amount: number | null
          sector: string | null
          source: Database["public"]["Enums"]["application_source"] | null
          source_channel: string | null
          stage: string | null
          status: Database["public"]["Enums"]["opportunity_status"] | null
          thesis_fit: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_investment_memo: {
        Args: { p_opportunity_id: string }
        Returns: string
      }
      create_organization_with_owner: {
        Args: { p_fund_name?: string; p_name: string; p_slug: string }
        Returns: string
      }
      has_org_role: {
        Args: {
          p_organization_id: string
          p_roles: Database["public"]["Enums"]["app_role"][]
        }
        Returns: boolean
      }
      is_org_member: { Args: { p_organization_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "partner" | "analyst" | "reviewer" | "founder"
      application_source: "inbound" | "outbound"
      investment_decision:
        | "invest"
        | "reject"
        | "continue_diligence"
        | "request_more_evidence"
        | "watchlist"
      membership_status: "invited" | "active" | "suspended" | "removed"
      memo_status:
        | "draft"
        | "generated"
        | "under_review"
        | "approved"
        | "superseded"
      message_direction: "inbound" | "outbound"
      message_status:
        | "received"
        | "queued"
        | "sent"
        | "delivered"
        | "read"
        | "failed"
      opportunity_status:
        | "sourced"
        | "activated"
        | "applied"
        | "screening"
        | "diligence"
        | "memo_ready"
        | "recommended"
        | "watchlist"
        | "rejected"
        | "deployed"
        | "closed"
      trend_direction: "improving" | "stable" | "declining" | "unknown"
      verification_status:
        | "verified"
        | "partially_verified"
        | "unverified"
        | "inferred"
        | "unavailable"
        | "contradicted"
        | "missing"
      workflow_status:
        | "queued"
        | "running"
        | "waiting"
        | "completed"
        | "failed"
        | "cancelled"
      workflow_step_status:
        | "pending"
        | "running"
        | "completed"
        | "failed"
        | "skipped"
        | "waiting"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "partner", "analyst", "reviewer", "founder"],
      application_source: ["inbound", "outbound"],
      investment_decision: [
        "invest",
        "reject",
        "continue_diligence",
        "request_more_evidence",
        "watchlist",
      ],
      membership_status: ["invited", "active", "suspended", "removed"],
      memo_status: [
        "draft",
        "generated",
        "under_review",
        "approved",
        "superseded",
      ],
      message_direction: ["inbound", "outbound"],
      message_status: [
        "received",
        "queued",
        "sent",
        "delivered",
        "read",
        "failed",
      ],
      opportunity_status: [
        "sourced",
        "activated",
        "applied",
        "screening",
        "diligence",
        "memo_ready",
        "recommended",
        "watchlist",
        "rejected",
        "deployed",
        "closed",
      ],
      trend_direction: ["improving", "stable", "declining", "unknown"],
      verification_status: [
        "verified",
        "partially_verified",
        "unverified",
        "inferred",
        "unavailable",
        "contradicted",
        "missing",
      ],
      workflow_status: [
        "queued",
        "running",
        "waiting",
        "completed",
        "failed",
        "cancelled",
      ],
      workflow_step_status: [
        "pending",
        "running",
        "completed",
        "failed",
        "skipped",
        "waiting",
      ],
    },
  },
} as const
