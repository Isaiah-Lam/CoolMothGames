from flask import Flask, render_template, request, redirect, session
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text
import werkzeug.security


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = ('connection string')
database = SQLAlchemy(app, engine_options={"pool_recycle": 55})

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)



@app.route('/')
def index():
    return render_template("index.html")
    












if __name__ == "__main__":
    app.run(debug=True)