import path from 'path';
import { createConnection, Connection } from 'typeorm';
import { User } from '../entities/User';

export const connectDB = async () => {
  try {
    const connection: Connection = await createConnection({
      type: 'postgres',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'engineershub',
      synchronize: true,
      logging: true,
      entities: [path.join(__dirname, '../entities/*.ts')],
    });

    console.log('Connected to DB ✔ ');
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};
