const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user",
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"doctor",
            required: true,
        },
        date: {
            type:Date,
            required:[true, "Tanggal dan jam janji temu wajib diisi"],
        },
        document: {
            filename:String,
            originalname: String,
            mimetype:String,
            size:Number,
        },
        status: {
            type:String,
            enum:["pending","approved","rejected"],
            default: "pending",
        },
    },
    {timestamps:true}
);
module.exports=mongoose.model("appointment", appointmentSchema);