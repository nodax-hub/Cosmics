from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime

from backend.src import models, schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_login(db: Session, login: str):
    return db.query(models.User).filter(models.User.login == login).first()

def get_comic_book_by_attribute(db: Session, **kwargs):
    return db.query(models.ComicBook).filter_by(**kwargs).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        login=user.login,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password,
        role=models.Role.CUSTOMER  # or whatever role is appropriate
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_comic_books(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ComicBook).offset(skip).limit(limit).all()

def create_comic_book(db: Session, comic_book: schemas.ComicBookCreate):
    db_item = models.ComicBook(**comic_book.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
