import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import time
import customtkinter
import tkinter as tk

reader = SimpleMFRC522()

# Tkinter setup
customtkinter.set_appearance_mode('Dark')
customtkinter.set_default_color_theme('blue')
app = customtkinter.CTk()
app.geometry("720x480")
app.title('RFID Reader')

label_info = tk.Label(app, text='Detected RFID Tags:')
label_info.pack(pady=10)

info_frame = tk.Frame(app)
info_frame.pack()

tag_text = tk.Text(info_frame, height=20, width=50)
tag_text.pack()

def write_register(address, value):
    reader.MFRC522_Write(address, value)
    print(f"Written {value:08b} to register {address:02X}")

def read_register(address):
    value = reader.MFRC522_Read(address)
    print(f"Read {value:08b} from register {address:02X}")
    return value
def read_tags():
    detected_tags = set()

    try:
        rfid_id, _ = reader.read_no_block()
        if rfid_id:
            detected_tags.add(rfid_id)
    except Exception as e:
        pass

    tag_text.delete('1.0', tk.END)

    for tag in detected_tags:
        tag_text.insert(tk.END, f'{tag}\n')

    app.after(1000, read_tags)

read_tags()


# Set GsNReg (0x27)
print("Setting GsNReg...")
write_register(0x27, 0xF0)
time.sleep(1)
write_register(0x27, 0xFF)
time.sleep(1)

# Set CWGsPReg (0x28)
print("Setting CWGsPReg...")
write_register(0x28, 0x3F)
time.sleep(1)

# Set AmpRcv in AutoTestReg (0x36)
print("Setting AmpRcv in AutoTestReg...")
current_value = read_register(0x36)
new_value = current_value | 0x40  # Set bit 6 to 1
write_register(0x36, new_value)

# Verify register values
print("\nVerifying register values...")
read_register(0x27)
read_register(0x28)
read_register(0x36)


app.mainloop()

GPIO.cleanup()

"""
# In the Python terminal
from set_registers import read_register

read_register(0x27)  # Verify GsNReg
read_register(0x28)  # Verify CWGsPReg
read_register(0x36)  # Verify AutoTestReg

"""