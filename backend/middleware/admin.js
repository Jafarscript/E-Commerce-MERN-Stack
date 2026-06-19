import User from "../models/User.js"



const admin = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "admin") return res.status(403).json({ error: "Access denied" });
        next()
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}
export default admin