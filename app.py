from flask import Flask, render_template, request, redirect, session, flash
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text
from datetime import date
import werkzeug.security

# Examples on how to get and commit

# content = {"name":request.form["name"], "email":request.form["email"]}
# user = Users(**content)
# database.session.add(user)
# database.session.commit()

# name = request.form["inputname"]
# con.execute(text(f"insert into users (name) values({name})"), request.form)



# here's a really good overview of the SQLAlchemy query builder
# https://flask-sqlalchemy.palletsprojects.com/en/2.x/queries/


app = Flask(__name__)
connectionString = "postgresql://cmg_service:v2_3zhww_qhYRWUP4akHzCjzxNfcGuYZ@db.bit.io:5432/Isaiah-Lam/coolmothgames?sslmode=require"
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


@app.route('/account')
def accountPage():
    if (session.get("userid") is None):
        return render_template("loginsignup.html")
    else:
        user = Users.query.filter_by(userID=session.get("userid"))
        return render_template("account.html")
    

@app.route('/signup', methods=["POST"])
def signup():
    content = {"username":request.form["username"], "email":request.form["email"], "password":werkzeug.security.generate_password_hash(request.form["password"], "sha256", 16)}
    newUser = Users(**content)
    try:
        database.session.add(newUser)
        database.session.commit()
        session["userid"] = newUser.userID
        session["username"] = newUser.username
        return redirect('/')
    except:
        flash("Username or email already in use")
        return redirect('/account')
    

@app.route('/login', methods=["POST"])
def login():
    user = Users.query.filter_by(username=request.form["username"]).first()
    if (user is not None and werkzeug.security.check_password_hash(user.password, request.form["password"])):
        session["userid"] = user.userID
        session["username"] = user.username
        return redirect('/')
    else:
        flash("Wrong info")
        return redirect('/account')
    

@app.route("/logout")
def logout():
    session["userid"] = None
    session["username"] = None
    return redirect('/account')
    

@app.route('/games')
def gamesPage():
    return render_template("games.html")


@app.route('/memory', methods=["GET"])
def memory():
    return render_template('memory.html')


@app.route('/memory', methods=["POST"])
def memoryScore():
    submitScore(1, request.form["score"])
    return redirect("/memory")


@app.route('/rps')
def rps():
    return render_template("rps.html")


# function for submitting score to leaderboard
def submitScore(gameID, score):
    if (session.get("userid") is None):
        flash("You must be logged in to submit to the leaderboards")
    else:
        flash("Score submitted")
        content = {"gameID":gameID, "userID":session.get("userid"), "date":date.today(), "score":score}
        score = Leaderboards(**content)
        database.session.add(score)
        database.session.commit()

    












if __name__ == "__main__":
    app.run(debug=True)