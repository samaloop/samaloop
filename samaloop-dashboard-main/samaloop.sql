-- --------------------------------------------------------
-- Host:                         aws-0-ap-southeast-1.pooler.supabase.com
-- Server version:               PostgreSQL 15.8 on aarch64-unknown-linux-gnu, compiled by gcc (GCC) 13.2.0, 64-bit
-- Server OS:                    
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table public.ages
CREATE TABLE IF NOT EXISTS "ages" (
	"id" VARCHAR NOT NULL,
	"name" JSONB NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id")
);

-- Data exporting was unselected.

-- Dumping structure for table public.clients
CREATE TABLE IF NOT EXISTS "clients" (
	"id" VARCHAR NOT NULL,
	"name" JSONB NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	PRIMARY KEY ("id")
);

-- Data exporting was unselected.

-- Dumping structure for table public.client_types
CREATE TABLE IF NOT EXISTS "client_types" (
	"id" VARCHAR NOT NULL,
	"name" JSONB NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	PRIMARY KEY ("id")
);

-- Data exporting was unselected.

-- Dumping structure for table public.credentials
CREATE TABLE IF NOT EXISTS "credentials" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"name" VARCHAR NOT NULL,
	"abbreviation" VARCHAR NULL DEFAULT NULL,
	"type" VARCHAR NULL DEFAULT NULL,
	"logo" VARCHAR NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id")
);

-- Data exporting was unselected.

-- Dumping structure for table public.genders
CREATE TABLE IF NOT EXISTS "genders" (
	"id" VARCHAR NOT NULL,
	"name" JSONB NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id")
);

-- Data exporting was unselected.

-- Dumping structure for table public.hours
CREATE TABLE IF NOT EXISTS "hours" (
	"id" VARCHAR NOT NULL,
	"name" JSONB NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	PRIMARY KEY ("id")
);

-- Data exporting was unselected.

-- Dumping structure for table public.info
CREATE TABLE IF NOT EXISTS "info" (
	"id" VARCHAR NOT NULL,
	"data" JSONB NULL DEFAULT NULL,
	"image" VARCHAR NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id")
);

-- Data exporting was unselected.

-- Dumping structure for table public.methods
CREATE TABLE IF NOT EXISTS "methods" (
	"id" VARCHAR NOT NULL,
	"name" JSONB NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	PRIMARY KEY ("id")
);

-- Data exporting was unselected.

-- Dumping structure for table public.prices
CREATE TABLE IF NOT EXISTS "prices" (
	"id" VARCHAR NOT NULL,
	"name" JSONB NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	PRIMARY KEY ("id")
);

-- Data exporting was unselected.

-- Dumping structure for table public.profiles
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"slug" VARCHAR NOT NULL,
	"name" VARCHAR NULL DEFAULT NULL,
	"credential" UUID NULL DEFAULT NULL,
	"photo" VARCHAR NULL DEFAULT NULL,
	"profession" VARCHAR NULL DEFAULT NULL,
	"description" JSONB NULL DEFAULT NULL,
	"method_info" JSONB NULL DEFAULT NULL,
	"awards" TEXT NULL DEFAULT NULL,
	"hour" VARCHAR NULL DEFAULT NULL,
	"year" VARCHAR NULL DEFAULT NULL,
	"client" VARCHAR NULL DEFAULT NULL,
	"price" VARCHAR NULL DEFAULT NULL,
	"contact" JSONB NULL DEFAULT NULL,
	"gender" VARCHAR NULL DEFAULT NULL,
	"age" VARCHAR NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	"status" VARCHAR NULL DEFAULT 'inactive',
	"awards_en" TEXT NULL DEFAULT NULL,
	"professions" JSONB NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "profiles_age_fkey" FOREIGN KEY ("age") REFERENCES "ages" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
	CONSTRAINT "profiles_client_fkey" FOREIGN KEY ("client") REFERENCES "clients" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
	CONSTRAINT "profiles_credential_fkey" FOREIGN KEY ("credential") REFERENCES "credentials" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
	CONSTRAINT "profiles_gender_fkey" FOREIGN KEY ("gender") REFERENCES "genders" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
	CONSTRAINT "profiles_hour_fkey" FOREIGN KEY ("hour") REFERENCES "hours" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
	CONSTRAINT "profiles_price_fkey" FOREIGN KEY ("price") REFERENCES "prices" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
	CONSTRAINT "profiles_year_fkey" FOREIGN KEY ("year") REFERENCES "years" ("id") ON UPDATE NO ACTION ON DELETE SET NULL
);

-- Data exporting was unselected.

-- Dumping structure for table public.profile_client_types
CREATE TABLE IF NOT EXISTS "profile_client_types" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"profile" UUID NOT NULL,
	"client_type" VARCHAR NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	CONSTRAINT "profile_client_types_client_type_fkey" FOREIGN KEY ("client_type") REFERENCES "client_types" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "profile_client_types_profile_fkey" FOREIGN KEY ("profile") REFERENCES "profiles" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

-- Data exporting was unselected.

-- Dumping structure for table public.profile_methods
CREATE TABLE IF NOT EXISTS "profile_methods" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"profile" UUID NOT NULL,
	"method" VARCHAR NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	CONSTRAINT "profile_methods_method_fkey" FOREIGN KEY ("method") REFERENCES "methods" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "profile_methods_profile_fkey" FOREIGN KEY ("profile") REFERENCES "profiles" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

-- Data exporting was unselected.

-- Dumping structure for table public.profile_other_credentials
CREATE TABLE IF NOT EXISTS "profile_other_credentials" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"profile" UUID NULL DEFAULT NULL,
	"credential" UUID NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	CONSTRAINT "profile_other_credentials_credential_fkey" FOREIGN KEY ("credential") REFERENCES "credentials" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "profile_other_credentials_profile_fkey" FOREIGN KEY ("profile") REFERENCES "profiles" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

-- Data exporting was unselected.

-- Dumping structure for table public.profile_prices
CREATE TABLE IF NOT EXISTS "profile_prices" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"profile" UUID NOT NULL,
	"price" VARCHAR NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	CONSTRAINT "profile_prices_price_fkey" FOREIGN KEY ("price") REFERENCES "prices" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "profile_prices_profile_fkey" FOREIGN KEY ("profile") REFERENCES "profiles" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

-- Data exporting was unselected.

-- Dumping structure for table public.profile_specialities
CREATE TABLE IF NOT EXISTS "profile_specialities" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"profile" UUID NULL DEFAULT NULL,
	"speciality" VARCHAR NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	CONSTRAINT "profile_specialities_profile_fkey" FOREIGN KEY ("profile") REFERENCES "profiles" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "profile_specialities_speciality_fkey" FOREIGN KEY ("speciality") REFERENCES "specialities" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

-- Data exporting was unselected.

-- Dumping structure for table public.specialities
CREATE TABLE IF NOT EXISTS "specialities" (
	"id" VARCHAR NOT NULL,
	"name" JSONB NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	PRIMARY KEY ("id")
);

-- Data exporting was unselected.

-- Dumping structure for table public.specialities_mobile
CREATE TABLE IF NOT EXISTS "specialities_mobile" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"speciality" VARCHAR NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	CONSTRAINT "specialities_mobile_speciality_fkey" FOREIGN KEY ("speciality") REFERENCES "specialities" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

-- Data exporting was unselected.

-- Dumping structure for table public.users
CREATE TABLE IF NOT EXISTS "users" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"uid" UUID NULL DEFAULT NULL,
	"name" VARCHAR NULL DEFAULT NULL,
	"email" VARCHAR NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	CONSTRAINT "users_uid_fkey" FOREIGN KEY ("uid") REFERENCES "auth"."users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

-- Data exporting was unselected.

-- Dumping structure for table public.years
CREATE TABLE IF NOT EXISTS "years" (
	"id" VARCHAR NOT NULL,
	"name" JSONB NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	PRIMARY KEY ("id")
);

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
