-- Fix legacy plan values (0_init used 'BRONZE', schema now uses 'BASIC')
UPDATE "vendors" SET "plan" = 'BASIC' WHERE "plan" NOT IN ('BASIC', 'PRO', 'PREMIUM');

-- Sanitize any invalid enum values before type conversion
UPDATE "vendors" SET "status" = 'PENDING' WHERE "status" NOT IN ('PENDING', 'ACTIVE', 'SUSPENDED');
UPDATE "users" SET "role" = 'USER' WHERE "role" NOT IN ('USER', 'VENDOR', 'ADMIN');
UPDATE "bookings" SET "status" = 'PENDING' WHERE "status" NOT IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REFUNDED');
UPDATE "reviews" SET "status" = 'PENDING' WHERE "status" NOT IN ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum (safe, idempotent)
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('USER', 'VENDOR', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "VendorPlan" AS ENUM ('BASIC', 'PRO', 'PREMIUM');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AlterColumn: TEXT -> enum (only if currently TEXT)
DO $$ BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name='users' AND column_name='role') = 'text' THEN
    ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole" USING "role"::"UserRole";
  END IF;
END $$;

DO $$ BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name='vendors' AND column_name='status') = 'text' THEN
    ALTER TABLE "vendors" ALTER COLUMN "status" TYPE "VendorStatus" USING "status"::"VendorStatus";
  END IF;
END $$;

DO $$ BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name='vendors' AND column_name='plan') = 'text' THEN
    ALTER TABLE "vendors" ALTER COLUMN "plan" TYPE "VendorPlan" USING "plan"::"VendorPlan";
  END IF;
END $$;

DO $$ BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name='bookings' AND column_name='status') = 'text' THEN
    ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "BookingStatus" USING "status"::"BookingStatus";
  END IF;
END $$;

DO $$ BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name='reviews' AND column_name='status') = 'text' THEN
    ALTER TABLE "reviews" ALTER COLUMN "status" TYPE "ReviewStatus" USING "status"::"ReviewStatus";
  END IF;
END $$;

-- AddUniqueConstraint (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vendors_user_id_key'
  ) THEN
    ALTER TABLE "vendors" ADD CONSTRAINT "vendors_user_id_key" UNIQUE ("user_id");
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vendors_slug_key'
  ) THEN
    ALTER TABLE "vendors" ADD CONSTRAINT "vendors_slug_key" UNIQUE ("slug");
  END IF;
END $$;
