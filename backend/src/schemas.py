from datetime import datetime
from pydantic import BaseModel
from enum import Enum


class Role(str, Enum):
    customer = "customer"
    admin = "admin"


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str
    login: str
    first_name: str
    last_name: str


class UserLogin(UserBase):
    password: str


class User(UserBase):
    id: int
    role: Role

    class Config:
        orm_mode = True


class OrderBase(BaseModel):
    customer_id: int


class OrderCreate(OrderBase):
    pass


class Order(OrderBase):
    id: int
    order_date: datetime
    status: str

    class Config:
        orm_mode = True


class SaleBase(BaseModel):
    order_id: int
    comic_book_id: int
    quantity: int


class SaleCreate(SaleBase):
    pass


class Sale(SaleBase):
    id: int
    sale_date: datetime

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


class ComicBook(ComicBookBase):
    id: int

    class Config:
        orm_mode = True