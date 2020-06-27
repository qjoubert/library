"use strict";

let library = [
  {
    title: "The Power of Now",
    author: "Eckhart Tolle",
    pages: 236,
    read: true
  },
  {
    title: "The Four Agreements",
    author: "Don Miguel Ruiz",
    pages: 160,
    read: true
  },
  {
    title: "Eloquent Javascript",
    author: "Marijn Haverbeke",
    pages: 472,
    read: true
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    pages: 464,
    read: false
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    pages: 352,
    read: false
  }
];

if (!getLibrary() || getLibrary().length === 0) {
  setLibrary(library);
}

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(book) {
  const library = getLibrary();
  library.push(book);
  setLibrary(library);
}

function append(parent, ...args) {
  const children = args;
  children.forEach(child => {
    parent.appendChild(child);
  })
}

function create(elmt, attributes = null) {
  const el = document.createElement(elmt);
  if (attributes) {
    for (const key in attributes) {
      el.setAttribute(key, attributes[key]);
    }
  }
  return el;
}

function createBookCard(book) {
  const card = create("article", {
    class: "card"
  });
  const title = create("h2");
  const author = create("p");
  const pages = create("p");
  const read = create("p");
  const deleteBtn = create("button");
  const readBtn = create("button");

  title.textContent = book.title;
  author.textContent = `by ${book.author}`;
  pages.textContent = `pages: ${book.pages}`;
  read.textContent = book.read ? "read: yes" : "read: not yet";
  readBtn.textContent = book.read ? "not read yet" : "mark as read";
  deleteBtn.textContent = "remove";

  listen(readBtn, "click", toggleReadStatus);
  listen(deleteBtn, "click", deleteBook);
  append(card, title, author, pages, read, readBtn, deleteBtn);
  
  return card;
}

function createNewBookForm() {
  const form = create("form", {
    action: "#",
    id: "new-book-form"
  });
  const titleInput = create("input", {
    id: "title-input",
    placeholder: "title",
    type: "text"
  });
  const authorInput = create("input", {
    id: "author-input",
    placeholder: "author",
    type: "text"
  });
  const pagesInput = create("input", {
    id: "pages-input",
    placeholder: "pages",
    type: "number"
  });
  const readLabel = create("label", {
    for: "read"
  });
  const readRadio = create("input", {
    id: "read",
    name: "read-status",
    type: "radio",
    value: 1
  });
  const notReadLabel = create("label", {
    for: "not-read"
  });
  const notReadRadio = create("input", {
    checked: true,
    id: "not-read",
    name: "read-status",
    type: "radio",
    value: 0
  });
  const submitBtn = create("button", {
    id: "submit-btn",
  })

  readLabel.textContent = "read";
  notReadLabel.textContent = "not read yet";
  submitBtn.textContent = "Add book to library";
  listen(submitBtn, "click", onSubmitNewBook);
  append(form, titleInput, authorInput, pagesInput, readLabel, readRadio, notReadLabel, notReadRadio, submitBtn);
  return form;
}

function deleteBook(e) {
  const bookIndex = e.target.parentNode.dataset.index;
  const library = getLibrary()
  library.splice(bookIndex, 1);
  setLibrary(library);
  render();
}

function getLibrary() {
  return JSON.parse(sessionStorage.getItem("library"));
}

function listen(elmt, event, action) {
  elmt.addEventListener(event, (e) => {
    action(e);
  });
}

function onSubmitNewBook(e) {
  e.preventDefault();
  const title = document.getElementById("title-input").value;
  const author = document.getElementById("author-input").value;
  const pages = document.getElementById("pages-input").value;
  const read = document.getElementById("read").checked ? true : false;

  const book = new Book(title, author, pages, read);
  addBookToLibrary(book);
  render();
}

function render() {
  const libraryContainer = document.getElementById("library-container");
  const library = getLibrary();

  libraryContainer.innerHTML = "";
  library.forEach((book, index) => {
    const bookCard = createBookCard(book);
    bookCard.setAttribute("data-index", index);
    libraryContainer.appendChild(bookCard);
  });
}

function setLibrary(library) {
  sessionStorage.setItem("library", JSON.stringify(library));
}

function toggleReadStatus(e) {
  const bookIndex = e.target.parentNode.dataset.index;
  const library = getLibrary();
  const hasReadBook = library[bookIndex].read;
  library[bookIndex].read = hasReadBook ? false : true;
  setLibrary(library);
  render();
}

render();

const newBookBtn = document.getElementById("new-book-btn");

newBookBtn.addEventListener("click", () => {
  if (document.getElementById("new-book-form")) {
    return;
  };
  const formContainer = document.getElementById("form-container");
  const form = createNewBookForm();
  append(formContainer, form);
  formContainer.insertBefore(form, newBookBtn);
})
