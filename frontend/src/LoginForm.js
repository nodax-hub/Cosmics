import {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import './LoginForm.css';
import {UserContext} from './context/UserContext';

const LoginForm = ({isVisible, onClose}) => {
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [, setToken] = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: JSON.stringify(
                    `grant_type=&username=${authEmail}&password=${authPassword}&scope=&client_id=&client_secret=`
                ),
            };

            const response = await fetch("http://localhost:8000/users/token/", requestOptions);

            if (!response.ok) {
                const errorData = await response.text(); // Чтение тела ответа как текст
                console.error('Ошибка входа:', errorData);
                alert('Ошибка', errorData);
            } else {
                const data = await response.json();
                setToken(data.access_token);

                console.log('Вход выполнен успешно!');
                setMessage('Вход выполнен успешно!');
                setTimeout(() => {
                    onClose();
                    setMessage('');
                    navigate('/profile'); // Перенаправление на страницу профиля после успешного входа
                    window.location.reload(); // Обновление страницы для принудительного обновления Header
                }, 2000);
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
                    <h2 style={{margin: '0 auto'}}>Вход в систему</h2>
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
