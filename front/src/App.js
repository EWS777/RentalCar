import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CarList from "./pages/car/carList";
import CarDetail from "./pages/car/CarDetail";
import Authorization from "./pages/authorization/authorization";
import MainPage from "./pages/mainPage/mainPage";
import { useState } from "react";
import Profile from "./pages/profile/profile";
import ProtectedRoute from "./pages/ProtectedRoute";
import CarReserve from "./pages/car/carReserve";

function NotFound() {
    return <h2>Not Found (404)</h2>;
}

function App() {
    const [userRole, setUserRole] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserRole(null);
    };

    return (
        <div className="App">
            <Router>
                <nav>
                    {!userRole && <Link to="/authorization">Authorization</Link>}
                    <Link to="/">Main Page</Link>
                    {userRole === 'admin' && <Link to="/cars">Add car</Link>}
                    {(userRole === 'user' || !userRole) && <Link to="/carlist">Cars</Link>}
                    {(userRole === 'user' || userRole === 'admin') && <Link to="/profile">Profile</Link>}
                    {(userRole === 'user' || userRole === 'admin') && <button onClick={handleLogout}>Logout</button>}
                </nav>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/authorization" element={<Authorization setRole={setUserRole} />} />
                    <Route path="/" element={<MainPage />} />
                    <Route path="/carlist" element={<CarList/>}/>
                    <Route path="/carlist/:id" element={<CarDetail />} />
                    <Route path="/profile" element={ 
                        <ProtectedRoute requiredRoles={['user', 'admin']} setRole={setUserRole}> <Profile /> </ProtectedRoute>} />
                    <Route path="/cars" element={
                        <ProtectedRoute requiredRoles={'admin'} setRole={setUserRole}> <CarList /> </ProtectedRoute> } />
                    <Route path="/carlist/:id/reserve" element={
                        <ProtectedRoute requiredRoles={'user'} setRole={setUserRole}> <CarReserve /> </ProtectedRoute> } />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
