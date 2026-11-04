const docModel = require("../schemas/docModel");
const userModel = require("../schemas/userModel");

const getAllDoctorsController = async(req, res) => {
    try{
        const doctors = await docModel.find();

        res.status(200).send({
            message:"Doctor fetched",
            success: true,
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Server error", success:false});
    }
};

const updateDoctorStatusController = async(req, res) => {
    try {
        const{doctorId, status} = req.body || {};

        if(!["approved","rejected"].includes(status)) {
            return res
            .status(400)
            .send({message:"Status harus approved atau rejected", success:false});
        }

        const doctor = await docModel.findByIdAndUpdate(doctorId, {status});
        if(!doctor){
            return res
            .status(404)
            .send({message:"Dokter tidak ditemukan", success: false});
        }

        await userModel.findByIdAndUpdate(doctor.userId, {
            $set : {isdoctor: status === "approved"},
            $push: {
                notification: {
                    type: "doctor-request-status",
                    message: `Pengajuan dokter kamu ${status}`,
                    onClickPath: "/user/notifications",
                },
            },
        });

        res.status(200).send({message:"Status dokter diperbarui", success: true});
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Server error", success:false});
    }
};

const getAllUsersController = async(req, res) => {
    try {
        const users = await userModel.find().select("-password");

        res.status(200).send({
            message:"User fetched",
            success: true,
            data: users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Server error", success: false});
    }
};

module.exports = {getAllDoctorsController, updateDoctorStatusController, getAllUsersController};