const Clickbutton = document.querySelectorAll('.button');
const tbody = document.querySelector('.tbody')
let carrito = []

//recorremos los botones y cuando hace en alguno click lo añade al carrito
Clickbutton.forEach(btn => {
    btn.addEventListener('click', addToCarritoItem) 
})

//el item con el titulo, precio y la imagen
function addToCarritoItem(e){
    const button = e.target 
    const item = button.closest('.card')//toma la card
    const itemTitle = item.querySelector('.card-title').textContent;//obtiene el contenido del queryselector
    const itemPrice = item.querySelector('.precio').textContent;
    const itemImg = item.querySelector('.card-img-top').src;
    //generamos el objeto item
    const newItem = {
      title: itemTitle,
      precio: itemPrice,
      img: itemImg,
      cantidad: 1
    }

    addItemCarrito(newItem)
}
//adicionamos el item al carrito
function addItemCarrito(newItem){
    
    //alert
    const alert = document.querySelector('.alert')

    setTimeout(function(){
        alert.classList.add('hide')
    },2000) 
    alert.classList.remove('hide')

    const InputElemnto = tbody.getElementsByClassName('input__elemento')//obtiene el elemento de tbody input__elemento
    //recorremos el carrito(con el trim quitamos los espacion de los lados)
    for (let i =0; i < carrito.length ; i++) {
        if(carrito[i].title.trim() === newItem.title.trim()) {
           carrito[i].cantidad ++;//se cumple la condicion, se incrementa
           const inputValue = InputElemnto[i]
           inputValue.value ++;//incrementa la cantidad del carrito y no agrega otro igual
           CarritoTotal()
           return null; //si se ejecuta este no hace el push ni el render
        }    
    }
    carrito.push(newItem)
    renderCarrito()
}
//Lo que se encuentra en la variable carrito
function renderCarrito(){
    tbody.innerHTML = ''//carrito vacio
    carrito.map(item => {
        const tr = document.createElement('tr')//Crea el elemento tr
        tr.classList.add('itemCarrito')
        //trae el contenido del tr y describe lo que ira dentro del carrito
        const Content = `
         
        <th scope="row">1</th>
            <td class="table__productos">
              <img src=${item.img}
                alt="">
              <h6 class="title">${item.title}</h6>
            </td>
            <td class="table__precio">
              <p>${item.precio}</p>
            </td>
            <td class="table__cantidad">
              <input type="number" min="1" value=${item.cantidad} class="input__elemento">
              <button class="delete btn btn-danger">x</button> 
            </td>
        
        `
        tr.innerHTML = Content; //agregamos al tr el Content
        tbody.append(tr)//agregamos al tbody que esta vacio el tr

        tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
        tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad)
    })
    CarritoTotal()
}

//Calcula el total de lo que se añade al carrito
function CarritoTotal(){ 
  let Total = 0;
  const itemCardTotal = document.querySelector('.itemCardTotal')
  carrito.forEach((item) => {//recorre el carrito
    const precio = Number(item.precio.replace("$", ''))
    Total = Total + precio*item.cantidad
  })
  itemCardTotal.innerHTML = `Total $${Total}`
  addLocalStorage()
}
//Funcion para eliminar el item
function removeItemCarrito(e){
  const buttonDelete = e.target
  const tr = buttonDelete.closest(".itemCarrito")
  const title = tr.querySelector('.title').textContent;
  for (let i =0; i<carrito.length ; i++){

    if(carrito[i].title.trim() === title.trim()){
       carrito.splice(i, 1)//elimina un elemento del carrito
    }
  }  
  //alert
  const alert = document.querySelector('.remove')

    setTimeout(function(){
        alert.classList.add('remove')
    },2000) 
    alert.classList.remove('remove')

  tr.remove()
  CarritoTotal()  
} 
//Suma de las cantidades
function sumaCantidad(e){
    const sumaInput = e.target
    const tr = sumaInput.closest(".itemCarrito")
    const title = tr.querySelector('.title').textContent
    carrito.forEach(item =>{
        if (item.title.trim() === title){
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;//para que si modifico la cantidad manualmente lo tome
            item.cantidad = sumaInput.value
            CarritoTotal()            
        }
    })
}
//se implementa LocalStorage
function addLocalStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito))
}
//Se ejecuta cada vez que se actualiza la pagina, si existe se guarda 
window.onload = function(){
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if (storage){
       carrito = storage;
       renderCarrito()
    }
}