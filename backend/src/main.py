from typing import List, Literal
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session
from passlib.context import CryptContext

from backend.src import crud, models, schemas
from .models import ComicBook  # Изменен путь импорта на относительный

from .schemas import ComicBookResponse
from backend.src.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(root_path="/api")

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

# Dependency for getting DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_user_by_token(token: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_token(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    return user

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# Зависимость для проверки JWT и получения текущего пользователя
def get_current_user(Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    try:
        Authorize.jwt_required()
    except AuthJWTException as e:
        raise HTTPException(status_code=401, detail="Unauthorized")

    user_email = Authorize.get_jwt_subject()
    user = crud.get_user_by_email(db, email=user_email)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@app.post("/auth/token/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = Authorize.create_access_token(subject=user.email)
    return {"access_token": access_token}

# Пример маршрута, доступного только авторизованным пользователям
@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.put("/users/me", response_model=schemas.User)
def update_current_user(
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    if user_update.password:
        user_update.password = pwd_context.hash(user_update.password)
    updated_user = crud.update_user(db, user_id=current_user.id, user_update=user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

# Пример маршрута для создания комикса, доступного только авторизованным пользователям
@app.post("/comic_books/", response_model=schemas.ComicBook)
def create_comic_book(
        comic_book: schemas.ComicBookCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)
):
    return crud.create_comic_book(db=db, comic_book=comic_book)

@app.get("/comic_books/", response_model=List[schemas.ComicBook])
def read_comic_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_comic_books(db, skip=skip, limit=limit)

@app.get("/comics", response_model=list[ComicBookResponse])
def read_comics(db: Session = Depends(get_db)):
    comics = db.query(ComicBook).all()
    return comics
@app.get("/comic_books/search_by", response_model=schemas.ComicBook)
def read_comic_book(attr: Literal['id', 'title', 'author', 'genre'], val, db: Session = Depends(get_db)):
    return crud.get_comic_book_by_attribute(db, **{attr: val})

if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
