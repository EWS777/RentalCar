import connection from "../config.js";

class Person {
    static async getPerson(username) {
        try {
            const [result] = await connection.execute(`SELECT * FROM Person WHERE Username= ?`, [username]);
            if (result.length > 0) {
                const {IdPerson, Username, Name, Role, Password, Number } = result[0];
                return {
                    id: IdPerson,   
                    username: Username,
                    password: Password,
                    name: Name,
                    role: Role,
                    number: Number,
                };
            }
            return result;
        } catch (error) {
            console.error(error);
        }
    }
    
    static async addPerson(username, password){
        try {
            const request = 'INSERT INTO Person (Username, Password) VALUES (?, ?)';
            const [results] = await connection.execute(request, [username, password]);
            const [rows] = await connection.execute('SELECT * FROM Person WHERE IdPerson = ?', [results.insertId]);
            
            return {
                username: rows[0].Username,
                name: rows[0].Name,
                role: rows[0].Role,
            };
        }catch (e) {
            console.log(e);
        }
    }
    
    static async updatePerson(username, name, number){
        const query = `UPDATE Person SET Name = ?, Number = ? WHERE Username = ?`;
        const [result] = await connection.execute(query, [name, number, username]);

        return {
            username: result[0].Username,
            name: result[0].Name,
            role: result[0].Role,
            number: result[0].Number,
        };
    }
}    
    

export default Person;