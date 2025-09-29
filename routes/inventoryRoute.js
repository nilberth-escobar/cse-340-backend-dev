// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// route to management view
router.get("/", invController.buildManagementView);

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassificationView);

// Route to add inventory
router.get("/add-inventory", invController.buildAddInventoryView);

// Process the new classification data
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    invController.addClassification
);

// Process the new inventory data
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    invController.addInventory
);


module.exports = router;