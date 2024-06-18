import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // Перенаправление на главную страницу после выхода будет выполнено внутри компонента Header
  };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="App">
        <div className="background">
          <div className="stars-container"></div>
        </div>
        <Routes>
          <Route path="/" element={<><MainContent /><AboutUs /><WorkWithUs /><Shop /><ContactForm /><Footer /></>} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
