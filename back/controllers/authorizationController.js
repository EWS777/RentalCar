import authorizationService from "../services/authorizationService.js";
import JWT from "../JWT.js";
import jwt from "jsonwebtoken";



class AuthorizationController {
    static async registration(req, res) {
        try {
            const result = await authorizationService.register(req.body);
            const token = jwt.sign({person: result}, JWT.secret, {expiresIn: '1h'});
            res.status(201).json({ token });
        }catch (err){
            res.status(500).json({ error: err.message });
        }
    }

    static async login(req, res) {
        try {
            const result = await authorizationService.login(req.query);
            
            const token = jwt.sign({person: result}, JWT.secret, {expiresIn: '1h'});
            res.status(200).json({ token });
        }catch (err){
            res.status(500).json({ error: err.message });
        }
    }
}

export default AuthorizationController;