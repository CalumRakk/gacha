// --- DATOS DEL JUEGO (Nuestra "Base de Datos") *** ---
const items = [
    { nombre: "Fragmento de Nada", rareza: "Común", sprite: "https://cdn-icons-png.flaticon.com/128/18178/18178793.png" },
    { nombre: "Piedra Común", rareza: "Común", sprite: "https://cdn-icons-png.flaticon.com/128/6224/6224567.png" },
    { nombre: "Espada de Madera", rareza: "Común", sprite: "https://cdn-icons-png.flaticon.com/128/18906/18906740.png" },
    { nombre: "Escudo de Cuero", rareza: "Común", sprite: "https://cdn-icons-png.flaticon.com/128/7269/7269786.png" },
    { nombre: "Poción Curativa Menor", rareza: "Común", sprite: "https://cdn-icons-png.flaticon.com/128/970/970558.png" },
    { nombre: "Daga Oxidada", rareza: "Común", sprite: "https://cdn-icons-png.flaticon.com/128/464/464092.png" },
    { nombre: "Botas Usadas", rareza: "Común", sprite: "https://cdn-icons-png.flaticon.com/128/304/304722.png" },
    { nombre: "Casco Abollado", rareza: "Común", sprite: "https://cdn-icons-png.flaticon.com/128/685/685895.png" },
    { nombre: "Flecha Perdida", rareza: "Común", sprite: "https://cdn-icons-png.flaticon.com/128/1167/1167723.png" },
    { nombre: "Anillo de Latón", rareza: "Común", sprite: "https://cdn-icons-png.flaticon.com/128/441/441784.png" },
    { nombre: "Daga de Acero", rareza: "Raro", sprite: "https://cdn-icons-png.flaticon.com/128/942/942977.png" },
    { nombre: "Armadura de Mallas", rareza: "Raro", sprite: "https://cdn-icons-png.flaticon.com/128/962/962291.png" },
    { nombre: "Poción Curativa Mayor", rareza: "Raro", sprite: "https://cdn-icons-png.flaticon.com/128/441/441831.png" },
    { nombre: "Escudo Reforzado", rareza: "Raro", sprite: "https://cdn-icons-png.flaticon.com/128/474/474864.png" },
    { nombre: "Espada Larga", rareza: "Raro", sprite: "https://cdn-icons-png.flaticon.com/128/1656/1656949.png" },
    { nombre: "Espada Ancestral", rareza: "Épico", sprite: "https://cdn-icons-png.flaticon.com/128/942/942984.png" },
    { nombre: "Cetro de Poder Arcano", rareza: "Épico", sprite: "https://cdn-icons-png.flaticon.com/128/4882/4882999.png" },
    { nombre: "Armadura de Dragón", rareza: "Épico", sprite: "https://cdn-icons-png.flaticon.com/128/962/962284.png" },
];

const rarezas = [
    { tipo: "Común", prob: 0.89 },
    { tipo: "Raro", prob: 0.10 },
    { tipo: "Épico", prob: 0.01 },
];

const pityRarity = [
    { tipo: "Raro", prob: 0.90 },
    { tipo: "Épico", prob: 0.10 },
];

// --- ESTADO DEL JUEGO ---
let gemas = 200;
let pityContador = 0;
let inventario = []; // ¡NUESTRO INVENTARIO!
const pityMaximo = 7;
const costoInvocacionX1 = 10;
const costoInvocacionX10 = 100;

// --- ELEMENTOS DEL DOM ---
const gemasSpan = document.getElementById("gemas");
const pitySpan = document.getElementById("pity");
const invocarX1Btn = document.getElementById("invocar-x1");
const invocarX10Btn = document.getElementById("invocar-x10");
const resultadosDiv = document.getElementById("resultados-items");
const mensajesDiv = document.getElementById("mensajes");

// Elementos del inventario
const inventoryIcon = document.getElementById("inventory-icon");
const inventoryModal = document.getElementById("inventory-modal");
const closeModalBtn = document.querySelector(".close-button");
const inventoryItemsDiv = document.getElementById("inventory-items");


// --- FUNCIONES DEL JUEGO ---

function seleccionarRareza(tablaProbabilidades) {
    const rand = Math.random();
    let acumulado = 0;
    for (const rareza of tablaProbabilidades) {
        acumulado += rareza.prob;
        if (rand < acumulado) {
            return rareza.tipo;
        }
    }
}

function invocarItem(pityActivo = false) {

    if (pityActivo){
        alert("Modo Pity Activo, obtendrás un item raro o épico.");
    }

    const rarezaSeleccionada = pityActivo 
        ? seleccionarRareza(pityRarity) 
        : seleccionarRareza(rarezas);

    const itemsFiltrados = items.filter(item => item.rareza === rarezaSeleccionada);
    const itemObtenido = itemsFiltrados[Math.floor(Math.random() * itemsFiltrados.length)];

    if (itemObtenido.rareza === "Común") {
        pityContador++;
    } else {
        pityContador = 0;
    }
    triggerPulseAnimation(inventoryIcon);
    return itemObtenido;
}

function actualizarUI() {
    gemasSpan.textContent = gemas;
    pitySpan.textContent = pityContador;
    mensajesDiv.textContent = "";
}

function mostrarResultados(itemsObtenidos) {
    resultadosDiv.innerHTML = "";
    for (const item of itemsObtenidos) {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item";
        itemDiv.style.borderColor = item.rareza === "Épico" ? "gold" : item.rareza === "Raro" ? "blue" : "#ddd";
        
        itemDiv.innerHTML = `
            <img src="${item.sprite}" alt="${item.nombre}" class="item-image">
            <div class="nombre">${item.nombre}</div>
            <div class="rareza" style="color: ${item.rareza === 'Épico' ? 'gold' : item.rareza === 'Raro' ? 'blue' : 'gray'};">${item.rareza}</div>
        `;
        resultadosDiv.appendChild(itemDiv);
    }
}

// Agrega pequeña animacion para resaltar un elemento de forma temporal
function triggerPulseAnimation(element) {
  element.classList.remove('pulse-animation');
  void element.offsetWidth;
  element.classList.add('pulse-animation');
}

// ¡NUEVA FUNCIÓN PARA RENDERIZAR EL INVENTARIO!
function renderizarInventario() {
    inventoryItemsDiv.innerHTML = "";

    if (inventario.length === 0) {
        inventoryItemsDiv.innerHTML = "<p>El inventario está vacío.</p>";
        return;
    }

    const inventarioAgrupado = inventario.reduce((acc, item) => {
        acc[item.nombre] = (acc[item.nombre] || 0) + 1;
        return acc;
    }, {});

    const itemsOrdenados = Object.keys(inventarioAgrupado).sort();

    for (const nombreItem of itemsOrdenados) {
        const itemInfo = items.find(item => item.nombre === nombreItem);
        const count = inventarioAgrupado[nombreItem];

        const itemStackDiv = document.createElement("div");
        itemStackDiv.className = "inventory-item-stack";
        itemStackDiv.style.borderColor = itemInfo.rareza === "Épico" ? "gold" : itemInfo.rareza === "Raro" ? "blue" : "#ccc";
        
        itemStackDiv.innerHTML = `
            ${count > 1 ? `<span class="count">x${count}</span>` : ''}
            <img src="${itemInfo.sprite}" alt="${itemInfo.nombre}" class="item-image">
            <div class="nombre">${itemInfo.nombre}</div>
            <div class="rareza" style="color: ${itemInfo.rareza === 'Épico' ? 'gold' : itemInfo.rareza === 'Raro' ? 'blue' : 'gray'};">${itemInfo.rareza}</div>
        `;
        inventoryItemsDiv.appendChild(itemStackDiv);
    }
}



// --- EVENT LISTENERS ---

invocarX1Btn.addEventListener("click", () => {
    if (gemas >= costoInvocacionX1) {
        gemas -= costoInvocacionX1;
        
        const esPity = pityContador >= pityMaximo;
        const item = invocarItem(esPity);

        inventario.push(item); // AÑADIR AL INVENTARIO

        mostrarResultados([item]);
        actualizarUI();
    } else {
        mensajesDiv.textContent = "No tienes suficientes gemas.";
    }
});

invocarX10Btn.addEventListener("click", () => {
    if (gemas >= costoInvocacionX10) {
        gemas -= costoInvocacionX10;
        const itemsObtenidos = [];

        for (let i = 0; i < 10; i++) {
            const esPity = pityContador >= pityMaximo;
            const item = invocarItem(esPity);
            itemsObtenidos.push(item);
        }
        
        inventario.push(...itemsObtenidos); // AÑADIR TODOS AL INVENTARIO

        mostrarResultados(itemsObtenidos);
        actualizarUI();
    } else {
        mensajesDiv.textContent = "No tienes suficientes gemas.";
    }
});

// Event listeners para el modal del inventario
inventoryIcon.addEventListener("click", () => {
    renderizarInventario(); // Dibuja el inventario antes de mostrarlo
    inventoryModal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
    inventoryModal.style.display = "none";
});

// Cierra el modal si el usuario hace clic fuera del contenido
window.addEventListener("click", (event) => {
    if (event.target == inventoryModal) {
        inventoryModal.style.display = "none";
    }
});


// Inicializar la UI al cargar la página
actualizarUI();