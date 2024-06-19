from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class Role(str, Enum):
    customer = "customer"
    admin = "admin"


class UserBase(BaseModel):
    email: str


class UserInfo(UserBase):
    login: str
    first_name: str
    last_name: str


class UserCreate(UserInfo):
    password: str


class UserLogin(UserBase):
    password: str


class UserUpdate(BaseModel):
    login: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    password: str | None = None


class User(UserInfo):
    id: int
    role: Role

    class Config:
        orm_mode = True


class SaleBase(BaseModel):
    comic_book_id: int
    quantity: int


class Sale(SaleBase):
    id: int
    sale_date: datetime
    order_id: int

    class Config:
        orm_mode = True


class OrderBase(BaseModel):
    pass


class OrderCreate(OrderBase):
    """Используется для создания нового заказа"""
    sales: list[SaleBase]


class Order(OrderBase):
    id: int
    order_date: datetime
    status: str
    customer_id: int

    class Config:
        orm_mode = True


class ComicBookBase(BaseModel):
    title: str
    author: str
    publisher: str
    stock_quantity: int
    description: str
    genre: str
    price: float


class ComicBookCreate(ComicBookBase):
    pass


class ComicBook(BaseModel):
    id: int
    title: str
    author: str
    publisher: str
    stock_quantity: int
    description: str
    genre: str
    price: float

    class Config:
        orm_mode = True


class ComicBookResponse(BaseModel):
    id: int
    title: str
    price: float

    class Config:
        orm_mode = True
