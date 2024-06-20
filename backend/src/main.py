import fastapi.security as _security
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_jwt_auth.exceptions import AuthJWTException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from backend.src import crud, models, schemas
from backend.src import services
from backend.src.database import engine
from backend.src.services import get_db, compile_order_response

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


@app.get("/users", response_model=list[schemas.UserResponse], tags=['users'])
def read_users(current_user: schemas.UserResponse = Depends(services.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud.get_users(db)


@app.post("/users", response_model=schemas.UserResponse, tags=['users'])
def create_user(user: schemas.UserWithPassword, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/orders", response_model=list[schemas.OrderResponse], tags=['users'])
def get_orders(skip: int = 0, limit: int = 100,
               db: Session = Depends(get_db),
               current_user: schemas.UserResponse = Depends(services.get_current_user)):
    
    orders = crud.get_all_orders(skip=skip, limit=limit, db=db) \
        if current_user.role == models.Role.ADMIN else \
        crud.get_user_orders(user_id=current_user.id, skip=skip, limit=limit, db=db)
    
    return [compile_order_response(order, db) for order in orders]


@app.post('/users/orders/create_order', response_model=schemas.OrderResponse, tags=['users'])
def create_order(
        order: schemas.OrderCreate,
        db: Session = Depends(get_db),
        current_user: schemas.UserResponse = Depends(services.get_current_user)
):
    created_order = crud.create_order(db=db, order=order, user_id=current_user.id)
    return compile_order_response(created_order, db)


@app.get('/users/orders/{order_id}', response_model=schemas.OrderResponse, tags=['users'])
def get_order_details_by_id(
        order_id: int,
        db: Session = Depends(get_db),
        current_user: schemas.UserResponse = Depends(services.get_current_user)
):
    owner_id = crud.get_order_owner_id(db=db, order_id=order_id)
    
    # Если пользователь не админ проверяем является ли он владельцем заказа который запрашивает
    if current_user.role != models.Role.ADMIN:
        if owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return crud.get_all_sales_by_order_id(db=db, order_id=order_id)


@app.post("/token", tags=['auth'])
def generate_token(
        form_data: _security.OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db),
):
    user = services.authenticate_user(form_data.username, form_data.password, db)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    
    return services.create_token(user)


@app.get("/users/me", response_model=schemas.UserResponse, tags=['users'])
def read_users_me(current_user: schemas.UserResponse = Depends(services.get_current_user)):
    return current_user


@app.put("/users/me", response_model=schemas.UserResponse, tags=['users'])
def update_current_user(
        user_update: schemas.UserWithPassword,
        db: Session = Depends(get_db),
        current_user: schemas.UserResponse = Depends(services.get_current_user)
):
    if user_update.password:
        user_update.password = pwd_context.hash(user_update.password)
    
    updated_user = crud.update_user(db, user_id=current_user.id, user_update=user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@app.get("/comics", response_model=list[schemas.ComicBookResponse], tags=['comic_book'])
def read_comic_books(skip: int = 0, limit: int = 30, db: Session = Depends(get_db)):
    return crud.get_comic_books(db, skip=skip, limit=limit)


@app.get("/comics/{id}", response_model=schemas.ComicBookResponse, tags=['comic_book'])
def read_comic_book(id: int, db: Session = Depends(get_db)):
    comic_book = crud.get_comic_book_by_id(db, comic_id=id)
    if comic_book is None:
        raise HTTPException(status_code=404, detail="Comic not found")
    return comic_book


if __name__ == '__main__':
    import uvicorn
    
    uvicorn.run(app, host="127.0.0.1", port=8000)
