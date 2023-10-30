/*Потрібно реалізувати функціонал як на відео UserList, а саме:

1. При кліку на кнопку Add user запускаєте функцію addUser() яка робить наступне:
Стягуєте дані з полів і формує об’єкт.
Цей об’єкт пушитю в масив.
Поля зачищає.
Запускаєм функцію render() яка генерую всю інфу в таблицю відносно вашого масиву.

2. При кліку на кнопку Delete запускаєте функцію deleteUser() яка робить наступне:
Дізнаєтеся в якому рядку ви клікнули(тобто індекс).
По цьому індексу видаляємо елемент з масиву.
Запускаєм заново функцію render().

3. При кліку на кнопку Edit запускаєте функцію editUser() яка робить наступне:
Дізнаєтеся в якому рядку ви клікнули(тобто індекс).
По цьому індексу витягуємо конкретрний елемент(тобто об’єкт) з масиву.
З об’єкт достаємо дані і передаємо в форму(тобто у value інпутів).
Запам’ятовуємо даний індекс в змінну userIndex.
Показуємо кнопку Edit user і приховуємо Add user.

4. При кліку на кнопку Edit User запускаєте функцію saveEditUser() яка робить наступне:
Стягуєте дані з полів і формує об’єкт через клас.
Цей об’єкт додається на місце старого об’єкту через userIndex.
Поля зачищає.
Запускаєм функцію render() яка генерую всю інфу в таблицю відносно вашого масиву.
------------------------------------------------------------------------------------------*/
function getS(selector: string): HTMLInputElement {
    return document.querySelector(selector) as HTMLInputElement;
}


let loginRegExp = /^\w{4,16}$/i;
let passRegExp = /^[a-z0-9_\-\.]{4,16}$/i;
let emailRegExp = /^[a-z0-9\.\-]+@[a-z]+?\.[a-z]{1,6}$/i;
const userLoginInput = getS(".user-login") as HTMLInputElement;
const userPasswordInput = getS(".user-password") as HTMLInputElement;
const userEmailInput = getS(".user-email") as HTMLInputElement;
let login: boolean;
let password: boolean;
let email: boolean;
let check: boolean = true;
let userIndex: number;
const userList: UserInterface[] = [];

// Інтерфейс для User
interface UserInterface {
    Login: string;
    Password: string;
    Email: string;
}

/* create style*/
function checkValid(event: MouseEvent, value: boolean): void {
    login = loginRegExp.test(userLoginInput.value);
    password = passRegExp.test(userPasswordInput.value);
    email = emailRegExp.test(userEmailInput.value);
    if (value) {
        (event.target as HTMLInputElement).classList.add("focus");
        (event.target as HTMLInputElement).classList.remove("error");
        getS(".user-add-btn").classList.remove("active");
        check = true;
        btn();
    } else {
        (event.target as HTMLInputElement).classList.add("error");
        (event.target as HTMLInputElement).classList.remove("focus");

    }
}

(getS(".user-login") as HTMLInputElement).addEventListener("input", function (event: MouseEvent): void { checkValid(event, login); });
(getS(".user-password") as HTMLInputElement).addEventListener("input", function (event: MouseEvent): void { checkValid(event, password); });
(getS(".user-email") as HTMLInputElement).addEventListener("input", function (event: MouseEvent): void { checkValid(event, email); });



(getS(".user-login") as any).onblur = function (): void { this.classList.remove("focus"); };
(getS(".user-password") as any).onblur = function (): void { this.classList.remove("focus"); };
(getS(".user-email") as any).onblur = function (): void { this.classList.remove("focus"); };



getS('.user-add-btn').addEventListener('click', function (): void {
    if (login && password && email) {
        getS(".user-add-btn").classList.add("active");
        getS(".user-add-btn").disabled = true;

        // Створення об'єкт, використовуючи дані з полів форми
        const formData: UserInterface = {
            Login: getS('.user-login').value,
            Password: getS('.user-password').value,
            Email: getS('.user-email').value
        };
        userList.push(formData);


        // Очищення полів форми
        (document.forms[0] as HTMLFormElement).reset();

        // Виклик функції render для генерації таблиці
        render();
        check = false;
    }
})



// Функція для генерації таблиці на основі масиву користувачів
function render(): void {

    // Очищення таблиці перед оновленням
    getS('.user-list').innerHTML = '';

    // Проходження по кожному користувачу та додавання його до таблиці
    userList.forEach((userData: UserInterface, index: number) => {
        let row = document.createElement('tr');
        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${userData.Login}</td>
        <td>${userData.Password}</td>
        <td>${userData.Email}</td>
        <td><input type='button' class='edit-btn btn' name='edit' value='Edit' data-index="${index}"></td>
        <td><input type='button' class='delete-btn btn' name='delete' value='Delete' data-index="${index}"></td>
    `;
        // Додавання створений рядок до таблиці
        getS('.user-list').appendChild(row);
    });
}



function deleteUser(event: MouseEvent): void {
    const button = event.target as HTMLButtonElement;
    const index = button.dataset.index;

    if (index !== undefined) {
        const indexNum = parseInt(index);
        if (!isNaN(indexNum) && indexNum >= 0 && indexNum < userList.length) {
            userList.splice(indexNum, 1);
            render();
        }
    }
}

function editUser(event: MouseEvent): void {
    const button = event.target as HTMLButtonElement;
    const index = parseInt(button.dataset.index || "");

    if (!isNaN(index) && index >= 0 && index < userList.length) {
        userIndex = index; // Store the index of the user to be edited
        const userToEdit = userList[userIndex];
        // Заповнюємо поля форми даними користувача
        (getS(".user-login") as HTMLInputElement).value = userToEdit.Login;
        (getS(".user-password") as HTMLInputElement).value = userToEdit.Password;
        (getS(".user-email") as HTMLInputElement).value = userToEdit.Email;

        // Показуємо кнопку "Edit User" і приховуємо кнопку "Add User"
        (getS(".user-add-btn") as HTMLButtonElement).hidden = true;
        (getS(".user-edit-btn") as HTMLButtonElement).hidden = false;
        getS(".edit-btn").disabled = true;
        getS(".delete-btn").disabled = true;
        render();
    }
}

function saveEditUser(): void {
    if (login && password && email) {
        // Створення об'єкту User з оновленими даними з полів
        const updatedUser: UserInterface = {
            Login: getS(".user-login").value,
            Password: getS(".user-password").value,
            Email: getS(".user-email").value,
        };
        // Заміна старого об'єкту на оновлений за індексом userIndex
        userList[userIndex] = updatedUser;
        btn();
        //   Приховуйте кнопку "Edit User" і показуйте кнопку "Add User"
        (getS(".user-add-btn") as HTMLButtonElement).hidden = false;
        (getS(".user-edit-btn") as HTMLButtonElement).hidden = true;
        // Викликаємо функцію render для оновлення таблиці
        render();
        // Очищення полів форми
        (document.forms[0] as HTMLFormElement).reset();
    }
}
getS('.user-edit-btn').addEventListener('click', saveEditUser);

getS("tbody").onclick = (event: MouseEvent) =>
    (event.target as HTMLElement).classList.contains("edit-btn")
        ? editUser(event)
        : (event.target as HTMLElement).classList.contains("delete-btn")
            ? deleteUser(event)
            : 0;



function btn() {
    if (login && password && email) {
        getS(".user-add-btn").disabled = false;
        getS(".user-edit-btn").disabled = false;
    }
}
