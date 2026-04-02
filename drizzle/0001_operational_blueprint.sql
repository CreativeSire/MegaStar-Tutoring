CREATE TABLE IF NOT EXISTS "availability_blocks" (
  "id" text PRIMARY KEY NOT NULL,
  "owner_user_id" text NOT NULL REFERENCES "user_profiles"("id") ON DELETE CASCADE,
  "day_of_week" integer NOT NULL,
  "start_minute" integer NOT NULL,
  "end_minute" integer NOT NULL,
  "label" text NOT NULL DEFAULT 'Available',
  "notes" text NOT NULL DEFAULT '',
  "active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE "ratings"
  ADD COLUMN IF NOT EXISTS "moderation_status" text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS "source" text NOT NULL DEFAULT 'workspace';

ALTER TABLE "invoices"
  ADD COLUMN IF NOT EXISTS "invoice_number" text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "client_name_snapshot" text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "line_items_json" text NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "export_format" text NOT NULL DEFAULT 'csv',
  ADD COLUMN IF NOT EXISTS "due_at" timestamptz;
