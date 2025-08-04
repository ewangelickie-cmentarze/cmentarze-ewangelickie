// Wczytaj dane z cemeteries.json i wyświetl pinezki na mapie
let cemeteries = [];

async function loadCemeteries() {
  const response = await fetch('cemeteries.json');
  cemeteries = await response.json();
  addMarkers(cemeteries);
}

const map = L.map('map').setView([52.2297, 21.0122], 6); // Centrum Polski

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let markers = [];

function addMarkers(data) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  data.forEach(cemetery => {
    const marker = L.marker([cemetery.latitude, cemetery.longitude]).addTo(map);
    marker.on('click', () => showInfo(cemetery));
    markers.push(marker);
  });
}

function showInfo(cemetery) {
  const panel = document.getElementById('info-panel');
  const content = document.getElementById('info-content');
  let html = `<h2>${cemetery.name}</h2>`;
  if (cemetery.photos && cemetery.photos.length) {
    html += `<img src="${cemetery.photos[0]}" alt="Zdjęcie cmentarza" class="cemetery-photo">`;
  }
  html += `<p>${cemetery.description || ''}</p>`;
  if (cemetery.buried && cemetery.buried.length) {
    html += `<h3>Pochowani:</h3><ul>`;
    cemetery.buried.forEach(person => {
      html += `<li>${person.name} (${person.birth}–${person.death})</li>`;
    });
    html += `</ul>`;
  }
  content.innerHTML = html;
  panel.classList.remove('hidden');
}

// Zamknij panel info
document.getElementById('close-info').onclick = function() {
  document.getElementById('info-panel').classList.add('hidden');
}

// Wyszukiwarka
document.getElementById('search').addEventListener('input', function(e) {
  const text = e.target.value.toLowerCase();
  const filtered = cemeteries.filter(c =>
    c.name.toLowerCase().includes(text) ||
    (c.description && c.description.toLowerCase().includes(text))
  );
  addMarkers(filtered);
});

loadCemeteries();