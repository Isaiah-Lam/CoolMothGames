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
    # email = database.Column(database.String(100), unique = True)
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
# app.config['SESSION_FILE_THRESHOLD'] = 1
Session(app)



@app.route('/')
def index():

    try:
        featuredGames = []
        highestRating = con.execute(text('select "gameID", avg("rating") as "average" from ratings group by "gameID" order by "average";')).first()
        highestRatedGame = con.execute(text(f'select * from games where "gameID"={highestRating.gameID}')).first()
        featuredGames.append({"gameid":highestRatedGame.gameID, "title":highestRatedGame.title})
        mostRatings = con.execute(text('select "gameID", count("ratingID") as "countRatings" from ratings group by "gameID" order by "countRatings" desc')).first()
        mostRatedGame = con.execute(text(f'select * from games where "gameID"={mostRatings.gameID}')).first()
        featuredGames.append({"gameid":mostRatedGame.gameID, "title":mostRatedGame.title})

        featuredScores = []
        highscoregames = [2,6,7,8,10]
        lowscoregames = [1,4]

        # select max scores
        # for each, select date where score = score and gameID = gameID

        scores = con.execute(text('select "gameID", max("score"), min("score") from leaderboards group by "gameID"')).all()
        maxDate = date(1,1,1)
        minDate = date(9999,12,31)
        oldScore = ''
        newScore = ''
        playerHighscoreCounts = {}
        for score in scores:
            if (score.gameID in highscoregames):
                entry = con.execute(text(f'select "userID", "boardID", "date" from leaderboards where "score" = {score.max} and "gameID" = {score.gameID}')).first()
            elif (score.gameID in lowscoregames):
                entry = con.execute(text(f'select "userID", "boardID", "date" from leaderboards where "score" = {score.min} and "gameID" = {score.gameID}')).first()
            if (entry.date > maxDate):
                maxDate = entry.date
                newScore = entry
            if (entry.date < minDate):
                minDate = entry.date
                oldScore = entry
            if (entry.userID in playerHighscoreCounts):
                playerHighscoreCounts[entry.userID] += 1
            else:
                playerHighscoreCounts[entry.userID] = 1
        
        oldScore = con.execute(text(f'select "username", "score", "date", "title", "difficulty" from users join leaderboards on users."userID" = leaderboards."userID" join games on leaderboards."gameID" = games."gameID" where "boardID" = {oldScore.boardID}')).first()
        newScore = con.execute(text(f'select "username", "score", "date", "title", "difficulty" from users join leaderboards on users."userID" = leaderboards."userID" join games on leaderboards."gameID" = games."gameID" where "boardID" = {newScore.boardID}')).first()

        featuredScores.append({"heading":"Oldest Highscore","user":oldScore.username, "score":oldScore.score, "date":oldScore.date, "title":oldScore.title, "difficulty":oldScore.difficulty})
        featuredScores.append({"heading":"Newest Highscore","user":newScore.username, "score":newScore.score, "date":newScore.date, "title":newScore.title, "difficulty":newScore.difficulty})
        print(list(playerHighscoreCounts.keys())[list(playerHighscoreCounts.values()).index(max(playerHighscoreCounts.values()))])
        topPlayer = con.execute(text(f'select * from leaderboards join users on leaderboards."userID" = users."userID" where users."userID" = {list(playerHighscoreCounts.keys())[list(playerHighscoreCounts.values()).index(max(playerHighscoreCounts.values()))]}')).all()

    except:
        con.rollback()
        return redirect('/')

    return render_template("index.html", featuredGames=featuredGames, featuredScores=featuredScores, topPlayer=topPlayer, loggedIn=(session.get("userid") is not None))


@app.route('/account', methods=["GET"])
def accountPage():
    if (session.get("userid") is None):
        return render_template("loginsignup.html", loggedIn=False)
    else:
        user = Users.query.filter_by(userID=session.get("userid")).first()
        print(user)
        return render_template("account.html", userInfo=user, loggedIn=(session.get("userid") is not None))


@app.route('/login', methods=["GET"])
def loadlogin():
    return render_template("loginsignup.html")



@app.route('/signup', methods=["POST"])
def signup():
    # content = {"username":request.form["username"], "email":request.form["email"], "password":werkzeug.security.generate_password_hash(request.form["password"], "sha256", 16)}
    content = {"username":request.form["username"], "password":werkzeug.security.generate_password_hash(request.form["password"], "sha256", 16)}

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
    


@app.route('/pigame', methods= ["GET"])
def pigame():
    pi = "1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989"
    return render_template("pigame.html", pi=pi, loggedIn=(session.get("userid") is not None))

@app.route('/pigame', methods=["POST"])
def pigameScore():
    submitScore(10, request.form["score"])
    return redirect('/pigame')

    

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
    games = Games.query.order_by(Games.title).all()
    return render_template("games.html", games=games, loggedIn=(session.get("userid") is not None))

@app.route('/tictactoe', methods=["GET"])
def tictactoe():
    user = Users.query.filter_by(userID=session.get("userid")).first()
    wins = Leaderboards.query.filter_by(userID=session.get("userid"), gameID=3).first()
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
        flash("Please Login to track wins.")
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
    try:
        leaderboards = con.execute(text('SELECT "boardID", "gameID", users."userID", "date", "score", "username", "difficulty" FROM leaderboards join users on leaderboards."userID" = users."userID";')).all()
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
        replies = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 1;'))
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 1;'))
    except:
        con.rollback()
        return redirect("/memory-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game, replies=replies)

@app.route('/rps-forums', methods=["GET"])
def rpsForums():
    try:
        game = Games.query.filter_by(gameID='2').first()
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 2;'))
        replies = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 2;'))
    except:
        con.rollback()
        return redirect("/rps-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game, replies=replies)

@app.route('/tictactoe-forums', methods=["GET"])
def tttForums():
    try:
        game = Games.query.filter_by(gameID='3').first()
        replies = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 3;'))
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 3;'))
    except:
        con.rollback()
        return redirect("/tictactoe-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game, replies=replies)

@app.route('/minesweeper-forums', methods=["GET"])
def mineForums():
    try: 
        game = Games.query.filter_by(gameID='4').first()
        replies = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 4;'))
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 4;'))
    except:
        con.rollback()
        return redirect("/minesweeper-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game, replies=replies)

@app.route('/connect4-forums', methods=["GET"])
def connect4Forums():
    try:
        game = Games.query.filter_by(gameID='5').first()
        replies = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 5;'))
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 5;'))
    except:
        con.rollback()
        return redirect("/connect4-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game, replies=replies)

@app.route('/starwar-forums', methods=["GET"])
def starwarForums():
    try:
        game = Games.query.filter_by(gameID='6').first()
        replies = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 6;'))
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 6;'))
    except:
        con.rollback()
        return redirect("/starwar-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game, replies=replies)

@app.route('/flappymoth-forums', methods=["GET"])
def flappymothForums():
    try:
        game = Games.query.filter_by(gameID='7').first()
        replies = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 7;'))
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 7;'))
    except:
        con.rollback()
        return redirect("/flappymoth-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game, replies=replies)

@app.route('/doodlemoth-forums', methods=["GET"])
def doodlemothForums():
    try:
        game = Games.query.filter_by(gameID='8').first()
        replies = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 8;'))
        messages = con.execute(text('SELECT "messageID", "gameID", users."userID", "date", "message", "replyTo", users."username" FROM messages join users on messages."userID" = users."userID" where messages."gameID" = 8;'))
    except:
        con.rollback()
        return redirect("/doodlemoth-forums")
    return render_template('forums.html', loggedIn=(session.get("userid") is not None), messages=messages, game=game, replies=replies)

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
    routes = {"1":"/memory-forums", "2":"/rps-forums", "3":"/tictactoe-forums", "4":"/minesweeper-forums","5":"/connect4-forums",
                  "6":"/starwar-forums", "7":"/flappymoth-forums", "8":"/doodlemoth-forums"}
    route = request.form["gameid"]
    return redirect(routes[route])

@app.route('/blackjack', methods=["GET"])
def blackjack():
    return render_template("blackjack.html", loggedIn=(session.get("userid") is not None))



@app.route('/starwar', methods=["GET"])
def spacewar():
    return render_template("spacewar.html", loggedIn=(session.get("userid") is not None))

@app.route('/starwar', methods=["POST"])
def spacewarScore():
    submitScore(6, request.form["score"])
    return render_template("spacewar.html", loggedIn=(session.get("userid") is not None))


@app.route('/drawpad')
def drawpad():
    return render_template("drawpad.html", loggedIn=(session.get("userid") is not None))


@app.route('/flappymoth', methods=["GET"])
def flappymoth():
    return render_template("flappymoth.html", loggedIn=(session.get("userid") is not None))

@app.route("/flappymoth", methods=["POST"])
def flappyMothScore():
    submitScore(7, request.form["score"])
    return render_template("flappymoth.html", loggedIn=(session.get("userid") is not None))


@app.route("/doodlemoth", methods=["GET"])
def doodlemoth():
    return render_template("doodlemoth.html", loggedIn=(session.get("userid") is not None))

@app.route("/doodlemoth", methods=["POST"])
def doodleMothScore():
    submitScore(8, request.form["score"])
    return redirect("/doodlemoth")

@app.route('/loadgame', methods=["GET"])
def loadGame():
    id = request.args.get('game')
    print(id)
    if(id == "1"):
        return redirect("/memory")    
    elif(id == "2"):
        return redirect("/rps")
    elif(id == "3"):
        return redirect("/tictactoe")
    elif(id == "4"):
        return redirect("/minesweeper")      
    elif(id == "5"):
        return redirect("/connect4")
    elif(id == "6"):
        return redirect("/starwar")
    elif(id == "7"):
        return redirect("/flappymoth")
    elif(id == "8"):
        return redirect("/doodlemoth")
    elif(id == "9"):
        return redirect("/drawpad")
    elif(id == "10"):
        return redirect("/pigame")
    elif(id == "11"):
        return redirect("/blackjack")
    else:
        return redirect("/games")


# function for submitting score to leaderboard
def submitScore(gameID, score, difficulty=None):
    if (session.get("userid") is None):
        flash("You must be logged in to submit to the leaderboards")
    else:
        bestEntry = ""
        if (difficulty):
            bestEntry = con.execute(text(f'select * from leaderboards where "gameID" = {gameID} and "userID" = {session.get("userid")} and "difficulty" = ' + "'" + difficulty + "'")).first()
        else:
            bestEntry = con.execute(text(f'select * from leaderboards where "gameID" = {gameID} and "userID" = {session.get("userid")} and "difficulty" is null')).first()
        
        if (bestEntry):
            highscores = [2,6,7,8,10]
            lowscores = [1,4]
            if ((gameID in highscores and bestEntry.score < float(score)) or (gameID in lowscores and bestEntry.score > float(score))):
                con.execute(text('update leaderboards set "score" = ' + score + ', "date" = ' + date.today() + ' where "gameID" = ' + gameID + " and userID = " + session.get("userid")))
                flash("Score submitted")
        else:
            content = {"gameID":gameID, "userID":session.get("userid"), "date":date.today(), "score":score, "difficulty":difficulty}
            score = Leaderboards(**content)
            database.session.add(score)
            database.session.commit()
















if __name__ == "__main__":
    app.run(debug=True)