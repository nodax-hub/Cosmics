import logging
from typing import Literal
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from backend.src import crud, models, schemas
from backend.src.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Settings(BaseModel):
    authjwt_secret_key: str = "secret"


@AuthJWT.load_config
def get_config():
    return Settings()


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request, exc):
    return HTTPException(status_code=exc.status_code, detail=exc.message)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = crud.get_user_by_login(db, login=user.login)
    if db_user:
        raise HTTPException(status_code=400, detail="Login already registered")
    return crud.create_user(db=db, user=user)


@app.post("/auth/token/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = Authorize.create_access_token(subject=user.email)
    return {"access_token": access_token}


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/comic_books/", response_model=schemas.ComicBook)
def create_comic_book(
        comic_book: schemas.ComicBookCreate, db: Session = Depends(get_db)
):
    return crud.create_comic_book(db=db, comic_book=comic_book)


@app.get("/comic_books/", response_model=list[schemas.ComicBook])
def read_comic_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_comic_books(db, skip=skip, limit=limit)


@app.get("/comic_books/search_by", response_model=schemas.ComicBook)
def read_comic_book(attr: Literal['id', 'title', 'author', 'genre'], val, db: Session = Depends(get_db)):
    return crud.get_comic_book_by_attribute(db, **{attr: val})


if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
