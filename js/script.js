// Definir la variable global
let filmsData = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
      // Los datos obtenidos en formato JSON se almacenan en la variable data. Aquí, los estamos almacenando en una variable global llamada window.filmsData para poder acceder a ellos desde cualquier parte de nuestro código.
      filmsData = data;
    });

  const searchField = document.getElementById('inputBuscar');
  const searchBtn = document.getElementById('btnBuscar');
  const filmList = document.getElementById('lista');

  searchBtn.addEventListener('click', () => {
    const query = searchField.value.toLowerCase();

    // Filtrar las películas según el término de búsqueda
    const filteredFilms = filmsData.filter(film => {
      return film.title.toLowerCase().includes(query) ||
        film.genres.some(genre => genre.name.toLowerCase().includes(query)) ||
        (film.tagline && film.tagline.toLowerCase().includes(query)) || 
        (film.overview && film.overview.toLowerCase().includes(query));
    });

    // Limpiar la lista antes de agregar nuevos elementos
    filmList.innerHTML = '';

    // Renderizar los resultados
    filteredFilms.forEach(film => {
      const item = document.createElement('li');
      item.classList.add('list-group-item', 'bg-dark', 'text-light');

      item.addEventListener('click', () => {
        displayFilmDetails(film);
      });

      // Cómo se muestran los resultados
      item.innerHTML = `
        <strong>${film.title}</strong>
        <p>${film.tagline}</p>
        <div class="star-rating">
          ${generateStarRating(film.vote_average)}
        </div>
      `;

      filmList.appendChild(item);
    });
  });
});

// Definir la función generateStarRating para generar estrellas según la votación
function generateStarRating(vote) {
  const maxStars = 5;
  let filledStars = Math.round(vote / 2);
  let starsHTML = '';

  for (let i = 0; i < maxStars; i++) {
    if (i < filledStars) {
      starsHTML += `<span class="fa fa-star checked text-warning"></span>`;
    } else {
      starsHTML += `<span class="fa fa-star text-secondary"></span>`;
    }
  }

  return starsHTML;
}

function displayFilmDetails(film) {
  const offcanvasBody = document.querySelector('.offcanvas-body');

  // Mostrar detalles de la película
  offcanvasBody.innerHTML = `
    <h5>${film.title}</h5>
    <p>${film.overview}</p>
    <ul>
      ${film.genres.map(genre => `<li>${genre.name}</li>`).join('')}
    </ul>
    <div class="dropdown mt-3">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Más detalles
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Año: ${film.release_date.split('-')[0]}</a></li>
        <li><a class="dropdown-item" href="#">Duración: ${film.runtime} mins</a></li>
        <li><a class="dropdown-item" href="#">Presupuesto: $${film.budget.toLocaleString()}</a></li>
        <li><a class="dropdown-item" href="#">Ingresos: $${film.revenue.toLocaleString()}</a></li>
      </ul>
    </div>
  `;

  // Crear el panel offcanvas para mostrarlo
  const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasTop'));
  offcanvas.show();
}