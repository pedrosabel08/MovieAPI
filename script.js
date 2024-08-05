const apiKey = 'f4c7538bc33b5aa1361f4ae4bfb87b27';
let currentPage = 1;
const moviesPerPage = 20;
const imageBaseUrl = 'https://image.tmdb.org/t/p/w200';
let selectedGenre = '';

function fetchGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=pt-BR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            populateGenreDropdown(data.genres);
        })
        .catch(error => console.error('Erro ao obter gêneros:', error));
}

function populateGenreDropdown(genres) {
    const genreSelect = document.getElementById('genre-select');
    genreSelect.innerHTML = '<option value="">Todos os gêneros</option>';
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

function fetchMovies(page, genreId = '') {
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=${page}`;
    if (genreId) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=pt-BR&page=${page}&with_genres=${genreId}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
            updateNavigation(data.page, data.total_pages);
        })
        .catch(error => console.error('Erro ao obter filmes:', error));
}

function displayMovies(movies) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie';
        const posterUrl = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=Sem+Imagem';
        movieElement.innerHTML = `
            <a href="movie.html?id=${movie.id}">
                <img src="${posterUrl}" alt="${movie.title} Poster">
                <div class="description">
                    <h2>${movie.title}</h2>
                    <p>Data de lançamento: <b>${movie.release_date}</b></p>
                    <p>Avaliação: ${movie.vote_average}</p>
                </div>
            </a>
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
    fetchMovies(currentPage, selectedGenre);
}

function handleGenreChange(event) {
    selectedGenre = event.target.value;
    currentPage = 1;
    fetchMovies(currentPage, selectedGenre);
}

document.getElementById('genre-select').addEventListener('change', handleGenreChange);

fetchGenres();
fetchMovies(currentPage);