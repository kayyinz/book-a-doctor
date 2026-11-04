const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type : String,
            required: [true, "Nama lengkap wajib diisi"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email wajib diisi"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password wajib diisi"],
        },
        phone: {
            type: String,
            required: [true, "Nomor telepon wajib diisi"],
            trim: true,
        },
        type: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isdoctor: {
            type: Boolean,
            default: false,
        },
        notification: {
            type: Array,
            default: [],
        },
        seennotification: {
            type: Array,
            default: [],
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("user", userSchema);