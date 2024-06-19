from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

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


def get_comic_book_by_id(db: Session, comic_id: int):
    return db.query(models.ComicBook).filter(models.ComicBook.id == comic_id).first()


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


def create_order(db: Session, order: schemas.OrderCreate, user_id: int):
    db_order = models.Order(customer_id=user_id)
    
    db.add(db_order)
    db.flush()
    
    for sale in order.sales:
        if not db.query(models.ComicBook).get(sale.comic_book_id):
            raise HTTPException(status_code=404, detail="Comic not found")
        
        db.add(models.Sale(order_id=db_order.id, **sale.dict()))
        if sale.quantity == 666:
            raise Exception
    
    db.commit()
    
    return db_order


def get_all_sales_by_order_id(db: Session, order_id: int):
    all_ = (db
            .query(models.Sale)
            .join(models.ComicBook, models.Sale.comic_book_id == models.ComicBook.id)
            .join(models.Order, models.Sale.order_id == models.Order.id)
            .join(models.User, models.Order.customer_id == models.User.id)
            .filter(models.Sale.order_id == order_id)
            .all())
    return all_


def get_order_by_id(db: Session, order_id: int):
    return db.query(models.Order).get(order_id)


def get_user_by_id(db, user_id):
    return db.query(models.User).get(user_id)


def get_order_owner_id(db: Session, order_id: int):
    order: models.Order = get_order_by_id(db, order_id=order_id)
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order.customer_id


def get_all_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()


def get_user_orders(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Order).filter_by(customer_id=user_id).offset(skip).limit(limit).all()
