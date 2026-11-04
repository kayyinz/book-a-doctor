const userModel = require("../schemas/userModel");

const adminMiddleware = async (req, res, next) =>{
    try{
        const user = await userModel.findById(req.userId);
        if(!user || user.type !== "admin"){
            return res
            .status(403)
            .send({message:"Khusus admin", success:false});
        }
        next();
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Server error", success:false});
    }
};

module.exports = adminMiddleware;