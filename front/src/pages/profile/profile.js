import React, { useState, useEffect } from "react";
import './profile.css';
import {jwtDecode} from "jwt-decode";

export const getPerson = async (token, setUsername, setName, setNumber, setError) => {
    try {
        const response = await fetch(`http://localhost:5000/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (response.ok) {
            setUsername(result.username || '');
            setName(result.name || '');
            setNumber(result.number || '');
        } else {
            setError(result.error || 'Error fetching profile');
        }
    } catch (e) {
        setError('Error connecting to the server');
        console.error('Error: ', e);
    }
};

export const updatePerson = async (token, username, name, number, setUsername, setName, setNumber, setError) => {
    try {
        const response = await fetch(`http://localhost:5000/profile/${username}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                name,
                number
            })
        });
        const result = await response.json();
        if (response.ok) {
            setUsername(result.username);
            setName(result.name);
            setNumber(result.number);
        } else {
            setError(result.error || 'Error fetching profile');
        }
    } catch (e) {
        setError('Error connecting to the server');
        console.error('Error: ', e);
    }
};

export const getReservedCars = async (username, setReservedCars, setError) =>{
    try {
        const response = await fetch(`http://localhost:5000/profile/${username}/getReservedCars`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            const error = await response.json();
            setError(error.message || 'Error fetching reserved cars');
            return;
        }

        const result = await response.json();
        setReservedCars(result);
    }catch (e){
        console.error("Error: ", e);
    }
};



const Profile = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [number, setNumber] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [reservedCars, setReservedCars] = useState([]);


    useEffect(() => {
        if (token) {
            getPerson(token, setUsername, setName, setNumber, setError);
        }
    }, [token]);

    useEffect(() => {
        if (username) {
            getReservedCars(username, setReservedCars, setError);
        }
    }, [username]);

    const calculateRentalCost = (start, end, dailyCost) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const days = Math.ceil((endDate - startDate + 1) / (1000 * 60 * 60 * 24));
        return days * dailyCost;
    };

    return (
        <div className="container-profile">
            <div className="form-row">
                <div className="input-group">
                    <p>Username: {username}</p>
                    <input type="number" placeholder="Number" value={number} onChange={(e) => setNumber(e.target.value)}/>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <button
                    onClick={() => updatePerson(token, username, name, number, setUsername, setName, setNumber, setError)}>Update
                </button>

            </div>

            {jwtDecode(token)?.person?.role !== 'admin' && (
                <div>
                    <h2 className="reserved-header">List of your reserved cars</h2>
                    {reservedCars.length > 0 ? (
                        reservedCars.map((car) => {
                            const rentalCost = calculateRentalCost(car.StartedAt, car.FinishedAt, car.Cost);
                            return (
                                <div className="reserved-car" key={car.IdRent}>
                                    <p> <strong>Car:</strong> {car.Make} {car.Model} ({car.Year}) </p>
                                    <p><strong>Gearbox:</strong> {car.Gearbox}</p>
                                    <p><strong>Fuel:</strong> {car.Fuel}</p>
                                    <p><strong>Cost:</strong> ${rentalCost}</p>
                                    <p>
                                        <strong>Rental Period:</strong>{' '}
                                        {new Date(car.StartedAt).toLocaleDateString()} -{' '}
                                        {new Date(car.FinishedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <h2>No reserved cars found.</h2>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
