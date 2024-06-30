# Smart library project

![image](https://github.com/magdalenabegic/BiblIoTekar/assets/98237744/b2833b3b-6d82-4cb5-a0ba-5b20e6bbf290)
![image](https://github.com/magdalenabegic/BiblIoTekar/assets/98237744/1c32eef7-ecf5-4c54-b4b7-53576845a0e4)
![image](https://github.com/magdalenabegic/BiblIoTekar/assets/98237744/e2b170fc-d2e1-4b33-84b5-83d88c05554a)


The idea for this project emerged from my experiences during the first two years of my studies when I worked in a library. 

This project is part of the final assignment for IoT (Internet of Things) program at VERN' University. While it's not yet complete, I've chosen to keep this repository visible on my profile to provide transparency about the ongoing work.
 
 ## Table of Contents
- [Smart library project](#smart-library-project)
  - [Table of Contents](#table-of-contents)
  - [Project Description](#project-description)
  - [Installation](#installation)
  - [Used Equipment](#used-equipment)


## Project Description

Libraries play one of the most crucial roles in educational institutions, and there should be a continuous effort towards their modernization. The term "smart" implies more efficient, flexible, and organized solutions with the integration of digital processes.

The goal of this project is to develop an intelligent library system using RFID technology and a Raspberry Pi computer. The system will feature a software/admin interface for librarians to manage and monitor the library's book inventory. The library will consist of a shelf, box and table for the presentation/prototype. Each one of them will have a connected RFID module and Raspberry Pi. Every Pi will have the same python script, only LOCATION_ID inside the .env file will be different.

Instead of relying on traditional bookshelf organization, the RFID technology will enable precise tracking of each book's location on the shelves. Librarians will be able to view the current books on each shelf in real-time through the software interface. Additionally, the system will generate comprehensive reports and analytics, including charts, to provide insights into book usage patterns.

By leveraging RFID technology and IoT (Internet of Things), librarians can gain valuable insights into the library's operations. They can identify which shelves are most frequently accessed, track book circulation trends, and analyze which books are underutilized. This data-driven approach enhances the overall efficiency and organization of the library, allowing librarians to make informed decisions to optimize the library's resources and improve the user experience.

## Installation

1. Clone the repository:
   git clone https://github.com/magdalenabegic/rfid-bookshelf-system.git
2. Navigate to the project directory:
    cd your-project
3. Install dependencies:
    mfrc522
    dotenv
    spidev
    cmake
    Rust
    libsql-experimental
4. The main python script is currently proba-fixed.py
5. web application is located in smart-library directory, for its installation and other details please look at its README file
6. For communication with Raspberry Pis I used SSH
7. Example of .env file:  
    TURSO_URL=https://example.turso.com  
    TURSO_TOKEN=your_token_here  
    LOCATION_ID=3  


## Used Equipment

- Raspberry Pi 4
- RFID reader MFRC-522, 13.56MHz + RFID stickers (tags) for books
- Protoboard, red and black pvc isolated cables (or breadboard and jump wires)
