import { useState, useEffect, useContext, useRef } from 'react';
import './UserProfile.css';
import profile from './Images/профиль.jpg';
import { UserContext } from './context/UserContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders] = useState([]); // Для примера
  const [editing, setEditing] = useState(false);
  const [token] = useContext(UserContext);
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Используем useRef для предотвращения повторного вызова

  useEffect(() => {
    if (hasFetched.current) return; // Если уже выполнено, не делаем повторный вызов

    const fetchUser = async () => {
      console.log('Fetching user data'); // Диагностика
      try {
        const response = await fetch('http://localhost:8000/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Используем токен для аутентификации
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            alert('Требуется авторизация. Пожалуйста, войдите снова.');
            navigate('/login');
            return;
          }
          throw new Error('Ошибка при получении данных пользователя');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить данные пользователя');
      }
    };

    if (token) {
      fetchUser();
      hasFetched.current = true; // Помечаем, что вызов был выполнен
    }
  }, [token, navigate]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/me`, {
        method: 'PUT', // Используем метод PUT для обновления данных
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Используем токен для аутентификации
        },
        body: JSON.stringify(user), // Отправляем обновленные данные пользователя
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении данных пользователя');
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // Обновляем состояние с новыми данными пользователя
      setEditing(false); // Завершаем режим редактирования
      alert('Данные успешно обновлены');
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Не удалось сохранить данные пользователя');
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  if (!user) {
    return <div>Загрузка...</div>; // Показать загрузку, пока данные пользователя не загружены
  }

  return (
    <div className="userProfile">
      <div className="userDetails">
        <img src={profile} alt="Profile" className="profilePicture" />
        <div className="userInfo">
          <div className="name">
            {editing ? (
              <>
                <input
                  type="text"
                  name="first_name"
                  className="inputField"
                  value={user.first_name}
                  onChange={handleChange}
                  placeholder="Имя"
                />
                <input
                  type="text"
                  name="last_name"
                  className="inputField"
                  value={user.last_name}
                  onChange={handleChange}
                  placeholder="Фамилия"
                />
              </>
            ) : (
              <span>{user.first_name} {user.last_name}</span>
            )}
          </div>
          <form className="userForm">
            <div className="contactInfo">
              {editing ? (
                <>
                  <input
                    type="text"
                    name="login"
                    className="inputField"
                    value={user.login}
                    onChange={handleChange}
                    placeholder="Логин"
                  />
                  <input
                    type="email"
                    name="email"
                    className="inputField"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </>
              ) : (
                <span>{user.login} - {user.email}</span>
              )}
            </div>
            <button
              type="button"
              className="editSaveButton"
              onClick={() => navigate('/')}
            >
              К выбору!
            </button> {/* Изменена кнопка */}
            {!editing && (
              <div className="editSave">
                <button type="button" className="editSaveButton" onClick={handleEdit}>Редактировать</button>
              </div>
            )}
            {editing && (
              <div className="editSave">
                <button type="button" className="editSaveButton" onClick={handleSave}>Сохранить</button>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="orders">
        <h2>Мои заказы:</h2>
        {orders.map((order) => (
          <div key={order.id} className="order">
            <span>ID заказа: {order.id}</span>
            <span>Дата: {order.name}</span>
            <span>Статус: {order.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
