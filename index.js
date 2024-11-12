class Book {
  constructor(title, author, isbn) {
    (this.title = title), (this.author = author), (this.isbn = isbn);
  }
}

class UI {
  static displayBooks() {
    const storedBooks = Store.getBooks();

    storedBooks.forEach((book) => UI.addBooksToList(book));
  }

  static addBooksToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title} </td>
       <td>${book.author} </td>
          <td>${book.isbn} </td>
          <td><a href="#" class="btn btn-danger btn-sm delete"/>X </td></td>
    `;
    list.appendChild(row);
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const form = document.querySelector("#book-form");
    const container = document.querySelector(".container");
    container.insertBefore(div, form);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 1000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book); //send to UI
    localStorage.setItem("books", JSON.stringify(books)); // send to localStorage
  }

  static removeBook(isbn) {
    const storedBooks = Store.getBooks();
    storedBooks.forEach((books, index) => {
      if (books.isbn === isbn) {
        storedBooks.splice(index, 1);
      }
    });
    localStorage.removeItem("books", JSON.stringify(storedBooks));
  }
}

document.addEventListener("DOMContentLoaded", UI.displayBooks);
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Add all fields", "danger");
  } else {
    const book = new Book(title, author, isbn);
    UI.addBooksToList(book);

    Store.addBook(book);

    UI.showAlert("Success!", "success");
    UI.clearFields();
  }
});

document.querySelector("table").addEventListener("click", (event) => {
  const deleteButton = event.target.closest("a");

  if (deleteButton.tagName !== "A") {
    return;
  } else {
    Store.removeBook(
      event.target.parentElement.previousElementSibling.textContent
    );
    event.target.closest("tr").remove();
    UI.showAlert("Book deleted", "danger");
  }
});
