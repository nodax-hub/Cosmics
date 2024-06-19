import './Admin.css';
import comic1 from "./Images/xmen.jpg";

const Admin = () => {
    const orders = [
        {title: "Заказ от Фёдора", id: "1", status: "принят", image: comic1},
        {title: "Заказ от Ивана", id: "2", status: "отправлен", image: comic1},
        {title: "Заказ от Марии", id: "3", status: "доставлен", image: comic1},
        {title: "Заказ от Сергея", id: "4", status: "принят", image: comic1},
        {title: "Заказ от Анны", id: "5", status: "отменен", image: comic1},
        {title: "Заказ от Ольги", id: "6", status: "принят", image: comic1},
        {title: "Заказ от Дмитрия", id: "7", status: "отправлен", image: comic1},
        {title: "Заказ от Алексея", id: "8", status: "доставлен", image: comic1},
        {title: "Заказ от Виктора", id: "9", status: "принят", image: comic1},
        {title: "Заказ от Натальи", id: "10", статус: "отменен", image: comic1},
        {title: "Заказ от Алены", id: "11", статус: "принят", image: comic1},
        {title: "Заказ от Андрея", id: "12", статус: "отправлен", image: comic1},
        {title: "Заказ от Юлии", id: "13", статус: "доставлен", image: comic1},
    ];

    return (
        <div className="adminProfile">
            <h1>Ваша роль: Администратор.</h1>
            <h2>Вам доступны заказы пользователей...</h2>
            <div className="ordersContainer">
                <div className="orders">
                    {orders.map((order, index) => (
                        <div className="card" key={index}>
                            <img src={order.image} alt={order.title}/>
                            <div className="container">
                                <h4>{order.title}</h4>
                                <p>ID заказа: {order.id}</p>
                                <p>Статус: {order.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="navigation">
                <a href="http://localhost:3000" className="editSaveButton">На главную</a>
            </div>
        </div>
    );
};

export default Admin;
