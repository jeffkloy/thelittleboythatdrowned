// Array to store poem filenames
let poems = [];

// DOM elements
const poemList = document.getElementById('poem-list');
const poemDisplay = document.getElementById('poem-display');

// Function to fetch the list of poems from the poetry directory
async function fetchPoemList() {
    try {
        // Try to fetch the generated poem list file
        const response = await fetch('poetry/poems.json');
        if (response.ok) {
            const data = await response.json();
            return data.poems;
        }
    } catch (error) {
        console.log('No poems.json found, fetching directory listing');
    }
    
    // For GitHub Pages: Try to fetch the directory listing
    try {
        const response = await fetch('poetry/');
        if (response.ok) {
            const text = await response.text();
            // Parse the directory listing HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'));
            
            const poems = links
                .map(link => link.getAttribute('href'))
                .filter(href => href && href.endsWith('.md'))
                .map(href => decodeURIComponent(href.split('/').pop()));
            
            if (poems.length > 0) {
                return poems.sort();
            }
        }
    } catch (error) {
        console.log('Directory listing not available');
    }
    
    // Final fallback: Return empty array with error message
    console.error('Unable to fetch poem list. Please ensure poems.json exists in the poetry directory.');
    return [];
}

// Function to get clean title from filename
function getCleanTitle(filename) {
    return filename.replace('.md', '');
}

// Function to parse markdown to HTML (basic implementation)
function parseMarkdown(markdown) {
    // Remove the first line (title) as we'll display it separately
    const lines = markdown.split('\n');
    const title = lines[0].replace(/^#\s*/, '').replace(/[""]/g, '');
    const content = lines.slice(1).join('\n');
    
    // Basic markdown parsing
    let html = content
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .trim();
    
    if (html && !html.startsWith('<p>')) {
        html = '<p>' + html;
    }
    if (html && !html.endsWith('</p>')) {
        html = html + '</p>';
    }
    
    return { title, content: html };
}

// Function to load and display a poem with smooth transitions
async function loadPoem(filename, linkElement) {
    // Fade out current content
    poemDisplay.style.opacity = '0';
    
    setTimeout(async () => {
        poemDisplay.innerHTML = '<p class="loading">Loading poem</p>';
        poemDisplay.style.opacity = '1';
        
        try {
            // Try to load the poem file
            const response = await fetch(`poetry/${encodeURIComponent(filename)}`);
            
            if (!response.ok) {
                console.error(`Failed to load ${filename}: HTTP ${response.status}`);
                throw new Error(`Failed to load poem (HTTP ${response.status})`);
            }
            
            const markdown = await response.text();
            const { title, content } = parseMarkdown(markdown);
            
            // Fade out loading message
            poemDisplay.style.opacity = '0';
            
            setTimeout(() => {
                poemDisplay.innerHTML = `
                    <h2>${title}</h2>
                    <div class="poem-text">${content}</div>
                `;
                poemDisplay.style.opacity = '1';
                
                // Update active state in navigation
                document.querySelectorAll('.poem-list a').forEach(link => {
                    link.classList.remove('active');
                });
                if (linkElement) {
                    linkElement.classList.add('active');
                }
                
                // Scroll to top of poem content on mobile
                if (window.innerWidth <= 767) {
                    poemDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
            
        } catch (error) {
            console.error('Error loading poem:', error);
            poemDisplay.style.opacity = '0';
            
            setTimeout(() => {
                poemDisplay.innerHTML = `
                    <p class="error">Unable to load poem: ${getCleanTitle(filename)}</p>
                    <p class="error-detail">Please ensure you're viewing this page through a web server (not file://) or on GitHub Pages.</p>
                `;
                poemDisplay.style.opacity = '1';
            }, 300);
        }
    }, 300);
}

// Function to create navigation links
function createNavigation() {
    poems.forEach((filename, index) => {
        const li = document.createElement('li');
        li.style.setProperty('--index', index);
        li.setAttribute('role', 'listitem');
        
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = getCleanTitle(filename);
        a.setAttribute('role', 'button');
        a.setAttribute('aria-label', `Read poem: ${getCleanTitle(filename)}`);
        
        a.addEventListener('click', (e) => {
            e.preventDefault();
            loadPoem(filename, e.target);
        });
        
        li.appendChild(a);
        poemList.appendChild(li);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Add initial opacity transition to poem display
    poemDisplay.style.transition = 'opacity 0.3s ease-in-out';
    
    // Show loading state
    poemList.innerHTML = '<li class="loading">Loading poems...</li>';
    
    try {
        // Fetch the list of poems
        poems = await fetchPoemList();
        
        // Clear loading state
        poemList.innerHTML = '';
        
        if (poems.length > 0) {
            // Create navigation
            createNavigation();
            
            // Load the first poem by default after a short delay
            setTimeout(() => {
                const firstLink = poemList.querySelector('a');
                if (firstLink) {
                    firstLink.click();
                }
            }, 500);
        } else {
            // No poems found
            poemList.innerHTML = '<li class="error">No poems found. Please run generate_poem_list.py to create poems.json</li>';
            poemDisplay.innerHTML = '<p class="error">Unable to load poem list</p><p class="error-detail">Please ensure poems.json exists in the poetry directory.</p>';
        }
    } catch (error) {
        console.error('Error loading poem list:', error);
        poemList.innerHTML = '<li class="error">Error loading poem list</li>';
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        const activeLink = document.querySelector('.poem-list a.active');
        if (!activeLink) return;
        
        const allLinks = Array.from(document.querySelectorAll('.poem-list a'));
        const currentIndex = allLinks.indexOf(activeLink);
        
        if (e.key === 'ArrowDown' && currentIndex < allLinks.length - 1) {
            e.preventDefault();
            allLinks[currentIndex + 1].click();
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            allLinks[currentIndex - 1].click();
        }
    });
});