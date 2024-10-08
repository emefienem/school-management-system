require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const WebSocket = require("ws");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://school-management-system-frontend-4axa.onrender.com"],
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
app.use("/message", require("./routers/messageRoute"));

const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    try {
      const msg = JSON.parse(message);
      console.log("Received:", msg);

      await prisma.message.create({
        data: {
          senderEmail: msg.senderEmail,
          receiverEmail: msg.receiverEmail,
          text: msg.text,
          timestamp: new Date(),
        },
      });

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg));
        }
      });
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  // finally {
  //   await prisma.$disconnect();
  // }
}

main();

const connectionString = process.env.DATABASE_URL;

const client = new Client({ connectionString: connectionString });

client
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log("Connection error", err))
  .finally(() => client.end);

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to School Management System" });
});
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
