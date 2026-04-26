# Setup Guide - NetChill Hub

## Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- TMDB API account and key
- Basic understanding of HTML/CSS/JavaScript

## Getting Started

### 1. Get TMDB API Key
1. Visit [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Request an API key (choose "Developer" option)
5. Copy your API key

### 2. Configure the Application
1. Open `src/js/config.js`
2. Replace `YOUR_API_KEY` with your actual TMDB API key:
   ```javascript
   API_KEY: 'your_actual_api_key_here'
   ```

### 3. Run the Application
1. Open `index.html` in your web browser
2. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

### 4. Test the Features
- Browse trending movies on the homepage
- Use the search functionality
- Click on movie cards to view details
- Navigate between different sections

## Project Structure
```
NetChill-Hub/
├── docs/                    # SDD Documentation
│   ├── constitution.md      # Project scope and boundaries
│   ├── feature-specifications.md  # Detailed feature requirements
│   └── task-breakdown.md    # Development task organization
├── src/                     # Source code
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   └── js/
│       ├── config.js       # API configuration
│       ├── api.js          # TMDB API service
│       ├── components.js   # UI components
│       ├── router.js       # Client-side routing
│       └── app.js          # Main application controller
├── assets/                  # Static assets
├── index.html              # Main HTML file
└── README.md               # Project overview
```

## Development Guidelines

### Code Organization
- **config.js**: API keys and configuration constants
- **api.js**: All TMDB API interactions and caching
- **components.js**: Reusable UI components and utilities
- **router.js**: Hash-based routing for SPA navigation
- **app.js**: Main application logic and event handling

### Key Features Implemented
- ✅ Trending movies display
- ✅ Top-rated movies display
- ✅ Movie search with debouncing
- ✅ Movie detail pages with cast information
- ✅ Responsive design
- ✅ Error handling and loading states
- ✅ Client-side routing
- ✅ API response caching

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### Common Issues
1. **"Please configure your TMDB API key"**
   - Make sure you've replaced `YOUR_API_KEY` in `config.js`

2. **Movies not loading**
   - Check browser console for API errors
   - Verify your API key is valid
   - Check internet connection

3. **CORS errors when running locally**
   - Use a local server instead of opening HTML directly
   - Try the server options mentioned in step 3

### Performance Tips
- The app caches API responses for 1 hour
- Images are lazy-loaded for better performance
- Search is debounced to reduce API calls

## Deployment
The application is a static frontend that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Just upload the files and ensure your API key is configured!