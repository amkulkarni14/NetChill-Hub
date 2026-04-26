// API Service for TMDB integration
class APIService {
    constructor() {
        this.cache = new Map();
    }

    // Build API URL with parameters
    buildURL(endpoint, params = {}) {
        const url = new URL(CONFIG.BASE_URL + endpoint);
        url.searchParams.append('api_key', CONFIG.API_KEY);
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value);
            }
        });
        
        return url.toString();
    }

    // Generic fetch with caching
    async fetchWithCache(url, cacheKey) {
        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < APP_CONFIG.CACHE_DURATION) {
            return cached.data;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Cache the result
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Get trending movies
    async getTrendingMovies() {
        const url = this.buildURL(ENDPOINTS.TRENDING);
        return this.fetchWithCache(url, 'trending_movies');
    }

    // Get top rated movies
    async getTopRatedMovies() {
        const url = this.buildURL(ENDPOINTS.TOP_RATED);
        return this.fetchWithCache(url, 'top_rated_movies');
    }

    // Search movies
    async searchMovies(query) {
        if (!query || query.length < 2) return { results: [] };
        
        const url = this.buildURL(ENDPOINTS.SEARCH, { query });
        const cacheKey = `search_${query.toLowerCase()}`;
        return this.fetchWithCache(url, cacheKey);
    }

    // Get movie details
    async getMovieDetails(movieId) {
        const url = this.buildURL(`${ENDPOINTS.MOVIE_DETAILS}/${movieId}`);
        const cacheKey = `movie_${movieId}`;
        return this.fetchWithCache(url, cacheKey);
    }

    // Get movie credits (cast)
    async getMovieCredits(movieId) {
        const url = this.buildURL(`${ENDPOINTS.MOVIE_DETAILS}/${movieId}/credits`);
        const cacheKey = `credits_${movieId}`;
        return this.fetchWithCache(url, cacheKey);
    }

    // Get movies by genre
    async getMoviesByGenre(genreId, genreName) {
        const url = this.buildURL(ENDPOINTS.DISCOVER, { 
            with_genres: genreId,
            sort_by: 'popularity.desc'
        });
        const cacheKey = `genre_${genreId}`;
        const data = await this.fetchWithCache(url, cacheKey);
        // Add genre name to the response for display
        data.genreName = genreName;
        return data;
    }

    // Helper to get full image URL
    getImageURL(path, size = CONFIG.POSTER_SIZE) {
        if (!path) return 'https://via.placeholder.com/500x750/333/fff?text=No+Image';
        return `${CONFIG.IMAGE_BASE_URL}/${size}${path}`;
    }

    // Helper to get backdrop URL
    getBackdropURL(path) {
        return this.getImageURL(path, CONFIG.BACKDROP_SIZE);
    }

    // Helper to get profile URL
    getProfileURL(path) {
        return this.getImageURL(path, CONFIG.PROFILE_SIZE);
    }
}

// Create global API instance
const api = new APIService();