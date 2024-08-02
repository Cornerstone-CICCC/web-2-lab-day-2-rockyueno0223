$(function() {

  // your code here
  $('.posts h3').on('click', () => {
    $('.posts ul').slideToggle()
  })

  $('.todos h3').on('click', () => {
    $('.todos ul').slideToggle()
  })

  function getUserById(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${id}`,
        type: 'GET',
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
    })
  }

  function getPostsById(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${id}/posts`,
        type: 'GET',
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
    })
  }

  function getTodosById(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${id}/todos`,
        type: 'GET',
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
    })
  }

  function getPostByPostId(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/posts/${id}`,
        type: 'GET',
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
    })
  }

  async function build(id) {
    const user = await getUserById(id)
    const posts = await getPostsById(id)
    const todos = await getTodosById(id)

    $(".info img").attr("src", user.image);

    $('.info__content').append(`<h2>${user.firstName} ${user.lastName}</h2>`)
    $('.info__content').append(`<p>Age: ${user.age}</p>`)
    $('.info__content').append(`<p>Email: ${user.email}</p>`)
    $('.info__content').append(`<p>Phone: ${user.phone}</p>`)

    $('.posts h3').text(`${user.firstName}'s Posts`);
    if (posts.posts.length === 0) {
      $('.posts ul').append(`<li>User has no posts</li>`);
    } else {
      $.each(posts.posts, function (index, post) {
      $('.posts ul').append(`<h4 post-id='${post.id}'>${post.title}</h4><li>${post.body}</li>`);
    });
    }

    $('.todos h3').text(`${user.firstName}'s To Dos`);
    if (todos.todos.length === 0) {
      $('.todos ul').append(`<li>User has no todos</li>`);
    } else {
      $.each(todos.todos, function (index, todo) {
      $('.todos ul').append(`<li>${todo.todo}</li>`);
    });
    }
  }

  let userId = 1

  $('header button:nth-child(1)').on('click', () => {
    $('.info h2').remove()
    $('.info p').remove()

    $('.posts h3').text('');
    $('.posts ul h4').remove()
    $('.posts ul li').remove()
    $('.todos h3').text('');
    $('.todos ul li').remove()

    userId--
    if (userId < 1) {
      userId = 30
    }
    build(userId)
  })

  $('header button:nth-child(2)').on('click', () => {
    $('.info h2').remove()
    $('.info p').remove()

    $('.posts h3').text('');
    $('.posts ul h4').remove()
    $('.posts ul li').remove()
    $('.todos h3').text('');
    $('.todos ul li').remove()

    userId++
    if (userId > 30) {
      userId = 1
    }
    build(userId)
  })

  let overlay = $(`<div class='overlay'></div>`).hide().appendTo('.container')
  let modal = $(`<div class='modal'></div>`)
  let modalCloseBtn = $(`<button>Close</button>`)

  function attachCloseHandler() {
    modalCloseBtn.off('click').on('click', function() {
      overlay.hide()
    });
  }
  attachCloseHandler()

  $('.posts ul').on('click', 'h4', async function() {
    let title = $(this).clone()
    let body = $(this).next().clone()

    let postId = $(this).attr('post-id')
    const clickedPost = await getPostByPostId(postId)

    let viewsElement = $(`<p>Views: ${clickedPost.views}</p>`)

    modal.empty()
    overlay.empty()

    // make modal
    modal.append(title)
    modal.append(body)
    modal.append(viewsElement)

    modal.append(modalCloseBtn)

    attachCloseHandler()

    overlay.append(modal)
    overlay.show()
  })

  $(document).ready(function () {
    build(userId)
  })
})
