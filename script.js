let indexes = new Array();

let createUser = (firstName, lastName, id, email) => {
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("user-card");
    let avatar = document.createElement("img");
    avatar.setAttribute("src", "https://i.pravatar.cc/500?img=" + (id - 1));
    let name = document.createElement("h2");
    name.innerHTML = firstName + " " + lastName;
    let idPtag = document.createElement("p");
    idPtag.innerHTML = "Id: " + id;
    let emailPtag = document.createElement("p");
    emailPtag.innerHTML = email;
    mainDiv.appendChild(avatar);
    mainDiv.appendChild(name);
    mainDiv.appendChild(idPtag);
    mainDiv.appendChild(emailPtag);
    let buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("buttons");
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.setAttribute("id", email);
    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.setAttribute("id", email);
    buttonsDiv.appendChild(deleteButton);
    buttonsDiv.appendChild(editButton);
    mainDiv.appendChild(buttonsDiv);
    document.getElementById("main").appendChild(mainDiv);

    //Button listeners

    deleteButton.addEventListener("click", () => {
        fetch("https://reqres.in/api/users/" + id, {
            method: 'DELETE'
        }).then(response => console.log(response));
        usersArray.splice(indexes[id], 1);
        reIndexOpt(indexes[id]);
        loadUsers();
    });
    editButton.addEventListener("click", () => {
        let editingCard = document.createElement("div");
        let editMessage = document.createElement("h2");
        editMessage.innerHTML = "Please Enter New Data";
        editingCard.classList.add("user-card");
        let editingForm = document.createElement("form");
        let firstNameInput = document.createElement("input");
        firstNameInput.setAttribute("type", "text");
        firstNameInput.setAttribute("placeholder", "Enter First Name");
        let lastNameInput = document.createElement("input");
        lastNameInput.setAttribute("type", "text");
        lastNameInput.setAttribute("placeholder", "Enter Last Name");
        let emailInput = document.createElement("input");
        emailInput.setAttribute("type", "email");
        emailInput.setAttribute("placeholder", "Email");
        let submitButton = document.createElement("button");
        submitButton.innerHTML = "Update";
        editingForm.appendChild(firstNameInput);
        editingForm.appendChild(lastNameInput);
        editingForm.appendChild(emailInput);

        editingCard.appendChild(editMessage);
        editingCard.appendChild(editingForm);
        editingCard.appendChild(submitButton);
        document.getElementById("main").innerHTML = "";
        document.getElementById("main").appendChild(editingCard);

        submitButton.addEventListener("click", () => {
            if (firstNameInput.value.length != 0 && lastNameInput.value.length != 0 && emailInput.value.length != 0 && ValidateEmail(emailInput.value)) {
                updateRequest(firstNameInput.value, lastNameInput.value, emailInput.value, id);
            }
        });
    });
}
let usersArray = [];
async function getUsers() {
    const response = await fetch("https://reqres.in/api/users");
    const json = await response.json();
    usersArray = json.data;
    loadUsers();
    reIndex();

}
async function updateRequest(first_name, last_name, email, id) {
    const response = await fetch("https://reqres.in/api/users/" + id, {
        method: 'PUT',
        body: {
            id,
            email,
            first_name,
            last_name,
        }
    });
    console.log(response);
    usersArray[indexes[id]].first_name = first_name;
    usersArray[indexes[id]].last_name = last_name;
    usersArray[indexes[id]].email = email;
    loadUsers();
}
let reIndex = () => {
    for (let i = 0; i < usersArray.length; i++) {
        indexes[usersArray[i].id] = i;
    }
}
let reIndexOpt = (j) => {
    for (let i = j; i < usersArray.length; i++) {
        indexes[usersArray[i].id] = i;
    }
}
let loadUsers = () => {

    document.getElementById("main").innerHTML = "";
    if (usersArray.length == 0) {
        let emptyText = document.createElement("h2");
        emptyText.innerHTML = "No Users Available";
        document.getElementById("main").appendChild(emptyText);
    } else {
        usersArray.map((user) => {
            if (user != undefined) {
                createUser(user.first_name, user.last_name, user.id, user.email)
            }
        });
    }
}
//copied from w3resource to validate email input
function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}

getUsers();

//Answers to questions
//1. 200 for GET and PUT (list users and update a user) , 204 for DELETE (delete a user)
//2. 2xx are for successful requests, 3xx are for Redirections, 4xx are for errors on the client side, 5xx are for errors on the server side
//3. A javascript promise is an object that carries an asynchronous operation that may fail or succeed
//    and when it succeeds it may bring back a value (promise value)  