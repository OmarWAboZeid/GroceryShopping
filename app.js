const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.getElementById('grocery')
const submitbtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearbtn = document.querySelector('.clear-btn')


//edit option 
var editElement;
let editFlag = false;
let editId = ""
//Event listeners
//submit form 
form.addEventListener('submit', addItem)

window.addEventListener('DOMContentLoaded', setupItems)
clearbtn.addEventListener('click', clearItems)
const deletebtn = document.querySelector('.delete-btn')
//functions
function addItem(e) {
    e.preventDefault()
    console.log(grocery.value)
    let value = grocery.value
    let id = new Date().getTime().toString();
    if(value && !editFlag) {
        //add to list
        add(id, value)
        addToLocalStorage(id, value)
        setBackToDefault()
        displayAlert(`item ${value} added to list`, "success")
    } else if (value && editFlag) {
        console.log("went here with ", value, " and ", editFlag)

        //edit the item in the list
        editElement.innerHTML = value
        displayAlert("editing value", "danger")
        editLocalStorage(editId, value)
        setBackToDefault()
    } else {
        displayAlert("please enter value", "danger")
    }
}

function add(id, value) {
    const element = document.createElement("article");
    element.classList.add("grocery-item");
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr)
    element.innerHTML = `<p class="alert">${value}</p>
    <div class="btn-container">
        <button type ="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <button type ="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
        
    </div>`

    const deleteBtn = element.querySelector(".delete-btn")
    const editBtn = element.querySelector(".edit-btn")
    deleteBtn.addEventListener('click', deleteItem)
    editBtn.addEventListener('click', editItem)
    container.classList.add("show-container")

    list.appendChild(element)

}
function deleteItem(e) {
    console.log("deleted item")
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id
    list.removeChild(element)
    if(list.length == 0) {
        setBackToDefault()
        container.classList.remove("show-container")
    }
    displayAlert("no items found", "danger")
    removeFromLocalStorage(id)

}

function editLocalStorage(id, v) {
    let items = getLocalStorage();
    console.log("in editLocalStorage", items)
    items = items.filter(function(item) {
        if(item.id === id) {
            item.value = v;
        }
        return item;
    });

    localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter(function(item){
        if(item.id !== id) return item
    })

    localStorage.setItem("list", JSON.stringify(items))
}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    console.log("editID in editItem " , editId)
    submitbtn.textContent = "edit";
}

function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    setTimeout(() => {
        alert.textContent = ""
        alert.classList.remove(`alert-${action}`)
    }, 1000);
}

function setBackToDefault(){
    console.log('set to defaut')
    grocery.value = ""
    editFlag = false
    editId = ''
    submitbtn.textContent = "submit"

}

function getLocalStorage() {
    return localStorage.getItem("list") ? 
    JSON.parse(localStorage.getItem("list")) :
    [];
    
}
function addToLocalStorage(id, value) {
    console.log('added to local storage')
    const grocery = {id, value}
    let items = getLocalStorage()
    console.log(items)
    items.push(grocery)
    localStorage.setItem("list", JSON.stringify(items))
}

function clearItems() {
    const items = document.querySelectorAll('.grocery-item');
    if(items.length > 0) {
        items.forEach(function(item) {
            list.removeChild(item);
        })
    }
    container.classList.remove("show-container")
    displayAlert("removed items", "danger")
    setBackToDefault()
    localStorage.removeItem("list");
}
//local storage

//setup items

function setupItems() {
    let items = getLocalStorage();
    if(items.length > 0) {
        //display them
        items.forEach((item) => {
            add(item.id, item.value)
        })
    }
}