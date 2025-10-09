// Needed Resources
const express = require("express")
const router = new express.Router()
const appointmentController = require("../controllers/appointmentController")
const utilities = require("../utilities/")
const appointmentValidate = require("../utilities/appointment-validation")

// Route to display booking form (requires login)
router.get(
  "/book/:inv_id", 
  utilities.checkLogin, 
  appointmentController.buildBookingForm
)

// Route to process appointment booking (requires login)
router.post(
  "/book",
  utilities.checkLogin,
  appointmentValidate.appointmentRules(),
  appointmentValidate.checkAppointmentData,
  appointmentController.createAppointment
)

// Route to view user's appointments (requires login)
router.get(
  "/my-appointments",
  utilities.checkLogin,
  appointmentController.buildMyAppointments
)

// Route to cancel appointment (requires login)
router.get(
  "/cancel/:appointment_id",
  utilities.checkLogin,
  appointmentController.cancelAppointment
)

// Route to manage all appointments (requires Employee or Admin)
router.get(
  "/manage",
  utilities.checkLogin,
  utilities.checkAccountType,
  appointmentController.buildManageAppointments
)

// Route to update appointment status (requires Employee or Admin)
router.post(
  "/update-status",
  utilities.checkLogin,
  utilities.checkAccountType,
  appointmentValidate.statusUpdateRules(),
  appointmentValidate.checkStatusData,
  appointmentController.updateStatus
)

module.exports = router