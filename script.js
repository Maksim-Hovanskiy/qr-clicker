document.addEventListener("DOMContentLoaded", function () {
  // Инициализация localStorage
  if (!localStorage.getItem("qrCounter")) {
    localStorage.setItem("qrCounter", "0");
  }
  if (!localStorage.getItem("comments")) {
    localStorage.setItem("comments", JSON.stringify([]));
  }
  if (!localStorage.getItem("clickedUsers")) {
    localStorage.setItem("clickedUsers", JSON.stringify([]));
  }

  // Получаем параметры из URL (для QR-кода)
  const urlParams = new URLSearchParams(window.location.search);
  const qrId = urlParams.get("qr");

  // Элементы DOM
  const counterElement = document.getElementById("counter");
  const clickBtn = document.getElementById("clickBtn");
  const clickedMessage = document.getElementById("clickedMessage");
  const commentForm = document.getElementById("commentForm");
  const commentsContainer = document.getElementById("commentsContainer");
  const imageInput = document.getElementById("image");
  const previewContainer = document.getElementById("previewContainer");
  const imagePreview = document.getElementById("imagePreview");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  // Уникальный идентификатор пользователя (можно улучшить)
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("userId", userId);
  }

  // Проверка, отметился ли уже пользователь
  const clickedUsers = JSON.parse(localStorage.getItem("clickedUsers"));
  const hasClicked = clickedUsers.includes(userId + (qrId ? "-" + qrId : ""));

  // Обновление счетчика
  function updateCounter() {
    counterElement.textContent = localStorage.getItem("qrCounter");
  }

  // Анимация счетчика
  function animateCounter() {
    counterElement.classList.add("pulse");
    setTimeout(() => {
      counterElement.classList.remove("pulse");
    }, 1500);
  }

  // Показать уведомление
  function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.classList.remove("error");
    if (isError) {
      toast.classList.add("error");
    }
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // Загрузка комментариев
  function loadComments() {
    const comments = JSON.parse(localStorage.getItem("comments"));
    if (comments.length === 0) return;

    commentsContainer.innerHTML = "";
    comments.forEach((comment) => {
      const commentCard = document.createElement("div");
      commentCard.className = "comment-card";

      const commentHeader = document.createElement("div");
      commentHeader.className = "comment-header";

      const commentAvatar = document.createElement("div");
      commentAvatar.className = "comment-avatar";
      commentAvatar.textContent = comment.name.charAt(0).toUpperCase();

      const headerContent = document.createElement("div");

      const commentAuthor = document.createElement("div");
      commentAuthor.className = "comment-author";
      commentAuthor.textContent = comment.name;

      const commentDate = document.createElement("div");
      commentDate.className = "comment-date";
      commentDate.textContent = new Date(comment.date).toLocaleString();

      headerContent.appendChild(commentAuthor);
      headerContent.appendChild(commentDate);
      commentHeader.appendChild(commentAvatar);
      commentHeader.appendChild(headerContent);

      const commentText = document.createElement("div");
      commentText.className = "comment-text";
      commentText.textContent = comment.comment;

      commentCard.appendChild(commentHeader);
      commentCard.appendChild(commentText);

      if (comment.image) {
        const commentImage = document.createElement("img");
        commentImage.className = "comment-image";
        commentImage.src = comment.image;
        commentCard.appendChild(commentImage);
      }

      commentsContainer.appendChild(commentCard);
    });
  }

  // Предпросмотр изображения
  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        imagePreview.src = event.target.result;
        previewContainer.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      previewContainer.style.display = "none";
    }
  });

  // Обработка клика на счетчик
  clickBtn.addEventListener("click", function () {
    if (hasClicked) return;

    let count = parseInt(localStorage.getItem("qrCounter"));
    count++;
    localStorage.setItem("qrCounter", count.toString());

    clickedUsers.push(userId + (qrId ? "-" + qrId : ""));
    localStorage.setItem("clickedUsers", JSON.stringify(clickedUsers));

    updateCounter();
    animateCounter();
    clickBtn.disabled = true;
    clickedMessage.style.display = "block";

    showToast("Спасибо, что отметились!");
  });

  // Обработка формы комментария
  commentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!hasClicked && !qrId) {
      showToast("Пожалуйста, сначала отметьтесь!", true);
      return;
    }

    const name = document.getElementById("name").value;
    const commentText = document.getElementById("comment").value;
    const imageFile = imageInput.files[0];

    const comments = JSON.parse(localStorage.getItem("comments"));
    const newComment = {
      name,
      comment: commentText,
      date: new Date().toISOString(),
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        newComment.image = event.target.result;
        saveComment(comments, newComment);
      };
      reader.readAsDataURL(imageFile);
    } else {
      saveComment(comments, newComment);
    }
  });

  function saveComment(comments, newComment) {
    comments.unshift(newComment);
    localStorage.setItem("comments", JSON.stringify(comments));

    commentForm.reset();
    previewContainer.style.display = "none";
    loadComments();
    showToast("Комментарий добавлен!");
  }

  // Инициализация
  updateCounter();
  loadComments();

  if (hasClicked) {
    clickBtn.disabled = true;
    clickedMessage.style.display = "block";
  }

  // Анимация при загрузке
  setTimeout(() => {
    document.querySelector(".counter-section").style.opacity = "1";
    document.querySelector(".comment-section").style.opacity = "1";
  }, 300);
});

// Добавь в конец script.js

// Анимация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  // Анимация для заголовка
  const header = document.querySelector("header");
  header.style.animation = "fadeIn 1s ease-out";

  // Анимация для счетчика
  const counter = document.getElementById("counter");
  counter.style.animation = "bounceIn 1s ease-out";

  // Анимация при клике на кнопку
  const clickBtn = document.getElementById("clickBtn");
  if (clickBtn) {
    clickBtn.addEventListener("click", function () {
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 1000);

      // Анимация увеличения счетчика
      const target = parseInt(counter.textContent) + 1;
      animateCounter(counter, target);
    });
  }

  // Анимация при наведении на карточки комментариев
  const commentCards = document.querySelectorAll(".comment-card");
  commentCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
});

// Функция анимации счетчика
function animateCounter(element, target) {
  let current = parseInt(element.textContent);
  const increment = target > current ? 1 : -1;
  const stepTime = Math.abs(Math.floor(1000 / (target - current)));

  const timer = setInterval(() => {
    current += increment;
    element.textContent = current;

    // Добавляем эффект при изменении числа
    element.style.transform = "scale(1.1)";
    setTimeout(() => {
      element.style.transform = "scale(1)";
    }, 100);

    if (current === target) {
      clearInterval(timer);
    }
  }, stepTime);
}

// Анимация при отправке формы
const commentForm = document.getElementById("commentForm");
if (commentForm) {
  commentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

    // Имитация отправки
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Отправлено!';
      showToast("Комментарий успешно добавлен!");

      // Сброс формы
      setTimeout(() => {
        this.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить';
      }, 1500);
    }, 2000);
  });
}

// Показ превью изображения с анимацией
const imageInput = document.getElementById("image");
if (imageInput) {
  imageInput.addEventListener("change", function () {
    const previewContainer = document.getElementById("previewContainer");
    const preview = document.getElementById("imagePreview");

    if (this.files && this.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        preview.src = e.target.result;
        previewContainer.style.display = "block";
        preview.style.animation = "bounceIn 0.5s ease-out";
      };

      reader.readAsDataURL(this.files[0]);
    }
  });
}
