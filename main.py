#This is a hypothetical example.
class RFIDReader:
    def read_tag(self):
        # In a real scenario, this method would interact with the RFID reader.
        # The actual implementation depends on the RFID reader and SDK.
        # For simplicity, let's assume it returns a hardcoded RFID tag for testing.
        return "RFID123"

class Book:
    def __init__(self, title, author, rfid_tag):
        self.title = title
        self.author = author
        self.rfid_tag = rfid_tag

class Bookshelf:
    def __init__(self):
        self.books_on_shelf = []

    def add_book(self, book):
        self.books_on_shelf.append(book)
        print(f"Book '{book.title}' added to the shelf.")

    def remove_book(self, rfid_tag):
        for book in self.books_on_shelf:
            if book.rfid_tag == rfid_tag:
                self.books_on_shelf.remove(book)
                print(f"Book '{book.title}' removed from the shelf.")
                break
        else:
            print("Book not found on the shelf.")

if __name__ == "__main__":
    rfid_reader = RFIDReader()
    bookshelf = Bookshelf()

    #The while True loop simulates an ongoing process where books are scanned and added to the shelf. The user can choose to remove a book by typing 'yes' when prompted.
    while True:
        user_input = input("Scan a book or type 'exit' to quit: ")
        
        if user_input.lower() == 'exit':
            break

        rfid_tag_in_hand = rfid_reader.read_tag()
        new_book = Book("New Book", "New Author", rfid_tag_in_hand)
        bookshelf.add_book(new_book)

        user_input = input("Remove the book? (yes/no): ")
        if user_input.lower() == 'yes':
            bookshelf.remove_book(rfid_tag_in_hand)
