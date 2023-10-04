// import { read } from "fs";
const root = `http://${window.location.hostname}:3000/`;
console.log(root);

window.onload = () => {

    let main = document.querySelector("section");
    display_posts_json(main);

    let form = document.querySelector("#post_form");
    let input_field = document.querySelector("#text_input");

    form.addEventListener("submit", (e) => {
        if(input_field.value.length <= 140 && input_field.value.length != 0) {
            e.preventDefault()
            create_post_json(input_field.value, main);
            document.querySelector(".error").style.display = "none";
            input_field.value = "";
        }else {
            e.preventDefault()
            document.querySelector(".error").style.display = "inline";
        }
    });
}

async function create_post_json(text, parent) {
    let response = await fetch(`${root}messages`, {method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: text})});
    console.log("ok");
    
    console.log(response);
    let id = await response.text()
    let almostPost = await fetch(`${root}messages/${id}`, {method: "GET"});
    let post = await almostPost.json()
    console.log(post);
    displayOnePost(post, parent);
}

function displayOnePost(element, parent) {
    let post = document.createElement("article")
    post.id = element.id;

    let post_content = document.createElement("p");
    post_content.appendChild(document.createTextNode(element.content));
    post.appendChild(post_content);

    let post_date = document.createElement("p");
    console.log(typeof(element.date));
    post_date.appendChild(document.createTextNode(element.date));
    post_date.classList.add("date");
    post.appendChild(post_date);

    let author = document.createElement("p");
    author.appendChild(document.createTextNode(element.name));
    author.classList.add("author");
    post.appendChild(author);

    let checkbox = document.createElement("input");
    checkbox.type  = "checkbox";
    checkbox.classList.add("checkbox");
    if (element.read == true){
        checkbox.checked = true;
        post.classList.add("read");
    }
    checkbox.addEventListener("change", mark_read);
    post.appendChild(checkbox);

    parent.prepend(post);
}

async function display_posts_json(parent){
    // if (!getCookie("posts")){
    //     return
    // }
    // let all_posts = JSON.parse(getCookie("posts"))
    console.log(await fetch(`${root}messages`, {method: "GET"}));

    let response = await fetch(`${root}messages`, {method: "GET"});
    let all_posts = await response.json();
    
    console.log(all_posts);

    all_posts.forEach(element => {
        displayOnePost(element, parent);
    });
    mark_read();
}

function mark_read() {
    let posts = document.querySelectorAll("article");
    
    
    posts.forEach(element => {
        let checkmark = element.querySelector(":scope > input");
        if (checkmark.checked) {
            if(!element.classList.contains("read")){
                fetch(`${root}/messages/${element.id}`, {method: "PATCH"});
            }
            element.classList.add("read");
        }
        else {
            if(element.classList.contains("read")){
                fetch(`${root}/messages/${element.id}`, {method: "PATCH"});
            }
            element.classList.remove("read");
        }
    })
}