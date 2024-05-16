import { Sequelize } from "sequelize";
import * as process from "process";

// Load environment variables from .env file
require('dotenv').config()

let instance: Sequelize;

class Database {
    constructor() {
        if (!instance) {
            const client = new Sequelize(
                    process.env.DB_NAME || 'senseiv',
                    process.env.DB_USER || 'postgres',
                    process.env.DB_PASSWORD || 'postgres',
                    {
                        host: process.env.DB_HOST || '127.0.0.1',
                        port: parseInt(process.env.DB_PORT as string) || 5432,
                pool: {
                    max: parseInt(process.env.DB_MAX_CONNECTIONS as string) || 10,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },
                dialect: 'postgres',
                logging: false
        })

            // Connect to database
            client.authenticate()
                .then(r => console.log('connected to database'))
                .catch(e => {
                    throw new Error(e)
                })

            instance = client
        }
    }

    static getConnection(): Sequelize {
        if (!instance) {
            new Database();
        }

        return instance;
    }
}

export default Database;