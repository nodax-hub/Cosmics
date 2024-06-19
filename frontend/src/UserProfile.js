import { useState, useEffect, useContext } from 'react';
import './UserProfile.css';
import profile from './Images/профиль.jpg';
import { UserContext } from './context/UserContext';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, ] = useState([]); // Для примера
  const [editing, setEditing] = useState(false);
  const [token] = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Используем токен для аутентификации
          },
        });

        if (!response.ok) {
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
    }
  }, [token]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
    // Логика сохранения изменений
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
                  name="firstName"
                  value={user.first_name}
                  onChange={handleChange}
                  placeholder="Имя"
                />
                <input
                  type="text"
                  name="lastName"
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
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              ) : (
                <span>{user.email}</span>
              )}
            </div>
            <a href="http://localhost:3000" className="editSaveButton">На главную</a>
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
