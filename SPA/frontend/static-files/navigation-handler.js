// TODO: Don't write all JS code in the same file.
document.addEventListener('DOMContentLoaded', function () {
  console.log('REALOADING JS FILE');
  changeToPage(location.pathname);
  if (localStorage.accessToken) {
    console.log('localStorage.accessToken: ', localStorage.accessToken);
    login(localStorage.accessToken);
  } else {
    logout();
  }

  // Handle menu clicks
  document.body.addEventListener('click', function (event) {
    if (event.target.tagName == 'A') {
      event.preventDefault();
      const url = event.target.getAttribute('href');
      goToPage(url);
    }
  });
  // Delete article
  document
    .getElementById('deleteBtn')
    .addEventListener('click', function (event) {
      event.preventDefault();
      deleteArticle(localStorage.articleId);
    });
  document
    .getElementById('editBtn')
    .addEventListener('click', function (event) {
      event.preventDefault();
      goToPage('/update-article');
    });

  // Create article
  document
    .querySelector('#create-article-page form')
    .addEventListener('submit', function (event) {
      event.preventDefault();

      const title = document.querySelector('#create-article-page .title').value;
      const description = document.querySelector(
        '#create-article-page .description'
      ).value;
      const content = document.querySelector('#create-article-page .content')
        .value;
      const article = {
        title: title,
        description: description,
        content: content,
        username: localStorage.activeUser,
      };
      fetch('http://localhost:8080/rest-api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.accessToken,
        },
        body: JSON.stringify(article),
      })
        .then(function (response) {
          if (response.status == 201) {
            const location = response.headers.get('Location');
            goToPage(location);
          } else {
            localStorage.errorMessage = 'Error creating new article';
            goToPage('/error-page');
          }
        })
        .catch(function (error) {
          // TODO: Update the view and display error.
          console.log(error);
          localStorage.errorMessage = error;
          goToPage('/error-page');
        });
    });

  // Update article
  document
    .querySelector('#update-article-page form')
    .addEventListener('submit', function (event) {
      event.preventDefault();
      const id = localStorage.articleId;
      const article = {
        title: document.querySelector('#update-article-page .title').value,
        description: document.querySelector('#update-article-page .description')
          .value,
        content: document.querySelector('#update-article-page .content').value,
      };
      fetch('http://localhost:8080/rest-api/articles/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      })
        .then(function (response) {
          if (response.status == 204) {
            const location = response.headers.get('Location');
            goToPage(location + id);
          } else {
            localStorage.errorMessage = 'error updating article';
            goToPage('/error-page');
          }
        })
        .catch(function (error) {
          localStorage.errorMessage = error;
        });
    });

  // Login
  document
    .querySelector('#login-page form')
    .addEventListener('submit', function (event) {
      event.preventDefault();

      const username = document.querySelector('#login-page .username').value;
      const password = document.querySelector('#login-page .password').value;

      fetch('http://localhost:8080/rest-api/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:
          'grant_type=password&username=' +
          escape(username) +
          '&password=' +
          escape(password),
      })
        .then(function (response) {
          console.log('Response.status: ', response.status);
          if (response.status == 500) {
            localStorage.errorMessage =
              'The server hit an error when trying to log in';
            goToPage('/error-page');
          } else if (response.status == 400) {
            localStorage.errorMessage = 'Wrong username or password';
            goToPage('/error-page');
          } else {
            console.log('Returning response.json() ', response.json());
            return response.json();
          }
        })
        .then(function (response) {
          console.log(
            'Response from successfull login: ' +
              response.body +
              ' + acesstoken' +
              response.body.access_token
          );
          login(response.body.access_token);
        })
        .catch(function (error) {
          console.log('error response from login: ', error);
        });
    });
  // Sign UP
  document
    .querySelector('#sign-up-page form')
    .addEventListener('submit', function (event) {
      console.log('Pressed submit1');
      event.preventDefault();
      console.log('Pressed submit');
      const username = document.querySelector('#sign-up-page .username').value;
      const email = document.querySelector('#sign-up-page .email').value;
      const password = document.querySelector('#sign-up-page .password').value;
      const confirmationPassword = document.querySelector(
        '#sign-up-page .confirmationPassword'
      ).value;

      fetch('http://localhost:8080/rest-api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:
          'username=' +
          escape(username) +
          '&email=' +
          escape(email) +
          '&password=' +
          escape(password) +
          '&confirmationPassword=' +
          escape(confirmationPassword),
      })
        .then(function (response) {
          if (response.status == 200) {
            return response.json;
          } else {
            localStorage.errorMessage = 'Error creating account';
            goToPage('/error-page');
          }
        })
        .then(function (body) {
          goToPage('/login');
        })
        .catch(function (error) {
          localStorage.errorMessage = error;
        });
    });
});

// Get all articles
function fetchAllArticles() {
  fetch('http://localhost:8080/rest-api/articles')
    .then(function (response) {
      if (response.status == 200) {
        return response.json();
      } else {
        localStorage.errorMessage = 'Error fetching articles';
      }
    })
    .then(function (articles) {
      const ul = document.querySelector('#articles-page ul');
      ul.innerText = '';
      for (const article of articles.articles) {
        const li = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.innerText = article.title;
        anchor.setAttribute('href', '/articles/' + article.id);
        li.appendChild(anchor);
        ul.append(li);
      }
    })
    .catch(function (error) {
      localStorage.errorMessage = error;
    });
}

// Get article by ID
function fetchArticle(id) {
  fetch('http://localhost:8080/rest-api/articles/' + id)
    .then(function (response) {
      if (response.status == 200) {
        return response.json();
      } else {
        localStorage.errorMessage = 'error fetching article';
      }
    })
    .then(function (article) {
      console.log(
        'Article.title recieved from fetching article by ID: ',
        article.title
      );
      const authorSpan = document.querySelector('#article-page .author');
      const titleSpan = document.querySelector('#article-page .title');
      const contentSpan = document.querySelector('#article-page .content');
      localStorage.articleTitle = article.title;
      localStorage.articleDescription = article.description;
      localStorage.articleContent = article.content;
      if (
        localStorage.accessToken &&
        localStorage.activeUser == article.username
      ) {
        document.getElementById('deleteBtn').style.display = 'block';
        document.getElementById('editBtn').style.display = 'block';
      } else {
        document.getElementById('deleteBtn').style.display = 'none';
        document.getElementById('editBtn').style.display = 'none';
      }

      authorSpan.innerText = article.username;
      titleSpan.innerText = article.title;
      contentSpan.innerText = article.content;
    })
    .catch(function (error) {
      localStorage.errorMessage = error;
    });
}

// DELETE article by ID
function deleteArticle(id) {
  fetch('http://localhost:8080/rest-api/articles/' + id, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.accessToken,
    },
  })
    .then(function (response) {
      if (response.status == 204) {
        goToPage('/articles');
      } else {
        localStorage.errorMessage = 'Error deleting article';
        goToPage('/error-page');
      }
    })
    .catch(function (error) {
      localStorage.errorMessage = error;
    });
}

window.addEventListener('popstate', function (event) {
  const url = location.pathname;
  changeToPage(url);
});

function goToPage(url) {
  changeToPage(url);
  history.pushState({}, '', url);
}

function changeToPage(url) {
  const currentPageDiv = document.getElementsByClassName('current-page')[0];
  if (currentPageDiv) {
    currentPageDiv.classList.remove('current-page');
  }

  if (url == '/') {
    document.getElementById('home-page').classList.add('current-page');
  } else if (url == '/about') {
    document.getElementById('about-page').classList.add('current-page');
  } else if (url == '/articles') {
    document.getElementById('articles-page').classList.add('current-page');
    fetchAllArticles();
  } else if (url == '/update-article') {
    setContent();
    document
      .getElementById('update-article-page')
      .classList.add('current-page');
  } else if (url == '/login') {
    document.getElementById('login-page').classList.add('current-page');
  } else if (url == '/sign-up') {
    document.getElementById('sign-up-page').classList.add('current-page');
  } else if (new RegExp('^/articles/[0-9]+$').test(url)) {
    document.getElementById('article-page').classList.add('current-page');
    const id = url.split('/')[2];
    localStorage.articleId = id;
    fetchArticle(id);
  } else if (url == '/create') {
    document
      .getElementById('create-article-page')
      .classList.add('current-page');
  } else if (url == '/logout') {
    logout();
  } else if (url == '/error-page') {
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerText = localStorage.errorMessage;
    document.getElementById('error-page').classList.add('current-page');
  } else {
    document.getElementById('error-page').classList.add('current-page');
  }
}
function setContent() {
  const title = document.querySelector('#update-article-page .title');
  title.setAttribute('value', localStorage.articleTitle);
  document.getElementById('update-description').value =
    localStorage.articleDescription;
  document.getElementById('update-content').value = localStorage.articleContent;
}

function login(accessToken) {
  localStorage.accessToken = accessToken;
  document.body.classList.add('isLoggedIn');
  document.body.classList.remove('isLoggedOut');
  goToPage('/');
}

function logout() {
  localStorage.accessToken = '';
  document.body.classList.remove('isLoggedIn');
  document.body.classList.add('isLoggedOut');
  goToPage('/');
}
