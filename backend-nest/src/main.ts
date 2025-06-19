/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger" // <-- dodaj Swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.enableCors({
    origin: "*",
  })

  // ✅ Konfiguracja Swagger + Bearer Auth (JWT)
  const config = new DocumentBuilder()
    .setTitle("My API")
    .setDescription("API documentation with JWT authentication")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        in: "header",
      },
      "access-token", // <- identyfikator dla @ApiBearerAuth()
    )
    .build()

const swaggerDocument = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, swaggerDocument)

  const port = 3000
  // const port = process.env.PORT || 3000

  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`)
  Logger.log(`${process.env.DB_URL}`)
    
}

bootstrap()
