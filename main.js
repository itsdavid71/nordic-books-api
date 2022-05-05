function init() {

    const apiUrl = 'https://nordic-books-api.herokuapp.com';
    const allBooksField = document.querySelector('.all_books');
    const addForm = document.getElementById('addBook');
    const editFormField = document.getElementById('editFormField');
    const editForm = document.getElementById('editForm');
    const sortButtons = document.querySelector('.sort_buttons');

    // UserID Books
    const userBooks = document.getElementById('userBooks');
    


    function addBook(el) {
        const bookItem = document.createElement('div');
        bookItem.className = 'book_item';
        
        const bookName = document.createElement('p');
        bookName.className = 'book_title';
        bookName.innerHTML = el.title;
        bookItem.append(bookName);

        const bookImg = document.createElement('img');
        bookImg.className = 'book_img';
        bookImg.src = el.imageUrl;
        bookItem.append(bookImg);

        const bookAuthor = document.createElement('p');
        bookAuthor.className = 'book_author';
        bookAuthor.innerHTML = el.author;
        bookItem.append(bookAuthor);

        if (el.userId != undefined) {
            const bookUser = document.createElement('p');
            bookUser.className = 'book_user';
            bookUser.innerHTML = `Пользователь: ${el.userId}`;
            bookItem.append(bookUser);
        }

        const bookDelete = document.createElement('button');
        bookDelete.className = 'book_delete';
        bookDelete.innerText = 'Удалить';
        bookDelete.dataset.bookId = el._id;
        bookItem.append(bookDelete);

        const bookEdit = document.createElement('button');
        bookEdit.className = 'book_edit';
        bookEdit.innerText = 'Редактировать';
        bookEdit.dataset.bookId = el._id;
        bookItem.append(bookEdit);
        
        allBooksField.append(bookItem);
    }

    function getBookAll() {
        allBooksField.innerHTML = '';
        fetch(`${apiUrl}/books`)
        .then(response => response.json())
        .then(response => {
            for (let i = 0; i < response.length; i++) {
                addBook(response[i]);
            }
        });
    }

    

    async function getBook(id) {
        return fetch(`${apiUrl}/books/${id}`);
    }

    getBookAll();

    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = addForm.title.value;
        const author = addForm.author.value;
        const userId = addForm.userId.value;

        const formData = new FormData()
        formData.append('author', author)
        formData.append('title', title)
        formData.append('cover', cover.files[0])

        fetch(`${apiUrl}/books`, {
          method: 'POST',
          headers: {'user-id': userId},
          body: formData,
        })
        .then((res) => res.json())
        .then((response) => {
            let bookId = response.insertedId;
            getBook(bookId)
            .then(response => response.json())
            .then(response => {
                addBook(response);
            });
            addForm.reset();
        })

    });

    // Delete
    allBooksField.addEventListener('click', (e) => { 
        if (!e.target.classList.contains('book_delete')) return;
        const bookId = e.target.dataset.bookId;

        fetch(`${apiUrl}/books/${bookId}`, {
            method: 'DELETE',
        })
        .then(() => {
            e.target.parentElement.remove();
        });
    });

    // Edit
    allBooksField.addEventListener('click', (e) => { 
        if (!e.target.classList.contains('book_edit')) return;

        editFormField.style.display = 'flex';
        const bookId = e.target.dataset.bookId;

        const currentItem = e.target.parentElement;
        const currentTitle = currentItem.querySelector('.book_title');
        const currentAuthor = currentItem.querySelector('.book_author');

        fetch(`${apiUrl}/books/${bookId}`)
        .then(response => response.json())
        .then(data => {
            editForm.id.value = data._id;
            editForm.author.value = data.author;
            editForm.title.value = data.title;
        });

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const bookId = editForm.id.value;
            const title = editForm.title.value;
            const author = editForm.author.value;

            const formData = new FormData()
            formData.append('author', author)
            formData.append('title', title)
            formData.append('cover', cover.files[0])

            fetch(`${apiUrl}/books/${bookId}`, {
                method: 'PUT',
                body: formData,
            })
            .then((res) => res.json())
            .then((response) => {
                currentTitle.innerText = title;
                currentAuthor.innerText = author;
                hidePopup();
            })
    });


    });

    editFormField.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-popup')) hidePopup();
        if (!e.target.classList.contains('popup_cancel')) return;
        hidePopup();

    })

    function hidePopup() {
        editForm.reset();
        editFormField.style.display = 'none';
    }


    // User ID
    userBooks.addEventListener('submit', (e) => {
        allBooksField.innerHTML = '';
        e.preventDefault();
        const user = userBooks.userId.value;
        fetch(`${apiUrl}/books`, {
            headers: {'user-id': user},
        })
        .then(response => response.json())
        .then(response => {
            for (let i = 0; i < response.length; i++) {
                addBook(response[i]);
            }
        });
    });

    // Sort

    // sortButtons.addEventListener('click', (e) => {
    //     if (!e.target.classList.contains('sort_button')) return;
    //     const sortBy = e.target.dataset.sort;
    //     getBookAll(sortBy);
    //     const arrayBook = [];
    //     for(let i = 0; i < allBooksField.childNodes.length; i++) {
    //         arrayBook[i] = allBooksField.childNodes[i];
    //     }
    //     console.log(arrayBook);
        
    // });




    
    
}

window.onload = init;