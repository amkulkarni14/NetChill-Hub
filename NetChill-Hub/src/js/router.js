// Simple hash-based router for SPA navigation
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.init();
    }

    // Initialize router
    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
        
        // Register routes
        this.registerRoutes();
    }

    // Register application routes
    registerRoutes() {
        this.routes.set('home', () => this.showHome());
        this.routes.set('trending', () => this.showTrending());
        this.routes.set('top-rated', () => this.showTopRated());
        this.routes.set('search', (query) => this.showSearch(query));
        this.routes.set('movie', (id) => this.showMovieDetail(id));
        this.routes.set('genre', (genreId, genreName) => this.showGenre(genreId, genreName));
    }

    // Handle route changes
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const [route, ...params] = hash.split('/');
        
        this.currentRoute = route;
        
        // Clear any existing errors
        Components.hideError();
        
        // Execute route handler
        const handler = this.routes.get(route);
        if (handler) {
            handler(...params);
        } else {
            this.navigateTo('home');
        }
    }

    // Navigate to a specific route
    navigateTo(route, ...params) {
        const hash = params.length > 0 ? `${route}/${params.join('/')}` : route;
        window.location.hash = hash;
    }

    // Show home view
    async showHome() {
        Components.showView('homeView');
        Components.updateNavigation('home');
        
        try {
            Components.showLoading();
            
            // Load both trending and top-rated movies
            const [trendingData, topRatedData] = await Promise.all([
                api.getTrendingMovies(),
                api.getTopRatedMovies()
            ]);
            
            // Update hero backdrop with trending movie
            Components.updateHeroBackdrop(trendingData.results);
            
            // Render movie grids
            const trendingContainer = document.getElementById('trendingMovies');
            const topRatedContainer = document.getElementById('topRatedMovies');
            
            Components.createMovieGrid(trendingData.results.slice(0, 8), trendingContainer);
            Components.createMovieGrid(topRatedData.results.slice(0, 8), topRatedContainer);
            
            // Update movie count in hero stats
            const movieCountElement = document.getElementById('movieCount');
            if (movieCountElement) {
                const totalResults = trendingData.total_results || 10000;
                movieCountElement.textContent = totalResults > 1000 ? 
                    `${Math.floor(totalResults / 1000)}K+` : `${totalResults}+`;
            }
            
            Components.hideLoading();
            
        } catch (error) {
            Components.showError(
                'Failed to load movies. Please check your internet connection.',
                () => this.showHome()
            );
        }
    }

    // Show trending movies
    async showTrending() {
        Components.showView('homeView');
        Components.updateNavigation('trending');
        
        try {
            Components.showLoading();
            
            const data = await api.getTrendingMovies();
            const container = document.getElementById('trendingMovies');
            
            // Hide top-rated section and show only trending
            document.querySelector('.section:nth-child(3)').style.display = 'none';
            document.querySelector('.section:nth-child(2) h3').textContent = 'Trending Movies';
            
            Components.createMovieGrid(data.results, container);
            Components.hideLoading();
            
        } catch (error) {
            Components.showError(
                'Failed to load trending movies.',
                () => this.showTrending()
            );
        }
    }

    // Show top-rated movies
    async showTopRated() {
        Components.showView('homeView');
        Components.updateNavigation('top-rated');
        
        try {
            Components.showLoading();
            
            const data = await api.getTopRatedMovies();
            const container = document.getElementById('topRatedMovies');
            
            // Hide trending section and show only top-rated
            document.querySelector('.section:nth-child(2)').style.display = 'none';
            document.querySelector('.section:nth-child(3)').style.display = 'block';
            document.querySelector('.section:nth-child(3) h3').textContent = 'Top Rated Movies';
            
            Components.createMovieGrid(data.results, container);
            Components.hideLoading();
            
        } catch (error) {
            Components.showError(
                'Failed to load top-rated movies.',
                () => this.showTopRated()
            );
        }
    }

    // Show search results
    async showSearch(query) {
        if (!query) {
            this.navigateTo('home');
            return;
        }
        
        Components.showView('searchView');
        Components.updateNavigation('');
        
        const searchTitle = document.getElementById('searchTitle');
        const searchResults = document.getElementById('searchResults');
        const noResults = document.getElementById('noResults');
        
        searchTitle.textContent = `Search Results for "${decodeURIComponent(query)}"`;
        
        try {
            Components.showLoading();
            
            const data = await api.searchMovies(decodeURIComponent(query));
            
            Components.hideLoading();
            
            if (data.results && data.results.length > 0) {
                Components.createMovieGrid(data.results, searchResults);
                noResults.style.display = 'none';
            } else {
                searchResults.innerHTML = '';
                noResults.style.display = 'block';
            }
            
        } catch (error) {
            Components.showError(
                'Failed to search movies.',
                () => this.showSearch(query)
            );
        }
    }

    // Show movie detail
    async showMovieDetail(movieId) {
        if (!movieId) {
            this.navigateTo('home');
            return;
        }
        
        Components.showView('movieDetailView');
        Components.updateNavigation('');
        
        try {
            Components.showLoading();
            
            // Load movie details and credits in parallel
            const [movie, credits] = await Promise.all([
                api.getMovieDetails(movieId),
                api.getMovieCredits(movieId)
            ]);
            
            const detailContainer = document.getElementById('movieDetail');
            detailContainer.innerHTML = Components.createMovieDetail(movie, credits);
            
            Components.hideLoading();
            
        } catch (error) {
            Components.showError(
                'Failed to load movie details.',
                () => this.showMovieDetail(movieId)
            );
        }
    }

    // Go back to previous view
    goBack() {
        window.history.back();
    }

    // Show genre movies
    async showGenre(genreId, genreName) {
        if (!genreId) {
            this.navigateTo('home');
            return;
        }
        
        Components.showView('searchView');
        Components.updateNavigation('');
        
        const searchTitle = document.getElementById('searchTitle');
        const searchResults = document.getElementById('searchResults');
        const noResults = document.getElementById('noResults');
        
        searchTitle.textContent = `${decodeURIComponent(genreName || 'Genre')} Movies`;
        
        try {
            Components.showLoading();
            
            const data = await api.getMoviesByGenre(genreId, decodeURIComponent(genreName));
            
            Components.hideLoading();
            
            if (data.results && data.results.length > 0) {
                Components.createMovieGrid(data.results, searchResults);
                noResults.style.display = 'none';
            } else {
                searchResults.innerHTML = '';
                noResults.style.display = 'block';
            }
            
        } catch (error) {
            Components.showError(
                'Failed to load genre movies.',
                () => this.showGenre(genreId, genreName)
            );
        }
    }
}

// Create global router instance
const router = new Router();