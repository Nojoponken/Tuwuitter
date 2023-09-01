window.onload = () => {
    console.log("Welcome to tUwUitter")

    let main = document.querySelector("main")
    display_posts(main)

    let form = document.querySelector("#post_form")
    let input_field = document.querySelector("#text_input")

    form.addEventListener("submit", (e) => {
        console.log(input_field.value)
        if(input_field.value.length <= 140 && input_field.value.length != 0) {
            create_post(input_field.value)
        }else {
            e.preventDefault()
            document.querySelector(".error").style.display = "inline"
        }
    })
}

function create_post(text){
    let date_time = new Date().toUTCString();

    let old_text = getCookie("post")
    if(old_text == false){
        document.cookie = "post=" +  date_time + "§" + text + "; expires=Thu, 31 Aug 2055 11:11:00 GMT+0200; path=/;" // Special case for first post
    } else {
        document.cookie = "post=" + old_text + "§" + date_time + "§" + text + "; expires=Thu, 31 Aug 2055 11:11:00 GMT+0200; path=/;"
    }
}

function display_posts(parent){
    if (!getCookie("post")){
        return
    }
    let all_posts = getCookie("post").split('§')
    all_posts = all_posts.reverse()
    for(let i = 0; i < all_posts.length; i+=2){
        let post = document.createElement("article")

        let post_content = document.createElement("p")
        post_content.appendChild(document.createTextNode(all_posts[i]))
        post.appendChild(post_content)

        let post_date = document.createElement("p")
        post_date.appendChild(document.createTextNode(all_posts[i+1]))
        post_date.classList.add("date")
        post.appendChild(post_date)

        let img = document.createElement("img")
        img.src = "https://en.bloggif.com/tmp/f0795844f7de69a8f4e5fe05d8fc43c3/text.gif?1693553120"
        img.classList.add("author")
        post.appendChild(img)

        let checkbox = document.createElement("input")
        checkbox.type  = "checkbox"
        checkbox.classList.add("readbox")
        post.appendChild(checkbox)

        parent.appendChild(post)
    }
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
  