import os
from datetime import timedelta
from flask import Flask, request, jsonify,session,redirect,url_for,render_template
from flask_cors import CORS
from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key="HARSHINI"
app.permanent_session_lifetime = timedelta(minutes=30)
CORS(app, resources={r"/*": {"origins": "*"}})
  # Enable Cross-Origin Resource Sharing for frontend communication

# Connect to MongoDB
client = MongoClient('mongodb+srv://aswin132003:8870480win@aswinset.0fhvnfz.mongodb.net/?retryWrites=true&w=majority&appName=AswinSet')  # MongoDB URI from environment variable
db = client.netflix_comments  # Database
users_collection = db.users
comments = db.comments  # Users collection

# Login (or Register if user not found)
@app.route('/login', methods=['POST'])
def login_or_register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    print(data)
    # Find the user by username
    user = users_collection.find_one({"username": username})

    if user:
        # If user found, check if the password matches
        if not check_password_hash(user['password'], password):
            return jsonify({"message": "Invalid password"}), 400
        session['username']=username
        session.permanent=True
        print(session)
        return jsonify({"message": "Login successful"}), 200
    else:
        # If user not found, create a new user
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        users_collection.insert_one({"username": username, "password": hashed_password})
        return jsonify({"message": "User registered successfully"}), 200
@app.route('/welcome')
def welcome():
    if 'username' in session:
        return f"Welcome {session['username']}!"

@app.route('/logout')
def logout():
    session.pop('username', None)

@app.route('/comments')
def comments():
    if 'username' not in session:
        return render_template('error.html',error_title="Unauthorized Access",error_message="pls login and try again")
    else:
        return render_template('commentspage.html')
# Run the Flask app
@app.route('/movieinfo', methods=["POST"])
def movieinfo():
    data = {"title": "", "description": ""}
    try:
        payload = request.json
        if not payload or not payload.get("websiteurl"):
            return jsonify({"error": "Missing or invalid website URL"}), 400
        moviepage = requests.get("https://www.netflix.com/title/"+payload.get("websiteurl"))
        bsmp = BeautifulSoup(moviepage.text, 'html.parser')
        # Extract title and description
        movietitle = bsmp.find('h1', {'data-uia': 'title-info-title'})
        moviedescription = bsmp.find('div', {'data-uia': 'title-info-synopsis'})

        if movietitle:
            data["title"] = movietitle.text.strip()
        if moviedescription:
            data["description"] = moviedescription.text.strip()
        
        return jsonify(data), 200
    except Exception as e:
        print("Error:", str(e))  # Log the actual error
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
