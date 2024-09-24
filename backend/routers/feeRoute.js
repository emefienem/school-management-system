const router = require("express").Router();
const feeCtrl = require("../controllers/feeController");

router.get("/get-fee/:id", feeCtrl.getAllFeeStructures);

router.post("/set-fee", feeCtrl.setFee);
router.post("/process-fee", feeCtrl.processFee);

module.exports = router;
