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

// Route to build the account update view
router.get("/update/:accountId", utilities.checkLogin, (accountController.buildUpdateView))

// Route for logout
router.get("/logout", (accountController.logout))

// Route to process registration
router.post(
    '/register', 
    regValidate.registationRules(),
    regValidate.checkRegData,
    (accountController.registerAccount))

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  (accountController.accountLogin)
)

// Process the update account data
router.post(
    '/update-info', 
    utilities.checkLogin,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    (accountController.updateAccount)
)

// Process the password update
router.post(
    '/update-password',
    utilities.checkLogin, 
    regValidate.updatePasswordRules(),
    regValidate.checkPasswordData,
    (accountController.updatePassword)
)

module.exports = router
