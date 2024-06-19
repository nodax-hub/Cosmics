import './Error.css';
import error from './Images/error.jpg';


const ErrorPage = () => {
    return (
        <div className="error-container">
            <h1>ОШИБКА</h1>
            <img src={error} alt="error_cat" className="error_cat"/>

            <p>Даня качает пресс</p>
        </div>
    );
}

export default ErrorPage;
