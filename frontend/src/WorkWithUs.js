import './WorkWithUs.css';
// eslint-disable-next-line no-unused-vars
import React from "react";

const WorkWithUs = () => {
  return (
      <div id="workWithUs" className="workWithUs">
          <h2>Сотрудничество</h2>
          <ul>
              <li>Email: <a href="mailto:nik.zhur.serg@gmail.com">nik.zhur.serg@gmail.com</a></li>
              <li>Telegram: <a href="https://t.me/juicy_apelsin">@juicy_apelsin</a></li>
          </ul>
          <p className="partnershipText">
              Мы всегда рады сотрудничеству. Если вы заинтересованы в работе с нами, то напишите нам на почту или в
              телеграмм
          </p>
          <a href="https://vk.com/apelsin_fresh" className="contactButton">Связаться с нами</a>
      </div>
  );
};

export default WorkWithUs;
