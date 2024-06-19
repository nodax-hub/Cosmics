// Modal.js

import PropTypes from 'prop-types';
import './Modal.css'; // Добавьте стили для модального окна

const Modal = ({show, onClose, comic}) => {
    if (!show || !comic) return null;

    return (
        <div className="modalBackdrop">
            <div className="modalContent">
                <h2>{comic.title}</h2>
                <img src={`/comics/${comic.id}.jpg`} alt={comic.title} className="modalImage"/>
                <p><strong>Автор:</strong> {comic.author}</p>
                <p><strong>Издатель:</strong> {comic.publisher}</p>
                <p><strong>Количество на складе:</strong> {comic.stock_quantity}</p>
                <p><strong>Описание:</strong> {comic.description}</p>
                <p><strong>Жанр:</strong> {comic.genre}</p>
                <p><strong>Цена:</strong> {comic.price} рублей</p>
                <button onClick={onClose} className="closeButton">Закрыть</button>
            </div>
        </div>
    );
};

// Добавляем валидацию типов props с использованием PropTypes
Modal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    comic: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        publisher: PropTypes.string.isRequired,
        stock_quantity: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        genre: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    }),
};

export default Modal;
