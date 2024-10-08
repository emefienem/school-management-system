const router = require("express").Router();
const messageCtrl = require("../controllers/messageController");

router
  .get("/contacts", messageCtrl.getContacts)
  .post("/create", messageCtrl.createContact);

router
  .get("/:user1Email/:user2Email", messageCtrl.getMessages)
  .post("/send", messageCtrl.sendMessage);

module.exports = router;
