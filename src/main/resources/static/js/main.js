/* ============================================================
   LOBOSO — JavaScript principal (REFACTORIZADO)
   ============================================================ */

const WA_NUMBER = '525519477201';

// ── Función para formatear precios ──
function formatPrice(price) {
  if (!price) return '';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
}

// ── Función de escape HTML ──
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ── Obtener URL base de la API ──
function getApiBaseUrl() {
  // Si estamos en producción, usar la URL relativa
  // Si estamos en desarrollo local, usar la IP correcta
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // Si es localhost o 127.0.0.1, usar la misma URL
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return window.location.origin;
  }
  
  // Si es una IP de red local (ej: 192.168.x.x), usar la misma
  if (hostname.match(/^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])/)) {
    return window.location.origin;
  }
  
  // En cualquier otro caso, usar la misma URL
  return window.location.origin;
}

// ── Función para cargar servicios (unificada para cualquier página) ──
function loadServicios(containerId = 'serviciosGrid') {
  const grid = document.getElementById(containerId);
  if (!grid) {
    // Si no hay grid, no hacer nada (puede que estemos en otra página)
    return;
  }
  
  // Mostrar loading
  grid.innerHTML = `
    <div class="col-span-full text-center py-12">
      <div class="inline-flex items-center gap-3 text-primary">
        <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Cargando servicios...</span>
      </div>
    </div>
  `;
  
  // Construir URL absoluta para móvil
  const baseUrl = getApiBaseUrl();
  const apiUrl = baseUrl + '/api/servicios/activos';
  
  console.log('📡 Cargando servicios desde:', apiUrl);
  console.log('📱 Dispositivo:', window.innerWidth < 768 ? 'Móvil' : 'Desktop');
  
  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    // Timeout para evitar que se quede colgado
    signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then(servicios => {
    console.log('✅ Servicios cargados:', servicios.length);
    
    if (!servicios || servicios.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-12 text-on-surface-variant">
          No hay servicios disponibles por el momento.
        </div>
      `;
      return;
    }
    
    renderServicios(grid, servicios);
  })
  .catch(error => {
    console.error('❌ Error al cargar servicios:', error);
    
    // Si el error es por timeout, mostrar mensaje específico
    let errorMsg = error.message || 'No se pudo conectar con el servidor.';
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      errorMsg = 'La solicitud tardó demasiado tiempo. Verifica tu conexión.';
    }
    
    grid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="inline-flex items-center gap-3 text-red-500 mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="font-semibold text-lg">Error al cargar los servicios</span>
        </div>
        <p class="text-on-surface-variant text-sm max-w-md mx-auto">${escapeHtml(errorMsg)}</p>
        <button onclick="loadServicios('${containerId}')" 
                class="mt-4 btn-blue bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-container transition-colors">
          🔄 Reintentar
        </button>
      </div>
    `;
  });
}

// ── Renderizar servicios en el grid ──
function renderServicios(grid, servicios) {
  let html = '';
  for (let i = 0; i < servicios.length; i++) {
    const s = servicios[i];
    const delay = 0.05 + (i * 0.05);
    
    html += `
      <div class="svc-card bg-white rounded-xl border border-outline-variant overflow-hidden flex flex-col reveal" style="transition-delay: ${delay}s">
        <div class="h-48 overflow-hidden bg-gray-100">
          <img alt="${escapeHtml(s.nombre)}" 
               class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
               src="${s.imagenUrl || 'https://via.placeholder.com/400x300/004e8a/FFFFFF?text=LOBOSO'}"
               onerror="this.src='https://via.placeholder.com/400x300/004e8a/FFFFFF?text=LOBOSO'"/>
        </div>
        <div class="p-6 flex flex-col flex-grow">
          <h3 class="text-[20px] font-semibold text-on-background mb-3">${escapeHtml(s.nombre)}</h3>`;
    
    if (s.caracteristicas && s.caracteristicas.length > 0) {
      html += `<ul class="space-y-1.5 text-[14px] text-on-surface-variant mb-6 flex-grow">`;
      for (let j = 0; j < Math.min(s.caracteristicas.length, 4); j++) {
        html += `
          <li class="flex items-center gap-2">
            <svg class="w-4 h-4 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            ${escapeHtml(s.caracteristicas[j])}
          </li>
        `;
      }
      if (s.caracteristicas.length > 4) {
        html += `<li class="text-primary text-sm mt-1">+${s.caracteristicas.length - 4} características más</li>`;
      }
      html += `</ul>`;
    } else {
      html += `<p class="text-[14px] text-on-surface-variant mb-6 flex-grow">${escapeHtml(s.descripcion || 'Sin descripción')}</p>`;
    }
    
    html += `
          <button onclick="verDetalleServicio(${s.id})" 
                  class="w-full border border-outline-variant text-primary text-[14px] font-semibold py-2.5 rounded-lg text-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
            Ver Detalles
          </button>
        </div>
      </div>
    `;
  }
  
  grid.innerHTML = html;
  
  // Re-inicializar el observer para las nuevas tarjetas
  setTimeout(() => {
    const revEls = document.querySelectorAll('.reveal:not(.in)');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revEls.forEach(el => obs.observe(el));
  }, 100);
}

// ── Función para ver detalle del servicio ──
function verDetalleServicio(id) {
  const baseUrl = getApiBaseUrl();
  const apiUrl = baseUrl + '/api/servicios/' + id;
  
  console.log('📡 Cargando detalle del servicio ID:', id);
  
  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .then(servicio => {
    const modal = document.getElementById('servicioModal');
    const titulo = document.getElementById('modalServicioTitulo');
    const content = document.getElementById('modalServicioContent');
    
    if (!modal || !titulo || !content) {
      console.error('❌ Modal no encontrado');
      return;
    }
    
    titulo.textContent = servicio.nombre;
    
    let caracteristicasHtml = '';
    if (servicio.caracteristicas && servicio.caracteristicas.length > 0) {
      caracteristicasHtml = `
        <div class="mb-6">
          <h4 class="font-semibold text-on-background text-lg mb-3">Características</h4>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
      `;
      for (let i = 0; i < servicio.caracteristicas.length; i++) {
        caracteristicasHtml += `
          <li class="flex items-center gap-2 text-on-surface-variant">
            <svg class="w-5 h-5 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            ${escapeHtml(servicio.caracteristicas[i])}
          </li>
        `;
      }
      caracteristicasHtml += `</ul></div>`;
    }
    
    const whatsappMessage = servicio.whatsappMessage || 'Hola, me interesa el servicio de ' + servicio.nombre + '. ¿Podrían darme más información?';
    const whatsappUrl = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(whatsappMessage);
    
    content.innerHTML = `
      <div class="flex flex-col md:flex-row gap-6">
        <div class="md:w-1/2">
          <img src="${servicio.imagenUrl || 'https://via.placeholder.com/500x400/004e8a/FFFFFF?text=LOBOSO'}" 
               alt="${escapeHtml(servicio.nombre)}" 
               class="w-full rounded-xl shadow-md object-cover"
               onerror="this.src='https://via.placeholder.com/500x400/004e8a/FFFFFF?text=LOBOSO'"/>
        </div>
        <div class="md:w-1/2">
          <p class="text-on-surface-variant leading-relaxed mb-4">${escapeHtml(servicio.descripcionLarga || servicio.descripcion || 'Sin descripción disponible')}</p>
          ${servicio.precioBase ? '<p class="text-2xl font-bold text-primary mb-4">' + formatPrice(servicio.precioBase) + '</p>' : ''}
          ${caracteristicasHtml}
          <a href="${whatsappUrl}" target="_blank" 
             class="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition mt-4">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Cotizar por WhatsApp
          </a>
        </div>
      </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  })
  .catch(error => {
    console.error('❌ Error al cargar detalle del servicio:', error);
    alert('Error al cargar los detalles del servicio. Por favor, intenta de nuevo.');
  });
}

// ── Función para cerrar el modal ──
function closeServicioModal() {
  const modal = document.getElementById('servicioModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// ── Formulario de contacto ──
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('fsub');
  const msg = document.getElementById('fsuccess');
  if (btn) {
    btn.textContent = 'Enviando…';
    btn.disabled = true;
  }
  setTimeout(() => {
    if (btn) {
      btn.style.display = 'none';
    }
    if (msg) {
      msg.classList.remove('hidden');
    }
    e.target.reset();
  }, 1100);
}

// ── Inicializar todo cuando el DOM esté listo ──
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 LOBOSO - Inicializando...');
  console.log('📱 Dispositivo:', window.innerWidth < 768 ? 'Móvil' : 'Desktop');
  console.log('🌐 URL base:', getApiBaseUrl());
  
  // WhatsApp FAB
  document.querySelectorAll('[data-wa-link]').forEach(el => {
    el.href = 'https://wa.me/' + WA_NUMBER;
  });

  // Header: efecto scroll
  const hdr = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (hdr) hdr.classList.toggle('solid', window.scrollY > 50);
  });

  // Hamburger
  const hamBtn = document.getElementById('ham-btn');
  const mobMenu = document.getElementById('mob-menu');
  const hl1 = document.getElementById('hl1');
  const hl2 = document.getElementById('hl2');
  const hl3 = document.getElementById('hl3');
  let menuOpen = false;

  if (hamBtn) {
    hamBtn.addEventListener('click', () => {
      menuOpen = !menuOpen;
      if (mobMenu) mobMenu.classList.toggle('open', menuOpen);
      if (menuOpen) {
        if (hl1) hl1.style.transform = 'rotate(45deg) translateY(7px)';
        if (hl2) hl2.style.opacity = '0';
        if (hl3) hl3.style.transform = 'rotate(-45deg) translateY(-7px)';
      } else {
        if (hl1) hl1.style.transform = '';
        if (hl2) hl2.style.opacity = '';
        if (hl3) hl3.style.transform = '';
      }
    });
  }

  document.querySelectorAll('.mob-lnk').forEach(l => l.addEventListener('click', () => {
    menuOpen = false;
    if (mobMenu) mobMenu.classList.remove('open');
    if (hl1) hl1.style.transform = '';
    if (hl2) hl2.style.opacity = '';
    if (hl3) hl3.style.transform = '';
  }));

  // Scroll reveal
  const revEls = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  revEls.forEach(el => obs.observe(el));

  // ═══════════════════════════════════════════════════════════
  // CARGAR SERVICIOS - EN CUALQUIER PÁGINA QUE TENGA EL GRID
  // ═══════════════════════════════════════════════════════════
  const serviciosGrid = document.getElementById('serviciosGrid');
  if (serviciosGrid) {
    console.log('📦 Grid de servicios encontrado, cargando...');
    loadServicios('serviciosGrid');
  } else {
    console.log('ℹ️ No hay grid de servicios en esta página');
  }

  // Cerrar modal con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeServicioModal();
    }
  });

// ── Animación de entrada para sección promocionales ──
  const promoBanner = document.querySelector('.promo-banner-section');
  if (promoBanner) {
    promoBanner.querySelectorAll('.promo-mini-card, .promo-stat-bar').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity .5s ease ${i * 0.08}s, transform .5s ease ${i * 0.08}s`;
    });

    const promoObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.promo-mini-card, .promo-stat-bar').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
          // El bloque de texto usa la clase .reveal ya existente
          promoObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    promoObs.observe(promoBanner);
  }

  // ============================================================
  // CARRUSEL DE CLIENTES - CON LOOP INFINITO
  // ============================================================
  initClientCarousel();
});

// ── Inicializar carrusel de clientes ──
function initClientCarousel() {
  const carousel = document.getElementById('clientCarousel');
  const dotsContainer = document.getElementById('carouselDots');
  
  if (!carousel) return;
  
  console.log('🎠 Inicializando carrusel de clientes...');
  
  // Obtener los items originales
  const originalItems = Array.from(carousel.querySelectorAll('.client-carousel-item'));
  const totalOriginalItems = originalItems.length;
  
  // Si no hay items, salir
  if (totalOriginalItems === 0) {
    console.warn('⚠️ No hay items en el carrusel');
    return;
  }
  
  // Clonar items para efecto infinito (duplicar el conjunto)
  const clones = originalItems.map(item => item.cloneNode(true));
  clones.forEach(clone => carousel.appendChild(clone));
  
  // Todos los items (originales + clones)
  const allItems = carousel.querySelectorAll('.client-carousel-item');
  const totalItems = allItems.length;
  
  let currentIndex = 0;
  let itemsPerView = getItemsPerView();
  let autoPlayInterval = null;
  const AUTO_PLAY_DELAY = 3500;
  let isTransitioning = false;

  // Calcular items por vista
  function getItemsPerView() {
    const width = window.innerWidth;
    if (width >= 1024) return 5;
    if (width >= 768) return 3;
    if (width >= 480) return 2;
    return 1;
  }

  // Calcular el ancho de un item
  function getItemWidth() {
    const wrapper = carousel.parentElement;
    if (!wrapper) return 150;
    const wrapperWidth = wrapper.clientWidth;
    const gap = getGap();
    // Restar padding del wrapper (0 en este caso)
    const availableWidth = wrapperWidth;
    return (availableWidth - (gap * (itemsPerView - 1))) / itemsPerView;
  }

  function getGap() {
    const width = window.innerWidth;
    if (width >= 1024) return 20;
    if (width >= 768) return 16;
    if (width >= 480) return 14;
    return 10;
  }

  // Actualizar items per view
  function updateItemsPerView() {
    const newItemsPerView = getItemsPerView();
    if (newItemsPerView !== itemsPerView) {
      itemsPerView = newItemsPerView;
      updateCarousel(false);
      createDots();
    }
  }

  // Crear dots
  function createDots() {
    if (!dotsContainer) return;
    const totalSlides = Math.ceil(totalOriginalItems / itemsPerView);
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', function() {
        goToSlide(parseInt(this.getAttribute('data-index')));
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Actualizar dots
  function updateDots() {
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
    const totalSlides = Math.ceil(totalOriginalItems / itemsPerView);
    // Determinar qué slide real corresponde
    let realIndex = currentIndex % totalOriginalItems;
    let slideIndex = Math.floor(realIndex / itemsPerView);
    if (slideIndex >= totalSlides) slideIndex = 0;
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === slideIndex);
    });
  }

  // Mover carrusel
  function updateCarousel(animate = true) {
    if (!carousel) return;
    const itemWidth = getItemWidth();
    const gap = getGap();
    const offset = currentIndex * (itemWidth + gap);
    carousel.style.transition = animate ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    carousel.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  // Ir a un slide específico
  function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const totalSlides = Math.ceil(totalOriginalItems / itemsPerView);
    // Si es el último slide de los clones, saltar al principio
    if (index >= totalSlides) {
      index = 0;
    }
    if (index < 0) {
      index = totalSlides - 1;
    }
    
    currentIndex = index * itemsPerView;
    updateCarousel(true);
    resetAutoPlay();
    
    setTimeout(() => {
      isTransitioning = false;
      // Si estamos en los clones, saltar al original correspondiente
      if (currentIndex >= totalOriginalItems) {
        currentIndex = currentIndex - totalOriginalItems;
        updateCarousel(false);
        updateDots();
      }
    }, 650);
  }

  // Avanzar automáticamente
  function nextSlide() {
    if (isTransitioning) return;
    const totalSlides = Math.ceil(totalOriginalItems / itemsPerView);
    const currentSlide = Math.floor((currentIndex % totalOriginalItems) / itemsPerView);
    const nextSlideIndex = (currentSlide + 1) % totalSlides;
    goToSlide(nextSlideIndex);
  }

  // Resetear autoplay
  function resetAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
    startAutoPlay();
  }

  // Iniciar autoplay
  function startAutoPlay() {
    if (autoPlayInterval) return;
    autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
  }

  // Detener autoplay
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  // Inicializar
  function init() {
    itemsPerView = getItemsPerView();
    currentIndex = 0;
    createDots();
    updateCarousel(false);
    startAutoPlay();

    // Pausar al hacer hover
    const wrapper = document.querySelector('.client-carousel-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAutoPlay);
      wrapper.addEventListener('mouseleave', startAutoPlay);
    }

    // Recalcular en resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateItemsPerView();
        updateCarousel(false);
      }, 250);
    });
  }

  init();
}