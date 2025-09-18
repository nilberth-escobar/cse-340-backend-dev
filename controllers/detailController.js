const detailModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const detailCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
detailCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await detailModel.getCarDetails(classification_id);
  const grid = await utilities.buildCarDetailGrid(data);
  let nav = await utilities.getNav();
  const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/detail", {
    title: className,
    nav,
    grid,
  });
};

module.exports = detailCont;