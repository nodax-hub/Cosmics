import {useContext, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './Header';
import MainContent from './MainContent';
import AboutUs from './AboutUs';
import WorkWithUs from './WorkWithUs';
import Shop from './Shop';
import Footer from './Footer';
import UserProfile from './UserProfile';
import Error from './Error';
import ContactForm from './ContactForm';
import Admin from "./Admin";
import {UserContext, UserProvider} from './context/UserContext';
import PrivateRoute from './PrivateRoute'; // Импортируем PrivateRoute
import './App.css';

function AppContent() {
    const [, setToken] = useContext(UserContext);

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token'); // Удаление токена из localStorage при выходе
    };

    useEffect(() => {
        // Проверка токена в localStorage при монтировании компонента
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, [setToken]);

    return (
        <Router>
            <Header onLogout={handleLogout}/>
            <div className="App">
                <div className="background">
                    <div className="stars-container"></div>
                </div>
                <Routes>
                    <Route path="/" element={<><MainContent/><AboutUs/><WorkWithUs/><Shop/><ContactForm/><Footer/></>}/>
                    {/* Защищенные маршруты обернуты в PrivateRoute */}
                    <Route path="/profile" element={<PrivateRoute/>}>
                        <Route path="" element={<UserProfile/>}/>
                    </Route>
                    <Route path="/admin" element={<PrivateRoute/>}>
                        <Route path="" element={<Admin/>}/>
                    </Route>
                    <Route path="*" element={<Error/>}/>
                </Routes>
            </div>
        </Router>
    );
}

function App() {
    return (
        <UserProvider>
            <AppContent/>
        </UserProvider>
    );
}

export default App;
