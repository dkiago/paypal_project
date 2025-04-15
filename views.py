from main import app
import os
from flask import render_template, request, jsonify
from gateway import transact

# --------------------
# Route Definitions
# --------------------

# Route for the home page
@app.route("/", methods=['GET'])
def home():
    return render_template('home.html')


# Route to handle payment submissions
@app.route("/handleSubmit", methods=['POST'])
def handleSubmit():
    # Check if the payment nonce is provided in the form data
    if not request.form['nonce']:
        return jsonify({"error": "Required mandatory field missing!"}), 400 # Shows a message about the nonce not being generated
    
    result = transact({
        'amount': '10.00',  # Hardcoded amount for the transaction
        'payment_method_nonce': request.form['nonce']  # Securely generated nonce from the client
    })
    # Check if the transaction was successful
    if result.is_success == False: # or not result.transaction:
        return jsonify({"message": "Transaction failed!"}), 400 # Shows a message about a problem on the server side
    return jsonify({"message": "Transaction successfully completed!"}), 200


# Route to fetch the authorization token for the client-side JavaScript
@app.route("/get-authorization")
def get_authorization():
    # Return the `AUTHORIZATION` environment variable as JSON
    return jsonify({"authorization": os.getenv("BT_AUTHORIZATION")})