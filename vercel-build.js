const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "prisma", "schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf-8");

schema = schema.replace(/provider = "sqlite"/, 'provider = "postgresql"');

fs.writeFileSync(schemaPath, schema);

const { execSync } = require("child_process");
execSync("npx prisma generate", { stdio: "inherit", cwd: __dirname });
try {
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit", cwd: __dirname });
} catch {
  // db push can fail if tables already exist
}
