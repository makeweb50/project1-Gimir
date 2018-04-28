import os
import psycopg2
import csv
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker


engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

db.execute("""CREATE TABLE books (
id SERIAL PRIMARY KEY,
isbn VARCHAR UNIQUE,
title VARCHAR NOT NULL,
author VARCHAR NOT NULL,
data VARCHAR NOT NULL
)""");

f = open("books.csv")
reader = csv.reader(f)
for isbn, title, author, data in reader:
    db.execute("INSERT INTO books (isbn, title, author, data) VALUES (:isbn, :title, :author, :data)",
                {"isbn": isbn, "title": title, "author": author, "data": data})
    db.commit()
