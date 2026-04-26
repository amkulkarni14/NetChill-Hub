// TMDB API Configuration
const CONFIG = {
    API_KEY: '5562eae2d7b6817c5fcb88730f4136d6', // Replace with your TMDB API key
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    POSTER_SIZE: 'w500',
    BACKDROP_SIZE: 'w1280',
    PROFILE_SIZE: 'w185'
};

// API Endpoints
const ENDPOINTS = {
    TRENDING: '/trending/movie/day',
    TOP_RATED: '/movie/top_rated',
    SEARCH: '/search/movie',
    MOVIE_DETAILS: '/movie',
    MOVIE_CREDITS: '/movie/{id}/credits',
    DISCOVER: '/discover/movie'
};

// App Configuration
const APP_CONFIG = {
    SEARCH_DEBOUNCE: 300,
    CACHE_DURATION: 3600000, // 1 hour in milliseconds
    RESULTS_PER_PAGE: 20
};