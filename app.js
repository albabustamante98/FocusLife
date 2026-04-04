// ===== FOCUSLIFE - app.js =====
// Gestor de tareas SPA — HTML + CSS + JS puro

// --- Variables globales ---
let estadoActual = null;
let fechaVisor = new Date();
let pomTimer = null;
let pomTiempo = 1500; // 25 minutos en segundos
let pomActivo = false;
let filtroBusqueda = '';

const CATEGORIAS = [
    { id: 'estudio', nombre: 'Estudio', icono: '🧠' },
    { id: 'trabajo', nombre: 'Trabajo', icono: '💻' },
    { id: 'personal', nombre: 'Personal', icono: '🌌' }
];

const ENERGIA_LABEL = {
    alta: '⚡ Alta',
    media: '🔋 Media',
    baja: '🪫 Baja'
};

const ESTADOS = [
    { id: 'cansado', texto: '😴 Cansado', consejo: '💡 Céntrate en tareas de Energía Baja y descansa.' },
    { id: 'normal', texto: '🙂 Normal', consejo: '💡 Día equilibrado. Empieza por lo más difícil.' },
    { id: 'motivado', texto: '🔥 Motivado', consejo: '🔥 ¡A tope! Quítate de encima las tareas de Energía Alta.' }
];

const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];


// --- Construcción del DOM ---
// Toda la interfaz se genera desde aquí, el HTML solo tiene el div#app vacío

const app = document.getElementById('app');

// Cabecera
const header = document.createElement('header');
header.id = 'cabecera-principal';
header.classList.add('cristal');

const h1 = document.createElement('h1');
h1.textContent = 'FocusLife';
h1.className = 'efecto-shimmer-lento';

const contenedorBuscador = document.createElement('div');
contenedorBuscador.id = 'contenedor-buscador';
contenedorBuscador.innerHTML =
    '<i class="fa-solid fa-magnifying-glass"></i>' +
    '<input type="text" id="input-buscador" placeholder="Buscar tarea...">';

const contenedorEstado = document.createElement('div');
contenedorEstado.id = 'contenedor-estado';
contenedorEstado.innerHTML =
    '<span>Estado: <span id="valor-estado" style="color:#cbd5e1;">Sin definir</span></span>' +
    '<div class="progreso-container">' +
        '<span id="texto-progreso">0 Tareas totales</span>' +
        '<div class="barra-fondo"><div id="barra-relleno"></div></div>' +
    '</div>';

header.appendChild(h1);
header.appendChild(contenedorBuscador);
header.appendChild(contenedorEstado);

// Sección con las 3 columnas de categorías
const seccionColumnas = document.createElement('section');
seccionColumnas.id = 'seccion-columnas';

CATEGORIAS.forEach(function(cat) {
    const col = document.createElement('article');
    col.className = 'columna cristal';
    col.dataset.categoria = cat.id;
    col.innerHTML =
        '<h2>' + cat.icono + ' ' + cat.nombre + '</h2>' +
        '<div id="lista-' + cat.id + '" class="contenedor-tareas"></div>';
    seccionColumnas.appendChild(col);
});

// Panel inferior: calendario+hoy y widgets
const dashboardInferior = document.createElement('div');
dashboardInferior.id = 'dashboard-inferior';

const seccionHoy = document.createElement('section');
seccionHoy.id = 'seccion-hoy';
seccionHoy.className = 'cristal';

const miniCalendario = document.createElement('div');
miniCalendario.id = 'mini-calendario';

const listaHoy = document.createElement('div');
listaHoy.id = 'lista-hoy';

seccionHoy.appendChild(miniCalendario);
seccionHoy.appendChild(listaHoy);

const seccionWidgets = document.createElement('section');
seccionWidgets.id = 'seccion-widgets';

const widgetPanel = document.createElement('div');
widgetPanel.className = 'widget-panel cristal';
widgetPanel.innerHTML =
    '<div>' +
        '<h3>Estado del Día</h3>' +
        '<div class="contenedor-botones-estado" id="caja-botones-estado"></div>' +
        '<p id="texto-consejo">Selecciona cómo te sientes hoy.</p>' +
    '</div>' +
    '<div>' +
        '<h3>Modo Concentración</h3>' +
        '<div id="tiempo-pomodoro">25:00</div>' +
        '<div class="pomodoro-botones">' +
            '<button id="btn-pomodoro">Iniciar Enfoque</button>' +
            '<button id="btn-reiniciar" title="Reiniciar"><i class="fa-solid fa-rotate-right"></i></button>' +
        '</div>' +
    '</div>';

seccionWidgets.appendChild(widgetPanel);
dashboardInferior.appendChild(seccionHoy);
dashboardInferior.appendChild(seccionWidgets);

// Formulario para añadir tareas
const seccionFormulario = document.createElement('section');
seccionFormulario.id = 'seccion-formulario';
seccionFormulario.className = 'cristal';
seccionFormulario.innerHTML =
    '<form id="form-nueva-tarea" novalidate>' +
        '<input type="text" id="input-titulo" placeholder="Añadir nueva tarea..." maxlength="50">' +
        '<input type="text" id="input-desc" placeholder="Descripción breve...">' +
        '<input type="date" id="input-fecha">' +
        '<select id="select-categoria">' +
            '<option value="">Categoría...</option>' +
            '<option value="estudio">Estudio</option>' +
            '<option value="trabajo">Trabajo</option>' +
            '<option value="personal">Personal</option>' +
        '</select>' +
        '<select id="select-energia">' +
            '<option value="">Energía...</option>' +
            '<option value="alta">⚡ Alta</option>' +
            '<option value="media">🔋 Media</option>' +
            '<option value="baja">🪫 Baja</option>' +
        '</select>' +
        '<button type="submit">Agregar</button>' +
        '<div id="mensaje-error"></div>' +
    '</form>';

// Montamos todo en #app
app.appendChild(header);
app.appendChild(seccionColumnas);
app.appendChild(dashboardInferior);
app.appendChild(seccionFormulario);


// --- Referencias al DOM ---
// Función para acceder a los elementos del formulario y la cabecera

function refs() {
    return {
        titulo: document.getElementById('input-titulo'),
        desc: document.getElementById('input-desc'),
        fecha: document.getElementById('input-fecha'),
        categoria: document.getElementById('select-categoria'),
        energia: document.getElementById('select-energia'),
        error: document.getElementById('mensaje-error'),
        barraText: document.getElementById('texto-progreso'),
        barraRell: document.getElementById('barra-relleno'),
        valorEstado: document.getElementById('valor-estado'),
        consejo: document.getElementById('texto-consejo'),
        pomodoro: document.getElementById('tiempo-pomodoro'),
        btnPomo: document.getElementById('btn-pomodoro')
    };
}


// --- Crear tarjeta de tarea en el DOM ---

function renderizarTarea(t) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarea' + (t.completada ? ' completada' : '');

    // Guardamos categoría y energía como atributos para usarlos después
    tarjeta.dataset.categoria = t.categoria;
    tarjeta.dataset.energia = t.energia;

    const esFavo = t.favorito || false;
    const estrellaClase = esFavo ? 'fa-solid estrella-activa' : 'fa-regular';
    const descHTML = t.desc ? '<div class="tarea-desc">' + t.desc + '</div>' : '';

    tarjeta.innerHTML =
        '<div class="tarea-header">' +
            '<div class="grupo-titulo">' +
                '<i class="fa-solid fa-circle-check" title="Completar"></i>' +
                '<h3 title="' + t.titulo + '">' + t.titulo + '</h3>' +
            '</div>' +
            '<div class="grupo-acciones">' +
                '<span class="fecha-pequena">📅 ' + t.fecha + '</span>' +
                '<span class="badge-energia">' + (ENERGIA_LABEL[t.energia] || t.energia) + '</span>' +
                '<i class="fa-star ' + estrellaClase + '" data-accion="favorito" title="Favorito"></i>' +
                '<button class="btn-editar" data-accion="editar" title="Editar">' +
                    '<i class="fa-solid fa-pen-to-square"></i>' +
                '</button>' +
                '<button class="btn-borrar" data-accion="borrar" title="Borrar">' +
                    '<i class="fa-solid fa-trash"></i>' +
                '</button>' +
            '</div>' +
        '</div>' + descHTML;

    const lista = document.getElementById('lista-' + t.categoria);
    if (lista) lista.appendChild(tarjeta);
}


// --- Barra de progreso ---

function actualizarProgreso() {
    const r = refs();
    const total = document.querySelectorAll('#seccion-columnas .tarea').length;
    const completadas = document.querySelectorAll('#seccion-columnas .tarea.completada').length;

    if (total === 0) {
        r.barraText.textContent = '🎉 ¡Día libre! Sin tareas';
        r.barraRell.style.width = '0%';
    } else {
        r.barraText.textContent = completadas + ' de ' + total + ' completadas';
        r.barraRell.style.width = (completadas / total * 100) + '%';
    }

    actualizarListaDia();
}


// --- Recomendación según el estado del día ---

function aplicarRecomendacion() {
    // Quitamos los brillos anteriores
    document.querySelectorAll('.tarea').forEach(function(t) {
        t.classList.remove('destacada-alta', 'destacada-media', 'destacada-baja');
        const et = t.querySelector('.etiqueta-recomendada');
        if (et) et.remove();
    });

    if (!estadoActual) return;

    const tareasHoy = Array.from(listaHoy.children).filter(function(t) {
        return t.classList.contains('tarea') && !t.classList.contains('completada');
    });

    if (!tareasHoy.length) return;

    var recomendada, clase;

    if (estadoActual === 'motivado') {
        recomendada = tareasHoy.find(function(t) { return t.dataset.energia === 'alta'; }) || tareasHoy[0];
        clase = 'destacada-alta';
    } else if (estadoActual === 'cansado') {
        const inv = tareasHoy.slice().reverse();
        recomendada = inv.find(function(t) { return t.dataset.energia === 'baja'; })
            || inv.find(function(t) { return t.dataset.energia === 'media'; })
            || inv[0];
        clase = 'destacada-baja';
    } else {
        recomendada = tareasHoy.find(function(t) { return t.dataset.energia === 'media'; }) || tareasHoy[0];
        clase = 'destacada-media';
    }

    if (!recomendada) return;

    recomendada.classList.add(clase);
    const badge = document.createElement('span');
    badge.className = 'etiqueta-recomendada';
    badge.textContent = '¡Empieza por esta!';
    const h3 = recomendada.querySelector('h3');
    if (h3) h3.appendChild(badge);
}


// --- Lista de tareas del día seleccionado ---

function actualizarListaDia() {
    listaHoy.innerHTML = '';

    const yyyy = fechaVisor.getFullYear();
    const mm = String(fechaVisor.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaVisor.getDate()).padStart(2, '0');
    const fechaBuscada = yyyy + '-' + mm + '-' + dd;

    const puntosEnergia = { alta: 3, media: 2, baja: 1 };

    var tareasHoy = Array.from(document.querySelectorAll('#seccion-columnas .tarea')).filter(function(t) {
        if (t.style.display === 'none') return false;
        const span = t.querySelector('.fecha-pequena');
        return span && span.textContent.includes(fechaBuscada);
    });

    // Ordenamos: favoritas arriba, luego por energía
    tareasHoy.sort(function(a, b) {
        const favA = a.querySelector('[data-accion="favorito"]').classList.contains('fa-solid') ? 1 : 0;
        const favB = b.querySelector('[data-accion="favorito"]').classList.contains('fa-solid') ? 1 : 0;
        if (favA !== favB) return favB - favA;
        return (puntosEnergia[b.dataset.energia] || 0) - (puntosEnergia[a.dataset.energia] || 0);
    });

    tareasHoy.forEach(function(t) {
        listaHoy.appendChild(t.cloneNode(true));
    });

    iluminarColumnasPorFecha(fechaBuscada);
    aplicarRecomendacion();
}

// Ilumina las columnas que tienen tareas en la fecha del visor
function iluminarColumnasPorFecha(fechaBuscada) {
    document.querySelectorAll('#seccion-columnas .columna').forEach(function(col) {
        const cat = col.dataset.categoria;
        const tieneTareas = Array.from(document.querySelectorAll('#lista-' + cat + ' .tarea')).some(function(t) {
            const span = t.querySelector('.fecha-pequena');
            return span && span.textContent.includes(fechaBuscada);
        });
        col.classList.toggle('categoria-activa', tieneTareas);
    });
}


// --- Calendario mini ---

function renderizarCalendario() {
    const texto = fechaVisor.getDate() + ' de ' + MESES[fechaVisor.getMonth()] + ' ' + fechaVisor.getFullYear();

    // Reconstruimos el HTML para no acumular listeners
    miniCalendario.innerHTML =
        '<div class="cal-header">' +
            '<i class="fa-solid fa-chevron-left" id="btn-dia-ant"></i>' +
            '<div id="selector-fecha-rapido" title="Elegir fecha">' +
                '<span>' + texto + '</span>' +
                '<i class="fa-regular fa-calendar-days"></i>' +
                '<input type="date" id="input-fecha-oculta">' +
            '</div>' +
            '<i class="fa-solid fa-chevron-right" id="btn-dia-sig"></i>' +
        '</div>' +
        '<div class="cal-dias">' +
            '<span>L</span><span>M</span><span>X</span>' +
            '<span>J</span><span>V</span><span>S</span><span>D</span>' +
        '</div>';

    // Marcamos el día de la semana actual
    const diaSemana = fechaVisor.getDay();
    const idx = diaSemana === 0 ? 6 : diaSemana - 1;
    const spans = miniCalendario.querySelectorAll('.cal-dias span');
    if (spans[idx]) spans[idx].classList.add('hoy-dia');

    document.getElementById('btn-dia-ant').addEventListener('click', function() {
        fechaVisor.setDate(fechaVisor.getDate() - 1);
        renderizarCalendario();
    });

    document.getElementById('btn-dia-sig').addEventListener('click', function() {
        fechaVisor.setDate(fechaVisor.getDate() + 1);
        renderizarCalendario();
    });

    const inputOculto = document.getElementById('input-fecha-oculta');

    document.getElementById('selector-fecha-rapido').addEventListener('click', function() {
        inputOculto.showPicker();
    });

    inputOculto.addEventListener('change', function(e) {
        if (!e.target.value) return;
        const nueva = new Date(e.target.value);
        nueva.setHours(12, 0, 0, 0);
        fechaVisor = nueva;
        renderizarCalendario();
    });

    actualizarListaDia();
}


// --- Delegación de eventos (un solo listener para toda la app) ---
// Usamos closest() para saber desde qué elemento viene el clic

document.addEventListener('click', function(e) {

    // Favorito
    const btnFavo = e.target.closest('[data-accion="favorito"]');
    if (btnFavo) {
        const tarjetaFavo = btnFavo.closest('.tarea');

        btnFavo.classList.toggle('fa-solid');
        btnFavo.classList.toggle('fa-regular');
        btnFavo.classList.toggle('estrella-activa');

        // Si estamos en la lista de "Hoy", sincronizamos con la tarjeta original
        const tituloLimpio = tarjetaFavo.querySelector('h3').innerText.replace('¡Empieza por esta!', '').trim();
        const original = Array.from(document.querySelectorAll('#seccion-columnas .tarea')).find(function(t) {
            return t.querySelector('h3').innerText.replace('¡Empieza por esta!', '').trim() === tituloLimpio;
        });

        if (original && original !== tarjetaFavo) {
            const estrellaOrig = original.querySelector('[data-accion="favorito"]');
            if (estrellaOrig) estrellaOrig.className = btnFavo.className;
        }

        guardarEnLocal();
        actualizarProgreso();
        return;
    }

    // Borrar tarea
    const btnBorrar = e.target.closest('[data-accion="borrar"]');
    if (btnBorrar) {
        const tarjetaBorrar = btnBorrar.closest('.tarea');
        if (!tarjetaBorrar) return;

        Swal.fire({
            title: '¿Eliminar tarea?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#60a5fa',
            cancelButtonColor: '#f87171',
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar',
            background: '#1e1b4b',
            color: '#ffffff',
            iconColor: '#f87171'
        }).then(function(result) {
            if (!result.isConfirmed) return;

            tarjetaBorrar.style.transition = 'opacity 0.3s, transform 0.3s';
            tarjetaBorrar.style.opacity = '0';
            tarjetaBorrar.style.transform = 'translateX(60px)';

            setTimeout(function() {
                tarjetaBorrar.remove();
                guardarEnLocal();
                actualizarProgreso();
            }, 320);

            Swal.fire({
                toast: true, position: 'top-end', icon: 'success',
                title: 'Tarea eliminada', showConfirmButton: false,
                timer: 1400, background: '#1e1b4b', color: '#fff'
            });
        });
        return;
    }

    // Completar tarea
    const iconoCheck = e.target.closest('.fa-circle-check');
    if (iconoCheck) {
        const tarjetaClicada = iconoCheck.closest('.tarea');
        const tituloLimpio = tarjetaClicada.querySelector('h3').innerText.replace('¡Empieza por esta!', '').trim();

        // Buscamos la tarjeta original en la columna usando jerarquía del DOM
        const original = Array.from(document.querySelectorAll('#seccion-columnas .tarea')).find(function(t) {
            return t.querySelector('h3').innerText.replace('¡Empieza por esta!', '').trim() === tituloLimpio;
        });

        if (original) {
            original.classList.toggle('completada');
            guardarEnLocal();
            actualizarProgreso();
        }
        return;
    }

    // Editar tarea
    const btnEditar = e.target.closest('[data-accion="editar"]');
    if (btnEditar) {
        const tarjetaEditar = btnEditar.closest('.tarea');
        if (!tarjetaEditar) return;

        const r = refs();
        r.titulo.value = tarjetaEditar.querySelector('h3').innerText.replace('¡Empieza por esta!', '').trim();
        r.desc.value = tarjetaEditar.querySelector('.tarea-desc') ? tarjetaEditar.querySelector('.tarea-desc').innerText.trim() : '';
        r.fecha.value = tarjetaEditar.querySelector('.fecha-pequena').textContent.replace('📅 ', '').trim();
        r.categoria.value = tarjetaEditar.dataset.categoria;
        r.energia.value = tarjetaEditar.dataset.energia;

        tarjetaEditar.remove();
        guardarEnLocal();
        actualizarProgreso();
        seccionFormulario.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    // Acordeón: expandir descripción al hacer clic en la tarjeta
    const tarjetaAcordeon = e.target.closest('.tarea');
    const esAccion = e.target.closest('button')
        || e.target.closest('.fa-circle-check')
        || e.target.closest('[data-accion="favorito"]');

    if (tarjetaAcordeon && !esAccion) {
        tarjetaAcordeon.classList.toggle('expandida');
    }
});


// --- Búsqueda en tiempo real ---

document.getElementById('input-buscador').addEventListener('input', function() {
    filtroBusqueda = this.value.toLowerCase().trim();
    aplicarFiltro();
});

function aplicarFiltro() {
    document.querySelectorAll('#seccion-columnas .tarea').forEach(function(t) {
        const titulo = t.querySelector('h3').textContent.replace('¡Empieza por esta!', '').toLowerCase();
        const desc = (t.querySelector('.tarea-desc') || {}).textContent || '';
        const coincide = titulo.includes(filtroBusqueda) || desc.toLowerCase().includes(filtroBusqueda);
        t.style.display = coincide ? '' : 'none';
    });
    actualizarListaDia();
}


// --- Validación y envío del formulario ---

document.getElementById('form-nueva-tarea').addEventListener('submit', function(e) {
    e.preventDefault();

    const r = refs();
    const tituloVal = r.titulo.value.trim();
    const descVal = r.desc.value.trim();
    const fechaVal = r.fecha.value;
    const categoriaVal = r.categoria.value;
    const energiaVal = r.energia.value;

    // Limpiamos errores anteriores
    r.error.style.display = 'none';
    [r.titulo, r.fecha, r.categoria, r.energia].forEach(function(el) {
        el.classList.remove('input-invalido');
    });

    function mostrarError(msg, campo) {
        r.error.textContent = msg;
        r.error.style.display = 'block';
        if (campo) campo.classList.add('input-invalido');
    }

    if (tituloVal.length < 3) return mostrarError('⚠️ El título debe tener al menos 3 caracteres.', r.titulo);
    if (tituloVal.length > 50) return mostrarError('⚠️ El título es demasiado largo (máx. 50 caracteres).', r.titulo);
    if (!fechaVal) return mostrarError('⚠️ Debes seleccionar una fecha.', r.fecha);

    const fechaSel = new Date(fechaVal);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSel < hoy) return mostrarError('⚠️ No puedes seleccionar una fecha pasada.', r.fecha);
    if (!categoriaVal) return mostrarError('⚠️ Selecciona una categoría.', r.categoria);
    if (!energiaVal) return mostrarError('⚠️ Selecciona el nivel de energía.', r.energia);

    renderizarTarea({
        titulo: tituloVal,
        desc: descVal,
        fecha: fechaVal,
        categoria: categoriaVal,
        energia: energiaVal,
        completada: false
    });

    guardarEnLocal();
    actualizarProgreso();
    this.reset();
});


// --- Pomodoro ---

function actualizarDisplayPomo() {
    const m = Math.floor(pomTiempo / 60);
    const s = pomTiempo % 60;
    refs().pomodoro.textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
}

document.getElementById('btn-pomodoro').addEventListener('click', function() {
    const btn = refs().btnPomo;

    if (pomActivo) {
        clearInterval(pomTimer);
        pomActivo = false;
        btn.textContent = 'Reanudar Enfoque';
    } else {
        pomActivo = true;
        btn.textContent = 'Pausar';

        pomTimer = setInterval(function() {
            pomTiempo--;
            actualizarDisplayPomo();

            if (pomTiempo <= 0) {
                clearInterval(pomTimer);
                pomActivo = false;
                pomTiempo = 1500;
                actualizarDisplayPomo();
                btn.textContent = 'Iniciar Enfoque';
                Swal.fire({
                    title: '¡Concentración completada! 🎉',
                    text: 'Tómate un descanso de 5 minutos.',
                    icon: 'success',
                    confirmButtonColor: '#60a5fa',
                    background: '#1e1b4b',
                    color: '#fff'
                });
            }
        }, 1000);
    }
});

document.getElementById('btn-reiniciar').addEventListener('click', function() {
    clearInterval(pomTimer);
    pomActivo = false;
    pomTiempo = 1500;
    actualizarDisplayPomo();
    refs().btnPomo.textContent = 'Iniciar Enfoque';
});


// --- Botones de estado del día ---

const cajaBotones = document.getElementById('caja-botones-estado');

ESTADOS.forEach(function(estado) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-estado-dia';
    btn.textContent = estado.texto;

    btn.addEventListener('click', function() {
        document.querySelectorAll('.btn-estado-dia').forEach(function(b) {
            b.classList.remove('activo');
        });
        btn.classList.add('activo');

        estadoActual = estado.id;
        const r = refs();
        r.consejo.textContent = estado.consejo;
        r.valorEstado.textContent = estado.texto;
        r.valorEstado.style.color = '#d8b4fe';

        aplicarRecomendacion();
    });

    cajaBotones.appendChild(btn);
});


// --- Guardar y cargar del localStorage ---

function guardarEnLocal() {
    const tareas = Array.from(document.querySelectorAll('#seccion-columnas .tarea')).map(function(t) {
        return {
            titulo: t.querySelector('h3').innerText.replace('¡Empieza por esta!', '').trim(),
            desc: t.querySelector('.tarea-desc') ? t.querySelector('.tarea-desc').innerText.trim() : '',
            fecha: t.querySelector('.fecha-pequena').textContent.replace('📅 ', '').trim(),
            categoria: t.dataset.categoria,
            energia: t.dataset.energia,
            completada: t.classList.contains('completada'),
            favorito: t.querySelector('[data-accion="favorito"]').classList.contains('fa-solid')
        };
    });
    localStorage.setItem('focuslife_tareas', JSON.stringify(tareas));
}

function cargarDeLocal() {
    const datos = localStorage.getItem('focuslife_tareas');
    if (!datos) return;
    JSON.parse(datos).forEach(renderizarTarea);
    actualizarProgreso();
}


// --- Inicio ---

renderizarCalendario();
actualizarProgreso();
cargarDeLocal();