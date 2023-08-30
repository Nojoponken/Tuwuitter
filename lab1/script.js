window.onload = () => {
    console.log("Welcome to tUwUitter")
    let form = document.querySelector("#post_form")
    form.addEventListener("submit", post)
}


function post(e){
    console.log(e)
    return false
}