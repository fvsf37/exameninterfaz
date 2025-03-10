document.addEventListener("DOMContentLoaded", async function () {
  var map = L.map("map").setView([36.7213, -4.4214], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  var iconoNormal = L.icon({
    iconUrl: "/images/studio.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -30],
  });

  var iconoResaltado = L.icon({
    iconUrl: "/images/studio.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -40],
  });

  async function cargarDatos(url) {
    try {
      let response = await fetch(url);
      let data = await response.json();
      console.log("Datos cargados:", data);

      let monumentList = document.getElementById("monument-list");

      data.features.forEach((feature) => {
        if (!feature.geometry || !feature.geometry.coordinates) return;

        let coords = feature.geometry.coordinates;
        let lat = coords[1];
        let lng = coords[0];

        let nombre = feature.properties.NOMBRE || "Sin Nombre";
        let descripcion = feature.properties.DESCRIPCION || "Sin Descripción";

        let marker = L.marker([lat, lng], { icon: iconoNormal }).addTo(map);

        marker.on("click", () => {
          mostrarModal(nombre, descripcion);
        });

        let listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "list-group-item-action");
        listItem.textContent = nombre;
        listItem.style.cursor = "pointer";

        listItem.addEventListener("click", () => {
          map.setView([lat, lng], 16);

          marker.setIcon(iconoResaltado);
          setTimeout(() => {
            marker.setIcon(iconoNormal);
          }, 3000); // ⏳ Resaltado por 3 segundos

          mostrarModal(nombre, descripcion);
        });

        monumentList.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  }

  function mostrarModal(nombre, descripcion) {
    Swal.fire({
      title: `<h3 class="fw-bold">${nombre}</h3>`,
      html: `
        <div class="text-center">
            <img src="/images/studio.png" class="mb-3" width="60">
        </div>
        <div style="
            max-height: 60vh; 
            overflow-y: auto; 
            text-align: justify; 
            font-size: 16px; 
            line-height: 1.6; 
            padding: 10px;">
            <p>${descripcion}</p>
        </div>`,
      confirmButtonText: "OK",
      confirmButtonColor: "#007bff",
      width: "50%",
    });
  }

  cargarDatos("/mapa/datos/monumentos");
});
