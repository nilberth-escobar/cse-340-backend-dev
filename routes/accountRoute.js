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

// Route to the account management view
router.get("/", utilities.checkLogin, (accountController.buildAccountManagementView))

// Route to build login view
router.get("/login", (accountController.buildLogin))

// Route to process registration
router.post(
    '/register', 
    regValidate.registationRules(),
    regValidate.checkRegData,
    (accountController.registerAccount))

// Process the login attempt
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  (accountController.accountLogin)
)

module.exports = router