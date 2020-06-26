// TODO: Don't write all JS code in the same file.
var TOKEN = null;

document.addEventListener('DOMContentLoaded', function () {
  console.log('REALOADING JS FILE');
  changeToPage(location.pathname);
  if (localStorage.token_val) {
    console.log(
      'localstorage: ' + localStorage.userId + ' - ' + localStorage.token_val
    );
    TOKEN = {
      id: localStorage.token_id,
      token: localStorage.token_val,
      userId: localStorage.token_userId,
    };
    console.log('STORAGE: ', TOKEN);
    login(TOKEN);
  } else {
    console.log('NO STORAGE ? :S');
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
        ownerId: TOKEN.userId,
      };
      console.log('Sending article: ', article);
      fetch('http://localhost:8080/rest-api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: JSON.stringify(TOKEN),
        },
        body: JSON.stringify(article),
      })
        .then(function (response) {
          if (response.status == 201) {
            const location = response.headers.get('Location');
            goToPage(location);
          } else {
            if (response.status == 401)
              localStorage.errorMessage =
                'You need to login to create a new article';
            else localStorage.errorMessage = 'Error creating new article';
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
          Authorization: JSON.stringify(TOKEN),
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
          if (response.status != 200) {
            console.log('Error login in: ', response.status);
            localStorage.errorMessage = getErrorMessage(response.status);
            const loginError = document.getElementById('login-error');
            loginError.innerText = localStorage.errorMessage;
            goToPage('/login');
          } else if (response.status == 200) {
            return response.json().then(function (access_token) {
              console.log('Response from successfull login: ', access_token);
              localStorage.activeUser = username;
              localStorage.errorMessage = '';
              login(access_token.access_token);
            });
          }
        })
        .catch(function (error) {
          localStorage.errorMessage =
            'The server hit an error when trying to log in';
          goToPage('/error-page');
          console.log('error response from login: ', error);
        });
    });
  // Sign UP
  document
    .querySelector('#sign-up-page form')
    .addEventListener('submit', function (event) {
      event.preventDefault();
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
            return response.json().then(function () {
              console.log('Go to loginPage');
              localStorage.errorMessage = '';
              goToPage('/login');
            });
          } else {
            console.log('Error creating account ? ', response.status);
            localStorage.errorMessage = getErrorMessage(response.status);
            const signUpError = document.getElementById('sign-up-error');
            signUpError.innerText = localStorage.errorMessage;
            goToPage('/sign-up');
          }
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
      if (TOKEN && localStorage.activeUser == article.username) {
        document.getElementById('deleteBtn').style.display = 'block';
        document.getElementById('editBtn').style.display = 'block';
        console.log('IN IF');
      } else {
        console.log('IN ELSE');
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
      Authorization: JSON.stringify(TOKEN),
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
    console.log('url = logout');
    sendLogoutRequest();
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

function login(token) {
  console.log('Loginfunc got accestoken: ', token);
  TOKEN = {
    id: token.id,
    token: token.token,
    userId: token.userId,
  };
  localStorage.token_val = TOKEN.token;
  localStorage.token_id = TOKEN.id;
  localStorage.token_userId = TOKEN.userId;

  console.log('databvals: ', TOKEN);
  document.body.classList.add('isLoggedIn');
  document.body.classList.remove('isLoggedOut');
  goToPage('/');
}

function logout() {
  console.log('In logout()');
  TOKEN = '';
  localStorage.clear();
  document.body.classList.remove('isLoggedIn');
  document.body.classList.add('isLoggedOut');
  goToPage('/');
}

function sendLogoutRequest() {
  console.log('Trying to logout with token: ', TOKEN);
  fetch('http://localhost:8080/rest-api/logout', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: JSON.stringify(TOKEN),
    },
  })
    .then(function (response) {
      console.log('Got response from logout');
      if (response.status == 200) {
        TOKEN = '';
        localStorage.clear();
        goToPage('/');
      } else {
        console.log('Logout failed ?');
      }
    })
    .catch(function (error) {
      console.log('Logout failed');
    });
}

function getErrorMessage(statusCode) {
  switch (statusCode) {
    case 400:
      return 'Error creating account: Username has to be between 3 and 9 characters and password must be more than 3 characters.';
    case 401:
      return 'You are not authroized to do that';
    case 404:
      return 'Resource not found';
    case 409:
      return 'Username is already taken';
    case 460:
      return 'Wrong username or password';
    case 461:
      return 'Account is already logged in on another device';
    case 500:
      return 'The server hit an error';
    default:
      return 'Oups we hit an error';
  }
}
