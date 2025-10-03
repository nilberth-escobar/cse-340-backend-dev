// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", (invController.buildByClassificationId));

// route to management view
router.get("/", (invController.buildManagementView));

// Route to build add classification view
router.get("/add-classification", (invController.buildAddClassificationView));

// Route to add inventory
router.get("/add-inventory", (invController.buildAddInventoryView));

// Route to get inventory based on classification_id
router.get("/getInventory/:classification_id", (invController.getInventoryJSON))

// Route to build the edit inventory view
router.get("/edit/:inv_id", (invController.editInventoryView))

// Route to build the delete confirmation view
router.get("/delete/:inv_id", (invController.buildDeleteConfirmationView))

// Process the new classification data
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    (invController.addClassification)
);

// Process the new inventory data
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    (invController.addInventory)
);

// Process the vehicle update
router.post(
    "/update/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    (invController.updateInventory)
  );

// Process the delete request
router.post(
    "/delete/",
    (invController.deleteInventoryItem)
);


module.exports = router;

