import fastapi.security as _security
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_jwt_auth.exceptions import AuthJWTException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from backend.src import crud, models, schemas
from backend.src import services
from backend.src.database import engine
from backend.src.services import get_db

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


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request, exc):
    return HTTPException(status_code=exc.status_code, detail=exc.message)


@app.get("/users/", response_model=list[schemas.User], tags=['users'])
def read_users(current_user: schemas.User = Depends(services.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud.get_users(db)


@app.post("/users/", response_model=schemas.User, tags=['users'])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/users/token/", tags=['users'])
async def generate_token(
        form_data: _security.OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db),
):
    user = await services.authenticate_user(form_data.username, form_data.password, db)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    
    return await services.create_token(user)


@app.get("/users/me", response_model=schemas.User, tags=['users'])
def read_users_me(current_user: schemas.User = Depends(services.get_current_user)):
    return current_user


@app.put("/users/me", response_model=schemas.User, tags=['users'])
def update_current_user(
        user_update: schemas.UserUpdate,
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(services.get_current_user)
):
    if user_update.password:
        user_update.password = pwd_context.hash(user_update.password)
    
    updated_user = crud.update_user(db, user_id=current_user.id, user_update=user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@app.post("/comics/", response_model=schemas.ComicBook, tags=['comic_book'])
def create_comic_book(
        comic_book: schemas.ComicBookCreate,
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(services.get_current_user)
):
    return crud.create_comic_book(db=db, comic_book=comic_book)


@app.get("/comics/", response_model=list[schemas.ComicBook], tags=['comic_book'])
def read_comic_books(skip: int = 0, limit: int = 30, db: Session = Depends(get_db)):
    return crud.get_comic_books(db, skip=skip, limit=limit)


@app.get("/comics/{id}", response_model=schemas.ComicBook, tags=['comic_book'])
def read_comic_book(id: int, db: Session = Depends(get_db)):
    comic_book = crud.get_comic_book_by_id(db, comic_id=id)
    if comic_book is None:
        raise HTTPException(status_code=404, detail="Comic not found")
    return comic_book


@app.post('/order/create_order', response_model=schemas.Order, tags=['order'])
def create_order(
        current_user_id: int,
        order: schemas.OrderCreate,
        db: Session = Depends(get_db),
        # current_user: schemas.User = Depends(services.get_current_user)
):
    return crud.create_order(db=db, order=order, user_id=current_user_id)


@app.get('/sales/{order_id}', response_model=list[schemas.Sale], tags=['order'])
def get_sales(
        order_id: int,
        db: Session = Depends(get_db),
        # current_user: schemas.User = Depends(services.get_current_user)
):
    return crud.get_all_sales_by_order_id(db=db, order_id=order_id)


if __name__ == '__main__':
    import uvicorn
    
    uvicorn.run(app, host="127.0.0.1", port=8000)
