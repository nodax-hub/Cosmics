import {useContext} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {UserContext} from './context/UserContext';

const PrivateRoute = () => {
    const [token] = useContext(UserContext);

    // Если токен отсутствует, перенаправляем на страницу входа
    return token ? <Outlet/> : <Navigate to="/" replace/>;
};

export default PrivateRoute;
