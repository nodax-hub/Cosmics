// Header.js
import { useState } from 'react';
import './Header.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Header = () => {
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isRegisterVisible, setRegisterVisible] = useState(false);

  const toggleLoginForm = () => {
    setLoginVisible(!isLoginVisible);
    setRegisterVisible(false); // Закрыть форму регистрации при открытии формы входа
  };

  const toggleRegisterForm = () => {
    setRegisterVisible(!isRegisterVisible);
    setLoginVisible(false); // Закрыть форму входа при открытии формы регистрации
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header>
      <div className="header-top">
        <div className="logo">
          <h1 className="headerTitle">COSMICS</h1>
        </div>
        <div className="authButtons">
          <button className="loginButton" onClick={toggleLoginForm}>Войти</button>
          <button className="registerButton" onClick={toggleRegisterForm}>Регистрация</button>
        </div>
      </div>
      <div className="header-bottom">
        <nav className="navigation">
          <a href="#aboutUs" className="navLink">О сервисе</a>
          <a href="#workWithUs" className="navLink">Сотрудничество</a>
          <a href="#shop" className="navLink">Журналы</a>
          <a href="#contact" className="navLink" onClick={() => scrollToSection('contact')}>Помощь</a>
        </nav>
      </div>
      <LoginForm isVisible={isLoginVisible} onClose={toggleLoginForm} />
      <RegisterForm isVisible={isRegisterVisible} onClose={toggleRegisterForm} />
    </header>
  );
};

export default Header;
