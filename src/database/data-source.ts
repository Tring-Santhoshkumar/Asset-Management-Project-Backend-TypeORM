import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";
import { Users } from "../modules/user/entity/user.entity";
import { Assets } from "../modules/Asset/entity/asset.entity";
import { Notifications } from "../modules/Notification/entity/notification.entity";
dotenv.config();

export const AppDataSource: DataSourceOptions = {
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_DB,
    synchronize: false,
    logging: true,
    entities: [Users, Assets, Notifications],
    migrations: ['src/database/migrations/*.{js,ts}']
};

const dataSource = new DataSource(AppDataSource);
export default dataSource;
