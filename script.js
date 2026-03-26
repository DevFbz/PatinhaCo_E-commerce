// ════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════
const PRODUCTS = [
    {id:1,name:'Puffer Coat Clássico',cat:'Casacos',price:149.90,oldPrice:189.90,emoji:'🧥',badge:'sale',sizes:['PP','P','M','G','GG'],desc:'Casaco acolchoado premium com tecido impermeável e forro térmico. Perfeito para dias frios sem abrir mão do estilo.',col:'Moda Urbana'},
    {id:2,name:'Hoodie Street Azul',cat:'Hoodies',price:129.90,emoji:'👕',badge:'hot',sizes:['PP','P','M','G','GG'],desc:'Moletom com capuz em algodão premium. Design ergonômico para máximo conforto e movimento livre.',col:'Inverno Premium'},
    {id:3,name:'Vestido Floral Rosa',cat:'Vestidos',price:99.90,emoji:'👗',badge:'new',sizes:['PP','P','M','G'],desc:'Vestido delicado com estampa floral, ideal para passeios e ocasiões especiais.',col:'Festa no Parque'},
    {id:4,name:'Camiseta Beach Club',cat:'Camisetas',price:69.90,emoji:'👙',badge:'new',sizes:['PP','P','M','G','GG'],desc:'Camiseta leve em malha fria, perfeita para os dias quentes de verão.',col:'Summer Vibes'},
    {id:5,name:'Trench Coat Elegante',cat:'Casacos',price:219.90,oldPrice:269.90,emoji:'🥼',badge:'sale',sizes:['P','M','G','GG'],desc:'Sobretudo sofisticado para cães que amam estilo. Material de alta qualidade resistente ao vento.',col:'Moda Urbana'},
    {id:6,name:'Bandana Glamour',cat:'Acessórios',price:39.90,emoji:'🎀',badge:'hot',sizes:['P','M','G'],desc:'Bandana luxuosa em veludo com detalhes em dourado. Transforma qualquer visual.',col:'Glamour Night'},
    {id:7,name:'Hoodie Tie-Dye',cat:'Hoodies',price:149.90,emoji:'🌈',badge:'new',sizes:['PP','P','M','G','GG'],desc:'Moletom tie-dye exclusivo com cores vibrantes. Único e cheio de personalidade.',col:'Inverno Premium'},
    {id:8,name:'Vestido Glam Night',cat:'Vestidos',price:179.90,emoji:'✨',sizes:['PP','P','M','G'],desc:'Vestido para ocasiões especiais com tecido brilhante e detalhes em renda.',col:'Glamour Night'},
    {id:9,name:'Colete Jeans',cat:'Casacos',price:119.90,emoji:'🧶',badge:'hot',sizes:['PP','P','M','G','GG'],desc:'Colete em jeans premium com acabamento delavê. O must-have da temporada.',col:'Moda Urbana'},
    {id:10,name:'Camiseta Tie-Dye',cat:'Camisetas',price:79.90,emoji:'🎽',badge:'new',sizes:['PP','P','M','G','GG'],desc:'Camiseta em tie-dye artesanal. Cada peça é única, assim como seu cão.',col:'Summer Vibes'},
    {id:11,name:'Colleira Premium',cat:'Acessórios',price:59.90,emoji:'📿',sizes:['P','M','G'],desc:'Coleira em couro vegano com fivela dourada. Resistente e elegante.',col:'Glamour Night'},
    {id:12,name:'Macacão Polar',cat:'Casacos',price:169.90,oldPrice:199.90,emoji:'🦺',badge:'sale',sizes:['PP','P','M','G','GG'],desc:'Macacão completo em fleece polar. Cobertura total do corpo para máximo aquecimento.',col:'Inverno Premium'},
  ];
  
  // ════════════════════════════════════════════
  // STATE
  // ════════════════════════════════════════════
  let cart = JSON.parse(localStorage.getItem('pc_cart')||'[]');
  let user = JSON.parse(localStorage.getItem('pc_user')||'null');
  let orders = JSON.parse(localStorage.getItem('pc_orders')||'[]');
  let wishlist = JSON.parse(localStorage.getItem('pc_wish')||'[]');
  let currentFilter = 'all';
  let currentPage = 'home';
  let modalProduct = null;
  let modalQty = 1;
  let modalSize = '';
  
  // ════════════════════════════════════════════
  // TOAST
  // ════════════════════════════════════════════
  function toast(msg,type='info'){
    const c=document.getElementById('toast-container');
    const t=document.createElement('div');
    t.className=`toast ${type}`;
    const icons={info:'ℹ️',success:'✅',error:'❌'};
    t.innerHTML=`<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
    c.appendChild(t);
    setTimeout(()=>t.remove(),3100);
  }
  
  // ════════════════════════════════════════════
  // NAVIGATION
  // ════════════════════════════════════════════
  function goTo(page){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    const target=document.getElementById(`page-${page}`);
    if(target){target.classList.add('active');window.scrollTo(0,0);}
    document.querySelectorAll('.nav-links a').forEach(a=>{
      a.classList.remove('active');
      if(a.id===`nav-${page}`)a.classList.add('active');
    });
    currentPage=page;
    if(page==='produtos')renderProducts();
    if(page==='conta')renderAccount();
    // Show footer on all pages except none
    document.getElementById('mainFooter').style.display='';
  }
  
  function filterByCollection(cat){
    currentFilter=cat;
    goTo('produtos');
    // Update filter buttons
    setTimeout(()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>{
        b.classList.toggle('active',b.dataset.filter===cat);
      });
      renderProducts();
    },50);
  }
  
  // ════════════════════════════════════════════
  // AUTH
  // ════════════════════════════════════════════
  function openAuth(){
    if(user){goTo('conta');}
    else{openModal('authModal');}
  }
  function switchTab(tab){
    document.getElementById('panelLogin').classList.toggle('active',tab==='login');
    document.getElementById('panelRegister').classList.toggle('active',tab==='register');
    document.getElementById('tabLogin').classList.toggle('active',tab==='login');
    document.getElementById('tabRegister').classList.toggle('active',tab==='register');
  }
  function doLogin(){
    const email=document.getElementById('loginEmail').value.trim();
    const pass=document.getElementById('loginPass').value;
    if(!email||!pass){toast('Preencha todos os campos','error');return;}
    const saved=JSON.parse(localStorage.getItem('pc_user')||'null');
    if(saved&&saved.email===email&&saved.password===pass){
      user=saved;loginSuccess();
    } else if(email&&pass.length>=6){
      // Demo: any valid login
      user={name:email.split('@')[0],email,password:pass};
      localStorage.setItem('pc_user',JSON.stringify(user));
      loginSuccess();
    } else {
      toast('Email ou senha incorretos','error');
    }
  }
  function demoLogin(){
    user={name:'Tutor Demo',email:'demo@patinhaco.com',password:'demo123'};
    localStorage.setItem('pc_user',JSON.stringify(user));
    loginSuccess();
  }
  function doRegister(){
    const name=document.getElementById('regName').value.trim();
    const email=document.getElementById('regEmail').value.trim();
    const pass=document.getElementById('regPass').value;
    if(!name||!email||!pass){toast('Preencha todos os campos','error');return;}
    if(pass.length<6){toast('Senha deve ter ao menos 6 caracteres','error');return;}
    user={name,email,password:pass};
    localStorage.setItem('pc_user',JSON.stringify(user));
    loginSuccess();
  }
  function loginSuccess(){
    closeModal('authModal');
    updateAuthUI();
    toast(`Bem-vindo, ${user.name.split(' ')[0]}! 🐾`,'success');
  }
  function doLogout(){
    user=null;
    localStorage.removeItem('pc_user');
    updateAuthUI();
    goTo('home');
    toast('Até logo! 🐾');
  }
  function updateAuthUI(){
    const btn=document.getElementById('authBtn');
    if(user){
      const initials=user.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
      btn.className='nav-btn logged';
      btn.innerHTML=`<span>🐾</span><span class="nav-user-name">${user.name.split(' ')[0]}</span>`;
      btn.onclick=()=>goTo('conta');
    } else {
      btn.className='nav-btn';
      btn.textContent='Entrar';
      btn.onclick=openAuth;
    }
  }
  
  // ════════════════════════════════════════════
  // CART
  // ════════════════════════════════════════════
  function saveCart(){localStorage.setItem('pc_cart',JSON.stringify(cart));}
  function openCart(){
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    renderCart();
  }
  function closeCart(){
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
  }
  function addToCart(id,size,qty=1){
    const p=PRODUCTS.find(x=>x.id===id);
    if(!p)return;
    const s=size||p.sizes[0];
    const key=`${id}-${s}`;
    const existing=cart.find(x=>x.key===key);
    if(existing){existing.qty+=qty;}
    else{cart.push({key,id,name:p.name,price:p.price,size:s,emoji:p.emoji,qty});}
    saveCart();updateCartBadge();
    toast(`${p.name} adicionado ao carrinho! 🛒`,'success');
  }
  function removeFromCart(key){
    cart=cart.filter(x=>x.key!==key);saveCart();updateCartBadge();renderCart();
  }
  function changeQty(key,delta){
    const item=cart.find(x=>x.key===key);
    if(!item)return;
    item.qty+=delta;
    if(item.qty<=0)removeFromCart(key);
    else{saveCart();renderCart();updateCartBadge();}
  }
  function updateCartBadge(){
    const total=cart.reduce((s,i)=>s+i.qty,0);
    const badge=document.getElementById('cartBadge');
    badge.textContent=total;
    badge.classList.toggle('show',total>0);
  }
  function renderCart(){
    const el=document.getElementById('cartItems');
    const footer=document.getElementById('cartFooter');
    const badge=document.getElementById('cartCountBadge');
    const total=cart.reduce((s,i)=>s+i.qty,0);
    badge.textContent=`${total} ${total===1?'item':'itens'}`;
    if(!cart.length){
      el.innerHTML=`<div class="cart-empty"><div class="empty-icon">🛒</div><p>Seu carrinho está vazio</p><small>Adicione produtos para começar!</small></div>`;
      footer.style.display='none';return;
    }
    footer.style.display='block';
    el.innerHTML=cart.map(item=>`
      <div class="cart-item">
        <div class="cart-item-img">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">Tamanho: ${item.size}</div>
          <div class="cart-item-price">R$ ${(item.price*item.qty).toFixed(2).replace('.',',')}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty('${item.key}',-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.key}',1)">+</button>
            <button class="cart-item-remove" onclick="removeFromCart('${item.key}')">🗑️</button>
          </div>
        </div>
      </div>`).join('');
    const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
    document.getElementById('cartSubtotal').textContent=`R$ ${subtotal.toFixed(2).replace('.',',')}`;
    document.getElementById('cartTotal').textContent=`R$ ${subtotal.toFixed(2).replace('.',',')}`;
  }
  
  // ════════════════════════════════════════════
  // CHECKOUT
  // ════════════════════════════════════════════
  function openCheckout(){
    if(!user){closeCart();toast('Faça login para finalizar a compra','info');setTimeout(()=>openModal('authModal'),400);return;}
    closeCart();
    const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
    document.getElementById('checkoutContent').innerHTML=`
      <div class="form-group"><label>CEP de entrega</label><input type="text" id="ckCep" placeholder="00000-000" maxlength="9"></div>
      <div class="form-group"><label>Endereço</label><input type="text" id="ckEnd" placeholder="Rua, número, bairro"></div>
      <div style="background:var(--bg);border-radius:var(--radius-sm);padding:16px;margin:16px 0">
        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:0.88rem;color:var(--muted);margin-bottom:8px">
          <span>${cart.reduce((s,i)=>s+i.qty,0)} itens</span><span>R$ ${subtotal.toFixed(2).replace('.',',')}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:0.88rem;color:var(--success)">
          <span>Frete</span><span>Grátis 🎉</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-weight:900;font-size:1.1rem;color:var(--text);margin-top:10px;padding-top:10px;border-top:1px solid rgba(0,0,0,0.08)">
          <span>Total</span><span style="color:var(--purple);font-family:'Fredoka One',cursive">R$ ${subtotal.toFixed(2).replace('.',',')}</span>
        </div>
      </div>
      <button class="btn-full" onclick="confirmOrder()">Confirmar Pedido 🐾</button>
    `;
    openModal('checkoutModal');
  }
  function confirmOrder(){
    const cep=document.getElementById('ckCep')?.value;
    const end=document.getElementById('ckEnd')?.value;
    if(!cep||!end){toast('Preencha o endereço de entrega','error');return;}
    const order={id:`#${Math.floor(Math.random()*90000+10000)}`,date:new Date().toLocaleDateString('pt-BR'),items:[...cart],total:cart.reduce((s,i)=>s+i.price*i.qty,0),status:'processando',address:end};
    orders.unshift(order);
    localStorage.setItem('pc_orders',JSON.stringify(orders));
    cart=[];saveCart();updateCartBadge();
    closeModal('checkoutModal');
    toast(`Pedido ${order.id} confirmado! 🎉`,'success');
    setTimeout(()=>goTo('conta'),1500);
  }
  
  // ════════════════════════════════════════════
  // PRODUCTS
  // ════════════════════════════════════════════
  function renderProducts(){
    const grid=document.getElementById('productGrid');
    if(!grid)return;
    let filtered=currentFilter==='all'?PRODUCTS:PRODUCTS.filter(p=>p.cat===currentFilter);
    const sort=document.getElementById('sortSelect')?.value||'default';
    if(sort==='price-asc')filtered=[...filtered].sort((a,b)=>a.price-b.price);
    else if(sort==='price-desc')filtered=[...filtered].sort((a,b)=>b.price-a.price);
    else if(sort==='name')filtered=[...filtered].sort((a,b)=>a.name.localeCompare(b.name));
    grid.innerHTML=filtered.map(p=>`
      <div class="product-card">
        ${p.badge?`<div class="product-badge ${p.badge}">${p.badge==='new'?'Novo':p.badge==='sale'?'Oferta':'🔥 Hot'}</div>`:''}
        <button class="product-wishlist ${wishlist.includes(p.id)?'active':''}" onclick="toggleWish(${p.id},this)" title="Favoritar">
          ${wishlist.includes(p.id)?'❤️':'🤍'}
        </button>
        <div class="product-img" onclick="openProductModal(${p.id})">${p.emoji}</div>
        <div class="product-body">
          <div class="product-category">${p.cat}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-sizes">${p.sizes.map(s=>`<span class="size-chip">${s}</span>`).join('')}</div>
          <div class="product-footer">
            <div>
              ${p.oldPrice?`<span class="product-price-old">R$ ${p.oldPrice.toFixed(2).replace('.',',')}</span>`:''}
              <span class="product-price">R$ ${p.price.toFixed(2).replace('.',',')}</span>
            </div>
            <button class="btn-add-cart" onclick="addToCart(${p.id},'')">🛒 Add</button>
          </div>
        </div>
      </div>`).join('');
    // Filter button events
    document.querySelectorAll('.filter-btn').forEach(btn=>{
      btn.onclick=()=>{
        currentFilter=btn.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts();
      };
    });
  }
  
  function toggleWish(id,btn){
    if(wishlist.includes(id)){wishlist=wishlist.filter(x=>x!==id);btn.innerHTML='🤍';btn.classList.remove('active');toast('Removido dos favoritos');}
    else{wishlist.push(id);btn.innerHTML='❤️';btn.classList.add('active');toast('Adicionado aos favoritos ❤️','success');}
    localStorage.setItem('pc_wish',JSON.stringify(wishlist));
  }
  
  function openProductModal(id){
    const p=PRODUCTS.find(x=>x.id===id);if(!p)return;
    modalProduct=p;modalQty=1;modalSize=p.sizes[0];
    document.getElementById('pmImg').innerHTML=`<span style="font-size:7rem">${p.emoji}</span>`;
    document.getElementById('pmCat').textContent=p.cat;
    document.getElementById('pmName').textContent=p.name;
    document.getElementById('pmPrice').textContent=`R$ ${p.price.toFixed(2).replace('.',',')}`;
    document.getElementById('pmDesc').textContent=p.desc;
    document.getElementById('pmQty').textContent='1';
    document.getElementById('pmSizes').innerHTML=p.sizes.map((s,i)=>`<button class="size-option ${i===0?'selected':''}" onclick="selectSize('${s}',this)">${s}</button>`).join('');
    openModal('productModal');
  }
  function selectSize(s,btn){
    modalSize=s;
    document.querySelectorAll('.size-option').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
  }
  function changeModalQty(d){
    modalQty=Math.max(1,modalQty+d);
    document.getElementById('pmQty').textContent=modalQty;
  }
  function addModalToCart(){
    if(modalProduct){addToCart(modalProduct.id,modalSize,modalQty);closeModal('productModal');}
  }
  
  // ════════════════════════════════════════════
  // ACCOUNT
  // ════════════════════════════════════════════
  function renderAccount(){
    if(!user)return;
    const initials=user.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
    document.getElementById('accAvatar').textContent=initials;
    document.getElementById('accName').textContent=user.name;
    document.getElementById('accEmail').textContent=user.email;
    document.getElementById('profName').value=user.name;
    document.getElementById('profEmail').value=user.email;
    // Orders
    const ol=document.getElementById('ordersList');
    if(!orders.length){ol.innerHTML=`<div class="empty-state"><div class="empty-icon">📦</div><p>Nenhum pedido ainda</p><small>Seus pedidos aparecerão aqui</small><br><button class="btn-sm" style="margin-top:16px" onclick="goTo('produtos')">Começar a comprar</button></div>`;return;}
    ol.innerHTML=orders.map(o=>`
      <div class="order-item">
        <div>
          <div style="font-weight:800;font-size:0.9rem">Pedido ${o.id}</div>
          <div style="font-size:0.78rem;color:var(--muted);margin-top:2px">${o.date} · ${o.items.length} ${o.items.length===1?'item':'itens'}</div>
          <div style="font-size:0.78rem;color:var(--muted)">${o.address}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:'Fredoka One',cursive;color:var(--purple);font-size:1rem">R$ ${o.total.toFixed(2).replace('.',',')}</div>
          <span class="order-status ${o.status}">${o.status==='entregue'?'✓ Entregue':'⏳ Processando'}</span>
        </div>
      </div>`).join('');
    // Fav
    const fl=document.getElementById('favList');
    const favProds=PRODUCTS.filter(p=>wishlist.includes(p.id));
    if(!favProds.length){fl.innerHTML=`<div class="empty-state"><div class="empty-icon">❤️</div><p>Nenhum favorito ainda</p><small>Clique no coração para favoritar</small></div>`;return;}
    fl.innerHTML=`<div class="produtos-grid" style="grid-template-columns:repeat(2,1fr)">${favProds.map(p=>`<div class="product-card"><div class="product-img" onclick="openProductModal(${p.id})">${p.emoji}</div><div class="product-body"><div class="product-name">${p.name}</div><div class="product-footer"><span class="product-price">R$ ${p.price.toFixed(2).replace('.',',')}</span><button class="btn-add-cart" onclick="addToCart(${p.id},'')">🛒</button></div></div></div>`).join('')}</div>`;
  }
  function showAccountSection(id,btn){
    document.querySelectorAll('.account-section').forEach(s=>s.classList.remove('active'));
    document.getElementById(`section-${id}`).classList.add('active');
    document.querySelectorAll('.account-nav-item').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  }
  function saveProfile(){
    const name=document.getElementById('profName').value.trim();
    const email=document.getElementById('profEmail').value.trim();
    if(!name||!email){toast('Preencha todos os campos','error');return;}
    user.name=name;user.email=email;
    localStorage.setItem('pc_user',JSON.stringify(user));
    updateAuthUI();renderAccount();
    toast('Perfil atualizado!','success');
  }
  
  // ════════════════════════════════════════════
  // MODALS
  // ════════════════════════════════════════════
  function openModal(id){document.getElementById(id).classList.add('open');}
  function closeModal(id){document.getElementById(id).classList.remove('open');}
  document.querySelectorAll('.modal-overlay').forEach(o=>{
    o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open');});
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-overlay.open').forEach(o=>o.classList.remove('open'));});
  
  // ════════════════════════════════════════════
  // CONTACT FORM
  // ════════════════════════════════════════════
  function sendContact(){
    const nome=document.getElementById('cNome')?.value.trim();
    const email=document.getElementById('cEmail')?.value.trim();
    const msg=document.getElementById('cMsg')?.value.trim();
    if(!nome||!email||!msg){toast('Preencha todos os campos obrigatórios','error');return;}
    if(!email.includes('@')){toast('Email inválido','error');return;}
    toast('Mensagem enviada! Entraremos em contato em breve 🐾','success');
    document.getElementById('cNome').value='';
    document.getElementById('cEmail').value='';
    document.getElementById('cMsg').value='';
  }
  
  // ════════════════════════════════════════════
  // TESTIMONIALS SLIDER
  // ════════════════════════════════════════════
  const track=document.getElementById('testiTrack');
  const dots=document.querySelectorAll('.testi-dot');
  let cur=0;
  function getPerView(){return window.innerWidth<640?1:window.innerWidth<1024?2:3;}
  function totalSlides(){return track.children.length-getPerView();}
  function goSlide(idx){
    cur=Math.max(0,Math.min(idx,totalSlides()));
    const w=track.children[0].offsetWidth+24;
    track.style.transform=`translateX(-${cur*w}px)`;
    dots.forEach((d,i)=>d.classList.toggle('active',i===Math.min(cur,dots.length-1)));
  }
  document.getElementById('testiNext').addEventListener('click',()=>goSlide(cur+1));
  document.getElementById('testiPrev').addEventListener('click',()=>goSlide(cur-1));
  dots.forEach((d,i)=>d.addEventListener('click',()=>goSlide(i)));
  window.addEventListener('resize',()=>goSlide(0));
  setInterval(()=>{if(cur>=totalSlides())goSlide(0);else goSlide(cur+1);},5000);
  
  // ════════════════════════════════════════════
  // SCROLL REVEAL
  // ════════════════════════════════════════════
  const reveals=document.querySelectorAll('.reveal');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        const delay=(Array.from(e.target.parentElement.children).indexOf(e.target)%4)*100;
        setTimeout(()=>e.target.classList.add('visible'),delay);
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.1});
  reveals.forEach(el=>obs.observe(el));
  
  // ════════════════════════════════════════════
  // COUNTERS
  // ════════════════════════════════════════════
  const counters=document.querySelectorAll('[data-target]');
  const cObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el=e.target,target=+el.dataset.target;
        let n=0,step=target/55;
        const t=setInterval(()=>{
          n+=step;
          if(n>=target){el.textContent=target+(target<100?'%':'+');clearInterval(t);}
          else el.textContent=Math.floor(n);
        },16);
        cObs.unobserve(el);
      }
    });
  },{threshold:0.5});
  counters.forEach(c=>cObs.observe(c));
  
  // ════════════════════════════════════════════
  // NAVBAR SCROLL
  // ════════════════════════════════════════════
  window.addEventListener('scroll',()=>{
    const nav=document.querySelector('nav');
    nav.style.boxShadow=window.scrollY>20?'0 4px 30px rgba(124,58,237,0.15)':'0 2px 20px rgba(124,58,237,0.08)';
  });
  
  // ════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════
  updateAuthUI();
  updateCartBadge();
  renderProducts();