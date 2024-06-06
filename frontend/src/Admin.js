import { useState } from 'react';
import './Admin.css';
import profile from './Images/профиль.jpg';
import comic1 from "./Images/xmen.jpg";

const Admin = () => {
    const [user, setUser] = useState({
        firstName: 'Михаил',
        lastName: 'Иванов',
        email: 'm.sok@gmail.com',
    });

    const orders = [
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
        { title: "Заказ от Фёдора", id: "1", status: "принят" , image: comic1},
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
        <div className="adminProfile">
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
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                />
                            </>
                        ) : (<div><p>{user.firstName} {user.lastName}</p>
                                <p>{user.email}</p></div>
                        )}
                    </div>
                    <form className="userForm">
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
            <h1>Ваша роль: Администратор.</h1>
            <h2>Вам доступны заказы пользователей...</h2>
            <div className="ordersContainer">
                <div className="orders">
                    {orders.map((order, index) => (
                        <div className="card" key={index}>
                            <img src={order.image} alt={order.title} />
                            <div className="container">
                                <h4>{order.title}</h4>
                                <p>{order.id}</p>
                                <p>Статус: {order.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;
