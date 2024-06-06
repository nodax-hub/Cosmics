import { useState } from 'react';
import './UserProfile.css';
import profile from './Images/профиль.jpg';

const UserProfile = () => {
  const [user, setUser] = useState({
    firstName: 'Михаил',
    lastName: 'Иванов',
    email: 'm.sok@gmail.com',
  });

  const orders = [
    { id: 1, name: '15.04.2024', status: 'Доставлен' },
  ];

  const [editing, setEditing] = useState(false);

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
                  value={user.firstName}
                  onChange={handleChange}
                  placeholder="Имя"
                />
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  placeholder="Фамилия"
                />
              </>
            ) : (
              <span>{user.firstName} {user.lastName}</span>
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
