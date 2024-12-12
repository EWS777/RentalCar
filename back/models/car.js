import db from '../config';

class Car{
    constructor(make, model, year, price){
        this.make = make;
        this.model = model;
        this.year = year;
        this.price = price;
    }

    static getAll(callback){
        db
    }
}