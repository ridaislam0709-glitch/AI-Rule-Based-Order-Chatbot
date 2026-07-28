# ==========================================================
# AI RULE BASED CHATBOT PROJECT 1
# Backend Using Flask + Pandas
# ==========================================================

from flask import Flask, render_template, request, jsonify
import pandas as pd
import os
# ==========================================================
# Flask Application
# ==========================================================

app = Flask(__name__)

# ==========================================================
# Dataset Path
# ==========================================================

DATASET_PATH = "data/orders.xlsx"

# ==========================================================
# Global Dataset Variable
# ==========================================================

orders = pd.DataFrame()

# ==========================================================
# Required Columns
# ==========================================================

REQUIRED_COLUMNS = [
    "OrderID",
    "Date",
    "CustomerID",
    "Product",
    "Quantity",
    "UnitPrice",
    "ShippingAddress",
    "PaymentMethod",
    "OrderStatus",
    "TrackingNumber",
    "ItemsInCart",
    "CouponCode",
    "ReferralSource",
    "TotalPrice"
]

# ==========================================================
# Load Dataset Function
# ==========================================================

def load_dataset():

    global orders

    if not os.path.exists(DATASET_PATH):

        print("❌ Dataset file not found.")
        return False

    try:

        orders = pd.read_excel(DATASET_PATH)

        # Remove spaces from column names
        orders.columns = orders.columns.str.strip()

        # Check Required Columns
        missing = []

        for column in REQUIRED_COLUMNS:

            if column not in orders.columns:
                missing.append(column)

        if len(missing) > 0:

            print("Missing Columns :")

            for col in missing:
                print(col)

            return False

        # Replace Empty Values
        orders = orders.fillna("")

        # Convert All Data Into String
        for column in orders.columns:
            orders[column] = orders[column].astype(str)

        print("===================================")
        print("Dataset Loaded Successfully")
        print("===================================")

        print("Total Records :", len(orders))
        print("Total Columns :", len(orders.columns))

        return True

    except Exception as error:

        print(error)

        return False


# ==========================================================
# Load Dataset
# ==========================================================

load_dataset()

# ==========================================================
# Greeting Commands
# ==========================================================

GREETINGS = [

    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening"

]

# ==========================================================
# Help Commands
# ==========================================================

HELP = [

    "help",
    "menu",
    "commands"

]

# ==========================================================
# Goodbye Commands
# ==========================================================

GOODBYE = [

    "bye",
    "exit",
    "quit",
    "goodbye"

]

# ==========================================================
# Greeting Response
# ==========================================================

def greeting_response():

    return {

        "type": "greeting",

        "reply":

"""👋 Hello!

Welcome to AI Rule Based Chatbot Project 1.

I can help you search your Excel dataset.

You can search using:

✅ Order ID

✅ Customer ID

✅ Product Name

Type HELP to see all available commands."""

    }

# ==========================================================
# Help Response
# ==========================================================

def help_response():

    return {

        "type":"help",

        "reply":

"""Available Commands

1. Search Order ID

Example

ORD200001


2. Search Customer ID

Example

C72649


3. Search Product

Example

Laptop


4. Type HELLO

5. Type BYE"""

    }

# ==========================================================
# Goodbye Response
# ==========================================================

def goodbye_response():

    return {

        "type":"bye",

        "reply":

"""Thank you for using

AI Rule Based Chatbot Project 1.

Have a Nice Day."""

    }

# ==========================================================
# Record Not Found
# ==========================================================

def not_found(value):

    return {

        "type":"notfound",

        "reply":

f"""❌ No record found.

Search Value

{value}

Please check the spelling and try again."""

    }
# ==========================================================
# Search Order By Order ID
# ==========================================================

def search_order(order_id):

    global orders

    result = orders[
        orders["OrderID"].str.upper() == order_id.upper()
    ]

    if result.empty:
        return not_found(order_id)

    row = result.iloc[0]

    return {

        "type": "order",

        "order_id": row["OrderID"],

        "date": row["Date"],

        "customer_id": row["CustomerID"],

        "product": row["Product"],

        "quantity": row["Quantity"],

        "unit_price": row["UnitPrice"],

        "total_price": row["TotalPrice"],

        "status": row["OrderStatus"],

        "tracking": row["TrackingNumber"],

        "payment": row["PaymentMethod"],

        "shipping": row["ShippingAddress"]

    }


# ==========================================================
# Search Customer By Customer ID
# ==========================================================

def search_customer(customer_id):

    global orders

    result = orders[
        orders["CustomerID"].str.upper() == customer_id.upper()
    ]

    if result.empty:
        return not_found(customer_id)

    row = result.iloc[0]

    print(row["TotalPrice"])

    return {

        "type": "customer",

        "customer_id": row["CustomerID"],

        "order_id": row["OrderID"],

        "product": row["Product"],

        "status": row["OrderStatus"],

        "tracking": row["TrackingNumber"],

        "total_price": row["TotalPrice"]

    }


# ==========================================================
# Search Product By Product Name
# ==========================================================

def search_product(product_name):

    global orders

    result = orders[
        orders["Product"]
        .str.lower()
        .str.contains(product_name.lower(), na=False)
    ]

    if result.empty:
        return not_found(product_name)

    row = result.iloc[0]

    return {

        "type": "product",

        "product": row["Product"],

        "price": row["TotalPrice"],

        "quantity": row["Quantity"],

        "status": row["OrderStatus"],

        "tracking": row["TrackingNumber"],

        "payment": row["PaymentMethod"]

    }
# ==========================================================
# Home Page
# ==========================================================

@app.route("/")
def home():

    return render_template("index.html")


# ==========================================================
# Chatbot Search API
# ==========================================================

@app.route("/search", methods=["POST"])
def search():

    data = request.get_json()

    if not data:

        return jsonify({

            "type": "empty",

            "reply": "No input received."

        })

    message = data.get("message", "").strip()

    if message == "":

        return jsonify({

            "type": "empty",

            "reply": "⚠ Please enter Order ID, Customer ID or Product Name."

        })

    lower = message.lower()

    # ==========================================
    # Greetings
    # ==========================================

    if lower in GREETINGS:

        return jsonify(
            greeting_response()
        )

    # ==========================================
    # Help
    # ==========================================

    elif lower in HELP:

        return jsonify(
            help_response()
        )

    # ==========================================
    # Goodbye
    # ==========================================

    elif lower in GOODBYE:

        return jsonify(
            goodbye_response()
        )

    # ==========================================
    # Search Order ID
    # ==========================================

    elif message.upper().startswith("ORD"):

        return jsonify(
            search_order(message)
        )

    # ==========================================
    # Search Customer ID
    # ==========================================

    elif message.upper().startswith("C"):

        return jsonify(
            search_customer(message)
        )

    # ==========================================
    # Search Product
    # ==========================================

    else:

        return jsonify(
            search_product(message)
        )


# ==========================================================
# Run Flask Server
# ==========================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )
 