-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "password_hash" TEXT,
    "google_id" TEXT,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "refresh_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "business_name" TEXT NOT NULL,
    "slug" TEXT,
    "tagline" TEXT,
    "description" TEXT,
    "category" TEXT,
    "category_slug" TEXT,
    "city" TEXT,
    "city_slug" TEXT,
    "cover_image" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'BRONZE',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "tiktok" TEXT,
    "video_url" TEXT,
    "gallery" JSONB,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "rank_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "min_price" DECIMAL(10,2),
    "max_price" DECIMAL(10,2),
    "response_time" TEXT,
    "years_in_business" INTEGER NOT NULL DEFAULT 0,
    "starting_price" DECIMAL(10,2),
    "average_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "cover_image" TEXT,
    "tags" JSONB,
    "author_name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "service_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "wedding_date" DATE NOT NULL,
    "guest_count" INTEGER,
    "notes" TEXT,
    "total_amount" DECIMAL(10,2),
    "deposit_amount" DECIMAL(10,2),
    "cancellation_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "booking_id" TEXT,
    "overall_rating" INTEGER NOT NULL,
    "communication_rating" INTEGER,
    "value_rating" INTEGER,
    "comment" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "vendor_reply" TEXT,
    "moderation_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

