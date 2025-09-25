import { migrate } from "drizzle-orm/mysql2/migrator";
import { drizzle } from "drizzle-orm/mysql2";
import mysql2 from "mysql2/promise";

const dbMigrate = async () => {
    try {
        const dbConnection = await mysql2.createConnection({
            host: "localhost",
            user: "root",
            database: "dogdate_db",
            password: "password"
        });
        const dbMigrator = drizzle(dbConnection);

        await migrate(dbMigrator, {
            migrationsFolder: "./drizzle"
        });
        console.log("Migration has been completed");
        process.exit(0);
    } catch (e) {
        console.log("Migration encountered an error: ", e);
        process.exit(0);
    }
};
dbMigrate();