// eslint-disable-next-line no-unused-vars
import React from 'react';
import './AboutUs.css';
import Comice from './Images/Nikita.jpg'; // Путь к изображению корректный
import Comice2 from './Images/профиль.jpg';

const AboutUs = () => (
  <div id="aboutUs" className="aboutUs">
    <h2>О нас</h2>
    <p>Наш сервис предлагает уникальный опыт в мире комиксов, объединяя любителей и профессионалов. Мы стремимся сделать ваши любимые истории доступными и увлекательными.</p>
    <div className="team">
      <div className="team-member">
        <img src={Comice} alt="Team Member" />
        <h4>John Dick</h4>
        <p>Начальник цеха</p>
      </div>
      <div className="team-member">
        <img src={Comice2} alt="Team Member" />
        <h4>Ioann Wilson</h4>
        <p>Главный по главному</p>
      </div>
    </div>
    <a href="https://vk.com/apelsin_fresh" className="learnMoreButton">Узнать больше</a>
  </div>
);

export default AboutUs;
