import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './LoginForm.css';

const LoginForm = ({ isVisible, onClose }) => {
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/auth/token/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        setMessage('Вход выполнен успешно!');
        setTimeout(() => {
          onClose();
          setMessage('');
          navigate('/profile'); // Перенаправление на страницу профиля после успешного входа
          window.location.reload(); // Обновление страницы для принудительного обновления Header
        }, 2000);
      } else {
        alert('Ошибка входа: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка входа');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="loginOverlay">
      <div className="loginForm">
        <div className="handle">
          <button className="closeButton" onClick={onClose}>×</button>
          <h2 style={{ margin: '0 auto' }}>Вход в систему</h2>
        </div>
        {message && <div className="successMessage">{message}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="authEmail"
            required
            className="inputField"
            placeholder="Email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
          />
          <input
            type="password"
            name="authPassword"
            required
            className="inputField"
            placeholder="Пароль"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
          />
          <button type="submit" className="button">Войти</button>
        </form>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LoginForm;
