#!/usr/bin/env python3

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import libsql_experimental as libsql
import spidev
from dotenv import load_dotenv
import os

load_dotenv()

LOCATION_ID = int(os.getenv("LOCATION_ID"))
DB_NAME: str = os.getenv("TURSO_DATABASE_URL", "library.db")
DB_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN", None)
print(f"DB_NAME={DB_NAME} | DB_AUTH_TOKEN={DB_AUTH_TOKEN} | LOCATION_ID={LOCATION_ID}")


def main():
    spi = spidev.SpiDev()
    spi.open(1, 0)  # Parametri (bus, device)

    reader = SimpleMFRC522()
    try:
        reader.READER.Write_MFRC522(0x26, 127)
        while True:
            rfid_id, _ = reader.read()

            update_book(rfid_id, LOCATION_ID)

    except KeyboardInterrupt:
        os.exit(1)

    finally:
        GPIO.cleanup()


def db_exec(*args):
    global DB_NAME
    global DB_AUTH_TOKEN
    conn = libsql.connect(database=DB_NAME, auth_token=DB_AUTH_TOKEN)
    res = conn.execute(*args)
    conn.commit()
    return res


def update_book(rfid_id: int, location_id: int):
    print(f"Updating rfid_id={rfid_id} to location={location_id}")
    db_exec(
        "UPDATE books set location_id=?, book_status='available' where rfid_id=?",
        (location_id, rfid_id),
    )


if __name__ == "__main__":
    main()
