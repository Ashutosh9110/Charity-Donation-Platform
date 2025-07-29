const express = require("express");
const router = express.Router();
const charityController = require("../controllers/charityController");
const donationController = require("../controllers/donationController")
const upload = require("../middlewares/upload");


router.post("/register", upload.single("image"), charityController.registerCharity);
router.get("/", charityController.getAllCharities);
router.get("/:id", charityController.getCharityById);
router.get("/charity/:id", donationController.getDonationsByCharity);
router.get("/category/:category", charityController.getCharitiesByCategory);


module.exports = router;
