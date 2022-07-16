// vars globales
const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("templateCard").content
const templateFooter = document.getElementById("templateFooter").content
const templateCarrito = document.getElementById("templateCarrito").content
const fragment = document.createDocumentFragment()
let carrito = {}

// eventos
document.addEventListener("DOMContentLoaded", ()=>{
    fetchData()
    // agregar productos al ls
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"))
        pintarCarrito()
    }
})
cards.addEventListener("click", e=>{
    agregarAlCarrito(e)
})
items.addEventListener("click", e => {
    btnAccion(e)
})

// funciones
const fetchData = async () =>{
    try {
        const res = await fetch("./json/api.json")
        const data = await res.json()
        pintarCards(data)
    } catch (error) {   
    }
}


// esto pinta mis cards en el html
const pintarCards = (data) =>{
    data.forEach(producto => {
        templateCard.querySelector(".title").textContent = producto.title
        templateCard.querySelector(".precio").textContent = producto.precio
        templateCard.querySelector("img").setAttribute("src", producto.img) 
        templateCard.querySelector(".btnAgregarCarrito").dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

// aca capturamos toda la card 
const agregarAlCarrito = e =>{
    if(e.target.classList.contains("btnAgregarCarrito")){
        setCarrito(e.target.parentElement.parentElement.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto =>{
    // creamos el objeto 
    const producto = {
        img: objeto.querySelector(".itemImg").src,
        id: objeto.querySelector(".btnAgregarCarrito").dataset.id,
        title: objeto.querySelector(".title").textContent,
        precio: objeto.querySelector(".precio").textContent,
        cantidad: 1
    }
    // aca voy a comprobar si ya existe nuestro producto en el carrito mediante su id para no volver a pintarlo, sino solo aumentale la cantidad
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    // empujamos el objeto a nuestro obj carrito
    carrito[producto.id] = {...producto}
    pintarCarrito()
}

// aca pintamos nuestros objetos en el carrito
const pintarCarrito = () => {
    items.innerHTML = ""
    // aca uso el object values para poder recorrer el objeto como si fuera un array con el forEach
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector(".imgCarrito").src = producto.img
        templateCarrito.querySelectorAll("td")[1].textContent = producto.title
        templateCarrito.querySelectorAll("td")[2].textContent = producto.cantidad
        templateCarrito.querySelector("span").textContent = producto.precio * producto.cantidad
        
        templateCarrito.querySelector('.btnAdd').dataset.id = producto.id
        templateCarrito.querySelector('.btnDelete').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
    // gardamos nuestros productos en el ls
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

// cuando se agrega un prod modificamos nuestro footer
const pintarFooter = () => {
    footer.innerHTML = ""
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío</th>`
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)
    
    templateFooter.querySelectorAll("td")[0].textContent = nCantidad
    templateFooter.querySelector("span").textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const vaciarCarrito = document.getElementById("vaciarCarrito")
    vaciarCarrito.addEventListener("click", () => {
        carrito = {}
        pintarCarrito()
    })
}

// botones aumentar y disminuir
const btnAccion = e => {
    // aumentar
    if(e.target.classList.contains("btnAdd")){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    // disminuir
    if(e.target.classList.contains("btnDelete")){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}