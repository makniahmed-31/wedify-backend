-- Fix legacy plan values before casting
UPDATE "vendors" SET "plan" = 'BASIC' WHERE "plan"::TEXT NOT IN ('BASIC', 'PRO', 'PREMIUM');
UPDATE "vendors" SET "status" = 'PENDING' WHERE "status"::TEXT NOT IN ('PENDING', 'ACTIVE', 'SUSPENDED');
UPDATE "users" SET "role" = 'USER' WHERE "role"::TEXT NOT IN ('USER', 'VENDOR', 'ADMIN');
UPDATE "bookings" SET "status" = 'PENDING' WHERE "status"::TEXT NOT IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REFUNDED');
UPDATE "reviews" SET "status" = 'PENDING' WHERE "status"::TEXT NOT IN ('PENDING', 'APPROVED', 'REJECTED');

-- users.role
DO $$ BEGIN
  IF (SELECT udt_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name='users' AND column_name='role') != 'UserRole' THEN
    ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
    ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole" USING "role"::TEXT::"UserRole";
    ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER'::"UserRole";
  END IF;
END $$;

-- vendors.status
DO $$ BEGIN
  IF (SELECT udt_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name='vendors' AND column_name='status') != 'VendorStatus' THEN
    ALTER TABLE "vendors" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "vendors" ALTER COLUMN "status" TYPE "VendorStatus" USING "status"::TEXT::"VendorStatus";
    ALTER TABLE "vendors" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"VendorStatus";
  END IF;
END $$;

-- vendors.plan
DO $$ BEGIN
  IF (SELECT udt_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name='vendors' AND column_name='plan') != 'VendorPlan' THEN
    ALTER TABLE "vendors" ALTER COLUMN "plan" DROP DEFAULT;
    ALTER TABLE "vendors" ALTER COLUMN "plan" TYPE "VendorPlan" USING "plan"::TEXT::"VendorPlan";
    ALTER TABLE "vendors" ALTER COLUMN "plan" SET DEFAULT 'BASIC'::"VendorPlan";
  END IF;
END $$;

-- bookings.status
DO $$ BEGIN
  IF (SELECT udt_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name='bookings' AND column_name='status') != 'BookingStatus' THEN
    ALTER TABLE "bookings" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "BookingStatus" USING "status"::TEXT::"BookingStatus";
    ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"BookingStatus";
  END IF;
END $$;

-- reviews.status
DO $$ BEGIN
  IF (SELECT udt_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name='reviews' AND column_name='status') != 'ReviewStatus' THEN
    ALTER TABLE "reviews" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "reviews" ALTER COLUMN "status" TYPE "ReviewStatus" USING "status"::TEXT::"ReviewStatus";
    ALTER TABLE "reviews" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"ReviewStatus";
  END IF;
END $$;
