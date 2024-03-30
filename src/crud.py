from sqlalchemy.orm import Session

from src import schemas, models


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_login(db: Session, login: str):
    return db.query(models.User).filter(models.User.login == login).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    # TODO: хешировать пароль
    fake_hashed_password = user.password + "notreallyhashed"
    
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


def get_comic_books(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ComicBook).offset(skip).limit(limit).all()


def create_comic_book(db: Session, comic_book: schemas.ComicBookCreate):
    db_item = models.ComicBook(**comic_book.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
