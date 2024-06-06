import Slider from 'react-slick';
import './Shop.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import comic1 from './Images/xmen.jpg';
import comic2 from './Images/boys.jpg';
import comic3 from './Images/iron-man.jpg';

const ShopPage = () => {
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

  return (
    <div className="shopPage">
      <h2 id="shop" className="Title">Журналы</h2>
      <Slider {...settings}>
        <div className="shopCard">
          <img src={comic1} alt="Product" className="productImage" />
          <div className="info">
            <p>X-Men</p>
            <p>3000 тунгриков</p>
            <button className="buyButton">Купить</button>
          </div>
        </div>
        <div className="shopCard">
          <img src={comic2} alt="Product" className="productImage" />
          <div className="info">
            <p>The Boys</p>
            <p>2999 тунгриков</p>
            <button className="buyButton">Купить</button>
          </div>
        </div>
        <div className="shopCard">
          <img src={comic3} alt="Product" className="productImage" />
          <div className="info">
            <p>Iron Man</p>
            <p>3001 тунгриков</p>
            <button className="buyButton">Купить</button>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default ShopPage;
