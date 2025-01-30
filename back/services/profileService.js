import Person from "../models/person.js";
import jwt from "jsonwebtoken";
import Car from "../models/car.js";
import JWT from "../JWT.js";

class profileService {
    static async getProfile(req){
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) return { error: 'Unauthorized' };
            const decoded = jwt.verify(token, JWT.secret);
            const person = await Person.getPerson(decoded.person.username);
            if (!person) return { error: 'Person not found' };

            return {
                username: person.username,
                name: person.name,
                role: person.role,
                number: person.number,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    static async updateProfile(req){
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) return { error: 'Unauthorized' };
        const decoded = jwt.verify(token, JWT.secret);
        
        const person = await Person.getPerson(decoded.person.username);
        if (!person) return { error: 'Person not found' };
        
        const result = await Person.updatePerson(decoded.person.username,req.body.name, req.body.number);
        return {
            username: result.username,
            name: result.name,
            role: result.role,
            number: result.number,
        };
    }
    
    static async getReservedCars(req){
        const person = await Person.getPerson(req.params.username);
        return await Car.getReservedCars(person.id);
    }
}

export default profileService;