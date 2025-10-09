const pool = require("../database")

/* *****************************
* Create new appointment
* *************************** */
async function createAppointment(account_id, inv_id, appointment_date, appointment_time, notes = null){
  try {
    const sql = `INSERT INTO appointment 
      (account_id, inv_id, appointment_date, appointment_time, notes, appointment_status) 
      VALUES ($1, $2, $3, $4, $5, 'pending') 
      RETURNING *`
    return await pool.query(sql, [account_id, inv_id, appointment_date, appointment_time, notes])
  } catch (error) {
    console.error("createAppointment error: " + error)
    return error.message
  }
}

/* *****************************
* Get appointments by account ID
* *************************** */
async function getAppointmentsByAccountId(account_id) {
  try {
    const sql = `SELECT 
      a.appointment_id,
      a.appointment_date,
      a.appointment_time,
      a.appointment_status,
      a.notes,
      a.created_at,
      i.inv_id,
      i.inv_make,
      i.inv_model,
      i.inv_year,
      i.inv_image
      FROM appointment a
      JOIN inventory i ON a.inv_id = i.inv_id
      WHERE a.account_id = $1
      ORDER BY a.appointment_date DESC, a.appointment_time DESC`
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getAppointmentsByAccountId error: " + error)
    return []
  }
}

/* *****************************
* Get all appointments (for admin)
* *************************** */
async function getAllAppointments() {
  try {
    const sql = `SELECT 
      a.appointment_id,
      a.appointment_date,
      a.appointment_time,
      a.appointment_status,
      a.notes,
      a.created_at,
      a.account_id,
      i.inv_make,
      i.inv_model,
      i.inv_year,
      acc.account_firstname,
      acc.account_lastname,
      acc.account_email
      FROM appointment a
      JOIN inventory i ON a.inv_id = i.inv_id
      JOIN account acc ON a.account_id = acc.account_id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC`
    const data = await pool.query(sql)
    return data.rows
  } catch (error) {
    console.error("getAllAppointments error: " + error)
    return []
  }
}

/* *****************************
* Get appointment by ID
* *************************** */
async function getAppointmentById(appointment_id) {
  try {
    const sql = `SELECT 
      a.*,
      i.inv_make,
      i.inv_model,
      i.inv_year,
      acc.account_firstname,
      acc.account_lastname,
      acc.account_email
      FROM appointment a
      JOIN inventory i ON a.inv_id = i.inv_id
      JOIN account acc ON a.account_id = acc.account_id
      WHERE a.appointment_id = $1`
    const data = await pool.query(sql, [appointment_id])
    return data.rows[0]
  } catch (error) {
    console.error("getAppointmentById error: " + error)
    return null
  }
}

/* *****************************
* Update appointment status
* *************************** */
async function updateAppointmentStatus(appointment_id, status) {
  try {
    const sql = `UPDATE appointment 
      SET appointment_status = $1 
      WHERE appointment_id = $2 
      RETURNING *`
    const data = await pool.query(sql, [status, appointment_id])
    return data.rows[0]
  } catch (error) {
    console.error("updateAppointmentStatus error: " + error)
    return null
  }
}

/* *****************************
* Delete appointment
* *************************** */
async function deleteAppointment(appointment_id) {
  try {
    const sql = 'DELETE FROM appointment WHERE appointment_id = $1'
    const data = await pool.query(sql, [appointment_id])
    return data
  } catch (error) {
    console.error("deleteAppointment error: " + error)
    return null
  }
}

/* *****************************
* Check for appointment conflicts
* Returns count of appointments at same date/time for same vehicle
* *************************** */
async function checkAppointmentConflict(inv_id, appointment_date, appointment_time, exclude_appointment_id = null) {
  try {
    let sql = `SELECT COUNT(*) as conflict_count 
      FROM appointment 
      WHERE inv_id = $1 
      AND appointment_date = $2 
      AND appointment_time = $3 
      AND appointment_status IN ('pending', 'confirmed')`
    
    const params = [inv_id, appointment_date, appointment_time]
    
    if (exclude_appointment_id) {
      sql += ` AND appointment_id != $4`
      params.push(exclude_appointment_id)
    }
    
    const data = await pool.query(sql, params)
    return parseInt(data.rows[0].conflict_count)
  } catch (error) {
    console.error("checkAppointmentConflict error: " + error)
    return 0
  }
}

/* *****************************
* Get upcoming appointments count for a vehicle
* *************************** */
async function getUpcomingAppointmentsByVehicle(inv_id) {
  try {
    const sql = `SELECT COUNT(*) as appointment_count 
      FROM appointment 
      WHERE inv_id = $1 
      AND appointment_date >= CURRENT_DATE
      AND appointment_status IN ('pending', 'confirmed')`
    const data = await pool.query(sql, [inv_id])
    return parseInt(data.rows[0].appointment_count)
  } catch (error) {
    console.error("getUpcomingAppointmentsByVehicle error: " + error)
    return 0
  }
}

module.exports = {
  createAppointment,
  getAppointmentsByAccountId,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  checkAppointmentConflict,
  getUpcomingAppointmentsByVehicle
}