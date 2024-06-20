from datetime import datetime

from pydantic import BaseModel, Field

from backend.src import models


class ComicBookBase(BaseModel):
    title: str
    author: str
    publisher: str
    stock_quantity: int
    description: str
    genre: str
    price: float


class ComicBookResponse(ComicBookBase):
    id: int
    
    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str
    login: str
    first_name: str
    last_name: str


class UserWithPassword(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    role: models.Role
    
    class Config:
        orm_mode = True


class SaleBase(BaseModel):
    comic_book_id: int = Field(gt=0)
    quantity: int = Field(gt=0)


class SaleResponse(SaleBase):
    comic_book: ComicBookResponse


class OrderCreate(BaseModel):
    sales: list[SaleBase]


class OrderResponse(BaseModel):
    id: int
    date: datetime
    status: str
    
    user: UserResponse
    sales: list[SaleResponse]
    
    class Config:
        orm_mode = True
