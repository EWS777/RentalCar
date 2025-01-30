import connection from "../config.js";

class Car {
    static async getAllCars(limit, skip) {
        try {
            const query = `SELECT * FROM car LIMIT ? OFFSET ?`;
            const [rows] = await connection.query(query, [limit, skip]);
            return rows;
        } catch (err) {
            console.error('Error fetching cars:', err);
            throw err;
        }
    }

    static async countCars() {
        try {
            const query = `SELECT COUNT(*) AS total FROM car`;
            const [result] = await connection.query(query);
            return result[0].total;
        } catch (err) {
            console.error('Error counting cars:', err);
            throw err;
        }
    }

    static async getCarById(id) {
        try {
            const request = `SELECT * FROM car WHERE IdCar=${id}`;
            const [rows] = await connection.query(request);
            return rows;
        }catch(err) {
            console.error('Error fetching car:', err);
        }
    }

    static async addCar(car) {
        try {
            const query = 'INSERT INTO car (isAvailable, make, model, year, color, cost, gearbox, fuel) VALUES (?, ?, ?, ?, ?, ?, ?,?)';
            const [results] = await connection.execute(query, [car.isAvailable, car.make, car.model, car.year, car.color, car.cost, car.gearbox, car.fuel]);

            const newCarId = results.insertId;
            
            return {
                id: newCarId,
                isAvailable: car.isAvailable,
                make: car.make,
                model: car.model,
                year: car.year,
                color: car.color,
                cost: car.cost,
                gearbox: car.gearbox,
                fuel: car.fuel,
            };
        } catch (err) {
            console.error('Error adding car:', err);
            throw err;
        }
    }
    
    static async deleteCarById(id) {
        try {
            const query = 'DELETE FROM car WHERE IdCar = ?';
            const [results] = await connection.execute(query, [id]);
            return results;
        } catch (err) {
            console.error('Error deleting car:', err);
            throw err;
        }
    }
    
    static async updateCarById(id, isAvailable, make, model, year, color, cost, gearbox, fuel){
        try {
            const query = `UPDATE car SET 
                IsAvailable = ?, 
                Make = ?, 
                Model = ?, 
                Year = ?, 
                Color = ?, 
                Cost = ?, 
                Gearbox = ?, 
                Fuel = ? 
            WHERE IdCar = ?`;
            const [results] = await connection.execute(query, [isAvailable, make, model, year, color, cost, gearbox, fuel, id]);

            if (results.affectedRows > 0) {
                return {
                    id: id,
                    isAvailable,
                    make,
                    model,
                    year,
                    color,
                    cost,
                    gearbox,
                    fuel,
                };
            } else throw new Error(`Car with Id ${id} not found.`);
        }catch(err) {
            console.error('Error updating car:', err);
            throw err;
        }
    }


    static async getAvailableCar(id, odKiedy, doKiedy) {
        try {
            const query = `SELECT * FROM Rent Where Car_IdPerson = ?
                           AND (
                               (StartedAt BETWEEN ? AND ?)
                               OR (FinishedAt BETWEEN ? AND ?)
                               OR (StartedAt = ? OR StartedAt = ?)
                               OR (FinishedAt = ? OR FinishedAt = ?)
                               
                               OR (? BETWEEN StartedAt AND FinishedAt)
                               OR (? BETWEEN StartedAt AND FinishedAt)
                               )`;
            const [rows] = await connection.query(query, [id, odKiedy, doKiedy, odKiedy, doKiedy, odKiedy, doKiedy, odKiedy, doKiedy, odKiedy, doKiedy]);
            return rows;
        } catch (err) {
            console.error('Error deleting car:', err);
            throw err;
        }
    }
    
    static async addReserve(idCar, idPerson, odKiedy, doKiedy){
        try {
            const query = 'INSERT INTO Rent (StartedAt, FinishedAt, Person_IdPerson, Car_IdPerson) VALUES (?, ?, ?, ?)';
            const [results] = await connection.execute(query, [odKiedy, doKiedy, idPerson, idCar]);
            return true;
        } catch (err) {
            console.error('Error adding car:', err);
            throw err;
        }
    }
    
    static async getReservedCars(personId){
        try {
            const query = `
            SELECT 
                Rent.IdRent,
                Rent.StartedAt,
                Rent.FinishedAt,
                Car.IdCar,
                Car.Make,
                Car.Model,
                Car.Year,
                Car.Color,
                Car.Cost,
                Car.Gearbox,
                Car.Fuel,
                Car.IsAvailable
            FROM 
                Rent
            INNER JOIN 
                Car ON Rent.Car_IdPerson = Car.IdCar
            WHERE 
                Rent.Person_IdPerson = ?;
        `;
            const [results] = await connection.execute(query, [personId]);
            return results;
        }catch (err){
            throw err;
        }
    }
}

export default Car;