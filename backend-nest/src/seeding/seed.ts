import dbConfig from "../config/db.config"
import { DataSource, DataSourceOptions } from "typeorm"
import { runSeeders, SeederOptions } from "typeorm-extension"
import { UserFactory } from "./user.factory"
import { MainSeeder } from "./main.seeder"
import * as dotenv from 'dotenv'
import { PostFactory } from "./postEN.factory"
dotenv.config()


const options: DataSourceOptions & SeederOptions = {
  ...dbConfig(),
  factories: [UserFactory, PostFactory],
  seeds: [MainSeeder],
}

const datasource = new DataSource(options)
datasource.initialize().then(async () => {

  await datasource.synchronize(true)
  await runSeeders(datasource)
  process.exit()
})
