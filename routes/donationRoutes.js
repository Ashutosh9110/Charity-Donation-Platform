// routes/donationRoutes.js
const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");
const { authenticate } = require("../middlewares/auth");

router.post("/makeDonation", authenticate, donationController.createDonation);
router.get("/getUserDonation", authenticate, donationController.getUserDonations);
router.get("/all", donationController.getAllDonations);
router.post("/create-order", authenticate, donationController.createOrder);
router.get("/receipt/:id", authenticate, donationController.downloadReceipt);
router.get("/success", donationController.handleSuccess);

module.exports = router;
