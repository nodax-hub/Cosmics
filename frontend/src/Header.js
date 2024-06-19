import PropTypes from 'prop-types';
import './Header.css';
import {useContext, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom'; // Импортируем useLocation для определения текущего пути
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import {UserContext} from './context/UserContext';

const Header = ({onLogout}) => {
    const [isLoginVisible, setLoginVisible] = useState(false);
    const [isRegisterVisible, setRegisterVisible] = useState(false);
    const [userRole, setUserRole] = useState(null); // Добавляем состояние для роли пользователя
    const navigate = useNavigate();
    const [token, setToken] = useContext(UserContext);
    const location = useLocation(); // Получаем текущий путь
    console.log('Cur token:', token);
    useEffect(() => {
        const fetchUserRole = async () => {
            if (token) {
                try {
                    const response = await fetch('http://localhost:8000/api/users/me', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUserRole(data.role);
                    } else {
                        console.error('Ошибка получения данных пользователя:', response.statusText);
                    }
                } catch (error) {
                    console.error('Ошибка:', error);
                }
            }
        };

        fetchUserRole();
    }, [token]);

    const toggleLoginForm = () => {
        setLoginVisible(!isLoginVisible);
        setRegisterVisible(false);
    };

    const toggleRegisterForm = () => {
        setRegisterVisible(!isRegisterVisible);
        setLoginVisible(false);
    };

    const handleLogoutClick = () => {
        setToken(null);
        localStorage.removeItem('token'); // Удаление токена из localStorage
        onLogout();
        navigate('/'); // Перенаправление на главную страницу после выхода
    };

    // Определяем, нужно ли скрыть навигационные элементы
    const hideNavigation = location.pathname.includes('/profile') || location.pathname.includes('/admin');

    const handleProfileClick = () => {
        if (userRole === 'admin') {
            navigate('/admin');
        } else {
            navigate('/profile');
        }
    };

    return (
        <header>
            <div className="header-top">
                <div className="logo">
                    <h1 className="headerTitle">COSMICS</h1>
                </div>
                {token ? (
                    <div className="authButtons">
                        <button className="profileButton" onClick={handleProfileClick}>
                            {userRole === 'admin' ? 'Админ' : 'Профиль'}
                        </button>
                        <button className="logoutButton" onClick={handleLogoutClick}>Выход</button>
                    </div>
                ) : (
                    <div className="authButtons">
                        <button className="loginButton" onClick={toggleLoginForm}>Войти</button>
                        <button className="registerButton" onClick={toggleRegisterForm}>Регистрация</button>
                    </div>
                )}
            </div>
            {!hideNavigation && ( // Условное отображение навигации
                <div className="header-bottom">
                    <nav className="navigation">
                        <a href="#aboutUs" className="navLink">О сервисе</a>
                        <a href="#workWithUs" className="navLink">Сотрудничество</a>
                        <a href="#shop" className="navLink">Журналы</a>
                        <a href="#contact" className="navLink">Помощь</a>
                    </nav>
                </div>
            )}
            <LoginForm isVisible={isLoginVisible} onClose={toggleLoginForm}/>
            <RegisterForm isVisible={isRegisterVisible} onClose={toggleRegisterForm}/>
        </header>
    );
};

Header.propTypes = {
    onLogout: PropTypes.func.isRequired,
};

export default Header;
