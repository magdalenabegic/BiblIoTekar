import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import libsql_experimental as libsql
import spidev
import time
import customtkinter
import tkinter as tk
from dotenv import load_dotenv
from tkinter import simpledialog
import os

load_dotenv()

# Tkinter system settings
customtkinter.set_appearance_mode('Dark')
customtkinter.set_default_color_theme('blue')

# Initialize spidev
spi = spidev.SpiDev()
spi.open(0, 0)  # Parameters (bus, device)
spi.max_speed_hz = 50000

reader = SimpleMFRC522()

# Connect to the database
DB_NAME = os.getenv("TURSO_DATABASE_URL", 'library.db')
DB_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN", None)
print(f"DB_NAME={DB_NAME} | DB_AUTH_TOKEN={DB_AUTH_TOKEN}")
rfid_id = None  # Global variable

def db_exec(*args):
    conn = libsql.connect(database=DB_NAME, auth_token=DB_AUTH_TOKEN)
    res = conn.execute(*args)
    conn.commit()
    return res

def add_book():
    global rfid_id  # Use global variable

    # Tkinter dialog for data entry
    autor = simpledialog.askstring('Unos nove knjige', 'Autor:')
    naslov = simpledialog.askstring('Unos nove knjige', 'Naslov:')
    godina = simpledialog.askstring('Unos nove knjige', 'Godina izdanja:')

    # Insert information into the database
    db_exec('INSERT INTO books (rfid_id, autor, naslov, godina) VALUES (?, ?, ?, ?)',
                   (rfid_id, autor, naslov, godina))

    print('Informacije o knjizi prije unosa u bazu:')
    print('Autor:', autor)
    print('Naslov:', naslov)
    print('Godina izdanja:', godina)

def get_book_data(rfid_id):
    result = db_exec('SELECT * FROM books WHERE rfid_id=?', (rfid_id,)).fetchone()
    if result:
        return {'autor': result[1], 'naslov': result[2], 'godina': result[3], 'rfid_id': result[4]}
    else:
        return {}  # Return empty dictionary if the book is not found    

# Tkinter UI: app frame
app = customtkinter.CTk()
app.geometry('720x480')
app.title('My library')

# Label for displaying book information
label_info = tk.Label(app, text='Informacije o knjizi:')
label_info.pack(pady=10)

# Frame for displaying book data
info_frame = tk.Frame(app)
info_frame.pack()

# Entry fields for displaying book data
author_var = tk.StringVar()
title_var = tk.StringVar()
year_var = tk.StringVar()

# Labels for authors, titles, and publication years
label_author = tk.Label(info_frame, text='Autor: ')
label_author.pack()

label_title = tk.Label(info_frame, text='Naslov: ')
label_title.pack()

label_year = tk.Label(info_frame, text='Godina izdanja: ')
label_year.pack()

def write_register(address, value):
    spi.xfer2([address, value])

try:
    # Increase RFID antenna power by modifying registers
    write_register(0x28, 0x1F)  # CWGsPReg: Set all bits to increase conductance
    write_register(0x27, 0x70)  # GsNReg: Set higher conductance for TX1 and TX2
    write_register(0x26, 0x7F)  # RFCfgReg: Set receiver gain to maximum (127)

    db_exec("""
CREATE TABLE IF NOT EXISTS books (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	autor TEXT,
	naslov TEXT,
	godina INTEGER,
    rfid_id INTEGER
);
""")
    while True:
        app.update_idletasks()
        app.update()
        
        # Wait for a tag to be placed
        rfid_id, _ = reader.read()
        label_info.configure(text='Pročitana RFID oznaka: {}'.format(rfid_id))

        # Fetch data from the database
        book_data = get_book_data(rfid_id)

        # Check if all data is unknown
        all_unknown = all(value is None for value in book_data.values())

        # If the book is not found, ask the user to enter data
        if all_unknown:
            print('Knjiga nije pronađena u bazi. Dodajte novu knjigu.')
            add_book()
            print('Podatci o knjizi su dodani na RFID oznaku.')

        # Update labels with book data
        label_author.config(text='Autor: {}'.format(book_data.get('autor', 'Nepoznat')))
        label_title.config(text='Naslov: {}'.format(book_data.get('naslov', 'Nepoznat')))
        label_year.config(text='Godina izdanja: {}'.format(book_data.get('godina', 'Nepoznata')))

        time.sleep(1)

except KeyboardInterrupt:
    os._exit(1)

finally:
    GPIO.cleanup()
    app.destroy()
