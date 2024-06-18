import PropTypes from 'prop-types';
import './Header.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Header = ({ isAuthenticated, onLogout }) => {
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isRegisterVisible, setRegisterVisible] = useState(false);
  const navigate = useNavigate();

  const toggleLoginForm = () => {
    setLoginVisible(!isLoginVisible);
    setRegisterVisible(false);
  };

  const toggleRegisterForm = () => {
    setRegisterVisible(!isRegisterVisible);
    setLoginVisible(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/'); // Перенаправление на главную страницу после выхода
  };

  // Используем useEffect для обновления интерфейса при изменении состояния isAuthenticated
  useEffect(() => {
    // Это гарантирует, что когда isAuthenticated изменяется, компонент будет обновляться
  }, [isAuthenticated]);

  return (
    <header>
      <div className="header-top">
        <div className="logo">
          <h1 className="headerTitle">COSMICS</h1>
        </div>
        {isAuthenticated ? (
          <div className="authButtons">
            <Link to="/profile" className="profileButton">Профиль</Link>
            <button className="logoutButton" onClick={handleLogoutClick}>Выход</button>
          </div>
        ) : (
          <div className="authButtons">
            <button className="loginButton" onClick={toggleLoginForm}>Войти</button>
            <button className="registerButton" onClick={toggleRegisterForm}>Регистрация</button>
          </div>
        )}
      </div>
      <div className="header-bottom">
        <nav className="navigation">
          <a href="#aboutUs" className="navLink">О сервисе</a>
          <a href="#workWithUs" className="navLink">Сотрудничество</a>
          <a href="#shop" className="navLink">Журналы</a>
          <a href="#contact" className="navLink">Помощь</a>
        </nav>
      </div>
      <LoginForm isVisible={isLoginVisible} onClose={toggleLoginForm} />
      <RegisterForm isVisible={isRegisterVisible} onClose={toggleRegisterForm} />
    </header>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
