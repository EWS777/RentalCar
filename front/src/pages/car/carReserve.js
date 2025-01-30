import {useState} from "react";
import {jwtDecode} from "jwt-decode";
import {useParams} from "react-router-dom";
import "./carReserve.css"

export const getAvailableCar = async (odKiedy, doKiedy, id, token)=>{
    try {
        const response = await fetch(`http://localhost:5000/check?odKiedy=${odKiedy}&doKiedy=${doKiedy}&id=${id}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) throw new Error('Error');
        return await response.json();
    }catch (e){
        console.error("Error: ", e);
        return null;
    }
}

const CarReserve = () =>{
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const decodedToken = jwtDecode(token);
    
    const [odKiedy, setOdKiedy] = useState('');
    const [doKiedy, setDoKiedy] = useState('');
    const [message, setMessage] = useState('');
    const {id} = useParams();
    const [odKiedyError, setOdKiedyError] = useState(false);
    const [doKiedyError, setDoKiedyError] = useState(false);

    const handleAvailableCar = async ()=>{
        if (!odKiedy || !doKiedy) {
            if (!odKiedy) setOdKiedyError(true);
            if (!doKiedy) setDoKiedyError(true);
            setMessage("Wybierz daty!");
            return;
        }
        
        const startDate = new Date(odKiedy);
        const endDate = new Date(doKiedy);

        if (endDate < startDate) {
            setMessage("Data końcowa nie może być wcześniej niż data początkowa!");
            return;
        }
        const result = await getAvailableCar(odKiedy, doKiedy, id, token);
        if (result === true) setMessage("Samochód został zarezerwowany");
        if (result === null) {
            setMessage("Samochód jest zajęty!");
        }
    };
    
    return(
        <div>
            {message && <span>{message}</span>}
            <p>Start:</p>
            <input type="date" value={odKiedy} onChange={(e) => {
                setOdKiedy(e.target.value);
                setOdKiedyError(false);
            }} style={{ borderColor: odKiedyError ? 'red' : '' }}/>
            <p>Finish:</p>
            <input type="date" value={doKiedy} onChange={(e) => {
                setDoKiedy(e.target.value);
                setDoKiedyError(false);
            }} style={{ borderColor: doKiedyError ? 'red' : '' }}/>
            <button onClick={handleAvailableCar}>Check</button>
        </div>
    );
}
export default CarReserve;