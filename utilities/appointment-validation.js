const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Appointment Booking Validation Rules
 * ********************************* */
validate.appointmentRules = () => {
  return [
    // inv_id is required and must be numeric
    body("inv_id")
      .trim()
      .isNumeric()
      .withMessage("Invalid vehicle selected."),

    // appointment_date is required and must be a valid date in the future
    body("appointment_date")
      .trim()
      .notEmpty()
      .withMessage("Please select an appointment date.")
      .isDate()
      .withMessage("Please provide a valid date.")
      .custom((value) => {
        const selectedDate = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (selectedDate < today) {
          throw new Error("Appointment date must be in the future.")
        }
        
        // Limit to 60 days in advance
        const maxDate = new Date()
        maxDate.setDate(maxDate.getDate() + 60)
        if (selectedDate > maxDate) {
          throw new Error("Appointments can only be scheduled up to 60 days in advance.")
        }
        
        return true
      }),

    // appointment_time is required and must be valid
    body("appointment_time")
      .trim()
      .notEmpty()
      .withMessage("Please select an appointment time.")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Please provide a valid time in HH:MM format.")
      .custom((value) => {
        const [hours, minutes] = value.split(':').map(Number)
        
        // Business hours: 9 AM to 5 PM
        if (hours < 9 || hours >= 17) {
          throw new Error("Appointments are only available between 9:00 AM and 5:00 PM.")
        }
        
        // Only allow appointments on the hour or half hour
        if (minutes !== 0 && minutes !== 30) {
          throw new Error("Appointments are available at :00 or :30 minutes only.")
        }
        
        return true
      }),

    // notes are optional but should be sanitized
    body("notes")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Notes must be less than 500 characters."),
  ]
}

/* ******************************
 * Check appointment data and return errors or continue
 * ***************************** */
validate.checkAppointmentData = async (req, res, next) => {
  const { inv_id, appointment_date, appointment_time, notes } = req.body
  let errors = []
  errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const vehicleData = await invModel.getInventoryById(inv_id)
    const vehicle = vehicleData && vehicleData.length > 0 ? vehicleData[0] : null
    
    if (!vehicle) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/")
    }
    
    res.render("appointment/book", {
      errors,
      title: `Schedule Test Drive - ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      inv_id,
      appointment_date,
      appointment_time,
      notes,
    })
    return
  }
  next()
}

/* **********************************
 * Status Update Validation Rules
 * ********************************* */
validate.statusUpdateRules = () => {
  return [
    body("appointment_id")
      .trim()
      .isNumeric()
      .withMessage("Invalid appointment ID."),

    body("status")
      .trim()
      .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
      .withMessage("Invalid status value."),
  ]
}

/* ******************************
 * Check status update data
 * ***************************** */
validate.checkStatusData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    req.flash("notice", "Invalid status update request.")
    return res.redirect("/appointment/manage")
  }
  next()
}

module.exports = validate