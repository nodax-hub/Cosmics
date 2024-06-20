import jwt
from fastapi import Depends, HTTPException
from fastapi import security
from sqlalchemy.orm import Session

from backend.src import models, crud
from backend.src import schemas
from backend.src.crud import get_user_by_email
from backend.src.database import SessionLocal

oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/api/token")
JWT_SECRET = "myjwtsecret"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_token(user: models.User):
    user_obj = schemas.UserResponse.from_orm(user)
    
    token = jwt.encode(user_obj.dict(), JWT_SECRET)
    
    return dict(access_token=token, token_type="bearer")


def authenticate_user(email: str, password: str, db: Session):
    user = get_user_by_email(db=db, email=email)
    
    if not user:
        return False
    
    if not user.verify_password(password):
        return False
    
    return user


def get_current_user(
        db: Session = Depends(get_db),
        token: str = Depends(oauth2schema),
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(models.User).get(payload["id"])
    except:
        raise HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )
    
    return schemas.UserResponse.from_orm(user)


def compile_order_response(created_order, db):
    return schemas.OrderResponse(id=created_order.id,
                                 date=created_order.order_date,
                                 status=created_order.status,
                                 user=crud.get_user_by_id(db, crud.get_order_owner_id(db, created_order.id)),
                                 sales=[schemas.SaleResponse(comic_book_id=sale.comic_book_id,
                                                             quantity=sale.quantity,
                                                             comic_book=sale.comic_book)
                                        for sale in crud.get_all_sales_by_order_id(db=db,
                                                                                   order_id=created_order.id)])
