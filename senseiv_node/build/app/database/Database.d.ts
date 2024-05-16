import { Sequelize } from "sequelize";
declare class Database {
    constructor();
    static getConnection(): Sequelize;
}
export default Database;
