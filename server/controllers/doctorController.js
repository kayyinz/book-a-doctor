const docModel = require("../schemas/docModel");
const appointmentModel = require("../schemas/appointmentModel");
const userModel = require("../schemas/userModel");

const getDoctorAppointmentsController = async(req, res) => {
    try{
        const doctor = await docModel.findOne({
            userId: req.userId,
            status: "approved",
        });
        if(!doctor){
            return res
            .status(403)
            .send({message:"Kamu bukan dokter yang disetujui", success:false});
        }

        const appointments = await appointmentModel
        .find({doctorId: doctor._id})
        .populate("userId","fullName email phone")
        .sort({date:-1});;

        res.status(200).send({
            message:"Appointments fetched",
            success:true,
            data:appointments,
        });
    }  catch (error){
        console.log(error);
        res.status(500).send({message:"Server error", success: false});
    }
};

const updateAppointmentStatusController = async (req, res) => {
    try {
        const {appointmentId, status} = req.body || {};

        if(!["approved","rejected"].includes(status)){
            return res
            .status(400)
            .send({message:"Status harus approved atau rejected", success: false});
        }

        const doctor = await docModel.findOne({
            userId: req.userId,
            status:"approved",
        });
        if(!doctor){
            return res
            .status(403)
            .send({message: "Kamu bukan dokter yang disetujui", success: false});
        }

        const appointment = await appointmentModel.findOneAndUpdate(
            {_id: appointmentId, doctorId: doctor._id},
            {status}
        );
        if (!appointment) {
            return res
            .status(404)
            .send({message:"Janji temu tidak ditemukan", success: false});
        }

        const tanggal = appointment.date.toLocaleString("id-ID", {
            timeZone : "Asia/Jakarta",
            dateStyle: "long",
            timeStyle: "short",
        });
        const hasil = status === "approved" ? "disetujui" : "ditolak";

        await userModel.findByIdAndUpdate(appointment.userId, {
            $push: {
                notification: {
                    type:"appointment-status",
                    message: `Janji temu kamu dengan Dr. ${doctor.fullName} pada ${tanggal} WIB ${hasil}`,
                    onClickPath: "/user/appointments",
                },
            },
        });

        res.status(200).send({message: "Status janji temu diperbarui", success:true});
    }catch (error){
        console.log(error);
        res.status(500).send({message:"Server error", success: false});
    }
};

module.exports = {
    getDoctorAppointmentsController,
    updateAppointmentStatusController,
};