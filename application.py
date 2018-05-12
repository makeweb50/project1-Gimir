import os
import psycopg2
import requests
from flask import Flask, session, render_template, request, redirect, url_for, jsonify
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))



@app.route("/")
def index():
    if 'username' not in session:
        return redirect(url_for('login'))
    else:
        return redirect(url_for('logged'))



@app.route("/login")
def loginn():
    return render_template('login.html', title="login page")

@app.route("/login", methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        users = db.execute("SELECT * FROM users").fetchall()
        for user in users:
            if request.form['name'] in user[1]:
                if request.form['password'] in user[2]:
                    session['username'] = request.form['name']
                    session['password'] = request.form['password']
                    return redirect(url_for('logged'))
        return "You did not sign up"
    return redirect(url_for('loginn'))

@app.route("/signup", methods=('GET', 'POST'))
def signup():
    if request.method == 'POST':
        db.execute("INSERT INTO users (name, password) VALUES (:name, :password)",
                    {"name": request.form['name'], "password": request.form['password']})
        db.commit()
        return redirect(url_for('login'))
    return redirect(url_for('signupp'))



@app.route("/logged")
def logged():
    return render_template("logged.html", title="logged page")

@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('password', None)
    return redirect(url_for('loginn'))


@app.route("/comment", methods=["POST"])
def comment():
    comm = request.get_json()
    print(comm['rate'])
    print(type(comm))
    user = db.execute("SELECT * FROM users WHERE name = (:name)",
    {"name": session['username']}).fetchall()

    iduser = user[0][0]

    db.execute("INSERT INTO comments (user_id, grade, comment, book_isbn) VALUES (:user_id, :grade, :comment, :book_isbn)",
                {"user_id": iduser, "grade": comm['rate'], "comment": comm['text'], "book_isbn": comm['isbn']})
    db.commit()

    com = db.execute("SELECT * FROM comments WHERE book_isbn = (:isbn) AND user_id = (:user)",
    {"user": iduser, "isbn": comm['isbn']}).fetchall()

    result = []

    for i in com:
        result.append({"user": session['username'], "rate": i[1], "comment": i[2], "allow": True})

    return jsonify(result)


@app.route("/book", methods=["POST"])
def book():

    book = request.form.get("currency")
    result = []
    oneBook = db.execute("SELECT * FROM books WHERE title = (:book)",
    {"book": book}).fetchall()
    result.append({"title": oneBook[0][2], "author": oneBook[0][3], "isbn": oneBook[0][1], "year": oneBook[0][4]})
    isbn = oneBook[0][1]
    comment = db.execute("SELECT * FROM comments WHERE book_isbn = (:isbn)", {"isbn": isbn}).fetchall()
    comments = []
    if len(comment) is not 0:
        for com in comment:
            iduser = com[0]
            usern = db.execute("SELECT * FROM users WHERE id = (:iduser)", {"iduser": iduser}).fetchall()
            template = {
                'usern': usern[0][1],
                'grade': com[1],
                'comment': com[2]
            }
            comments.append(template)

    result.append(comments)

    res = requests.get("https://www.goodreads.com/book/review_counts.json", params={"key": "uf44igLdn7CKCpDscLpg", "isbns": isbn})
    data = res.json()
    result.append({"av_rating": data["books"][0]["average_rating"], "wr_count": data["books"][0]["work_ratings_count"]})

    for i in comments:
        if session['username'] in i['usern']:
            result.append({"allow": False})
            return jsonify(result)

    result.append({"allow": True})
    return jsonify(result)






@app.route("/booklist", methods=["POST"])
def booklist():

    book = request.form.get("currency")

    oneBook = db.execute("SELECT * FROM books WHERE title LIKE (:book) OR isbn LIKE (:book) OR author LIKE (:book)",
    {"book": '%' + book + '%'}).fetchall()

    result = []

    for book in oneBook:
        result.append({"title": book[2], "author": book[3]})

    return jsonify(result)



#   SNIPPET FOR CAESH   #
@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)
#   SNIPPET FOR CAESH   #
