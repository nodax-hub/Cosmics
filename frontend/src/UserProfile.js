import {useContext, useEffect, useRef, useState} from 'react';
import Slider from 'react-slick';
import './UserProfile.css';
import profile from './Images/профиль.jpg';
import {UserContext} from './context/UserContext';
import {useNavigate} from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]); // Пример данных заказов
    const [selectedOrder, setSelectedOrder] = useState(null); // Состояние для выбранного заказа
    const [editing, setEditing] = useState(false); // Состояние для режима редактирования
    const [token, setToken] = useContext(UserContext);
    const navigate = useNavigate();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;

        // Пример данных заказов, замените реальными данными позже
        const exampleOrders = [
            {
                id: 1,
                date: '2023-06-01',
                status: 'Доставлен',
                comics: [
                    {id: 1, title: 'Комикс 1', price: 100, image: '/comics/1.jpg'},
                    {id: 2, title: 'Комикс 2', price: 200, image: '/comics/3.jpg'},
                    {id: 1, title: 'Комикс 1', price: 100, image: '/comics/4.jpg'},
                    {id: 2, title: 'Комикс 2', price: 200, image: '/comics/2.jpg'}
                ]
            },
            {
                id: 2,
                date: '2023-07-01',
                status: 'В пути',
                comics: [
                    {id: 3, title: 'Комикс 3', price: 150, image: '/comics/3.jpg'},
                    {id: 4, title: 'Комикс 4', price: 250, image: '/comics/4.jpg'}
                ]
            },

            {
                id: 2,
                date: '2023-07-01',
                status: 'В пути',
                comics: [
                    {id: 3, title: 'Комикс 3', price: 150, image: '/comics/3.jpg'},
                    {id: 4, title: 'Комикс 4', price: 250, image: '/comics/4.jpg'}
                ]
            },

            {
                id: 2,
                date: '2023-07-01',
                status: 'В пути',
                comics: [
                    {id: 3, title: 'Комикс 3', price: 150, image: '/comics/3.jpg'},
                    {id: 4, title: 'Комикс 4', price: 250, image: '/comics/4.jpg'}
                ]
            },

            {
                id: 2,
                date: '2023-07-01',
                status: 'В пути',
                comics: [
                    {id: 3, title: 'Комикс 3', price: 150, image: '/comics/3.jpg'},
                    {id: 4, title: 'Комикс 4', price: 250, image: '/comics/4.jpg'}
                ]
            },

            {
                id: 2,
                date: '2023-07-01',
                status: 'В пути',
                comics: [
                    {id: 3, title: 'Комикс 3', price: 150, image: '/comics/3.jpg'},
                    {id: 4, title: 'Комикс 4', price: 250, image: '/comics/4.jpg'}
                ]
            },
            {
                id: 2,
                date: '2023-07-01',
                status: 'В пути',
                comics: [
                    {id: 3, title: 'Комикс 3', price: 150, image: '/comics/3.jpg'},
                    {id: 4, title: 'Комикс 4', price: 250, image: '/comics/4.jpg'}
                ]
            },

            {
                id: 2,
                date: '2023-07-01',
                status: 'В пути',
                comics: [
                    {id: 3, title: 'Комикс 3', price: 150, image: '/comics/3.jpg'},
                    {id: 4, title: 'Комикс 4', price: 250, image: '/comics/4.jpg'}
                ]
            }


        ];
        setOrders(exampleOrders);

        const fetchUser = async () => {
            console.log('Fetching user data');

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
                console.error('Ошибка:', error.message);  // Более подробное логирование
            }
        };

        if (token) {
            fetchUser();
            hasFetched.current = true;
        }
    }, [token, navigate]);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseSlider = () => {
        setSelectedOrder(null);
    };

    const handleEdit = () => {
        setEditing(true); // Включаем режим редактирования
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
            setEditing(false); // Отключаем режим редактирования
            alert('Данные успешно обновлены');

            // Проверим, вернулся ли новый токен и нужно ли его обновить
            const newToken = response.headers.get('Authorization');
            if (newToken && newToken !== token) {
                setToken(newToken);
                localStorage.setItem('token', newToken);
                console.log('Токен обновлен');
            }

        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось сохранить данные пользователя');
        }
    };

    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value});
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1
    };

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="userProfile">
            <div className="userDetails">
                <img src={profile} alt="Profile" className="profilePicture"/>
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
                                <button type="button" className="editSaveButton" onClick={handleEdit}>Редактировать
                                </button>
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
                    <div key={order.id} className="order" onClick={() => handleOrderClick(order)}>
                        <span>ID заказа: {order.id}</span>
                        <span>Дата: {order.date}</span>
                        <span>Статус: {order.status}</span>
                    </div>
                ))}
            </div>
            {selectedOrder && (
                <div className="orderSlider">
                    <h3>Комиксы в заказе {selectedOrder.id}:</h3>
                    <Slider {...sliderSettings}>
                        {selectedOrder.comics.map((comic) => (
                            <div key={comic.id} className="comicSlide">
                                <img src={comic.image} alt={comic.title} className="comicImage"/>
                                <div className="comicInfo">
                                    <p>{comic.title}</p>
                                    <p>{comic.price} рублей</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                    <button className="closeButton" onClick={handleCloseSlider}>Закрыть</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
