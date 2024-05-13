import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import spidev

# Inicijalizacija spidev
spi = spidev.SpiDev()
spi.open(0, 0)  # Parametri (bus, device)

reader = SimpleMFRC522()

# Postavljanje dometa na maksimalnu vrijednost (48 dB)
#1.metoda
def transfer_spi(data):
    return spi.xfer2(data)

def read_register(register):
    address = (register << 1) | 0x80
    response = transfer_spi([address, 0x00])
    return response[1]

def write_register(register, value):
    address = (register << 1) & 0x7E
    transfer_spi([address, value])

def set_receiver_gain(gain):
    current_value = read_register(0x26)  # 26h je adresa od RFCfgReg
    print("Current value of RFCfgReg before modification:", bin(current_value))

    # Clear bits 6 to 4
    current_value &= ~(0b111 << 4)

    # Set the desired gain value
    current_value |= (gain << 4) & 0b1110000 #samo 6-4 bitovi moraju biti modificirani
    print("Desired value of RFCfgReg after modification:", bin(current_value))
    # Write the updated value back to RFCfgReg
    write_register(0x26, current_value)

    new_value = read_register(0x26)
    print("New value of RFCfgReg after modification:", bin(new_value))

#2. metoda
def set_receiver_gain_to_maximum():
    # Set RxGain[2:0] bits to maximum value (111) for 48 dB gain
    write_register(0x26, (0x07 << 4))

''' probat umjesto 0x07 napisati 0x70'''

#3. metoda
class PCD_RxGain:
    RxGain_18dB = 0b000
    RxGain_23dB = 0b001
    RxGain_33dB = 0b100
    RxGain_38dB = 0b101
    RxGain_43dB = 0b110
    RxGain_48dB = 0b111

'''def PCD_GetAntennaGain():
    return read_register(0x26) & 0b111ž'''

def PCD_GetAntennaGain():
    return (read_register(0x26) >> 4) & 0b111 

def PCD_SetAntennaGain(gain):
    current_value = read_register(0x26)  # 0x26 is the address of RFCfgReg
    current_value &= ~(0b111 << 4)  # Clear RxGain[2:0] bits
    current_value |= (gain << 4) & 0b1110000  # Set RxGain[2:0] bits to the desired value
    write_register(0x26, current_value)  # Write the updated value back to RFCfgReg

#def PCD_AntennaOff():
    # Disable pins TX1 and TX2
    # You need to implement this function based on your hardware setup
   
try:
    while True:
        # Method 1: Set receiver gain directly
        set_receiver_gain(0b111)  # Set to maximum gain
        current_gain = PCD_GetAntennaGain()
        print("Current receiver gain (Method 1):", current_gain)

        # Method 2: Set receiver gain to maximum
        set_receiver_gain_to_maximum()
        current_gain = PCD_GetAntennaGain()
        print("Current receiver gain (Method 2):", current_gain)

        # Method 3: Set receiver gain using PCD-related methods
        PCD_SetAntennaGain(PCD_RxGain.RxGain_48dB)  # Set to maximum gain
        current_gain = PCD_GetAntennaGain()
        print("Current receiver gain (Method 3):", current_gain)

        rfid_id, _ = reader.read()
        print('RFID tag ID:', rfid_id)

except  KeyboardInterrupt:
    pass

finally:
    GPIO.cleanup()
