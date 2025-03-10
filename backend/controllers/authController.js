import User from "../models/User.js";
import mongoose from "mongoose";


// Get user info

export const getUserInfo = async (req, res) => {
    try{
        const { id } = req.params;

        console.log("extracted id", id)

        if (!mongoose.Types.ObjectId.isValid(id)){
            console.log(id);
            return res.status(400).json({success: false, message: "invalid user id"})
        }

        const user = await User.findById(id).exec();

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({user});


    } catch(error) {
        res.status(500).json({success: false, message: "server error"});
    }
}

export default getUserInfo
