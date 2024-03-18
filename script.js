const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closedModalBtn = document.getElementById("closed-modal-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const userNameInput = document.getElementById("userName")
const userNameWarn = document.getElementById("userName-warn")

const addToCartBtn = document.querySelector(".add-to-cart-btn")

let cart = []
/* abri Cart Modal */

cartBtn.addEventListener('click', function () {

   cartModal.style.display = 'flex'

})
/* fechar Cart Modal */
cartModal.addEventListener('click', function (event) {

   if (event.target === cartModal) {
      cartModal.style.display = 'none'
   }
})

closedModalBtn.addEventListener('click', function () {
   cartModal.style.display = 'none'
})

/* Produtos Menu */

menu.addEventListener('click', function (event) {

   let parentButton = event.target.closest(".add-to-cart-btn")
   if (parentButton) {
      const image = parentButton.getAttribute("data-image")
      const name = parentButton.getAttribute("data-name")
      const price = parseFloat(parentButton.getAttribute("data-price"))

      // Adcionar no carrinho
      addCat(image, name, price)
   }


})

/*  Adicionar no carrinho */
function addCat(image, name, price) {

   const existItem = cart.find(item => item.name === name)

   if (existItem) {
      existItem.quantity += 1
   } else {
      cart.push({ image, name, price, quantity: 1 })
   }


   updateCartModal()
}

// Atualiza Carrinho 

   function updateCartModal() {

      cartItemsContainer.innerHTML = ""
      let total = 0

      cart.forEach(item => {
         const cartItemElement = document.createElement("div");

         cartItemElement.innerHTML = `
               <div class="w-full flex items-center bg-slate-100 shadow-lg text-black justify-between rounded-lg p-4 ">
                  <div class="flex jusitfy-between items-center gap-4">
                  <image src=${item.image} alt=${item.name} class="w-20 h-20 rounded"/>
                     <div class="flex flex-col">
                           <p>Item: <span class="font-bold">${item.name}</span></p>
                           <p>Quantidade: <span class="font-bold"> ${item.quantity}</span></p>
                           <p>Valor: <span class="font-bold">R$ ${item.price.toFixed(2)}</span></p>
                     </div>
                     
                  </div>
                     <div class="bg-black text-white rounded p-1">
                        <button class="remove-from-btn" data-name="${item.name}">
                           Remover
                        </button>
                     </div>
                     
                  
               </div>
         
         
         `
         total += item.price * item.quantity


         cartItemsContainer.appendChild(cartItemElement)
      })
      cartTotal.textContent = total.toLocaleString("pt-BR", {
         style: "currency",
         currency: "BRL"

      })

      cartCount.innerText = cart.length;
   }

   // Função para remover o item do carrinho

   cartItemsContainer.addEventListener("click", function(event){
      if(event.target.classList.contains("remove-from-btn")){
         const name = event.target.getAttribute("data-name")

         removeItemCart(name);
      }
   })

   function removeItemCart(name){
      const index = cart.findIndex(item => item.name === name)

      if(index !== -1){
         const item = cart[index]

         if(item.quantity > 1){
            item.quantity -= 1
            updateCartModal()
            return;
         }
         cart.splice(index, 1)
         updateCartModal()
      }
   }

   // Address de entrega

   addressInput.addEventListener('input', function(event){
      let inputValue = event.target.value

      if(inputValue !== ""){
         addressInput.classList.remove("border-red-500")
         addressWarn.classList.add('hidden')
      }
      //
   })
   // nome cliente
   userNameInput.addEventListener('input', function(event){
      let inputNameValue = event.target.value
      if(inputNameValue !== ""){
         userNameInput.classList.remove("border-red-500")
         userNameWarn.classList.add('hidden')
      }
   })

   checkoutBtn.addEventListener("click", function(){

      /* const isOpen = checkRestaurantOpen()
      if(!isOpen){
         Toastify({
            text: "No momento estamos Fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "linear-gradient(#ef4444)",
            },
         }).showToast();
      } */



      if(cart.length === 0) return;

      if(addressInput.value === ""){
         addressWarn.classList.remove("hidden")
         addressInput.classList.add("border-red-500")
         return;
      }
      if(userNameInput.value === ""){
         userNameWarn.classList.remove("hidden")
         userNameWarn.classList.add("border-red-500")
         return;
      }
      


         // enviar pedido a api do whatsapp

      const cartItems = cart.map((item)=>{
         return (
         
            `${item.quantity} ${item.name} - SubTotal: R$ ${(item.price*item.quantity).toFixed(2)} \n`
            
         )
      }).join("")

      const valorTotalText = cartTotal.textContent
      const userName = userNameInput.value
      const address = addressInput.value

      const message = `Olá! The Burger Rock.\n\nPEDIDO DO CLIENTE, ${userName} É:\n\n${cartItems}\nTotal do Pedido: ${(valorTotalText)}\n\nEndereço de entrega:\n${address}\n`;

      const encodedMessage = encodeURIComponent(message)
      
      const phone = "5585997759542"

      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank")

      cart = []
      userNameInput.value = ""
      addressInput.value = ""
      updateCartModal()
   })


function checkRestaurantOpen(){
   const data = new Date()
   const hora = data.getHours()
   return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById('date-span')
const cartAlert = document.getElementById('cart-alert')

const isOpen = checkRestaurantOpen()

if(isOpen){
   spanItem.classList.remove("bg-red-500")
   spanItem.classList.add("bg-green-500")
   cartAlert.classList.add('hidden')


} else {
   spanItem.classList.add("bg-red-500")
   spanItem.classList.remove("bg-green-500")
   cartAlert.classList.add('flex')

}