import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isProd = process.env.NODE_ENV === "production";

  app.use(helmet());
  app.use(cookieParser());

  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Secret"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix("api/v1");

  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle("Wedify API")
      .setDescription("Wedding SaaS Marketplace API")
      .setVersion("1.0")
      .addBearerAuth()
      .addCookieAuth("wedify_token")
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
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Wedify backend running on http://localhost:${port}`);
  if (!isProd) console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
