import jwt from "jsonwebtoken";
import Car from "../models/car.js";
import Person from "../models/person.js";
import JWT from "../JWT.js";

class CarService{
    static async addCar(req){
        try{
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return { error: 'Unauthorized' };
            const decoded = jwt.verify(token, JWT.secret);
            if (decoded.person.role !== 'admin') return { error: 'Unauthorized' };
            
            const result = await Car.addCar(req.body);
            
            return {
                id: result.id,
                isAvailable: result.isAvailable,
                make: result.make,
                model: result.model,
                year: result.year,
                color: result.color,
                cost: result.cost,
                gearbox: result.gearbox,
                fuel: result.fuel
            };
            
        }catch (e){
            throw new Error(e.message);
        }
    }
    
    static async getCars(req){
        try {
            const result = await Car.getAllCars(10, 10 * (req.query.page-1));
            const total = await Car.countCars();
            return{
                total: total,
                cars: result
            };
            
        }catch (e){
            throw new Error(e.message);
        }
    }
    
    static async updateCar(req){
        try {
            const result = await Car.updateCarById(req.params.id, req.body.isAvailable, req.body.make, req.body.model, 
                req.body.year, req.body.color, req.body.cost, req.body.gearbox, req.body.fuel);
            
            return {
                id: result.id,
                isAvailable: result.isAvailable,
                make: result.make,
                model: result.model,
                year: result.year,
                color: result.color,
                cost: result.cost,
                gearbox: result.gearbox,
                fuel: result.fuel
            };
        }catch (e){
            throw new Error(e.message);
        }
    }

    static async getAvailableCar(req){
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return { error: 'Unauthorized' };
            const decoded = jwt.verify(token, JWT.secret);
            
            const getPerson = await Person.getPerson(decoded.person.username);
            
            const result = await Car.getAvailableCar(req.query.id, req.query.odKiedy, req.query.doKiedy);
            
            if (result.length === 0) {
                return await Car.addReserve(req.query.id, getPerson.id, req.query.odKiedy, req.query.doKiedy);
            }
            else throw new Error("Can't reserve in this days");
        }catch (e){
            throw new Error(e.message);
        }
    }
}

export default CarService;