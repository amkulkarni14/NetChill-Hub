// UI Components for NetChill Hub
class Components {
    // Create movie card element
    static createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.dataset.movieId = movie.id;
        
        const posterURL = api.getImageURL(movie.poster_path);
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        
        card.innerHTML = `
            <img src="${posterURL}" alt="${movie.title}" class="movie-poster" loading="lazy">
            <div class="movie-info">
                <h4 class="movie-title">${movie.title}</h4>
                <div class="movie-meta">
                    <span class="movie-year">${year}</span>
                    <span class="movie-rating">${rating}</span>
                </div>
            </div>
        `;
        
        // Add click handler for navigation
        card.addEventListener('click', () => {
            router.navigateTo('movie', movie.id);
        });
        
        return card;
    }

    // Create movie grid from array of movies
    static createMovieGrid(movies, container) {
        container.innerHTML = '';
        
        if (!movies || movies.length === 0) {
            container.innerHTML = '<p class="no-movies">No movies to display</p>';
            return;
        }
        
        movies.forEach(movie => {
            const card = this.createMovieCard(movie);
            container.appendChild(card);
        });
    }

    // Create movie detail view
    static createMovieDetail(movie, credits) {
        const posterURL = api.getImageURL(movie.poster_path);
        const backdropURL = api.getBackdropURL(movie.backdrop_path);
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
        const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : 'N/A';
        
        // Get top 10 cast members
        const cast = credits.cast ? credits.cast.slice(0, 10) : [];
        
        return `
            <div class="movie-detail-backdrop" style="background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${backdropURL}') center/cover; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;"></div>
            <div class="movie-detail">
                <img src="${posterURL}" alt="${movie.title}" class="detail-poster">
                <div class="detail-info">
                    <h2>${movie.title}</h2>
                    <div class="detail-meta">
                        <span class="meta-item">${year}</span>
                        <span class="meta-item">${runtime}</span>
                        <span class="meta-item">⭐ ${rating}</span>
                        <span class="meta-item">${movie.vote_count} votes</span>
                    </div>
                    <div class="detail-genres">
                        <strong>Genres:</strong> ${genres}
                    </div>
                    <div class="detail-overview">
                        <h3>Overview</h3>
                        <p>${movie.overview || 'No overview available.'}</p>
                    </div>
                    <div class="detail-cast">
                        <h3>Cast</h3>
                        <div class="cast-grid">
                            ${cast.map(actor => `
                                <div class="cast-member">
                                    <img src="${api.getProfileURL(actor.profile_path)}" 
                                         alt="${actor.name}" class="cast-photo" loading="lazy">
                                    <div class="cast-name">${actor.name}</div>
                                    <div class="cast-character">${actor.character}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Update hero section with dynamic backdrop
    static updateHeroBackdrop(movies) {
        if (!movies || movies.length === 0) return;
        
        const randomMovie = movies[Math.floor(Math.random() * Math.min(5, movies.length))];
        const backdropURL = api.getBackdropURL(randomMovie.backdrop_path);
        
        const heroBackdrop = document.querySelector('.hero-backdrop');
        if (heroBackdrop && randomMovie.backdrop_path) {
            heroBackdrop.style.backgroundImage = `url('${backdropURL}')`;
        }
    }

    // Show loading state
    static showLoading() {
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        
        loading.style.display = 'block';
        error.style.display = 'none';
    }

    // Hide loading state
    static hideLoading() {
        const loading = document.getElementById('loading');
        loading.style.display = 'none';
    }

    // Show error state
    static showError(message, retryCallback) {
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const errorMessage = document.getElementById('errorMessage');
        const retryBtn = document.getElementById('retryBtn');
        
        loading.style.display = 'none';
        error.style.display = 'block';
        errorMessage.textContent = message;
        
        // Remove existing listeners and add new one
        const newRetryBtn = retryBtn.cloneNode(true);
        retryBtn.parentNode.replaceChild(newRetryBtn, retryBtn);
        
        if (retryCallback) {
            newRetryBtn.addEventListener('click', retryCallback);
        }
    }

    // Hide error state
    static hideError() {
        const error = document.getElementById('error');
        error.style.display = 'none';
    }

    // Show/hide views
    static showView(viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.style.display = 'none';
        });
        
        // Show target view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.style.display = 'block';
        }
    }

    // Update navigation active state
    static updateNavigation(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const targetLink = document.querySelector(`[href="#${activeLink}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }

    // Debounce utility for search
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}