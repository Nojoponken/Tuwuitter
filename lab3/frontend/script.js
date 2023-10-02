window.onload = () => {

    let main = document.querySelector("main");
    display_posts_json(main);

    let form = document.querySelector("#post_form");
    let input_field = document.querySelector("#text_input");

    form.addEventListener("submit", (e) => {
        if(input_field.value.length <= 140 && input_field.value.length != 0) {
            e.preventDefault()
            create_post_json(input_field.value);
        }else {
            e.preventDefault()
            document.querySelector(".error").style.display = "inline";
        }
    });
}

function create_post_json(text) {
    fetch(`${window.location}messages`, {method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: text})});
}

async function display_posts_json(parent){
    // if (!getCookie("posts")){
    //     return
    // }
    // let all_posts = JSON.parse(getCookie("posts"))
    console.log(await fetch(`${window.location}messages`, {method: "GET"}));

    let response = await fetch(`${window.location}messages`, {method: "GET"});
    let all_posts = await response.json();
    
    console.log(all_posts);

    all_posts.reverse().forEach(element => {
        let post = document.createElement("article")
        post.id = element.id;

        let post_content = document.createElement("p");
        post_content.appendChild(document.createTextNode(element.content));
        post.appendChild(post_content);

        let post_date = document.createElement("p");
        post_date.appendChild(document.createTextNode(element.date));
        post_date.classList.add("date");
        post.appendChild(post_date);

        let author = document.createElement("p");
        author.appendChild(document.createTextNode(element.author));
        author.classList.add("author");
        post.appendChild(author);

        let checkbox = document.createElement("input");
        checkbox.type  = "checkbox";
        checkbox.classList.add("checkbox");
        checkbox.checked = element.read;
        post.appendChild(checkbox);

        parent.appendChild(post);
    })
    document.querySelectorAll("input[type=checkbox]").forEach(element => {
        element.addEventListener("change", mark_read);
    })
    mark_read();
}

function mark_read() {
    let posts = document.querySelectorAll("article");
    
    
    posts.forEach(element => {
        let checkmark = element.querySelector(":scope > input");
        if (checkmark.checked) {
            if(!element.classList.contains("read")){
                fetch(`${window.location}messages/${element.id}`, {method: "PATCH"});
            }
            element.classList.add("read");
        }
        else {
            if(element.classList.contains("read")){
                fetch(`${window.location}messages${element.id}`, {method: "PATCH"});
            }
            element.classList.remove("read");
        }
    })
}

// function getCookie(cname) {
//     let name = cname + "=";
//     let ca = document.cookie.split(';');
//     for(let i = 0; i < ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) == ' ') {
//         c = c.substring(1);
//       }
//       if (c.indexOf(name) == 0) {
//         return c.substring(name.length, c.length);
//       }
//     }
//     return false;
//   }
  