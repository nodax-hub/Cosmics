import PropTypes from 'prop-types';
import './Header.css';
import {useContext, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom'; // Импортируем useLocation для определения текущего пути
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import {UserContext} from './context/UserContext';

const Header = ({onLogout}) => {
    const [isLoginVisible, setLoginVisible] = useState(false);
    const [isRegisterVisible, setRegisterVisible] = useState(false);
    const navigate = useNavigate();
    const [token, setToken] = useContext(UserContext);
    const location = useLocation(); // Получаем текущий путь
    console.log('Cur token:', token);


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
    const hideNavigation = location.pathname.includes('/profile');

    const handleProfileClick = () => {
        navigate('/profile');
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
                            Профиль
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
                        <a href="/#aboutUs" className="navLink">О сервисе</a>
                        <a href="/#workWithUs" className="navLink">Сотрудничество</a>
                        <a href="/#shop" className="navLink">Журналы</a>
                        <a href="/#contact" className="navLink">Помощь</a>
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
