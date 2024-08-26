const router = require("express").Router();
const complainCtrl = require("../controllers/complainController");

router.post("/create", complainCtrl.create);

router.get("/list/:id", complainCtrl.list);

module.exports = router;
