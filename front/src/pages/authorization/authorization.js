import {useState} from "react";
import './authorization.css';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

export const addPerson = async (username, password) => {
    try {
        const response = await fetch('http://localhost:5000/registration',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password}),
        });
        const result = await response.json();
        if (result.token) localStorage.setItem('token', result.token);
        return result;
    }catch (e) {
        console.error('Error: ', e);
    }
};

export const getPerson = async (username, password) => {
    try {
        const response = await fetch(`http://localhost:5000/login?username=${username}&password=${password}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (result.token) localStorage.setItem('token', result.token);
        return result;
    }catch (e) {
        console.error('Error: ', e);
    }
};

export const decodeTokenAndSetRole = (token, setRole) => {
    try {
        const decodedToken = jwtDecode(token);
        
        if (  (decodedToken.exp * 1000) < Date.now()) {
            console.error('Token has expired');
            localStorage.removeItem('token');
            return null;
        }

        if (decodedToken && decodedToken.person.role) {
            setRole(decodedToken.person.role);
            return decodedToken;
        } else {
            console.log(decodedToken.person.role);
            return null;
        }
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

const Authorization = ({setRole}) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errors, setErrors] = useState([]);
    
    const validate = (username, password, passwordConfirm) => {
        const errors = [];
        if (username.length < 6) errors.push("'username' should be > 6");
        if (password.length < 8) errors.push("'password' should be > 8");
        if (passwordConfirm && password !== passwordConfirm) errors.push("Passwords do not match");
        return errors;
    };

    const handleAuth = async () => {
        const errors = validate(username, password, passwordConfirm);
        setErrors(errors);

        if (errors.length === 0) {
            const result = isLogin ? await getPerson(username, password) : await addPerson(username, password);
            if (result && result.error) {
                setErrors([result.error]);
            } else {
                const token = result.token;
                if (token) {
                    localStorage.setItem('token', token);
                    const decodedToken = decodeTokenAndSetRole(token, setRole);
                    if (!decodedToken) navigate('/*');
                    else navigate('/');
                }
            }
        }
    };

    const handleSwitchForm = (isLoginForm) => {
        setIsLogin(isLoginForm);
        setErrors([]);
        setUsername('');
        setPassword('');
        setPasswordConfirm('');
    };

    return (
        <div className="container">
            <div>
                <button className="button-login" onClick={() => handleSwitchForm(true)}>Login</button>
                <button className="button-login" onClick={() => handleSwitchForm(false)}>Rejestracja</button>
            </div>

            <div>
                {isLogin ? (
                    <div className="login">
                        <h2>Logowanie</h2>
                        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username}/>
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                        <button onClick={handleAuth}> Zaloguj się</button>
                    </div>
                ) : (
                    <div className="registration">
                        <h2>Rejestracja</h2>
                        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username}/>
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                        <input type="password" placeholder="Confirm Password" onChange={(e) => setPasswordConfirm(e.target.value)} value={passwordConfirm}/>
                        <button onClick={handleAuth}> Zarejestruj się</button>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <div className="error-messages">
                    {errors.map((error, index) => (
                        <p key={index} className="error">{error}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Authorization;