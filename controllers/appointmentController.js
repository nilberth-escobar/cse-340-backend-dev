const appointmentModel = require("../models/appointment-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const appointmentCont = {}

/* ****************************************
* Build appointment booking form
* *************************************** */
appointmentCont.buildBookingForm = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  
  try {
    const vehicleData = await invModel.getInventoryById(inv_id)
    
    if (!vehicleData || vehicleData.length === 0) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/")
    }
    
    const vehicle = vehicleData[0]
    
    res.render("appointment/book", {
      title: `Schedule Test Drive - ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      errors: null,
      vehicle,
      inv_id,
    })
  } catch (error) {
    req.flash("notice", "Sorry, there was an error loading the booking form.")
    res.redirect("/")
  }
}

/* ****************************************
* Process appointment booking
* *************************************** */
appointmentCont.createAppointment = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_id, appointment_date, appointment_time, notes } = req.body
  const account_id = res.locals.accountData.account_id
  
  try {
    // Check for conflicts
    const conflictCount = await appointmentModel.checkAppointmentConflict(
      inv_id, 
      appointment_date, 
      appointment_time
    )
    
    if (conflictCount > 0) {
      const vehicleData = await invModel.getInventoryById(inv_id)
      const vehicle = vehicleData[0]
      
      req.flash("notice", "Sorry, that time slot is already booked. Please select a different time.")
      return res.status(400).render("appointment/book", {
        title: `Schedule Test Drive - ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        errors: null,
        vehicle,
        inv_id,
        appointment_date,
        appointment_time,
        notes,
      })
    }
    
    // Create appointment
    const result = await appointmentModel.createAppointment(
      account_id,
      inv_id,
      appointment_date,
      appointment_time,
      notes
    )
    
    if (result) {
      req.flash("notice", "Your test drive appointment has been requested! We'll contact you shortly to confirm.")
      res.redirect("/appointment/my-appointments")
    } else {
      throw new Error("Appointment creation failed")
    }
  } catch (error) {
    console.error("Create appointment error: " + error)
    const vehicleData = await invModel.getInventoryById(inv_id)
    const vehicle = vehicleData[0]
    
    req.flash("notice", "Sorry, there was an error booking your appointment. Please try again.")
    res.status(500).render("appointment/book", {
      title: `Schedule Test Drive - ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      errors: null,
      vehicle,
      inv_id,
      appointment_date,
      appointment_time,
      notes,
    })
  }
}

/* ****************************************
* Build my appointments view
* *************************************** */
appointmentCont.buildMyAppointments = async function (req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  
  try {
    const appointments = await appointmentModel.getAppointmentsByAccountId(account_id)
    
    res.render("appointment/my-appointments", {
      title: "My Test Drive Appointments",
      nav,
      errors: null,
      appointments,
    })
  } catch (error) {
    console.error("Build my appointments error: " + error)
    req.flash("notice", "Sorry, there was an error loading your appointments.")
    res.redirect("/account/")
  }
}

/* ****************************************
* Build manage appointments view (Admin/Employee)
* *************************************** */
appointmentCont.buildManageAppointments = async function (req, res, next) {
  let nav = await utilities.getNav()
  
  try {
    const appointments = await appointmentModel.getAllAppointments()
    
    res.render("appointment/manage", {
      title: "Manage Test Drive Appointments",
      nav,
      errors: null,
      appointments,
    })
  } catch (error) {
    console.error("Build manage appointments error: " + error)
    req.flash("notice", "Sorry, there was an error loading appointments.")
    res.redirect("/inv/")
  }
}

/* ****************************************
* Update appointment status
* *************************************** */
appointmentCont.updateStatus = async function (req, res) {
  const { appointment_id, status } = req.body
  
  try {
    const result = await appointmentModel.updateAppointmentStatus(appointment_id, status)
    
    if (result) {
      req.flash("notice", `Appointment status updated to ${status}.`)
    } else {
      req.flash("notice", "Sorry, the status update failed.")
    }
  } catch (error) {
    console.error("Update status error: " + error)
    req.flash("notice", "Sorry, there was an error updating the appointment.")
  }
  
  res.redirect("/appointment/manage")
}

/* ****************************************
* Cancel appointment (customer)
* *************************************** */
appointmentCont.cancelAppointment = async function (req, res) {
  const appointment_id = parseInt(req.params.appointment_id)
  const account_id = res.locals.accountData.account_id
  
  try {
    // Verify appointment belongs to user
    const appointment = await appointmentModel.getAppointmentById(appointment_id)
    
    if (!appointment || appointment.account_id !== account_id) {
      req.flash("notice", "Appointment not found or you don't have permission to cancel it.")
      return res.redirect("/appointment/my-appointments")
    }
    
    const result = await appointmentModel.updateAppointmentStatus(appointment_id, 'cancelled')
    
    if (result) {
      req.flash("notice", "Your appointment has been cancelled.")
    } else {
      req.flash("notice", "Sorry, the cancellation failed.")
    }
  } catch (error) {
    console.error("Cancel appointment error: " + error)
    req.flash("notice", "Sorry, there was an error cancelling your appointment.")
  }
  
  res.redirect("/appointment/my-appointments")
}

module.exports = appointmentCont