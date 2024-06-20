import { useContext, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import './UserProfile.css';
import profile from './Images/профиль.jpg';
import { UserContext } from './context/UserContext';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [token, setToken] = useContext(UserContext);
    const navigate = useNavigate();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;

        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        alert('Требуется авторизация. Пожалуйста, войдите снова.');
                        navigate('/');
                        return;
                    }
                    throw new Error('Ошибка при получении данных пользователя');
                }

                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Ошибка:', error.message);
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/users/orders', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        alert('Требуется авторизация. Пожалуйста, войдите снова.');
                        navigate('/');
                        return;
                    }
                    throw new Error('Ошибка при получении данных пользователя');
                }

                const OrdersData = await response.json();
                setOrders(OrdersData);
            } catch (error) {
                console.error('Ошибка:', error.message);
            }
        };

        if (token) {
            fetchUser();
            fetchOrders();
            hasFetched.current = true;
        }
    }, [token, navigate]);

    const handleOrderClick = async (order) => {
        try {
            let current_order = orders.find(o => o.id === order.id);
            setSelectedOrder(current_order);
            setShowModal(true);
            console.log('current_order: ', current_order);
        } catch (error) {
            console.error('Ошибка:', error.message);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('Сессия истекла. Пожалуйста, войдите снова.');
                    setToken(null);
                    localStorage.removeItem('token');
                    navigate('/');
                    return;
                }
                const errorData = await response.json();
                alert(`Ошибка при обновлении данных: ${errorData.detail || response.statusText}`);
                return;
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setEditing(false);
            alert('Данные успешно обновлены');

            const newToken = response.headers.get('Authorization');
            if (newToken && newToken !== token) {
                setToken(newToken);
                localStorage.setItem('token', newToken);
            }

        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось сохранить данные пользователя');
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const sliderSettings = (numComics) => ({
        dots: true,
        infinite: numComics > 1,
        speed: 500,
        slidesToShow: numComics >= 4 ? 4 : numComics,
        slidesToScroll: 1
    });

    if (!user) {
        return <div>Загрузка...</div>;
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
                                <input
                                    type="text"
                                    name="login"
                                    className="inputField"
                                    value={user.login}
                                    onChange={handleChange}
                                    placeholder="Логин"
                                />
                            ) : (
                                <span>{user.login}</span>
                            )}
                        </div>
                        <button
                            type="button"
                            className="editSaveButton"
                            onClick={() => navigate('/#shop')}
                        >
                            К выбору!
                        </button>
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

            <h1>{user.role === 'admin' ? 'Ваша роль: Администратор.' : ''}</h1>
            <h2>{user.role === 'admin' ? 'Заказы всех пользователей:' : 'Мои заказы: '}</h2>
            <div className="orders">
                {orders.map((order) => (
                    <div key={order.id} className="order" onClick={() => handleOrderClick(order)}>
                        <span className="order-id">ID заказа: {order.id}</span>
                        {user.role === 'admin' && (<span className="order-user-email">Email заказчика: {order.user.email}</span>)}
                        <span className="order-date">Дата: {order.date}</span>
                        <span className="order-status">Статус: {order.status}</span>
                    </div>
                ))}
            </div>
            {showModal && selectedOrder && (
                <div className="orderModal">
                    <div className="modalContent">
                        <h3>Комиксы в заказе ID {selectedOrder.id}:</h3>
                        <h2>{user.role === 'admin' ? `${selectedOrder.user.first_name} ${selectedOrder.user.last_name}` : 'Мои заказы: '}</h2>
                        <Slider {...sliderSettings(selectedOrder.length)}>
                            {selectedOrder.sales.map((sale) => (
                                <div key={sale.comic_book_id} className="comicSlide">
                                    <img src={`/comics/${sale.comic_book_id}.jpg`} alt={sale.comic_book_id}
                                         className="comicImage"/>
                                    <div className="comicInfo">
                                        <p>Название: {sale.comic_book.title}</p>
                                        <p>Автор: {sale.comic_book.author}</p>
                                        <p>Издатель: {sale.comic_book.publisher}</p>
                                        <p>Количество: {sale.quantity}</p>
                                        <p>Цена за штуку: {sale.comic_book.price}</p>
                                        <p>Цена Итого: {sale.quantity * sale.comic_book.price}</p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                        <button className="closeModalButton" onClick={handleCloseModal}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
