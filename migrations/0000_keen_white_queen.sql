CREATE TABLE "applicationSources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "jobTrackers" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"position_applied" text NOT NULL,
	"url" text NOT NULL,
	"application_date" timestamp NOT NULL,
	"interview_date" timestamp,
	"notes" text,
	"createdAt" timestamp DEFAULT now(),
	"locationId" integer,
	"statusId" integer,
	"sourceId" integer,
	"user_id" integer NOT NULL,
	"is_notification_enabled" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"telephone" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_telephone_unique" UNIQUE("telephone")
);
--> statement-breakpoint
ALTER TABLE "applicationSources" ADD CONSTRAINT "applicationSources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobTrackers" ADD CONSTRAINT "jobTrackers_locationId_locations_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobTrackers" ADD CONSTRAINT "jobTrackers_statusId_statuses_id_fk" FOREIGN KEY ("statusId") REFERENCES "public"."statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobTrackers" ADD CONSTRAINT "jobTrackers_sourceId_applicationSources_id_fk" FOREIGN KEY ("sourceId") REFERENCES "public"."applicationSources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobTrackers" ADD CONSTRAINT "jobTrackers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statuses" ADD CONSTRAINT "statuses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;