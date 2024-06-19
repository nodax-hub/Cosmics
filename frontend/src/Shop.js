import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import './Shop.css'; // Импорт CSS стилей
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ShopPage = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // Убедимся, что полученные данные - это массив
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
          <div key={comic.id} className="shopCard">
            {/* Используем путь из папки public */}
            <img src={`/comics/${comic.id}.jpg`} alt={comic.title} className="productImage" />
            <div className="info">
              <p>{comic.title}</p>
              <p>{comic.price} рублей</p>
              <button className="buyButton">Купить</button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ShopPage;
