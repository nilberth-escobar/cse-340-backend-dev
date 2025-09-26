// Needed Resources
const express = require("express")
const router = new express.Router() 
const regValidate = require("../utilities/account-validation")
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Route to build login view
router.get("/login", (accountController.buildLogin))

// Route to build registration view
router.get("/register", (accountController.buildRegister))

// Route to process registration
router.post(
    '/register', 
    regValidate.registationRules(),
    regValidate.checkRegData,
    (accountController.registerAccount))

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router