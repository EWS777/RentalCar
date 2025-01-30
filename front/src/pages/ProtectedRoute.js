import { Navigate } from 'react-router-dom';
import { decodeTokenAndSetRole } from './authorization/authorization';

const ProtectedRoute = ({ children, requiredRole, setRole }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.log("Is no logined!");
        return <Navigate to="/*" />;
    }

    const decodedToken = decodeTokenAndSetRole(token, setRole);

    if (!decodedToken) {
        console.log("Token is expired!");
        return <Navigate to="/*" />;
    }

    const userRole = decodedToken.person?.role;
    
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
