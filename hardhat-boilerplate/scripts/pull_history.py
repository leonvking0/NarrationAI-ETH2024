import sqlite3
from sqlite3 import Error
from dataclasses import dataclass
from web3 import Web3
import json
import os
import sys
import time

@dataclass
class Chat:
    chat_id: int
    query: str
    response: str

DATABASE = "chats.db"

def create_connection(db_file):
    """ Create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(f"Connected to SQLite database: {db_file}")
    except Error as e:
        print(e)
    return conn

def create_table(conn):
    """ Create a table in the SQLite database """
    try:
        sql_create_users_table = """
        CREATE TABLE IF NOT EXISTS chats (
            chatid INTEGER PRIMARY KEY,
            query TEXT NOT NULL,
            response TEXT NOT NULL
        );
        """
        cursor = conn.cursor()
        cursor.execute(sql_create_users_table)
        print("Users table created successfully")
    except Error as e:
        print(e)

def query_chat_id_set(conn):
    result = set()
    sql_query_table = """
            SELECT * FROM chats;
            """
    cursor = conn.cursor()
    cursor.execute(sql_query_table)
    row = cursor.fetchone()
    while row:
        result.add(int(row[0]))
        row = cursor.fetchone()
    return result

def insert_chat(conn, chat):
    """ Insert a new user into the users table """
    sql_insert_user = """
    INSERT INTO chats (chatid, query, response)
    VALUES (?, ?, ?);
    """
    cursor = conn.cursor()
    cursor.execute(sql_insert_user, chat)
    conn.commit()
    print(f"Chat {chat[0]} added successfully")


def create_and_save_table(chats):
    database = DATABASE
    # Create a database connection
    conn = create_connection(database)

    # Create a table
    if conn is not None:
        create_table(conn)
    else:
        print("Error! Cannot create the database connection.")

    for chat in chats:
        insert_chat(conn, chat)

    # Close the connection
    if conn:
        conn.close()
        print("Connection closed")





def extract_full_chat_history(skip_chatid_set=set()):
    # Connect to the Ethereum node
    galadriel_url = "https://devnet.galadriel.com"
    web3 = Web3(Web3.HTTPProvider(galadriel_url))

    # Check if connection is successful
    if web3.is_connected():
        print("Connected to Ethereum node")
    else:
        print("Failed to connect to Ethereum node")
    contract_address_file = "../frontend/src/contracts/chat-contract-address.json"
    contract_abi_file = "../frontend/src/contracts/ChatSingle.json"
    with open(contract_address_file, "r") as f:
        temp = json.load(f)
        contract_address = temp["ChatSingle"]
    with open(contract_abi_file, "r") as f:
        temp = json.load(f)
        contract_abi = temp["abi"]

    # Create contract instance
    contract = web3.eth.contract(address=contract_address, abi=contract_abi)
    result = []
    chat_id = 0
    while True:
        # Call the view function
        try:
            if chat_id in skip_chatid_set:
                chat_id += 1
                continue
            value = contract.functions.getMessageHistoryContents(chat_id).call()
            if len(value) < 1:
                break
            if len(value) < 2:
                chat_id += 1
                continue
            result.append((chat_id, value[0], value[1]))
            chat_id += 1
            print(f"The value returned by the contract is: {value}")
        except Exception as e:
            print(f"An error occurred: {e}")
            break
    return result

def listen_to_event():
    galadriel_url = "https://devnet.galadriel.com"
    web3 = Web3(Web3.HTTPProvider(galadriel_url))

    # Check if connection is successful
    if web3.is_connected():
        print("Connected to Ethereum node")
    else:
        print("Failed to connect to Ethereum node")
    contract_address_file = "../frontend/src/contracts/chat-contract-address.json"
    contract_abi_file = "../frontend/src/contracts/ChatSingle.json"
    with open(contract_address_file, "r") as f:
        temp = json.load(f)
        contract_address = temp["ChatSingle"]
    with open(contract_abi_file, "r") as f:
        temp = json.load(f)
        contract_abi = temp["abi"]

    # Create contract instance
    contract = web3.eth.contract(address=contract_address, abi=contract_abi)


if __name__ == '__main__':
    if not os.path.exists(DATABASE):
        chats = extract_full_chat_history()
        create_and_save_table(chats)

    database = DATABASE
    # Create a database connection
    conn = create_connection(database)
    chatid_set = query_chat_id_set(conn)
    print(f"read chaid from db: {chatid_set}")
    while True:
        try:
            chats = extract_full_chat_history(chatid_set)
            if len(chats) > 0:
                print(f"received {len(chats)} new chats, preparing to write to db")
            for chat in chats:
                insert_chat(conn, chat)
                chatid_set.add(chat[0])
                print(f"wrote {chat[0]} to db")
            time.sleep(10)
        except KeyboardInterrupt:
            conn.close()
            print("Connection closed")
            sys.exit(0)
