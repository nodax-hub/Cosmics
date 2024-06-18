// RegisterForm.js
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import './RegisterForm.css';

const RegisterForm = ({isVisible, onClose}) => {
    const [login, setLogin] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (regPassword !== password2) {
            alert('Пароли не совпадают');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login,
                    email: regEmail,
                    password: regPassword,
                    first_name: firstName,
                    last_name: lastName
                }),
            });

            if (response.ok) {
                setMessage('Регистрация прошла успешно!');
                try {
                    const response = await fetch('http://localhost:8000/auth/token/login/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({email: regEmail, password: regPassword}),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        localStorage.setItem('token', data.access_token);
                        setMessage('Вход выполнен успешно!');
                        setTimeout(() => {
                            onClose();
                            setMessage('');
                            navigate('/profile');
                        }, 2000);
                    } else {
                        alert('Ошибка входа: ' + JSON.stringify(data));
                    }
                } catch (error) {
                    console.error('Ошибка:', error);
                    alert('Ошибка входа');
                }

            } else {
                const errorData = await response.json();
                alert('Ошибка регистрации: ' + JSON.stringify(errorData));
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка регистрации');
        }
    };

    if (!isVisible) return null;

    return (
        <div className="registerOverlay">
            <div className="registerForm">
                <div className="handle">
                    <button className="closeButton" onClick={onClose}>×</button>
                    <h2 style={{margin: '0 auto'}}>Регистрация</h2>
                </div>
                {message && <div className="successMessage">{message}</div>}
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        name="login"
                        required
                        className="inputField"
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <input
                        type="email"
                        name="regEmail"
                        required
                        className="inputField"
                        placeholder="Email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        name="regPassword"
                        required
                        className="inputField"
                        placeholder="Пароль"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password2"
                        required
                        className="inputField"
                        placeholder="Повторите пароль"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                    <input
                        type="text"
                        name="firstName"
                        required
                        className="inputField"
                        placeholder="Имя"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        type="text"
                        name="lastName"
                        required
                        className="inputField"
                        placeholder="Фамилия"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <button type="submit" className="button">Регистрация</button>
                </form>
            </div>
        </div>
    );
};

RegisterForm.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default RegisterForm;
