function getS(selector) {
    return document.querySelector(selector);
}
let loginRegExp = /^\w{4,16}$/i;
let passRegExp = /^[a-z0-9_\-\.]{4,16}$/i;
let emailRegExp = /^[a-z0-9\.\-]+@[a-z]+?\.[a-z]{1,6}$/i;
const userLoginInput = getS(".user-login");
const userPasswordInput = getS(".user-password");
const userEmailInput = getS(".user-email");
let login;
let password;
let email;
let check = true;
let userIndex;
const userList = [];
function checkValid(event, value) {
    login = loginRegExp.test(userLoginInput.value);
    password = passRegExp.test(userPasswordInput.value);
    email = emailRegExp.test(userEmailInput.value);
    if (value) {
        event.target.classList.add("focus");
        event.target.classList.remove("error");
        getS(".user-add-btn").classList.remove("active");
        check = true;
        btn();
    }
    else {
        event.target.classList.add("error");
        event.target.classList.remove("focus");
    }
}
getS(".user-login").addEventListener("input", function (event) { checkValid(event, login); });
getS(".user-password").addEventListener("input", function (event) { checkValid(event, password); });
getS(".user-email").addEventListener("input", function (event) { checkValid(event, email); });
getS(".user-login").onblur = function () { this.classList.remove("focus"); };
getS(".user-password").onblur = function () { this.classList.remove("focus"); };
getS(".user-email").onblur = function () { this.classList.remove("focus"); };
getS('.user-add-btn').addEventListener('click', function () {
    if (login && password && email) {
        getS(".user-add-btn").classList.add("active");
        getS(".user-add-btn").disabled = true;
        const formData = {
            Login: getS('.user-login').value,
            Password: getS('.user-password').value,
            Email: getS('.user-email').value
        };
        userList.push(formData);
        document.forms[0].reset();
        render();
        check = false;
    }
});
function render() {
    getS('.user-list').innerHTML = '';
    userList.forEach((userData, index) => {
        let row = document.createElement('tr');
        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${userData.Login}</td>
        <td>${userData.Password}</td>
        <td>${userData.Email}</td>
        <td><input type='button' class='edit-btn btn' name='edit' value='Edit' data-index="${index}"></td>
        <td><input type='button' class='delete-btn btn' name='delete' value='Delete' data-index="${index}"></td>
    `;
        getS('.user-list').appendChild(row);
    });
}
function deleteUser(event) {
    const button = event.target;
    const index = button.dataset.index;
    if (index !== undefined) {
        const indexNum = parseInt(index);
        if (!isNaN(indexNum) && indexNum >= 0 && indexNum < userList.length) {
            userList.splice(indexNum, 1);
            render();
        }
    }
}
function editUser(event) {
    const button = event.target;
    const index = parseInt(button.dataset.index || "");
    if (!isNaN(index) && index >= 0 && index < userList.length) {
        userIndex = index;
        const userToEdit = userList[userIndex];
        getS(".user-login").value = userToEdit.Login;
        getS(".user-password").value = userToEdit.Password;
        getS(".user-email").value = userToEdit.Email;
        getS(".user-add-btn").hidden = true;
        getS(".user-edit-btn").hidden = false;
        getS(".edit-btn").disabled = true;
        getS(".delete-btn").disabled = true;
        render();
    }
}
function saveEditUser() {
    if (login && password && email) {
        const updatedUser = {
            Login: getS(".user-login").value,
            Password: getS(".user-password").value,
            Email: getS(".user-email").value,
        };
        userList[userIndex] = updatedUser;
        btn();
        getS(".user-add-btn").hidden = false;
        getS(".user-edit-btn").hidden = true;
        render();
        document.forms[0].reset();
    }
}
getS('.user-edit-btn').addEventListener('click', saveEditUser);
getS("tbody").onclick = (event) => event.target.classList.contains("edit-btn")
    ? editUser(event)
    : event.target.classList.contains("delete-btn")
        ? deleteUser(event)
        : 0;
function btn() {
    if (login && password && email) {
        getS(".user-add-btn").disabled = false;
        getS(".user-edit-btn").disabled = false;
    }
}
