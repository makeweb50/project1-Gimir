import os
import psycopg2
from flask import Flask, session, render_template, request, redirect, url_for
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
    return render_template("index.html", title="Home page")

@app.route("/logged")
def logged():
    return render_template("logged.html", user=session['username'], pas=session['password'], title="logged page")

@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('password', None)
    return redirect(url_for('loginn'))

@app.route("/login")
def loginn():
    return render_template('login.html', title="login page")
@app.route("/signupp")

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
        return redirect(url_for('login'))
    return redirect(url_for('signupp'))



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
