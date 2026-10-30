// ===== Menú y página activa =====
(function () {
  const pagina = location.pathname.split('/').pop() || 'index.html';
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

// ===== Filtro de juegos (juegos.html) =====
(function () {
  const filtros = document.getElementById('filtros');
  if (!filtros) return;
  const tarjetas = document.querySelectorAll('#catalogo .tarjeta');
  const vacio = document.getElementById('vacio');

  filtros.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    filtros.querySelectorAll('button').forEach(x => x.classList.remove('activo'));
    b.classList.add('activo');
    const f = b.dataset.filtro;
    let visibles = 0;
    tarjetas.forEach(t => {
      const mostrar = f === 'todos' || t.dataset.genero === f;
      t.hidden = !mostrar;
      if (mostrar) visibles++;
    });
    vacio.hidden = visibles > 0;
  });
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
