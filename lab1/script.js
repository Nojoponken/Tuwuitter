window.onload = () => {

    let main = document.querySelector("main")
    display_posts_json(main)

    let form = document.querySelector("#post_form")
    let input_field = document.querySelector("#text_input")

    form.addEventListener("submit", (e) => {
        if(input_field.value.length <= 140 && input_field.value.length != 0) {
            create_post_json(input_field.value)
        }else {
            e.preventDefault()
            document.querySelector(".error").style.display = "inline"
        }
    })
}

function create_post_json(text) {
    let date_time = new Date().toUTCString()

    let new_post = {
        "content": text,
        "author": "John Doe",
        "date": date_time,
        "is_read": false
    }

    let all_posts = JSON.parse(getCookie("posts"))

    if(!all_posts) {
        all_posts = {"posts":[]}
    }

    all_posts.posts.push(new_post)

    document.cookie = "posts=" + JSON.stringify(all_posts) + "; expires=Thu, 31 Aug 2055 11:11:00 GMT+0200; path=/";
}

function display_posts_json(parent){
    if (!getCookie("posts")){
        return
    }
    let all_posts = JSON.parse(getCookie("posts"))

    all_posts.posts.reverse().forEach(element => {
        let post = document.createElement("article")

        let post_content = document.createElement("p")
        post_content.appendChild(document.createTextNode(element.content))
        post.appendChild(post_content)

        let post_date = document.createElement("p")
        post_date.appendChild(document.createTextNode(element.date))
        post_date.classList.add("date")
        post.appendChild(post_date)

        let author = document.createElement("p")
        author.appendChild(document.createTextNode(element.author))
        author.classList.add("author")
        post.appendChild(author)

        let checkbox = document.createElement("input")
        checkbox.type  = "checkbox"
        checkbox.classList.add("checkbox")
        checkbox.checked = element.is_read
        post.appendChild(checkbox)

        parent.appendChild(post)
    })
    document.querySelectorAll("input[type=checkbox]").forEach(element => {
        element.addEventListener("change", mark_read)
    })
    mark_read()
}

function mark_read() {
    let posts = document.querySelectorAll("article")
    let cookies = JSON.parse(getCookie("posts"))
    let index = cookies.posts.length
    posts.forEach(element => {
        index -= 1
        let checkmark = element.querySelector(":scope > input")
        if (checkmark.checked) {
            element.classList.add("read")
            cookies.posts[index].is_read = true
        }
        else {
            element.classList.remove("read")
            cookies.posts[index].is_read = false
        }
    })

    document.cookie = "posts=" + JSON.stringify(cookies) + "; expires=Thu, 31 Aug 2055 11:11:00 GMT+0200; path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return false;
  }
  