import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";
import "./carList.css";

export const addCar = async (token, make, model, year, color, cost, gearbox, fuel, isAvailable) => {
    try {
        const response = await fetch('http://localhost:5000/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                make,
                model,
                year,
                color,
                cost,
                gearbox,
                fuel,
                isAvailable
            })
        });
        if (!response.ok) throw new Error('Error');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

export const getAllCars = async (page = 1) => {
    try {
        const response = await fetch(`http://localhost:5000/cars?page=${page}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return { cars: [], totalPages: 1 };
    }
};

export const deleteCar = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/delete/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error');
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

const CarList = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [car, setCar] = useState({
        make: '',
        model: '',
        year: 0,
        color: '',
        cost: 0,
        gearbox: '',
        fuel: '',
        isAvailable: '',
    });

    const [errors, setErrors] = useState({
        make: false,
        model: false,
        year: false,
        color: false,
        cost: false,
        gearbox: false,
        fuel: false,
        isAvailable: false
    });

    useEffect(() => {
        const fetchCars = async () => {
            const data = await getAllCars(currentPage);
            setCars(data.cars);
            setTotalPages(Math.ceil(data.total/10));
        };
        fetchCars();
    }, [currentPage]);

    const handleAddCar = async () => {
        const newErrors = {
            make: !car.make,
            model: !car.model,
            year: !car.year || car.year <= 0,
            color: !car.color,
            cost: !car.cost || car.cost <= 0,
            gearbox: !car.gearbox,
            fuel: !car.fuel,
            isAvailable: !car.isAvailable
        };

        setErrors(newErrors);
        
        if (Object.values(newErrors).some((error) => error)) {
            return;
        }
        
        const newCar = await addCar(
            token,
            car.make,
            car.model,
            car.year,
            car.color,
            car.cost,
            car.gearbox,
            car.fuel,
            car.isAvailable
        );

        if (newCar && newCar.id) {
            setCar({ make: '', model: '', year: 0, color: '', cost: 0, gearbox: '', fuel: '', isAvailable: '' });
        } else {
            console.error('Error while adding the car.');
        }
    };

    const handleDeleteCar = async (id) => {
        const success = await deleteCar(id);
        if (success) setCars((prevCars) => prevCars.filter((car) => car.IdCar !== id));
    };

    const handleInputChange = (field, value) => {
        setCar((prevCar) => ({ ...prevCar, [field]: value }));
        
        setErrors((prevErrors) => ({ ...prevErrors, [field]: !value }));
    };
    
    return (
        <div>
            {token ? (
                    jwtDecode(token)?.person?.role === 'admin' ? (
                        <div>
                            <h2>Car list</h2>
                            <div className="add-car">
                                <input type="text" placeholder="Make" value={car.make}
                                       onChange={(e) => handleInputChange('make', e.target.value)} style={{ borderColor: errors.make ? 'red' : '' }}/>
                                <input type="text" placeholder="Model" value={car.model}
                                       onChange={(e) => handleInputChange('model', e.target.value)} style={{ borderColor: errors.model ? 'red' : '' }}/>
                                <input type="number" placeholder="Year" value={car.year}
                                       onChange={(e) => handleInputChange('year', e.target.value)} style={{ borderColor: errors.year ? 'red' : '' }}/>
                                <input type="text" placeholder="Color" value={car.color}
                                       onChange={(e) => handleInputChange('color', e.target.value)} style={{ borderColor: errors.color ? 'red' : '' }}/>
                                <input type="number" placeholder="Cost" value={car.cost}
                                       onChange={(e) => handleInputChange('cost', Number(e.target.value))} style={{ borderColor: errors.cost ? 'red' : '' }}/>
                                <select value={car.gearbox} onChange={(e) => setCar({...car, gearbox: e.target.value})} style={{ borderColor: errors.gearbox ? 'red' : '' }}>
                                    <option value="" disabled selected>Choose gearbox</option>
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                </select>
                                <select value={car.fuel} onChange={(e) => handleInputChange('fuel', e.target.value)} style={{ borderColor: errors.fuel ? 'red' : '' }}>
                                    <option value="" disabled selected>Choose fuel</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="LPG">LPG</option>
                                </select>
                                <select value={car.isAvailable}
                                        onChange={(e) => handleInputChange('isAvailable', e.target.value)} style={{ borderColor: errors.isAvailable ? 'red' : '' }}>
                                    <option value="" disabled selected>available?</option>
                                    <option value="Free">Free</option>
                                    <option value="Not free">Not free</option>
                                </select>
                                <button onClick={handleAddCar}>Add Car</button>
                            </div>
                            <ul className="list-cars">
                                {cars.map(car => (
                                    <li key={car.IdCar}>
                                        <span className="span-link">{car.Make} {car.Model} {car.Year} {car.Cost}</span>
                                            <Link className="link" to={`/carlist/${car.IdCar}`}>Details</Link>
                                            <button onClick={() => handleDeleteCar(car.IdCar)}>Delete</button>
                                        
                                    </li>
                                ))}
                            </ul>

                            <div>
                                {currentPage > 1 && (
                                    <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                                )}
                                <span>Page {currentPage} of {totalPages}</span>
                                {currentPage < totalPages && (
                                    <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2>List of cars</h2>
                            <ul className="list-cars">
                                {cars
                                    .filter(car => car.IsAvailable === 'Free')
                                    .map(car => (
                                        <li key={car.IdCar}>
                                            <span className="span-link">{car.Make} {car.Model} {car.Year} {car.Cost}</span>
                                            <Link className="link" to={`/carlist/${car.IdCar}`}>Details</Link>
                                            <Link className="link" to={`/carlist/${car.IdCar}/reserve`}>Zarezerwowac</Link>
                                        </li>
                                    ))}
                            </ul>
                            
                            <div>
                                {currentPage > 1 && (
                                    <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                                )}
                                <span>Page {currentPage} of {totalPages}</span>
                                {currentPage < totalPages && (
                                    <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                                )}
                            </div>
                        </div>
                    )
                ) :
                <div>
                    <h2>List of cars</h2>
                    <ul className="list-cars">
                        {cars
                            .filter(car => car.IsAvailable === 'Free')
                            .map(car => (
                                <li key={car.IdCar}>
                                    <span className="span-link">{car.Make} {car.Model} {car.Year} {car.Cost}</span>
                                    <Link className="link" to={`/carlist/${car.IdCar}`}>Details</Link>
                                </li>
                            ))}
                    </ul>
                    
                    <div>
                        {currentPage > 1 && (
                            <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                        )}
                        <span>Page {currentPage} of {totalPages}</span>
                        {currentPage < totalPages && (
                            <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                        )}
                    </div>
                </div>
            }
        </div>
    );
}
export default CarList;