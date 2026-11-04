const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    getDoctorAppointmentsController,
    updateAppointmentStatusController,
} = require("../controllers/doctorController");

const router = express.Router();

router.get("/appointments", authMiddleware, getDoctorAppointmentsController);
router.post("/update-status", authMiddleware, updateAppointmentStatusController);

module.exports = router;