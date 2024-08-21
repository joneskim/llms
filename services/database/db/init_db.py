# services/database/db/init_db.py

import sqlite3

def init_db():
    connection = sqlite3.connect('data/database.db')
    cursor = connection.cursor()

    # Create a table example
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL
    )
    ''')

    connection.commit()
    connection.close()

if __name__ == "__main__":
    init_db()
