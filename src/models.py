import enum

from sqlalchemy import Column, ForeignKey, Integer, String, Enum, DateTime, func
from sqlalchemy.orm import relationship

from src.database import Base


class Role(enum.Enum):
    CUSTOMER = "customer"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "User"
    
    id = Column(Integer, primary_key=True)
    
    login = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    
    first_name = Column(String)
    last_name = Column(String)
    
    role = Column(Enum(Role), default=Role.CUSTOMER)
    hashed_password = Column(String)
    
    orders = relationship("Order", back_populates="user")


class OrderStatus(enum.Enum):
    PENDING = "pending"
    COMPLETE = "complete"
    CANCELLED = "cancelled"
    FAILED = "failed"


class Order(Base):
    id = Column(Integer, primary_key=True)

    customer_id = Column(Integer, ForeignKey("User.id"))
    order_date = Column(DateTime, default=func.now())

    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)

    user = relationship("User", back_populates="orders")
    sales = relationship("Sale", back_populates="order")


class Sale(Base):
    id = Column(Integer, primary_key=True)
    
    order_id = Column(Integer, ForeignKey("Order.id"))
    comic_book_id = Column(Integer, ForeignKey("ComicBook.id"))
    sale_date = Column(DateTime, default=func.now())
    quantity = Column(Integer)
    
    order = relationship("Order", back_populates="sales")
    comic_book = relationship("ComicBook", back_populates="sales")


class ComicBook(Base):
    __tablename__ = "ComicBook"
    
    id = Column(Integer, primary_key=True)
    
    title = Column(String)
    author = Column(String)
    description = Column(String)
    genre = Column(String)
    publisher = Column(String)
    
    price = Column(Integer)
    stock_quantity = Column(Integer)
    
    sales = relationship("Sale", back_populates="comic_book")
