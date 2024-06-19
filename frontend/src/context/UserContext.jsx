import {createContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Сохраняем token в localStorage при его изменении
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    return (
        <UserContext.Provider value={[token, setToken]}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
