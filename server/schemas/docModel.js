const mongoose = require("mongoose");

const docSchema = new mongoose.Schema(
    {
        userId: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user",
            required : true,
            unique : true,
        },
        fullName: { type:String, required:[true, "Nama lengkap wajib diisi"], trim:true},
        email: {type:String, required:[true,"Email wajib diisi"], lowercase:true, trim:true},
        phone: {type:String, required:[true, "Nomor Telepon wajib diisi"], trim:true},
        address: {type:String, required:[true, "Alamat wajib diisi"], trim:true},
        specialization: {type:String, required:[true, "Spesialisasi wajib diisi"], trim:true},
        experience: {type:String, required:[true, "Pengalaman wajib diisi"], trim:true},
        fees: {type:Number, required:[true, "Biaya konsultasi wajib diisi"], min: 0},
        timings: {
            start: {type:String, required:[true,"Jam mulai wajib diisi"]},
            end: {type:String, required:[true,"Jam selesai wajib diisi"]},
        },
        status: {
            type: String,
            enum:["pending","approved","rejected"],
            default: "pending",
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("doctor", docSchema);