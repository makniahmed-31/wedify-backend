import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:4000",
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global prefix
  app.setGlobalPrefix("api/v1");

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle("Wedify API")
    .setDescription("Wedding SaaS Marketplace API")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth")
    .addTag("users")
    .addTag("vendors")
    .addTag("services")
    .addTag("bookings")
    .addTag("reviews")
    .addTag("subscriptions")
    .addTag("search")
    .addTag("seo")
    .addTag("analytics")
    .addTag("admin")
    .addTag("notifications")
    .addTag("marketplace")
    .addTag("payments")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Wedify backend running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
