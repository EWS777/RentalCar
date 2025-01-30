import Person from "../models/person.js";

class authorizationService {
    static async register(req){
        const result = await Person.getPerson(req.username);
        if (result.length === 0) return await Person.addPerson(req.username, req.password);
        else throw new Error("The username is registered yet!");
    }

    static async login(req){
        const result = await Person.getPerson(req.username);
        if (result.length === 0) throw new Error("Username is not found!");
        if (result.password !== req.password) throw new Error("The password is not correct!");
        return result;
    }
}

export default authorizationService;