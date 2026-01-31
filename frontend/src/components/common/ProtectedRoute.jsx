import { Navigate, Outlet } from 'react-router-dom';

// Or just import Context and useContext

import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <Loader />;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
