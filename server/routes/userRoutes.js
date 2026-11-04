const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const {
    registerController,
    loginController,
    getApprovedDoctorsController,
    applyDoctorController,
    bookAppointmentController,
    getMyAppointmentsController,
    getNotificationsController,
    markAllNotificationsReadController,
    deleteSeenNotificationsController,
} = require("../controllers/userController");

const router = express.Router();

const handleUpload = (req, res, next) => {
    upload.single("document")(req,res,(err)=>{
        if(err){
            return res.status(400).send({message:err.message, success:false});
        }
        next();
    });
};

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/doctors", authMiddleware, getApprovedDoctorsController);
router.post("/apply-doctor", authMiddleware, applyDoctorController);
router.post("/book-appointment", authMiddleware, handleUpload, bookAppointmentController);
router.get("/my-appointments", authMiddleware, getMyAppointmentsController);
router.get("/notifications", authMiddleware, getNotificationsController);
router.post("/notifications/read-all", authMiddleware, markAllNotificationsReadController);
router.delete("/notifications/seen", authMiddleware, deleteSeenNotificationsController);

module.exports = router;