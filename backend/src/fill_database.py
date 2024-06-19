import hashlib
import random

from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from models import Base, ComicBook, Role, User

# Создаем объект Faker для генерации тестовых данных
fake = Faker()


# Функция для хеширования пароля
def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


# Функция для заполнения таблицы User тестовыми данными
def create_users(session: Session, num: int):
    for _ in range(num):
        user_data = {
            "login": fake.user_name(),
            "email": fake.email(),
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "role": random.choice(list(Role)),
            "hashed_password": hash_password(fake.password()),
        }
        user = User(**user_data)
        session.add(user)
    session.commit()
    print(f"{num} пользователей было добавлено в базу данных.")


def create_comics(session: Session, num: int):
    # Списки для реалистичных данных
    titles = ["The Amazing Spider-Man", "Batman: The Dark Knight Returns", "Watchmen", "Saga", "Sandman", "X-Men",
              "Deadpool", "The Walking Dead", "Wonder Woman", "Saga of the Swamp Thing"]
    authors = ["Stan Lee", "Frank Miller", "Alan Moore", "Brian K. Vaughan", "Neil Gaiman", "Chris Claremont",
               "Rob Liefeld", "Robert Kirkman", "George Perez", "Alan Moore"]
    genres = ["Superhero", "Crime", "Science Fiction", "Fantasy", "Horror", "Action", "Adventure", "Mystery", "Comedy",
              "Drama"]
    publishers = ["Marvel Comics", "DC Comics", "Vertigo", "Image Comics", "Dark Horse Comics", "IDW Publishing",
                  "Boom! Studios", "Valiant Comics", "Archie Comics", "Dynamite Entertainment"]

    # Добавляем случайные комиксы в базу данных
    for _ in range(num):
        comic_book_data = {
            "title": random.choice(titles),
            "author": random.choice(authors),
            "description": "Description of the comic book.",
            "genre": random.choice(genres),
            "publisher": random.choice(publishers),
            "price": random.randint(5, 30),
            "stock_quantity": random.randint(50, 200)
        }
        comic_book = ComicBook(**comic_book_data)
        session.add(comic_book)
    # Коммитим транзакцию
    session.commit()


def main():
    # Создаем соединение с базой данных
    engine = create_engine("sqlite:///../../sql_app.db")
    Base.metadata.bind = engine

    # Создаем сессию базы данных
    DBSession = sessionmaker(bind=engine)

    with DBSession() as session:
        create_comics(session, 100)
        # create_users(session, 100)


if __name__ == '__main__':
    main()
