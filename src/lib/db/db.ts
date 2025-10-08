import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const poolConnection = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "dogdate_db",
    password: ""
});

const db = drizzle(poolConnection);
export { db };