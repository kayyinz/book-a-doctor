const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../schemas/userModel");
const docModel = require("../schemas/docModel");
const fs=require("fs");
const mongoose = require("mongoose");
const appointmentModel = require("../schemas/appointmentModel");

const registerController = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body || {};

    if (!fullName || !email || !password || !phone) {
      return res
        .status(400)
        .send({ message: "Semua field wajib diisi", success: false });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await userModel.findOne({ email: cleanEmail });
    if (existingUser) {
      return res
        .status(409)
        .send({ message: "Email sudah terdaftar", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      fullName,
      email: cleanEmail,
      password: hashedPassword,
      phone,
    });

    res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error", success: false });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email dan password wajib diisi", success: false });
    }

    const user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Email atau password salah", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "Email atau password salah", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    res.status(200).send({
      message: "Login Success",
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        type: user.type,
        isdoctor: user.isdoctor,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error", success: false });
  }
};

const getApprovedDoctorsController = async(req,res) => {
    try {
        const doctors = await docModel.find({status:"approved"});
        res
        .status(200)
        .send({message:"Doctors fetched", success:true, data:doctors});
    }catch (error) {
        console.log(error);
        res.status(500).send({message:"Server error", success:false});
    }
};

const applyDoctorController = async(req,res) => {
    try{
        const{
            fullName,
            email,
            phone,
            address,
            specialization,
            experience,
            fees,
            timings,
        } = req.body || {};
        
        if(
            !fullName || !email || !phone || !address || !specialization || !experience || fees === undefined|| fees === "" || !timings || !timings.start || !timings.end 
        ) {
            return res
            .status(400)
            .send({message: "Semua field wajib diisi", success: false});
        }
        if(Number.isNaN(Number(fees)) || Number(fees) < 0) {
            return res
            .status(400)
            .send({message: "Biaya konsultasi harus berupa angka", success: false});
        }

        const existingDoctor = await docModel.findOne({userId:req.userId});
        if(existingDoctor){
            return res
            .status(409)
            .send({message:"Kamu sudah pernah mengajukan sebagai dokter", success:false});
        }

        await docModel.create({
            userId: req.userId,
            fullName,
            email,
            phone,
            address,
            specialization,
            experience,
            fees: Number(fees),
            timings: {start: timings.start, end: timings.end},
        });

        await userModel.updateMany(
            {type:"admin"},
            {
                $push: {
                    notification: {
                        type: "apply-doctor-request",
                        message: `${fullName} mengajukan diri sebagai dokter`,
                        onClickPath: "/admin/doctors",
                    },
                },
            }
        );

        res.status(201).send({message:"Pengajuan dokter terkirim, menunggu persetujuan admin", success: true});
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Server error", success:false});
    }
};

const bookAppointmentController = async (req, res) => {
    const fail = (status, message) => {
    if(req.file) fs.unlink(req.file.path, () => {});
    return res.status(status).send({message, success:false});
    };

    try {
        const {doctorId, date} = req.body || {};

        if(!doctorId || !date) {
            return fail(400, "Dokter dan tanggal wajib diisi");
        }
        if(!mongoose.isValidObjectId(doctorId)) {
            return fail(400, "ID dokter tidak valid");
        }

        const appointmentDate = new Date(date);
        if(Number.isNaN(appointmentDate.getTime())){
            return fail (400, "Format tanggal tidak valid");
        }
        if(appointmentDate <= new Date()){
            return fail(400, "tanggal janji temu tidak boleh sebelum hari ini");
        }

        const doctor = await docModel.findOne({_id: doctorId, status:"approved"});
        if(!doctor) {
            return fail(404, "Dokter tidak ditemukan");
        }
        if (String(doctor.userId)=== String(req.userId)){
            return fail(400,"Kamu tidak bisa membuat janji dengan dirimu sendiri");
        }

        const conflict = await appointmentModel.findOne({
            doctorId,
            date: appointmentDate,
            status: {$in: ["pending","approved"]},
        });
        if(conflict){
            return fail(409, "Jadwal dokter pada waktu tersebut sudah terisi");
        }

        const document = req.file
        ? {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
        }
        : undefined;

        await appointmentModel.create({
            userId: req.userId,
            doctorId,
            date: appointmentDate, document,
        });

        const patient = await userModel.findById(req.userId);
        const tanggal = appointmentDate.toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
            dateStyle: "long",
            timeStyle: "short",
        });

        await userModel.findByIdAndUpdate(doctor.userId, {
            $push: {
                notification: {
                    type: "new-appointment",
                    message: `Permintaan janji temu dari ${patient.fullName} pada ${tanggal} WIB`,
                    onClickPath: "/doctor/appointments",
                },
            },
        });

        res
        .status(201)
        .send({message:"Janji temu berhasil dibuat", success:true});
    } catch (error) {
        console.log(error);
        if(req.file) fs.unlink(req.file.path, () => {});
        res.status(500).send({message:"Server error", success:false});
    }
};

const getMyAppointmentsController = async(req,res) => {
    try{
        const appointments = await appointmentModel
        .find({userId: req.userId})
        .populate("doctorId", "fullName specialization fees timings")
        .sort({date: -1});

        res.status(200).send({
            message: "Appointment fetched",
            success:true,
            data: appointments,
        });
    } catch(error) {
        console.log(error);
        res.status(500).send({message:"Server error", success:false});
    }
};

const getNotificationsController = async (req, res) => {
    try {
        const user = await userModel
        .findById(req.userId)
        .select("notification seennotification");

    if(!user) {
        return res
        .status(404)
        .send({message: "User tidak ditemukan", success: false});
    }

    res.status(200).send({
        message: "Notifications fetched",
        success:true,
        data: {
            notification: user.notification,
            seennotification: user.seennotification, 
        },
    });
} catch (error) {
    console.log(error);
    res.status(500).send({message:"Server error", success:false});
}
};

const markAllNotificationsReadController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .send({ message: "User tidak ditemukan", success: false });
    }

    user.seennotification.push(...user.notification);
    user.notification = [];
    await user.save();

    res.status(200).send({
      message: "Semua notifikasi ditandai sudah dibaca",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error", success: false });
  }
};

const deleteSeenNotificationsController = async (req, res) => {
  try {
    await userModel.updateOne(
      { _id: req.userId },
      { $set: { seennotification: [] } }
    );

    res.status(200).send({
      message: "Notifikasi yang sudah dibaca dihapus",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error", success: false });
  }
};

module.exports = { registerController, 
loginController,
getApprovedDoctorsController,
applyDoctorController,
bookAppointmentController,
getMyAppointmentsController,
getNotificationsController,
markAllNotificationsReadController,
deleteSeenNotificationsController
};