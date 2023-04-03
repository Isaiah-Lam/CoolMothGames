from flask import Flask, render_template, request, redirect, session, flash
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text
from datetime import date, timedelta
import werkzeug.security

# Examples on how to get and commit

# content = {"name":request.form["name"], "email":request.form["email"]}
# user = Users(**content)
# database.session.add(user)
# database.session.commit()

# name = request.form["inputname"]
# con.execute(text(f"insert into users (name) values({name})"), request.form)



# here's a really good overview of the SQLAlchemy query builder
# https://flask-sqlalchemy.palletsprojects.com/en/3.0.x/config/


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
    replyTo = database.Column(database.Integer)

class Leaderboards(database.Model) :
    boardID = database.Column(database.Integer, primary_key = True)
    gameID = database.Column(database.Integer, database.ForeignKey("games.gameID"))
    userID = database.Column(database.Integer, database.ForeignKey("users.userID"))
    date = database.Column(database.Date)
    score = database.Column(database.Float)
    difficulty = database.Column(database.String(25))

# these lines add the models defined above to the database as tables

# with app.app_context() :
#     database.create_all()



app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=5)
Session(app)



@app.route('/')
def index():
    return render_template("index.html", loggedIn=(session.get("userid") is not None))


@app.route('/account')
def accountPage():
    if (session.get("userid") is None):
        return render_template("loginsignup.html", loggedIn=False)
    else:
        # user = Users.query.filter_by(userID=session.get("userid"))
        return render_template("account.html", loggedIn=(session.get("userid") is not None))

    

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

@app.route('/account', methods=["GET"])
def account():
    return render_template('account.html')
    

@app.route('/games')
def gamesPage():
    return render_template("games.html", loggedIn=(session.get("userid") is not None))

@app.route('/tictactoe', methods=["GET"])
def tictactoe():
    user = Users.query.filter_by(userID=session.get("userid")).first()
    wins = Leaderboards.query.filter_by(userID=session.get("userid"), gameID=3).first()
  

    # working to add each user's highscore to the page when it loads

    # highscore = con.execute(text(f'select MAX("score") from leaderboards where "userID" = user.userID'))\

    return render_template('tic-tac-toe.html', userInfo = user, wins=wins, loggedIn=(session.get("userid") is not None))


@app.route('/tictactoe', methods=["POST"])
def tictactoePost():
    if(session.get("userid") is not None):
        wins = Leaderboards.query.filter_by(userID=session.get("userid"), gameID=3).first()
        
        if(wins is None):
            content = {"gameID":3, "userID":session.get("userid"), "date":date.today(), "score":1, "difficulty":None}
            score = Leaderboards(**content)
            database.session.add(score)
            database.session.commit()
        else:
            wins.score = wins.score + 1
            database.session.commit()
            
    else:  
        flash("not logged in")
    return redirect('/tictactoe')

@app.route('/memory', methods=["GET"])
def memory():
    return render_template('memory.html', loggedIn=(session.get("userid") is not None))


@app.route('/memory', methods=["POST"])
def memoryScore():
    submitScore(1, request.form["score"], request.form["difficulty"])
    return redirect("/memory")


@app.route('/rps', methods=["GET"])
def rps():
    highScore = 0
    if (session.get("userid") is None):
          highScore = "Login to see highscore"
    else:
        highScore = Leaderboards.query.order_by(Leaderboards.score.desc()).first()
        highScore = int(highScore.score)
    return render_template("rps.html", highScore=highScore, loggedIn=(session.get("userid") is not None))


@app.route('/rps', methods=["POST"])
def rpsScore():
    submitScore(2, request.form["score"])
    return redirect("/rps")


@app.route('/connect4', methods=["GET"])
def connect4():
    return render_template("connect4.html", loggedIn=(session.get("userid") is not None))



@app.route("/leaderboards", methods=["GET"])
def leaderboards():
    games = Games.query.order_by(Games.title).all()
    # leaderboards = Leaderboards.query.order_by(Leaderboards.score).join(Users, Leaderboards.userID==Users.userID).all()
    try:
        leaderboards = con.execute(text(f'SELECT "boardID", "gameID", users."userID", "date", "score", "username", "difficulty" FROM leaderboards join users on leaderboards."userID" = users."userID";')).all()
        return render_template("leaderboards.html", games=games, leaderboards=leaderboards, loggedIn=(session.get("userid") is not None))
    except:
        con.rollback()
        return redirect("/leaderboards")
    

@app.route('/minesweeper')
def minsweeper():
    return render_template("minesweeper.html", loggedIn=(session.get("userid") is not None))


@app.route("/minesweeper", methods=["POST"])
def minesweeperScore() :
    submitScore(4, request.form["score"], request.form["difficulty"])
    return redirect("/minesweeper")


@app.route('/chess')
def chess():
    cols = ['A','B','C','D','E','F','G','H']
    rows = [["wRook", "wKnight", "wBishop", "wQueen", "wKing", "wBishop", "wKnight", "wRook"], ["wPawn", "wPawn", "wPawn", "wPawn","wPawn", "wPawn","wPawn", "wPawn"], ["bPawn", "bPawn", "bPawn", "bPawn","bPawn", "bPawn","bPawn", "bPawn"], ["bRook", "bKnight", "bBishop", "bQueen", "bKing", "bBishop", "bKnight", "bRook"]]
    return render_template("chess.html", columns=cols, rows=rows, loggedIn=(session.get("userid") is not None))



@app.route('/memory-forums', methods=["GET"])
def memForums():
    try:
        game = Games.query.filter_by(gameID='1').first()
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 1;'))
    except:
        con.rollback()
        return redirect("/memory-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game)

@app.route('/rps-forums', methods=["GET"])
def rpsForums():
    try:
        game = Games.query.filter_by(gameID='2').first()
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 2;'))
    except:
        con.rollback()
        return redirect("/rps-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game)

@app.route('/tictactoe-forums', methods=["GET"])
def tttForums():
    try:
        game = Games.query.filter_by(gameID='3').first()
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 3;'))
    except:
        con.rollback()
        return redirect("/tictactoe-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game)

@app.route('/minesweeper-forums', methods=["GET"])
def mineForums():
    try: 
        game = Games.query.filter_by(gameID='4').first()
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 4;'))
    except:
        con.rollback()
        return redirect("/minesweeper-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game)

@app.route('/connect4-forums', methods=["GET"])
def connect4Forums():
    try:
        game = Games.query.filter_by(gameID='5').first()
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 5;'))
    except:
        con.rollback()
        return redirect("connect4-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game)

@app.route('/forums', methods=['POST'])
def forumsSubmit():
    if (session.get("userid") is None):
        flash("You must be logged in to submit to the forums")
    else:
        flash("Comment Submitted")
        try:
            reply = request.form["replyTo"]
        except:
            reply = None
        content = {"gameID":request.form["gameid"], "userID":session.get("userid"), "date":date.today(), "message":request.form["message"], "replyTo":reply}
        message = Messages(**content)
        database.session.add(message)
        database.session.commit()
        routes = {"1":"/memory-forums", "2":"/rps-forums", "3":"/tictactoe-forums", "4":"/minesweeper-forums","5":"/connect4-forums"}
        route = request.form["gameid"]
    return redirect(routes[route])


@app.route('/blackjack', methods=["GET"])
def blackjack():
    return render_template("blackjack.html", loggedIn=(session.get("userid") is not None))



@app.route('/spacewar', methods=["GET"])
def spacewar():
    return render_template("spacewar.html", loggedIn=(session.get("userid") is not None))



# function for submitting score to leaderboard
def submitScore(gameID, score, difficulty=None):
    if (session.get("userid") is None):
        flash("You must be logged in to submit to the leaderboards")
    else:
        flash("Score submitted")
        content = {"gameID":gameID, "userID":session.get("userid"), "date":date.today(), "score":score, "difficulty":difficulty}
        score = Leaderboards(**content)
        database.session.add(score)
        database.session.commit()



    












if __name__ == "__main__":
    app.run(debug=True)