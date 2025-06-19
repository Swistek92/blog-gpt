import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"
import * as path from "path"
import { registerAs } from "@nestjs/config"
export default registerAs(
  "dbconfig.dev",
  (): PostgresConnectionOptions => ({
    // Don't put this here, Instead put in the env file
    url: process.env.DB_URL,
    type: "postgres",
  port: +(process.env.DB_PORT ?? 3306),
    entities: [path.resolve(__dirname, "..") + "/**/*.entity{.ts,.js}"],

    synchronize: true,
  }),
)
