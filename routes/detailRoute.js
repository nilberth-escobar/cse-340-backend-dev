// Needed Resources
const express = require("express");
const router = new express.Router();
const detailController = require("../controllers/detailController");

// Route to build inventory by classification view
router.get("/detail/:classificationId", detailController.buildByClassificationId);

module.exports = router;