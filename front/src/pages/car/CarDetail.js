import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import "./carDetail.css";

const getCarById = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/car/${id}`);
        if (!response.ok) {
            throw new Error('Error');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

const updateCarById = async (id, make, model, year, color, cost, gearbox, fuel, isAvailable) => {
    try {
        const response = await fetch(`http://localhost:5000/car/${id}`,{
            method: 'PUT',
            headers: {
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
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(`Error: ${errorData.message || 'Unknown error'}`);
        }
        return await response.json();
    }catch (error) {
        console.error('Error:', error);
        return null;
    }
}


const CarDetail = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const {id} = useParams();
    const [car, setCar] = useState({
        id: 0,
        make: '',
        model: '',
        year: 0,
        color: '',
        cost: 0,
        gearbox: '',
        fuel: '',
        isAvailable: true,
    });

    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const fetchCar = async () => {
            const data = await getCarById(id);
            console.log(data[0].Model);
            if (data) {
                setCar({
                    make: data[0].Make,
                    model: data[0].Model,
                    year: data[0].Year,
                    color: data[0].Color,
                    cost: data[0].Cost,
                    gearbox: data[0].Gearbox,
                    fuel: data[0].Fuel,
                    isAvailable: data[0].IsAvailable
                });
            }
        };
        fetchCar();
    }, [id]);
    
    const handleUpdateCar = async () => {
        const success = await updateCarById(id, car.make, car.model, car.year, car.color, car.cost, car.gearbox, car.fuel, car.isAvailable);
        if (success) setIsClicked(false);
        else throw new Error("Error");
    };

    const handleUpdateClick = () => { setIsClicked(true);};
    
    return (
        <div>
            <h2>Car Details</h2>
            {token && jwtDecode(token).person?.role === 'admin' ?
                <div className="all">
                    <div className="opis">
                        <p>Make: {car.make}</p>
                        <p>Model: {car.model}</p>
                        <p>Year: {car.year}</p>
                        <p>Color: {car.color}</p>
                        <p>Cost: {car.cost}</p>
                        <p>Gearbox: {car.gearbox}</p>
                        <p>Fuel: {car.fuel}</p>
                        <p>Available: {car.isAvailable}</p>
                        <button onClick={handleUpdateClick}>Update Car</button>
                    </div>
                    {isClicked && (
                        <div className="update-car">
                            <input type="text" placeholder="Make" value={car.make}
                                   onChange={(e) => setCar({...car, make: e.target.value})}/>
                            <input type="text" placeholder="Model" value={car.model}
                                   onChange={(e) => setCar({...car, model: e.target.value})}/>
                            <input type="number" placeholder="Year" value={car.year}
                                   onChange={(e) => setCar({...car, year: Number(e.target.value)})}/>
                            <input type="text" placeholder="Color" value={car.color}
                                   onChange={(e) => setCar({...car, color: (e.target.value)})}/>
                            <input type="number" placeholder="Cost" value={car.cost}
                                   onChange={(e) => setCar({...car, cost: Number(e.target.value)})}/>
                            <select value={car.gearbox} onChange={(e) => setCar({...car, gearbox: e.target.value})}>
                                <option value="" disabled selected>Choose gearbox</option>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </select>
                            <select value={car.fuel} onChange={(e) => setCar({...car, fuel: e.target.value})}>
                                <option value="" disabled selected>Choose fuel</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="LPG">LPG</option>
                            </select>
                            <select value={car.isAvailable}
                                    onChange={(e) => setCar({...car, isAvailable: e.target.value})}>
                                <option value="" disabled selected>available?</option>
                                <option value="Free">Free</option>
                                <option value="Not free">Not free</option>
                            </select>
                            <button onClick={handleUpdateCar}>Save Changes</button>
                        </div>
                    )}
                </div>

                :

                <div className="opis">
                    <p>Make: {car.make}</p>
                    <p>Model: {car.model}</p>
                    <p>Year: {car.year}</p>
                    <p>Color: {car.color}</p>
                    <p>Cost: {car.cost}</p>
                    <p>Gearbox: {car.gearbox}</p>
                    <p>Fuel: {car.fuel}</p>
                    {token && jwtDecode(token).person?.role === 'user' &&
                        <Link className="button-reserve" to={`/carlist/${id}/reserve`}>Reserve</Link>}
                </div>

            }
        </div>
    );
};

export default CarDetail;
