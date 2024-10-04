require("dotenv").config;
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser("secret"));

const PORT = process.env.PORT || 5001;

app.use("/admin", require("./routers/adminRoute"));
app.use("/teacher", require("./routers/teacherRoute"));
app.use("/parent", require("./routers/parentRoute"));
app.use("/student", require("./routers/studentRoute"));
app.use("/subject", require("./routers/subjectRoute"));
app.use("/class", require("./routers/classRoute"));
app.use("/complain", require("./routers/complainRoute"));
app.use("/notice", require("./routers/noticeRoute"));

app.use("/auth", require("./routers/authRoute"));

app.use("/fee", require("./routers/feeRoute"));
app.use("/assignment", require("./routers/assignmentRoute"));
app.use("/test", require("./routers/testRoute"));

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

const connectionString =
  "postgresql://postgres:emefienem@localhost:5432/mydb?schema=public";

const client = new Client({ connectionString: connectionString });

client
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log("Connection error", err))
  .finally(() => client.end);

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to School Management System" });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
