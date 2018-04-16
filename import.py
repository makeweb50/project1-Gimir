import os
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

# db.execute("""CREATE TABLE users (
# id SERIAL PRIMARY KEY,
# name VARCHAR NOT NULL,
# password VARCHAR NOT NULL
# )""");
# db.execute("INSERT INTO users (name, password) VALUES ('Gimir', 'gimirgimir')");
# db.commit()
user = db.execute("SELECT * FROM users").fetchall()
print(user)
