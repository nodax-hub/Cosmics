import {useContext, useEffect, useState} from 'react';
import Slider from 'react-slick';
import Modal from './Modal'; // Импорт компонента модального окна
import './Shop.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {UserContext} from './context/UserContext'; // Импорт контекста пользователя

const ShopPage = () => {
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedComic, setSelectedComic] = useState(null);
    const [token] = useContext(UserContext); // Получаем токен из контекста

    useEffect(() => {
        // Функция для загрузки данных о комиксах
        const fetchComics = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/comics');
                if (!response.ok) {
                    throw new Error('Ошибка сети или сервер вернул некорректный ответ');
                }
                const data = await response.json();
                console.log('Загруженные данные о комиксах:', data);
                if (Array.isArray(data)) {
                    setComics(data);
                } else {
                    throw new Error('Ответ API не является массивом');
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных о комиксах:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComics();
    }, []);

    const fetchComicDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/comic_books/${id}`);
            if (!response.ok) {
                throw new Error('Ошибка сети или сервер вернул некорректный ответ');
            }
            const data = await response.json();
            setSelectedComic(data);
            setShowModal(true);
        } catch (error) {
            console.error('Ошибка при загрузке подробной информации о комиксе:', error);
        }
    };

    const handleCardClick = (comicId) => {
        fetchComicDetails(comicId);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedComic(null);
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="shopPage">
            <h2 id="shop" className="Title">Журналы</h2>
            <Slider {...settings}>
                {comics.map((comic) => (
                    <div key={comic.id} className="shopCard" onClick={() => handleCardClick(comic.id)}>
                        <img src={`/comics/${comic.id}.jpg`} alt={comic.title} className="productImage"/>
                        <div className="info">
                            <p>{comic.title}</p>
                            <p>{comic.price} рублей</p>
                            {token && <button className="buyButton">Купить</button>}
                        </div>
                    </div>
                ))}
            </Slider>
            {selectedComic && (
                <Modal
                    show={showModal}
                    onClose={handleCloseModal}
                    comic={selectedComic}
                />
            )}
        </div>
    );
};

export default ShopPage;
