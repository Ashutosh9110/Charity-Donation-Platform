const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const {authenticate} = require("../middlewares/auth");



router.post("/signUp", userController.signUp)
router.post("/signIn", userController.signIn)
router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, userController.updateProfile);



module.exports = router