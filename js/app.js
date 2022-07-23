
// vars globales
const btnMenu = document.getElementById('btnMenu')
const cards = document.getElementById("cards")
const itemsCarrito = document.getElementById("itemsCarrito")
const itemsFav = document.getElementById("itemsFav")
const footer = document.getElementById("footer")
const footerFav = document.getElementById("footerFav")
const templateCard = document.getElementById("templateCard").content
const templateFooter = document.getElementById("templateFooter").content
const templateCarrito = document.getElementById("templateCarrito").content
const templateFavoritos = document.getElementById("templateFavoritos").content
const fragment = document.createDocumentFragment()
let carrito = {}
let wishList = {}

// eventos
document.addEventListener("DOMContentLoaded", ()=>{
    fetchData()
    // agregar productos al ls
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"))
        pintarCarrito()
    }
    if(localStorage.getItem("favoritos")){
        wishList = JSON.parse(localStorage.getItem("favoritos"))
        pintarCarrito()
    }
})
cards.addEventListener("click", e=>{
    agregarAlCarrito(e)
})
cards.addEventListener("click", e=>{
    agregarFavoritos(e)
})
itemsCarrito.addEventListener("click", e => {
    btnAccion(e)
})

// funciones

// menu
btnMenu.addEventListener('click',()=>{
    const menuItems = document.querySelector('.menuItems')
    menuItems.classList.toggle('show')
})

const fetchData = async () =>{
    try {
        const res = await fetch("./json/api.json")
        const data = await res.json()
        pintarCards(data)
    } catch (error) {   
    }
}

// pintar cards en el html
const pintarCards = (data) =>{
    data.forEach(producto => {
        templateCard.querySelector(".title").textContent = producto.title
        templateCard.querySelector(".precio").textContent = producto.precio
        templateCard.querySelector("img").setAttribute("src", producto.img) 
        templateCard.querySelector(".btnAgregarCarrito").dataset.id = producto.id
        templateCard.querySelector(".btnFavoritos").dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}


// capturar toda la card para el carrito
const agregarAlCarrito = e =>{
    e.target.classList.contains("btnAgregarCarrito") && setCarrito(e.target.parentElement.parentElement.parentElement)
    // Swal.fire({
    //     title: 'Genial!',
    //     text: 'Se ha agregado su producto al carrito',
    //     icon: 'success',
    //     confirmButtonText: 'Cool'
    //   })
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'success',
        title: 'Su producto se ha añadido al carrito'
      })
    
    e.stopPropagation()
}

// aca para la wish list
const agregarFavoritos = e =>{
    e.target.classList.contains("btnFavoritos") && setFavoritos(e.target.parentElement.parentElement.parentElement)
    
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

const setFavoritos = objeto =>{
    const producto = {
        img: objeto.querySelector(".itemImg").src,
        id: objeto.querySelector(".btnFavoritos").dataset.id,
        title: objeto.querySelector(".title").textContent,
        precio: objeto.querySelector(".precio").textContent,
    }
    wishList[producto.id] = {...producto}
    pintarFavoritos()
}

// pintamos nuestros objetos en el carrito
const pintarCarrito = () => {
    itemsCarrito.innerHTML = ""
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
    itemsCarrito.appendChild(fragment)
   
    pintarFooter()
    // gardamos nuestros productos en el ls
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

const pintarFavoritos = () => {
    itemsFav.innerHTML = ""
    Object.values(wishList).forEach(producto => {
        templateFavoritos.querySelector(".imgFav").src = producto.img
        templateFavoritos.querySelectorAll("td")[1].textContent = producto.title
        templateFavoritos.querySelector("span").textContent = producto.precio

        const clone = templateFavoritos.cloneNode(true)
        fragment.appendChild(clone)
    })
    itemsFav.appendChild(fragment)

    pintarFooterFav()
    localStorage.setItem("favoritos", JSON.stringify(wishList))
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

const pintarFooterFav = () => {
    const btnVaciarWL = document.getElementById("btnVaciarWL")
    footerFav.innerHTML= ""
    if(Object.keys(wishList).length === 0){
        footerFav.innerHTML = `<th scope="row" colspan="5">Wish List vacia</th>`
        btnVaciarWL.innerHTML = ""
        return
    }else if(Object.keys(wishList).length >= 1){
        footerFav.innerHTML = ""
        btnVaciarWL.innerHTML = `<button class="btn btn-danger" id="vaciarWL"> vaciar wish list </button>`
        const vaciarWL = document.getElementById("vaciarWL")
        vaciarWL.addEventListener("click", () => {
        wishList = {}
        pintarFavoritos()
        })
        return
    }
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


