const apiKey = 'f4c7538bc33b5aa1361f4ae4bfb87b27';
let currentPage = 1;
const moviesPerPage = 20;
const imageBaseUrl = 'https://image.tmdb.org/t/p/w200';

function fetchMovies(page) {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
            updateNavigation(data.page, data.total_pages);
        })
        .catch(error => console.error('Erro:', error));
}

function displayMovies(movies) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie';
        const posterUrl = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=Sem+Imagem';
        movieElement.innerHTML = `
    <img src="${posterUrl}" alt="${movie.title} Poster">
    <div class="description">
        <h2>${movie.title}</h2>
        <p>Data de lançamento: ${movie.release_date}</p>
        <p>Avaliação: ${movie.vote_average}</p>
    </div>
`;
        moviesList.appendChild(movieElement);
    });
}

function updateNavigation(page, totalPages) {
    document.getElementById('page-info').textContent = `Página ${page} de ${totalPages}`;
    document.getElementById('prev').disabled = page === 1;
    document.getElementById('next').disabled = page === totalPages;
}

function changePage(delta) {
    currentPage += delta;
    fetchMovies(currentPage);
}

fetchMovies(currentPage);