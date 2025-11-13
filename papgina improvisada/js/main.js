// main.js - Interactividad: menú, lightbox y validación de formularios

// Helper para toggle aria-expanded
function toggleMenu(button, navId){
  const nav = document.getElementById(navId);
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  if(nav){
    nav.style.display = expanded ? 'none' : 'block';
  }
}

// Menú hamburguesa: aplica a botones con clase menu-toggle y navs enlazadas por aria-controls
document.addEventListener('DOMContentLoaded', ()=>{
  // Inicializar año en footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  document.querySelectorAll('.menu-toggle').forEach(btn => {
    const navId = btn.getAttribute('aria-controls');
    btn.addEventListener('click', ()=> toggleMenu(btn, navId));
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox && lightbox.querySelector('img');
  const lbClose = lightbox && lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.card-media').forEach(el => {
    el.addEventListener('click', (e)=>{
      const src = el.dataset.img || el.querySelector('img')?.src;
      const alt = el.querySelector('img')?.alt || '';
      if(lbImg && lightbox){
        lbImg.src = src;
        lbImg.alt = alt;
        lightbox.setAttribute('aria-hidden','false');
      }
    });
  });

  if(lbClose){
    lbClose.addEventListener('click', ()=>{
      lightbox.setAttribute('aria-hidden','true');
      lbImg.src = '';
    });
  }

  if(lightbox){
    lightbox.addEventListener('click', (e)=>{
      if(e.target === lightbox){
        lightbox.setAttribute('aria-hidden','true');
        if(lbImg) lbImg.src = '';
      }
    });
  }

  // Formularios: newsletter y contacto
  const newsletter = document.getElementById('newsletter-form');
  if(newsletter){
    newsletter.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = newsletter.querySelector('input[name="email"]');
      const feedback = newsletter.querySelector('.form-feedback');
      if(!email.checkValidity()){
        feedback.textContent = 'Introduce un correo válido.';
        email.focus();
        return;
      }
      feedback.textContent = 'Gracias por suscribirte. Revisa tu correo para confirmar.';
      newsletter.reset();
    });
  }

  const contact = document.getElementById('contact-form');
  if(contact){
    contact.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = contact.querySelector('#name');
      const email = contact.querySelector('#email');
      const message = contact.querySelector('#message');
      const feedback = contact.querySelector('.form-feedback');

      if(!name.value.trim()){ feedback.textContent='El nombre es obligatorio.'; name.focus(); return; }
      if(!email.checkValidity()){ feedback.textContent='Introduce un correo válido.'; email.focus(); return; }
      if(!message.value.trim() || message.value.trim().length < 10){ feedback.textContent='Escribe un mensaje (10+ caracteres).'; message.focus(); return; }

      // Simular envío y mostrar confirmación
      feedback.textContent = 'Mensaje enviado. Gracias — te contactaremos pronto.';
      contact.reset();
    });
  }

  // Animaciones al entrar: observar elementos y añadir clase .visible
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  },{threshold:0.12});

  document.querySelectorAll('.card, .hero-copy, .hero-image').forEach(el=>io.observe(el));
});