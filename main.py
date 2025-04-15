# Import the Flask class to create the applicationa and dotenv library to load enviroment variables
from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()

# Create an instance of the Flask application
app = Flask(__name__)

# Set the secret key for the application, used for cryptographic operations such as session management
app.secret_key = os.environ.get('BT_APP_SECRET_KEY')

# Importing all routes from the views.py file
from views import *

# Start the Flask dev server
if __name__ == '__main__':
    app.run(debug=True)