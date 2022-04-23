//Book Class: Represents a Book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
//UI Class: Handle UI Tasks
class UI{
    static displayBooks(){
        // const StoredBooks = [
        //     //add database connection
        // ];
        const books = Store.getBooks();//StoredBooks;

        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href = "#" class = "btn btn-danger btn-sm
        delete">X</a></td>
        `;

        list.appendChild(row);
    }
    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearField(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}
//Store Class: Handles Storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) =>{
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}
//Event: Desplay Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event:Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent actual submit
    e.preventDefault();
    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate
    if(title ==='' || author === '' || isbn ===''){
        UI.showAlert('Please provide all informations', 'danger');
    }else{
        //instatiate book
        const book = new Book(title, author, isbn);
        UI.addBookToList(book);

        //add book to store
        Store.addBook(book);
        //show success
        UI.showAlert('Book Added', 'success');
        //clear field
        UI.clearField();
    }
    

});
//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) =>{
    //remove book from UI
    UI.deleteBook(e.target);

    //remove book from the store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show success
    UI.showAlert('Book Removed', 'success');
})