import express from 'express';
import CarController from '../controllers/carController.js';
import AuthorizationController from "../controllers/authorizationController.js";
import ProfileController from "../controllers/profileController.js";

const router = express.Router();

router.get('/cars', CarController.getAll);
router.get('/car/:id', CarController.getCarById);
router.post('/add', CarController.createCar);
router.delete('/delete/:id', CarController.deleteCar);
router.put('/car/:id', CarController.updateCar);
router.post('/registration', AuthorizationController.registration);
router.get('/login', AuthorizationController.login);
router.get('/profile', ProfileController.profile);
router.put('/profile/:username', ProfileController.updateProfile);
router.get('/check', CarController.getAvailableCar);
router.get('/profile/:username/getReservedCars', ProfileController.getReservedCars);

export default router;