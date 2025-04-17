function enviarWhatsApp() {
  const nombre = encodeURIComponent(document.getElementById("nombre").value);
  const descripcion = encodeURIComponent(document.getElementById("descripcion").value);
  const numero = "59176543210"; // Tu número con código país

  const url = `https://wa.me/59162029291?text=Hola,%20quiero%20vender%20chatarra.%20Mi%20nombre%20es%20${nombre}%20y%20tengo%20esto%20para%20ofrecer:%20${descripcion}`;
  window.open(url, "_blank");
}

fetch('/api/materiales')
.then(res => res.json())
.then(data => {
  const contenedor = document.getElementById('materiales-container');

  // Ordenar: los materiales no vendidos primero, luego los vendidos
  data.sort((a, b) => {
    if (a.estado === 'Vendido' && b.estado !== 'Vendido') return 1;
    if (a.estado !== 'Vendido' && b.estado === 'Vendido') return -1;
    return 0;
  });

  // Generar el HTML para cada material
  contenedor.innerHTML = data.map(m => `
    <div class="material-publico ${m.estado === 'Vendido' ? 'vendido' : ''}" onclick="verImagen('${m.imagen}')">
      <img src="${m.imagen}" alt="${m.nombre}" style="max-width:200px; display:block; margin-bottom:10px;" />
      <h3>${m.nombre}</h3>
      <p>${m.info}</p>
      <p><strong>Precio:</strong> ${m.precio} Bs</p>
      <p><strong>Estado:</strong> ${m.estado}</p>
      ${m.estado !== 'Vendido' ? `
        <a href="https://wa.me/59162029291?text=Hola,%20me%20interesa%20el%20material:%20${encodeURIComponent(m.nombre)}" target="_blank">
          <button>📲 Consultar por WhatsApp</button>
        </a>
      ` : `
        <button disabled style="background-color: gray; color: white;">❌ No disponible</button>
      `}
    </div>
  `).join('');
});

// Función para ver la imagen en el modal
function verImagen(imagen) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");

  modal.style.display = "block";
  modalImg.src = imagen;
}

// Función para cerrar el modal
document.getElementById("close-modal").onclick = function() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

// Cerrar el modal si se hace clic fuera de la imagen
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

