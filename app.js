// books :
class Book {
  constructor(title, author, isbn) {
    this.title = title,
      this.author = author,
      this.isbn = isbn
  }
}


// ui class :
class ui {
  static displaybooks() {
    const books = store.getbooks();
    books.forEach(book => ui.addbook(book));
  }

  static addbook(book) {
    if (document.querySelector("thead").style.display === "none") {
      document.querySelector("thead").style.display = "";
    }
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `<td>${book.title}</td><td>${book.author}</td><td>${book.isbn}</td><td><a href="#" class="btn btn-outline-warning update">Update</a></td><td><a href="#" class="btn btn-danger delete">Remove</a></td>`
    list.appendChild(row);
  }

  static deletebook(ele) {
    if (ele.classList.contains('delete')) {
      if (confirm("Are You Sure you want to delete this book")) {
        ele.parentElement.parentElement.remove();
        ui.showalerts("book deleted succesfully", "success");
      }
    }

    (() => {
      if (document.querySelector("#book-list").childElementCount === 0) {
        document.querySelector("thead").style.display = "none";
      }
    })();

  }

  static updatebook(isbn) {
    if (confirm("Are You Sure you want to update this book")) {
      const books = store.getbooks();
      books.forEach((book, i) => {
        if (book.isbn === isbn) {

          const title = document.querySelector("#title");
          const author = document.querySelector("#author");
          const isbn = document.querySelector("#isbn");

          title.value = book.title;
          author.value = book.author;
          isbn.value = book.isbn;

          isbn.setAttribute("disabled", true);
          document.querySelector("#Abtn").setAttribute("style", "display:none;");
          document.querySelector("#Ubtn").setAttribute("style", "display:block;");

          document.querySelector("#Ubtn").addEventListener("click", (e) => {
            e.preventDefault();
            if (title.value === "" || author.value === "") {
              ui.showalerts("fillup all the fields", "danger")
            } else {

              (() => {
                for (let i = 0; i < document.getElementById("mytable").rows.length; i++) {
                  if (document.getElementById("mytable").rows[i].cells[2].innerText === isbn.value) {
                    document.getElementById("mytable").rows[i].cells[2].previousElementSibling.previousElementSibling.innerText = title.value;
                    document.getElementById("mytable").rows[i].cells[2].previousElementSibling.innerText = author.value;

                    book.title = title.value;
                    book.author = author.value;

                    isbn.removeAttribute("disabled");
                    localStorage.setItem("books", JSON.stringify(books));
                    document.querySelector("#Abtn").setAttribute("style", "display:block;");
                    document.querySelector("#Ubtn").setAttribute("style", "display:none;");
                    ui.showalerts("book updated succesfully", "success");
                  }
                }
              })();
              ui.clearfield();
            }
          });
        }
      });
    }
  }

  static clearfield() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static showalerts(message, classname) {
    const div = document.createElement("div");
    div.className = `alert alert-${classname}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }
}

// storage class :
class store {
  static getbooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addbooks(book) {
    const books = store.getbooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removebooks(isbn) {
    const books = store.getbooks();
    books.forEach((book, i) => {
      if (book.isbn === isbn) {
        books.splice(i, 1);
      }
    })
    localStorage.setItem("books", JSON.stringify(books));
  }

  static updatebook() {

  }
}

// event : display books :
document.addEventListener("DOMContentLoaded", ui.displaybooks);

// event : add book :
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // get form values :
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  if (title === "" || author === "" || isbn === "") {
    ui.showalerts("fillup all the fields", "danger");
  } else {
    const book = new Book(title, author, isbn);
    store.addbooks(book);
    ui.addbook(book);
    ui.clearfield();
    ui.showalerts("succesfully added", "success");
  }
});

// event : remove a book :
document.querySelector("#book-list").addEventListener("click", (e) => {
  ui.deletebook(e.target);
  store.removebooks(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
});

// event : update a book :
document.querySelector("#book-list").addEventListener("click", (e) => {
  ui.updatebook(e.target.parentElement.previousElementSibling.textContent);
})
