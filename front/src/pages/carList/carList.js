import {useState} from "react";

function CarList(){
    const [car,setCar]=useState({
        marka: '',
        model: '',
        rok: 0,
        cena: 0,
    })


    const changeMarka = (e) => {
        setCar({
            marka: e.target.value
        });
    }

    const changeModel = (e) => {
        setCar({
            model: e.target.value
        });
    }

    const changeRok = (e) => {
        setCar({
            rok: e.target.value
        });
    }

    const changeCena = (e) => {
        setCar({
            cena: e.target.value
        });
    }

    return (
        <div className="carList">
            <input value={car.marka} type="text" placeholder='marka...' onChange={changeMarka}/>
            <input value={car.model} type="text" placeholder='model...' onChange={changeModel}/>
            <input value={car.rok} type="number" placeholder='rok...' onChange={changeRok}/>
            <input value={car.cena} type="number" placeholder='cena...' onChange={changeCena}/>


            <button>Add</button>
            <button>Delete</button>
            <button>Change</button>

        </div>
    );
}

export default CarList;