from datetime import datetime

from pydantic import BaseModel


class UserBase(BaseModel):
    login: str
    email: str
    first_name: str
    last_name: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    role: str
    
    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customer_id: int


class OrderCreate(OrderBase):
    pass


class Order(OrderBase):
    id: int
    order_date: datetime
    status: str
    
    class Config:
        from_attributes = True


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
        from_attributes = True


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
        from_attributes = True
