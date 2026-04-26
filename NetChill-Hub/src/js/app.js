// Main Application Controller
class App {
    constructor() {
        this.searchTimeout = null;
        this.init();
    }

    // Initialize application
    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.checkAPIKey();
    }

    // Check if API key is configured
    checkAPIKey() {
        if (CONFIG.API_KEY === 'YOUR_API_KEY') {
            Components.showError(
                'Please configure your TMDB API key in src/js/config.js',
                null
            );
            return false;
        }
        return true;
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        
        if (searchInput) {
            // Debounced search
            const debouncedSearch = Components.debounce((query) => {
                this.handleSearch(query);
            }, APP_CONFIG.SEARCH_DEBOUNCE);
            
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                
                // Show/hide clear button
                clearSearch.style.display = query ? 'block' : 'none';
                
                if (query.length >= 2) {
                    debouncedSearch(query);
                } else if (query.length === 0) {
                    // Return to home if search is cleared
                    router.navigateTo('home');
                }
            });
            
            // Handle Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query.length >= 2) {
                        this.handleSearch(query);
                    }
                }
            });
        }
        
        // Clear search button
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                clearSearch.style.display = 'none';
                router.navigateTo('home');
            });
        }
        
        // Back button in movie detail
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                router.goBack();
            });
        }
        
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('href').slice(1);
                router.navigateTo(route);
            });
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            // Reset sections visibility when navigating
            this.resetSectionsVisibility();
        });
        
        // Genre card click handlers
        document.addEventListener('click', (e) => {
            const genreCard = e.target.closest('.genre-card');
            if (genreCard) {
                const genreId = genreCard.dataset.genreId;
                const genreName = genreCard.querySelector('span').textContent;
                if (genreId) {
                    router.navigateTo('genre', genreId, encodeURIComponent(genreName));
                }
            }
        });
    }

    // Handle search input
    handleSearch(query) {
        if (!query || query.length < 2) return;
        
        // Update search input if needed
        const searchInput = document.getElementById('searchInput');
        if (searchInput.value !== query) {
            searchInput.value = query;
        }
        
        // Navigate to search results
        router.navigateTo('search', encodeURIComponent(query));
    }

    // Reset sections visibility (for navigation)
    resetSectionsVisibility() {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.display = 'block';
        });
        
        // Reset section titles
        const trendingTitle = document.querySelector('.section:nth-child(2) h3');
        const topRatedTitle = document.querySelector('.section:nth-child(3) h3');
        
        if (trendingTitle) trendingTitle.textContent = 'Trending Now';
        if (topRatedTitle) topRatedTitle.textContent = 'Top Rated';
    }

    // Handle offline/online status
    setupNetworkHandling() {
        window.addEventListener('online', () => {
            console.log('Connection restored');
            // Optionally refresh current view
        });
        
        window.addEventListener('offline', () => {
            Components.showError(
                'You are offline. Please check your internet connection.',
                null
            );
        });
    }

    // Setup scroll effects for header
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class for backdrop blur effect
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
        
        // Smooth scroll for hero scroll indicator
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const contentWrapper = document.querySelector('.content-wrapper');
                if (contentWrapper) {
                    contentWrapper.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // Initialize app after DOM is loaded
    static start() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new App();
            });
        } else {
            new App();
        }
    }
}

// Start the application
App.start();