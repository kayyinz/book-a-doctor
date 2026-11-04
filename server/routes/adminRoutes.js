const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
    getAllDoctorsController,
    updateDoctorStatusController,
    getAllUsersController,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/doctors", authMiddleware, adminMiddleware, getAllDoctorsController);
router.post("/update-doctor-status", authMiddleware,adminMiddleware,updateDoctorStatusController);
router.get("/users", authMiddleware, adminMiddleware, getAllUsersController);

module.exports = router;