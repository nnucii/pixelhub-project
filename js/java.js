// ===== Menú y página activa =====
(function () {
  let pagina = location.pathname.split('/').pop() || 'index.html';
  if (pagina.startsWith('noticia-')) pagina = 'noticias.html';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === pagina) a.classList.add('activo');
  });
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  btn.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    btn.setAttribute('aria-expanded', abierto);
  });
})();

// ===== Minijuego (index.html) =====
(function () {
  const campo = document.getElementById('campo');
  if (!campo) return;
  const objetivo = document.getElementById('objetivo');
  const msg = document.getElementById('mensaje-juego');
  const elPuntos = document.getElementById('puntos');
  const elTiempo = document.getElementById('tiempo');
  const elRecord = document.getElementById('record');
  let puntos = 0, tiempo = 15, reloj = null;

  const guardado = () => { try { return +localStorage.getItem('pixelhub-record') || 0; } catch (e) { return 0; } };
  elRecord.textContent = guardado();

  function mover() {
    const x = Math.random() * (campo.clientWidth - 44);
    const y = Math.random() * (campo.clientHeight - 44);
    objetivo.style.left = x + 'px';
    objetivo.style.top = y + 'px';
  }

  function terminar() {
    clearInterval(reloj);
    objetivo.style.display = 'none';
    msg.style.display = 'flex';
    const record = Math.max(guardado(), puntos);
    try { localStorage.setItem('pixelhub-record', record); } catch (e) {}
    elRecord.textContent = record;
    msg.textContent = '¡Tiempo! Hiciste ' + puntos + ' puntos.';
  }

  document.getElementById('iniciar').addEventListener('click', () => {
    clearInterval(reloj);
    puntos = 0; tiempo = 15;
    elPuntos.textContent = 0; elTiempo.textContent = 15;
    msg.style.display = 'none';
    objetivo.style.display = 'block';
    mover();
    reloj = setInterval(() => {
      tiempo--;
      elTiempo.textContent = tiempo;
      if (tiempo <= 0) terminar();
    }, 1000);
  });

  objetivo.addEventListener('click', () => {
    puntos++;
    elPuntos.textContent = puntos;
    mover();
  });
})();

// ===== Biblioteca de juegos (juegos.html) =====
(function () {
  const catalogo = document.getElementById('catalogo');
  if (!catalogo) return;

  // Para agregar un juego, sumá una línea a esta lista.
  // Nota: No funciona, ver por qué
  // En "video" pegá el link de embed de YouTube (https://www.youtube.com/embed/ID)
  // o la ruta de un archivo .mp4 (por ej. '../video/hollow-quest.mp4').
  // "nivel" define los requisitos: 'liviano', 'medio' o 'pesado'. "disco" son los GB necesarios.
  const juegos = [
    { id: 1,  nombre: 'Hollow Quest',    genero: 'Aventura',   nivel: 'medio',   disco: 25, video: '', desc: 'Explorá ruinas antiguas con combate preciso y mapas enormes.' },
    { id: 2,  nombre: 'Turbo Drift',     genero: 'Carreras',   nivel: 'medio',   disco: 30, video: '', desc: 'Dominá los derrapes y competí en circuitos urbanos.' },
    { id: 3,  nombre: 'Imperio Cero',    genero: 'Estrategia', nivel: 'liviano', disco: 15, video: '', desc: 'Construí tu civilización por turnos: diplomacia o guerra.' },
    { id: 4,  nombre: 'Blade Rush',      genero: 'Acción',     nivel: 'medio',   disco: 35, video: '', desc: 'Combates veloces, combos y jefes de gran tamaño.' },
    { id: 5,  nombre: 'Sombras del Faro', genero: 'Terror',    nivel: 'pesado',  disco: 40, video: '', desc: 'Un faro abandonado, poca luz y mucho suspenso.' },
    { id: 6,  nombre: 'Gol Total',       genero: 'Deportes',   nivel: 'liviano', disco: 20, video: '', desc: 'Fútbol arcade para jugar solo o con amigos.' },
    { id: 7,  nombre: 'Isla Nube',       genero: 'Aventura',   nivel: 'liviano', disco: 12, video: '', desc: 'Viajá entre islas flotantes y descubrí sus secretos.' },
    { id: 8,  nombre: 'Neon Circuit',    genero: 'Carreras',   nivel: 'pesado',  disco: 45, video: '', desc: 'Carreras futuristas a toda velocidad con música electrónica.' },
    { id: 9,  nombre: 'Torre y Mago',    genero: 'Estrategia', nivel: 'liviano', disco: 5,  video: '', desc: 'Defendé tu torre con hechizos y trampas ingeniosas.' },
    { id: 10, nombre: 'Pixel Brawl',     genero: 'Acción',     nivel: 'liviano', disco: 3,  video: '', desc: 'Peleas arcade para hasta cuatro jugadores.' },
    { id: 11, nombre: 'Noche en el Motel', genero: 'Terror',   nivel: 'medio',   disco: 18, video: '', desc: 'Sobreviví una noche y resolvé el misterio del motel.' },
    { id: 12, nombre: 'Básquet Street',  genero: 'Deportes',   nivel: 'medio',   disco: 22, video: '', desc: 'Partidos 3 contra 3 en canchas callejeras.' }
  ];

  // Requisitos del sistema según el nivel del juego
  const REQ = {
    liviano: {
      min: ['Windows 10 (64 bits)', 'Procesador de 4 núcleos', '4 GB de RAM', 'Gráficos integrados'],
      rec: ['Windows 10/11 (64 bits)', 'Procesador de 4 núcleos o más', '8 GB de RAM', 'Placa de video con 2 GB']
    },
    medio: {
      min: ['Windows 10 (64 bits)', 'Procesador de 4 núcleos', '8 GB de RAM', 'Placa de video con 2 GB'],
      rec: ['Windows 10/11 (64 bits)', 'Procesador de 6 núcleos', '16 GB de RAM', 'Placa de video con 6 GB']
    },
    pesado: {
      min: ['Windows 10 (64 bits)', 'Procesador de 6 núcleos', '16 GB de RAM', 'Placa de video con 4 GB'],
      rec: ['Windows 11 (64 bits)', 'Procesador de 8 núcleos', '16 GB de RAM o más', 'Placa de video con 8 GB']
    }
  };
  const ETIQ = ['Sistema', 'Procesador', 'Memoria', 'Gráficos'];

  const buscador = document.getElementById('buscador');
  const filtros = document.getElementById('filtros');
  const contador = document.getElementById('contador');
  const vacio = document.getElementById('vacio');

  let genero = 'todos';
  let favoritos = [];
  try { favoritos = JSON.parse(localStorage.getItem('pixelhub-favoritos')) || []; } catch (e) {}

  function guardar() {
    try { localStorage.setItem('pixelhub-favoritos', JSON.stringify(favoritos)); } catch (e) {}
  }

  // Botones de filtro: Todos, Favoritos y un botón por cada género
  const generos = ['todos', 'favoritos'].concat([...new Set(juegos.map(j => j.genero))]);
  generos.forEach(g => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.filtro = g;
    b.textContent = g === 'todos' ? 'Todos' : g === 'favoritos' ? '♥ Favoritos' : g;
    if (g === 'todos') b.classList.add('activo');
    filtros.appendChild(b);
  });

  // Si vienen de la portada con ?genero=Acción, se activa ese filtro
  const pedido = new URLSearchParams(location.search).get('genero');
  if (pedido && generos.includes(pedido)) {
    genero = pedido;
    filtros.querySelectorAll('button').forEach(b => b.classList.toggle('activo', b.dataset.filtro === pedido));
  }

  // ----- Ventana flotante con video y requisitos -----
  const ventana = document.createElement('dialog');
  ventana.className = 'ventana-juego';
  ventana.setAttribute('aria-labelledby', 'vj-titulo');
  ventana.innerHTML =
    '<button type="button" class="cerrar" aria-label="Cerrar">✕</button>' +
    '<div class="vj-cabecera"><span class="genero" id="vj-genero"></span><h2 id="vj-titulo"></h2><p id="vj-desc"></p></div>' +
    '<div class="vj-cuerpo"><div class="vj-video" id="vj-video"></div><div class="vj-req" id="vj-req"></div></div>';
  document.body.appendChild(ventana);

  function lista(titulo, items, disco) {
    const caja = document.createElement('div');
    const h = document.createElement('h3');
    h.textContent = titulo;
    caja.appendChild(h);
    const ul = document.createElement('ul');
    items.concat(['Disco: ' + disco + ' GB libres']).forEach((t, i) => {
      const li = document.createElement('li');
      const b = document.createElement('b');
      if (i < ETIQ.length) { b.textContent = ETIQ[i] + ': '; li.appendChild(b); }
      li.appendChild(document.createTextNode(t));
      ul.appendChild(li);
    });
    caja.appendChild(ul);
    return caja;
  }

  function abrirVentana(j) {
    ventana.querySelector('#vj-genero').textContent = j.genero;
    ventana.querySelector('#vj-titulo').textContent = j.nombre;
    ventana.querySelector('#vj-desc').textContent = j.desc;

    const cajaVideo = ventana.querySelector('#vj-video');
    cajaVideo.innerHTML = '';
    if (j.video) {
      let el;
      if (/\.(mp4|webm)$/i.test(j.video)) {
        el = document.createElement('video');
        el.controls = true;
        el.src = j.video;
      } else {
        el = document.createElement('iframe');
        el.src = j.video;
        el.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
        el.allowFullscreen = true;
      }
      el.title = 'Gameplay de ' + j.nombre;
      cajaVideo.appendChild(el);
    } else {
      const ph = document.createElement('div');
      ph.className = 'vj-sinvideo';
      ph.innerHTML = '<span>▶</span><p>Video de gameplay próximamente</p>';
      cajaVideo.appendChild(ph);
    }

    const cajaReq = ventana.querySelector('#vj-req');
    cajaReq.innerHTML = '';
    const r = REQ[j.nivel];
    const t = document.createElement('h2');
    t.className = 'vj-titulo-req';
    t.textContent = 'Requisitos del sistema';
    cajaReq.appendChild(t);
    cajaReq.appendChild(lista('Mínimos', r.min, j.disco));
    cajaReq.appendChild(lista('Recomendados', r.rec, j.disco));
    ventana.showModal();
  }

  function cerrarVentana() {
    ventana.close();
  }
  // Al cerrar se vacía el video para que deje de sonar
  ventana.addEventListener('close', () => { ventana.querySelector('#vj-video').innerHTML = ''; });
  ventana.querySelector('.cerrar').addEventListener('click', cerrarVentana);
  // Clic en el fondo oscuro = cerrar
  ventana.addEventListener('click', e => { if (e.target === ventana) cerrarVentana(); });

  function dibujar() {
    const texto = buscador.value.trim().toLowerCase();
    const lista = juegos.filter(j => {
      const okGenero = genero === 'todos' || (genero === 'favoritos' ? favoritos.includes(j.id) : j.genero === genero);
      const okTexto = !texto || (j.nombre + ' ' + j.genero + ' ' + j.desc).toLowerCase().includes(texto);
      return okGenero && okTexto;
    });

    catalogo.innerHTML = '';
    lista.forEach(j => {
      const esFav = favoritos.includes(j.id);
      const t = document.createElement('article');
      t.className = 'tarjeta';
      t.innerHTML =
        '<span class="genero"></span>' +
        '<button type="button" class="fav' + (esFav ? ' activo' : '') + '" aria-pressed="' + esFav + '" aria-label="Marcar favorito">' + (esFav ? '♥' : '♡') + '</button>' +
        '<h3></h3><p></p><span class="mas">Ver gameplay y requisitos ▶</span>';
      t.tabIndex = 0;
      t.setAttribute('role', 'button');
      t.classList.add('clicable');
      t.querySelector('.genero').textContent = j.genero;
      t.querySelector('h3').textContent = j.nombre;
      t.querySelector('p').textContent = j.desc;
      t.addEventListener('click', () => abrirVentana(j));
      t.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target === t) { e.preventDefault(); abrirVentana(j); }
      });
      t.querySelector('.fav').addEventListener('click', e => {
        e.stopPropagation();
        favoritos = esFav ? favoritos.filter(id => id !== j.id) : favoritos.concat(j.id);
        guardar();
        dibujar();
      });
      catalogo.appendChild(t);
    });

    contador.textContent = lista.length + ' de ' + juegos.length + ' juegos';
    vacio.hidden = lista.length > 0;
  }

  filtros.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    filtros.querySelectorAll('button').forEach(x => x.classList.remove('activo'));
    b.classList.add('activo');
    genero = b.dataset.filtro;
    dibujar();
  });

  buscador.addEventListener('input', dibujar);
  dibujar();
})();

// ===== Validación del formulario (contacto.html) =====
(function () {
  const form = document.getElementById('form');
  if (!form) return;
  const resp = document.getElementById('respuesta');

  function error(id, texto) {
    document.getElementById('e-' + id).textContent = texto;
    return !texto;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();
    const mensaje = form.mensaje.value.trim();
    const ok = [
      error('nombre', nombre.length < 2 ? 'Escribí tu nombre.' : ''),
      error('correo', /^\S+@\S+\.\S+$/.test(correo) ? '' : 'Ingresá un correo válido.'),
      error('mensaje', mensaje.length < 10 ? 'El mensaje necesita al menos 10 caracteres.' : '')
    ].every(Boolean);
    if (!ok) return;
    resp.style.display = 'block';
    resp.textContent = 'Gracias, ' + nombre + '. Recibimos tu mensaje sobre "' + form.tema.value + '".';
    form.reset();
  });
})();

// ===== Trivia (trivia.html) =====
(function () {
  const caja = document.getElementById('trivia');
  if (!caja) return;

  const preguntas = [
    { p: '¿Cómo se llama el fontanero más famoso de Nintendo?',
      o: ['Luigi', 'Mario', 'Wario', 'Toad'], c: 1 },
    { p: '¿Qué consola de Nintendo se lanzó en 2017 y se puede usar en el living o en la calle?',
      o: ['Wii', 'Game Boy', 'Switch', 'GameCube'], c: 2 },
    { p: '¿En qué juego construís y explorás un mundo hecho de bloques?',
      o: ['Minecraft', 'Tetris', 'Pac-Man', 'Fortnite'], c: 0 },
    { p: '¿Cómo se llama el héroe que protege el reino de Hyrule en la saga Zelda?',
      o: ['Zelda', 'Ganon', 'Link', 'Epona'], c: 2 },
    { p: '¿Qué empresa creó la consola PlayStation?',
      o: ['Sony', 'Sega', 'Microsoft', 'Atari'], c: 0 },
    { p: '¿Qué personaje come puntos y huye de fantasmas en un laberinto?',
      o: ['Sonic', 'Pac-Man', 'Donkey Kong', 'Kirby'], c: 1 }
  ];

  const elProgreso = document.getElementById('t-progreso');
  const elPuntos = document.getElementById('t-puntos');
  const elPregunta = document.getElementById('t-pregunta');
  const elOpciones = document.getElementById('t-opciones');
  const elFeedback = document.getElementById('t-feedback');
  const btnSig = document.getElementById('t-siguiente');
  let actual = 0, aciertos = 0, respondida = false;

  function mostrar() {
    const q = preguntas[actual];
    respondida = false;
    elProgreso.textContent = 'Pregunta ' + (actual + 1) + ' de ' + preguntas.length;
    elPregunta.textContent = q.p;
    elFeedback.textContent = '';
    btnSig.hidden = true;
    elOpciones.innerHTML = '';
    q.o.forEach((texto, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = texto;
      b.addEventListener('click', () => responder(i, b));
      elOpciones.appendChild(b);
    });
  }

  function responder(i, boton) {
    if (respondida) return;
    respondida = true;
    const q = preguntas[actual];
    const botones = elOpciones.querySelectorAll('button');
    botones.forEach(b => b.disabled = true);
    botones[q.c].classList.add('correcta');
    if (i === q.c) {
      aciertos++;
      elPuntos.textContent = aciertos;
      elFeedback.textContent = '¡Correcto!';
    } else {
      boton.classList.add('incorrecta');
      elFeedback.textContent = 'Casi. La respuesta correcta es: ' + q.o[q.c] + '.';
    }
    btnSig.textContent = actual === preguntas.length - 1 ? 'Ver resultado' : 'Siguiente';
    btnSig.hidden = false;
  }

  function final() {
    elProgreso.textContent = 'Trivia terminada';
    elPregunta.textContent = 'Acertaste ' + aciertos + ' de ' + preguntas.length + '.';
    elOpciones.innerHTML = '';
    elFeedback.textContent = aciertos >= 5 ? '¡Sos un verdadero experto gamer!'
      : aciertos >= 3 ? '¡Muy bien! Un poco más de práctica y llegás a experto.'
      : 'Seguí jugando y probá de nuevo.';
    btnSig.textContent = 'Jugar de nuevo';
    btnSig.hidden = false;
    btnSig.dataset.reiniciar = '1';
  }

  btnSig.addEventListener('click', () => {
    if (btnSig.dataset.reiniciar) {
      delete btnSig.dataset.reiniciar;
      actual = 0; aciertos = 0;
      elPuntos.textContent = 0;
      mostrar();
      return;
    }
    actual++;
    if (actual >= preguntas.length) final(); else mostrar();
  });

  mostrar();
})();

