import profileService from "../services/profileService.js";

class ProfileController{
    static async profile(req, res) {
        try {
            const result = await profileService.getProfile(req);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json({ error: err.message});
        }
    }
    
    static async updateProfile(req, res){
        try {
            const result = await profileService.updateProfile(req);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    
    static async getReservedCars(req, res){
        try {
            const result = await profileService.getReservedCars(req);
            return res.status(200).json(result);
        }catch (err){
            return res.status(500).json({error: err.message});
        }
    }
}
export default ProfileController;