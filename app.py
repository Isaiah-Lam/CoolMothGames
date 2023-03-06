from flask import Flask, render_template, request, redirect, session
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text
import werkzeug.security


app = Flask(__name__)
connectionString = "postgresql://cmg_service:v2_3zhww_qhYRWUP4akHzCjzxNfcGuYZ@db.bit.io:5432/Isaiah-Lam/coolmothgames"
app.config['SQLALCHEMY_DATABASE_URI'] = (connectionString)
database = SQLAlchemy(app, engine_options={"pool_recycle": 55})
engine = create_engine(connectionString, echo=True)
con = engine.connect()

class Users(database.Model) :
    userID = database.Column(database.Integer, primary_key = True)
    username = database.Column(database.String(100), unique = True)
    email = database.Column(database.String(100), unique = True)
    password = database.Column(database.String(100))

class Games(database.Model) :
    gameID = database.Column(database.Integer, primary_key = True)
    title = database.Column(database.String(100))

class Tags(database.Model) :
    tagID = database.Column(database.Integer, primary_key = True)
    gameID = database.Column(database.Integer, database.ForeignKey("games.gameID"))
    genre = database.Column(database.String(50))

class Ratings(database.Model) :
    ratingID = database.Column(database.Integer, primary_key = True)
    gameID = database.Column(database.Integer, database.ForeignKey("games.gameID"))
    review = database.Column(database.String(255))
    rating = database.Column(database.Integer)

class Messages(database.Model) :
    messageID = database.Column(database.Integer, primary_key = True)
    gameID = database.Column(database.Integer, database.ForeignKey("games.gameID"))
    userID = database.Column(database.Integer, database.ForeignKey("users.userID"))
    date = database.Column(database.Date)
    message = database.Column(database.String(255))

class Leaderboards(database.Model) :
    boardID = database.Column(database.Integer, primary_key = True)
    gameID = database.Column(database.Integer, database.ForeignKey("games.gameID"))
    userID = database.Column(database.Integer, database.ForeignKey("users.userID"))
    date = database.Column(database.Date)
    score = database.Column(database.Float)

# these lines add the models defined above to the database as tables

# with app.app_context() :
#     database.create_all()



app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)



@app.route('/')
def index():
    return render_template("index.html")





    












if __name__ == "__main__":
    app.run(debug=True)