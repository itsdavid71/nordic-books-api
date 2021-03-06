function init() {
  const apiUrl = "https://nordic-books-api.herokuapp.com";
  const allBooksField = document.querySelector(".all_books");
  const addForm = document.getElementById("addBook");
  const alertsField = document.getElementById("alerts");
  const editFormField = document.getElementById("editFormField");
  const editForm = document.getElementById("editForm");
  const modalActions = editForm.querySelector(".modal-actions");
  const sortButtons = document.querySelector(".sort_buttons");

  // UserID Books
  const userBooks = document.getElementById("userBooks");

  function addComment(el, target) {
    const commentsField = target.parentElement.querySelector(".comments_list");
    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";
    const commentName = document.createElement("p");
    commentName.className = "comment-name";
    const commentText = document.createElement("p");
    commentText.className = "comment-text";
    commentName.innerHTML = el.name;
    commentText.innerHTML = el.text;
    commentItem.append(commentName);
    commentItem.append(commentText);
    commentsField.append(commentItem);
  }

  function addBook(el) {
    const bookItem = document.createElement("div");
    bookItem.className = "book_item col-lg-3 col-md-4 col-sm-6 mb-3";

    const bookContent = document.createElement("div");
    bookContent.className = "book_content card";

    const bookInfo = document.createElement("div");
    bookInfo.className = "book_info";

    const bookImg = document.createElement("img");
    bookImg.className = "book_img card-img-top";

    bookImg.src = el.imageUrl;
    bookImg.onerror = function () {
      bookImg.src = "http://scholamundi.org/images/placeholder.png";
    };

    bookInfo.append(bookImg);

    const bookName = document.createElement("p");
    bookName.className = "book_title";
    let checkBookName = el.title;
    if (checkBookName === "") checkBookName = "Без названия";
    bookName.innerHTML = checkBookName;
    bookInfo.append(bookName);

    const bookAuthor = document.createElement("p");
    bookAuthor.className = "book_author";
    bookAuthor.innerHTML = `Автор: <b>${el.author}</b>`;
    bookInfo.append(bookAuthor);

    const bookUser = document.createElement("p");
    bookUser.className = "book_user";
    if (el.userId != undefined) {
      bookUser.innerHTML = `Пользователь: <b>${el.userId}</b>`;
    } else {
      bookUser.innerHTML = `Пользователь не указан`;
    }

    bookInfo.append(bookUser);
    bookContent.append(bookInfo);

    const bookActions = document.createElement("div");
    bookActions.className = "book_actions";

    const bookEdit = document.createElement("button");
    bookEdit.className = "book_edit btn btn-outline-primary";
    bookEdit.innerText = "Редактировать";
    bookEdit.dataset.bookId = el._id;
    bookActions.append(bookEdit);

    const bookDelete = document.createElement("button");
    bookDelete.className = "book_delete btn btn-danger";
    bookDelete.innerText = "Удалить";
    bookDelete.dataset.bookId = el._id;
    bookActions.append(bookDelete);
    const bookComments = document.createElement("button");
    bookComments.className = "book_comments btn btn-outline-dark";
    bookComments.innerText = "Открыть комментарии";
    bookComments.dataset.bookId = el._id;
    bookActions.append(bookComments);
    bookContent.append(bookActions);

    bookItem.append(bookContent);
    allBooksField.append(bookItem);
  }

  function showLoader(e) {
    const loaderDiv = document.createElement("div");
    loaderDiv.className = "spinner-border";
    loaderDiv.role = "status";
    const loaderContent = document.createElement("span");
    loaderContent.className = "visually-hidden";
    loaderContent.innerText = "Загрузка...";
    e.append(loaderDiv);
  }

  function hideLoader(e) {
    const loaderDiv = e.querySelector(".spinner-border");
    loaderDiv.remove();
  }

  // async function getPages() {
  //   const response = await fetch(`${apiUrl}/books`);
  // }

  function createPagination(totalPages, currentPage) {
    const paginationNav = document.createElement("nav");
    const paginationField = document.createElement("ul");
    paginationField.className = "pag-field pagination justify-content-center";
    for (let i = 1; i < totalPages + 1; i++) {
      const paginationNumLi = document.createElement("li");
      paginationNumLi.className = "pag-num page-item";
      if (i === currentPage + 1) {
        paginationNumLi.classList.add("active");
      }

      const paginationNum = document.createElement("a");
      paginationNum.className = "pag-num page-link";
      paginationNum.innerText = i;
      paginationNum.href = `?page=${i}`;
      paginationNum.dataset.pageNum = i;
      paginationNumLi.append(paginationNum);
      paginationField.append(paginationNumLi);
      paginationNav.append(paginationField);
    }

    allBooksField.append(paginationField);
  }

  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("pag-num")) return;
    e.preventDefault();
    const nextPage = e.target.dataset.pageNum;
    getBookAll(nextPage - 1);
  });

  async function getBookAll(page = 0) {
    allBooksField.innerHTML = "";
    showLoader(allBooksField);
    try {
      const response = await fetch(`${apiUrl}/books?page=${page}`);
      const data = await response.json();
      const totalPages = data.totalPages;
      const currentPage = data.page;
      hideLoader(allBooksField);

      for (let i = 0; i < data.data.length; i++) {
        addBook(data.data[i]);
      }
      createPagination(totalPages, currentPage);
    } catch (error) {
      alert(error);
    }

    // Fetch/Then

    // fetch(`${apiUrl}/books`)
    //   .then((response) => response.json())
    //   .then((response) => {
    //     for (let i = 0; i < response.data.length; i++) {
    //       addBook(response.data[i]);
    //     }
    //   });
  }

  function getBook(id) {
    return fetch(`${apiUrl}/books/${id}`);
  }

  getBookAll();

  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = addForm.title.value;
    const author = addForm.author.value;
    const userId = addForm.userId.value;

    const formData = new FormData();
    formData.append("author", author);
    formData.append("title", title);
    formData.append("cover", cover.files[0]);

    fetch(`${apiUrl}/books`, {
      method: "POST",
      headers: { "user-id": userId },
      body: formData,
    })
      .then((res) => res.json())
      .then((response) => {
        let bookId = response.insertedId;
        getBook(bookId)
          .then((response) => response.json())
          .then((response) => {
            addBook(response);
          });
        addForm.reset();
      });
  });

  function addToast() {
    document.insertAdjacentHTML = `
      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-body">
          Hello, world! This is a toast message.
          <div class="mt-2 pt-2 border-top">
            <button type="button" class="btn btn-primary btn-sm">Take action</button>
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  // Countdown

  function revertDelete(e, id, text, time) {
    const alertItem = document.createElement("div");
    alertItem.className =
      "alert undo-delete alert-light alert-dismissible fade show";

    alertItem.insertAdjacentHTML(
      "beforeend",
      ` <div class="countdown">
          <div class="countdown-number">${time}</div>
          <svg>
            <circle style="animation: countdown ${time}s linear infinite forwards;" r="18" cx="20" cy="20"></circle>
          </svg>
        </div>
        <div class="undo-delete-field">
          <button type="button" class="btn btn-outline-danger undo-delete-button">Отменить удаление</button>
        </div>`
    );

    let alertTime = alertItem.querySelector(".countdown-number");
    let alertDeleteButton = alertItem.querySelector(".undo-delete-button");

    setInterval(function () {
      time = --time <= 0 ? 5 : time;
      alertTime.textContent = time;
    }, 1000);

    let deleteTimer = setTimeout(() => {
      alertItem.remove();

      fetch(`${apiUrl}/books/${id}`, {
        method: "DELETE",
      }).then(() => {
        e.remove();
      });
    }, time * 1000);

    alertDeleteButton.addEventListener("click", () => {
      alertItem.remove();
      e.style.display = "block";
      clearInterval(deleteTimer);
    });
    alertsField.append(alertItem);
  }

  // Delete
  allBooksField.addEventListener("click", (e) => {
    if (!e.target.classList.contains("book_delete")) return;
    const bookId = e.target.dataset.bookId;
    const bookItem = e.target.parentElement.parentElement.parentElement;
    const alertTime = 5;

    console.log(revertDelete(bookItem, bookId, "Книга удалена", alertTime));
    bookItem.style.display = "none";
  });

  // Comments

  allBooksField.addEventListener("click", (e) => {
    if (!e.target.classList.contains("book_comments")) return;
    e.target.classList.toggle("comments_open");
    bookComments(e.target);
  });

  allBooksField.addEventListener("click", (e) => {
    if (!e.target.classList.contains("comment_submit")) return;
    e.preventDefault();

    const addCommentForm = e.target.parentElement;
    const nameComment = addCommentForm.name.value;
    const textComment = addCommentForm.comment.value;
    const bookId = addCommentForm.book_id.value;

    if (nameComment == "" || textComment == "") {
      alert("Заполните все поля");
      return;
    }

    fetch(`${apiUrl}/books/${bookId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameComment,
        text: textComment,
      }),
    }).then(() => {
      const commentsField = addCommentForm.parentElement;
      const commentsList = commentsField.querySelector(".comments_list");
      getComments(bookId, commentsList);
    });
  });

  function createCommentsForm(e, bookId) {
    const commentsForm = document.createElement("form");
    commentsForm.className = "comments-book-form";
    const commentsUser = document.createElement("input");
    commentsUser.className = "form-control";
    commentsUser.placeholder = "Ваше имя";
    commentsUser.name = "name";
    commentsForm.append(commentsUser);

    const commentsBookId = document.createElement("input");
    commentsBookId.name = "book_id";
    commentsBookId.type = "hidden";
    commentsBookId.value = bookId;
    commentsForm.append(commentsBookId);

    const commentsText = document.createElement("textarea");
    commentsText.placeholder = "Введите текст";
    commentsText.name = "comment";
    commentsText.className = "form-control";
    commentsForm.append(commentsText);

    const commentsButton = document.createElement("button");
    commentsButton.innerText = "Отправить";
    commentsButton.type = "submit";
    commentsButton.className = "comment_submit btn btn-primary";
    commentsForm.append(commentsButton);
    e.prepend(commentsForm);
  }

  async function getComments(id, e) {
    const commentsList = e.parentElement.querySelector(".comments_list");
    commentsList.innerHTML = "";
    showLoader(commentsList);
    const response = await fetch(`${apiUrl}/books/${id}/comments`);
    const comments = await response.json();
    hideLoader(commentsList);
    for (let i = 0; i < comments.data.length; i++) {
      addComment(comments.data[i], e);
    }
    if (comments.data.length === 0) commentsList.innerHTML = "Пусто";
  }

  function bookComments(e) {
    if (e.classList.contains("comments_open")) {
      e.innerText = "Скрыть комментарии";
      const commentsField = document.createElement("div");
      commentsField.className = "comments_field";

      const commentsTitle = document.createElement("h3");
      commentsTitle.innerText = "Комментарии:";
      commentsField.append(commentsTitle);

      const commentsBookList = document.createElement("div");
      commentsBookList.className = "comments_list";
      commentsField.append(commentsBookList);
      e.parentElement.append(commentsField);

      const bookId = e.dataset.bookId;
      getComments(bookId, e);
      createCommentsForm(commentsField, bookId);
    } else {
      e.innerText = "Открыть комментарии";
      e.parentElement.querySelector(".comments_field").remove();
    }
  }

  // Edit

  const updateBookModal = new bootstrap.Modal(
    document.getElementById("editFormField")
  );

  allBooksField.addEventListener("click", (e) => {
    if (!e.target.classList.contains("book_edit")) return;
    updateBookModal.show();
    const bookId = e.target.dataset.bookId;
    const currentItem = e.target.parentElement.parentElement;
    const currentTitle = currentItem.querySelector(".book_title");
    const currentAuthor = currentItem.querySelector(".book_author b");
    const currentImg = currentItem.querySelector(".book_img");

    fetch(`${apiUrl}/books/${bookId}`)
      .then((response) => response.json())
      .then((data) => {
        editForm.id.value = data._id;
        editForm.author.value = data.author;
        editForm.title.value = data.title;
      });
  });
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const bookId = editForm.id.value;
    const title = editForm.title.value;
    const author = editForm.author.value;

    const formData = new FormData();
    formData.append("author", author);
    formData.append("title", title);
    formData.append("cover", cover_edit.files[0]);

    modalActions.style.display = "none";
    showLoader(editForm);

    fetch(`${apiUrl}/books/${bookId}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((response) => {
        getBook(bookId)
          .then((data) => data.json())
          .then((response) => {
            currentTitle.innerText = title;
            currentAuthor.innerText = author;
          });
        hidePopup();
        updateBookModal.hide();
        hideLoader(editForm);
        modalActions.style.display = "block";
      });
  });

  editFormField.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-popup")) hidePopup();
    if (!e.target.classList.contains("btn-close")) return;
    hidePopup();
  });

  function hidePopup() {
    editForm.reset();
    // editFormField.style.display = "none";
  }

  // User ID
  userBooks.addEventListener("submit", (e) => {
    allBooksField.innerHTML = "";
    e.preventDefault();
    showLoader(allBooksField);
    const user = userBooks.userId.value;
    fetch(`${apiUrl}/books`, {
      headers: { "user-id": user },
    })
      .then((response) => response.json())
      .then((response) => {
        const currentPage = response.page;
        hideLoader(allBooksField);
        for (let i = 0; i < response.data.length; i++) {
          addBook(response.data[i]);
        }
        if (response.data.length === 0)
          allBooksField.innerHTML = "Ничего не найдено";
        createPagination(response.totalPages, currentPage);
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
