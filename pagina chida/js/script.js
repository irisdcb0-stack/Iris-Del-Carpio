(function(){
  const PRODUCTS = [
    {id:'psx1',name:'ProSound X1',price:149.00,img:'assets/product1.svg',rating:4.2,excerpt:'Audífonos inalámbricos con sonido neutro y gran batería.'},
    {id:'btsp',name:'Bluetooth Speaker S',price:89.00,img:'assets/product2.svg',rating:4.5,excerpt:'Parlante portátil con graves potentes y diseño compacto.'},
    {id:'pd100',name:'PowerDock 100W',price:69.00,img:'https://via.placeholder.com/400x240?text=PowerDock',rating:4.0,excerpt:'Cargador múltiple para laptop y móviles.'}
  ];

  // Persisted cart (localStorage)
  const STORAGE_KEY = 'ec_cart_v1';
  const cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  function saveCart(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
  function $(sel,root=document){return root.querySelector(sel)}

  function format(v){return v.toFixed(2)}

  function renderProducts(){
    const grid = $('#productGrid');
    grid.innerHTML = '';
    PRODUCTS.forEach(p=>{
      const card = document.createElement('div');card.className='card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <div class="muted">${p.excerpt}</div>
        <div style="margin-top:8px;display:flex;align-items:center;gap:8px;">
          <div class="price">$${format(p.price)}</div>
          <button class="btn add" data-id="${p.id}" style="margin-left:auto">Agregar</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function updateCartCount(){
    const count = Object.values(cart).reduce((s,n)=>s+n,0);
    $('#cartCount').textContent = count;
    // toggle empty state and checkout
    const has = count > 0;
    $('#cartEmpty').style.display = has ? 'none' : 'block';
    $('#checkoutBtn').disabled = !has;
  }

  function addToCart(id){
    cart[id] = (cart[id]||0) + 1;
    saveCart(); updateCartCount(); renderCart();
  }

  function setQty(id, qty){
    if(qty <= 0){ delete cart[id]; } else { cart[id] = qty; }
    saveCart(); updateCartCount(); renderCart();
  }

  function clearCart(){
    Object.keys(cart).forEach(k=>delete cart[k]); saveCart(); updateCartCount(); renderCart();
  }

  function renderCart(){
    const items = $('#cartItems'); items.innerHTML='';
    let total=0;
    Object.keys(cart).forEach(id=>{
      const qty = cart[id];
      const prod = PRODUCTS.find(p=>p.id===id) || {name:id,price:0,img:''};
      const row = document.createElement('div'); row.className='cart-row';
      row.innerHTML = `
        <img src="${prod.img}" alt="${prod.name}" />
        <div class="cart-item-meta">
          <div class="cart-item-name">${prod.name}</div>
          <div class="cart-item-price">$${format(prod.price)} × ${qty}</div>
        </div>
        <div class="cart-actions">
          <div class="qty-controls" data-id="${id}">
            <button class="qty-decr" data-id="${id}">−</button>
            <div class="qty-value">${qty}</div>
            <button class="qty-incr" data-id="${id}">+</button>
          </div>
          <button class="btn subtle remove" data-id="${id}">Eliminar</button>
        </div>
      `;
      items.appendChild(row);
      total += prod.price * qty;
    });
    $('#cartTotal').textContent = format(total);
  }

  function openCart(){
    $('#cartModal').setAttribute('aria-hidden','false'); renderCart();
  }
  function closeCart(){
    $('#cartModal').setAttribute('aria-hidden','true');
  }

  // Delegate clicks
  document.addEventListener('click', e=>{
    const t = e.target;
    if(t.matches('.add')){ addToCart(t.dataset.id); }
    if(t.id === 'cartBtn'){ openCart(); }
    if(t.id === 'closeCart'){ closeCart(); }
    if(t.matches('.qty-incr')){ const id=t.dataset.id; setQty(id, (cart[id]||0)+1); }
    if(t.matches('.qty-decr')){ const id=t.dataset.id; setQty(id, (cart[id]||0)-1); }
    if(t.matches('.remove')){ const id=t.dataset.id; setQty(id, 0); }
    if(t.id === 'clearCartBtn'){ if(confirm('Vaciar el carrito?')) clearCart(); }
    if(t.id === 'checkoutBtn'){ // mostrar formulario
      $('#checkoutForm').style.display = 'block';
      $('#checkoutForm').setAttribute('aria-hidden','false');
      $('#cartFooter').style.display = 'none';
    }
    if(t.id === 'backToCart'){
      $('#checkoutForm').style.display = 'none';
      $('#checkoutForm').setAttribute('aria-hidden','true');
      $('#cartFooter').style.display = '';
    }
  });

  // Handle review form (unchanged)
  document.addEventListener('submit', e=>{
    if(e.target.id === 'reviewForm'){
      e.preventDefault();
      const txt = $('#reviewText').value.trim();
      if(!txt){ alert('Por favor añade un comentario.'); return; }
      alert('Gracias por tu reseña — se ha recibido');
      e.target.reset();
    }
    if(e.target.id === 'checkoutFormEl'){
      e.preventDefault();
      const name = $('#buyerName').value.trim();
      const email = $('#buyerEmail').value.trim();
      const address = $('#buyerAddress').value.trim();
      if(!name || !email || !address){ alert('Completa todos los campos.'); return; }
      // Simular pago/confirmación
      alert('Compra confirmada. Gracias, ' + name + '!');
      clearCart();
      closeCart();
      e.target.reset();
    }
  });

  // Init
  document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('year').textContent = new Date().getFullYear();
    renderProducts(); updateCartCount(); renderCart();
  });
})();
