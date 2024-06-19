import {useState} from 'react';
import './MainContent.css';
import comic1 from './Images/xmen.jpg';
import comic2 from './Images/boys.jpg';
import comic3 from './Images/iron-man.jpg';
import LoginForm from './LoginForm';

const MainContent = () => {
    const [isLoginVisible, setLoginVisible] = useState(false);

    const toggleLoginForm = () => {
        setLoginVisible(!isLoginVisible);
        console.log("LoginForm visibility: ", !isLoginVisible);
    };

    const comics = [
        {title: "X-Men", description: "Открывайте удивительный мир Людей Икс!", image: comic1},
        {title: "The Boys", description: "Черная комедия о супергероях с неожиданными поворотами.", image: comic2},
        {title: "Iron Man", description: "Приключения Железного человека в серии комиксов.", image: comic3},
        // Добавьте больше комиксов по необходимости
    ];

    return (
        <div className="mainContent">
            <div className="salesText">
                <h2>Лучшие комиксы для вас!</h2>
                <p>У нас вы найдете лучшие комиксы, которые подарят вам невероятные эмоции и погрузят в удивительный мир
                    супергероев. Покупайте прямо сейчас и наслаждайтесь захватывающими историями!</p>
            </div>
            <div className="comicsContainer">
                {comics.map((comic, index) => (
                    <div className="card" key={index}>
                        <img src={comic.image} alt={comic.title}/>
                        <div className="container">
                            <h4>{comic.title}</h4>
                            <p>{comic.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            {isLoginVisible && <LoginForm isVisible={isLoginVisible} onClose={toggleLoginForm}/>}
        </div>
    );
};

export default MainContent;
