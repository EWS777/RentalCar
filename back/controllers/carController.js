import Car from '../models/car.js';
import CarService from "../services/carService.js";

class CarController {
    static async createCar(req, res) {
        try {
            const result = await CarService.addCar(req);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const result = await CarService.getCars(req);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteCar(req, res) {
        try {
            const result = await Car.deleteCarById(req.params.id);
            res.status(204).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getCarById(req, res) {
        try {
            const result = await Car.getCarById(req.params.id);
            res.status(200).json(result);
        }catch(error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    
    static async updateCar(req, res) {
        try {
            const result = await CarService.updateCar(req);
            res.status(200).json(result);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAvailableCar(req, res) {
        try {
            const result = await CarService.getAvailableCar(req);
            res.status(200).json(result);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}   

export default CarController;