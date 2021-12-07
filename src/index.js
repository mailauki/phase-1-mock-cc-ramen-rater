document.addEventListener("DOMContentLoaded", () => {
  console.log("dom loaded")
  getMenu()
  getDetail(h2.id)
  form.addEventListener("submit", handleSubmit)
  updateBtn.addEventListener("click", toggleEdit)
  editForm.addEventListener("submit", handleEdit)
  deleteBtn.addEventListener("click", handleDelete)
})

// Query Selectors -------------------------------------------------------
const menu = document.querySelector("#ramen-menu")
const detail = document.querySelector("#ramen-detail")
const img = detail.querySelector("img")
const h2 = detail.querySelector("h2")
const h3 = detail.querySelector("h3")
const ratingDisplay = document.querySelector("#rating-display")
const commentDisplay = document.querySelector("#comment-display")
const form = document.querySelector("#new-ramen")
const newName = document.querySelector("#new-name")
const newRest = document.querySelector("#new-restaurant")
const newImage = document.querySelector("#new-image")
const newRating = document.querySelector("#new-rating")
const newComment = document.querySelector("#new-comment")
const updateBtn = document.querySelector("#edit-ramen-btn")
const editForm = document.querySelector("#edit-ramen")
const deleteBtn = document.querySelector("#delete-ramen-btn")
let editRamen = false
h2.id = 1

editForm.style.display = "none"

// Event Handlers --------------------------------------------------------
function handleClick(e) {
  getDetail(e.target.id)
  h2.id = e.target.id
}

function handleSubmit(e) {
  e.preventDefault()
  let ramenObj = {
    "name": newName.value,
    "restaurant": newRest.value,
    "image": newImage.value,
    "rating": newRating.value,
    "comment": newComment.value
  }
  addRamen(ramenObj)
  form.reset()
}

function toggleEdit() {
  editRamen = !editRamen
  if (editRamen) {
    updateBtn.style.display = "none"
    editForm.style.display = "flex"
  }
  else {
    updateBtn.style.display = "block"
    editForm.style.display = "none"
  }
}

function handleEdit(e) {
  e.preventDefault()
  ratingDisplay.innerText = e.target.querySelector("input").value
  commentDisplay.innerText = e.target.querySelector("textarea").value
  updateRamen(h2.id)
  toggleEdit()
  editForm.reset()
}

function handleDelete() {
  removeRamen(h2.id)
  if (h2.id > 1) {
    getDetail(--h2.id)
  }
  else {
    getDetail(++h2.id)
  }
}

// Renderings ------------------------------------------------------------
function renderMenu(ramen) {
  const img = document.createElement("img")
  img.setAttribute("src", ramen.image)
  img.id = ramen.id
  menu.appendChild(img)

  img.addEventListener("click", handleClick)
}

function renderDetail(ramen) {
  img.setAttribute("src", ramen.image)
  h2.innerText = ramen.name
  h3.innerText = ramen.restaurant
  ratingDisplay.innerText = ramen.rating
  commentDisplay.innerText = ramen.comment
}

// Fetch Requests --------------------------------------------------------
function getMenu() {
  fetch("http://localhost:3000/ramens")
  .then(res => res.json())
  .then(ramenData => {
    ramenData.forEach(ramen => {
      renderMenu(ramen)
    })
  })
}

function getDetail(id) {
  fetch(`http://localhost:3000/ramens/${id}`)
  .then(res => res.json())
  .then(data => {
    renderDetail(data)
  })
}

function addRamen(ramenObj) {
  fetch("http:localhost:3000/ramens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(ramenObj)
  })
  .then(res => res.json())
  .then(ramenData => {
    resetMenu()
    renderDetail(ramenData)
  })
}

function removeRamen(id) {
  fetch(`http://localhost:3000/ramens/${id}`, {
    method: "DELETE",
    headers: {
      "Constent-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(() => {
    resetMenu()
  })
}

function updateRamen(id) {
  let formData = {
    "rating": ratingDisplay.innerText,
    "comment": commentDisplay.innerText
  }

  fetch(`http://localhost:3000/ramens/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  })
}

function resetMenu() {
  while (menu.firstChild) {
    menu.removeChild(menu.firstChild)
  }
  getMenu()
}
