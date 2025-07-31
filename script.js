// Array to store poem objects with filenames and tags
let poems = [];
let activeTags = new Set(['all']); // Track active filter tags

// DOM elements
const poemList = document.getElementById('poem-list');
const poemDisplay = document.getElementById('poem-display');
const tagButtons = document.getElementById('tag-buttons');
// New: nav toggle for mobile navigation and year in footer
let navToggleBtn;
let siteNav;
let yearEl;

// Function to fetch the list of poems from the poetry directory
async function fetchPoemList() {
    try {
        // Try to fetch the generated poem list file
        const response = await fetch('poetry/poems.json');
        if (response.ok) {
            const data = await response.json();
            // Handle both old format (array of strings) and new format (array of objects)
            if (Array.isArray(data.poems)) {
                if (typeof data.poems[0] === 'string') {
                    // Old format - convert to new format
                    return data.poems.map(filename => ({ filename, tags: [] }));
                } else {
                    // New format with tags
                    return data.poems;
                }
            }
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
                .map(href => ({
                    filename: decodeURIComponent(href.split('/').pop()),
                    tags: []
                }));
            
            if (poems.length > 0) {
                return poems.sort((a, b) => a.filename.localeCompare(b.filename));
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

// Function to extract all unique tags from poems
function getAllTags() {
    const tagCounts = {};
    poems.forEach(poem => {
        poem.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    
    // Sort tags by frequency (most common first) then alphabetically
    return Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([tag, count]) => ({ tag, count }));
}

// Function to filter poems based on active tags
function filterPoems() {
    const filteredPoems = poems.filter(poem => {
        if (activeTags.has('all') || activeTags.size === 0) {
            return true;
        }
        // Check if poem has any of the active tags
        return poem.tags.some(tag => activeTags.has(tag));
    });
    
    return filteredPoems;
}

// Function to create tag filter buttons
function createTagButtons() {
    if (!tagButtons) return;
    
    const allTags = getAllTags();
    
    // Clear existing buttons
    tagButtons.innerHTML = '';
    
    // Add "All" button
    const allButton = document.createElement('button');
    allButton.className = 'tag-button active';
    allButton.textContent = `All (${poems.length})`;
    allButton.setAttribute('data-tag', 'all');
    allButton.setAttribute('aria-pressed', 'true');
    allButton.addEventListener('click', () => {
        activeTags.clear();
        activeTags.add('all');
        updateTagButtons();
        updatePoemList();
    });
    tagButtons.appendChild(allButton);
    
    // Add individual tag buttons
    allTags.forEach(({ tag, count }) => {
        const button = document.createElement('button');
        button.className = 'tag-button';
        button.textContent = `${tag} (${count})`;
        button.setAttribute('data-tag', tag);
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => {
            if (activeTags.has('all')) {
                activeTags.clear();
            }
            
            if (activeTags.has(tag)) {
                activeTags.delete(tag);
                if (activeTags.size === 0) {
                    activeTags.add('all');
                }
            } else {
                activeTags.add(tag);
            }
            
            updateTagButtons();
            updatePoemList();
        });
        tagButtons.appendChild(button);
    });
}

// Function to update tag button states
function updateTagButtons() {
    if (!tagButtons) return;
    
    const buttons = tagButtons.querySelectorAll('.tag-button');
    buttons.forEach(button => {
        const tag = button.getAttribute('data-tag');
        if (activeTags.has(tag)) {
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
        } else {
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
        }
    });
}

// Function to update the poem list based on filters
function updatePoemList() {
    const filteredPoems = filterPoems();
    
    // Clear current list
    poemList.innerHTML = '';
    
    if (filteredPoems.length === 0) {
        const li = document.createElement('li');
        li.className = 'no-results';
        li.textContent = 'No poems match the selected filters';
        poemList.appendChild(li);
        return;
    }
    
    // Create navigation links for filtered poems
    filteredPoems.forEach((poem, index) => {
        const li = document.createElement('li');
        li.style.setProperty('--index', index);
        li.setAttribute('role', 'listitem');
        
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = getCleanTitle(poem.filename);
        a.setAttribute('aria-label', `Read poem: ${getCleanTitle(poem.filename)}`);
        
        a.addEventListener('click', (e) => {
            e.preventDefault();
            loadPoem(poem.filename, e.currentTarget);
            // Close mobile nav after selection for better UX
            if (siteNav && window.matchMedia('(max-width: 767px)').matches) {
              siteNav.removeAttribute('data-open');
              if (navToggleBtn) navToggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
        
        li.appendChild(a);
        poemList.appendChild(li);
    });
    
    // If the currently active poem is no longer in the filtered list, load the first one
    const activeLink = poemList.querySelector('a.active');
    if (!activeLink && filteredPoems.length > 0) {
        const firstLink = poemList.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.click(), 300);
        }
    }
}

// Function to create navigation links (original)
function createNavigation() {
    createTagButtons();
    updatePoemList();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Cache new elements
    navToggleBtn = document.querySelector('.nav-toggle');
    siteNav = document.getElementById('site-nav');
    yearEl = document.getElementById('year');

    // Footer year
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Setup nav toggle behavior (mobile)
    if (navToggleBtn && siteNav) {
      navToggleBtn.addEventListener('click', () => {
        const isOpen = siteNav.getAttribute('data-open') === 'true';
        if (isOpen) {
          siteNav.removeAttribute('data-open');
          navToggleBtn.setAttribute('aria-expanded', 'false');
        } else {
          siteNav.setAttribute('data-open', 'true');
          navToggleBtn.setAttribute('aria-expanded', 'true');
          // manage focus for a11y: focus first link when opened
          const firstLink = siteNav.querySelector('a');
          if (firstLink) firstLink.focus();
        }
      });

      // Close nav on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && siteNav.getAttribute('data-open') === 'true') {
          siteNav.removeAttribute('data-open');
          navToggleBtn.setAttribute('aria-expanded', 'false');
          navToggleBtn.focus();
        }
      });
    }

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
            }, 300);
        } else {
            // No poems found
            poemList.innerHTML = '<li class="error">No poems found. Please run generate_poem_list.py to create poems.json</li>';
            poemDisplay.innerHTML = '<p class="error">Unable to load poem list</p><p class="error-detail">Please ensure poems.json exists in the poetry directory.</p>';
        }
    } catch (error) {
        console.error('Error loading poem list:', error);
        poemList.innerHTML = '<li class="error">Error loading poem list</li>';
    }
    
    // Add keyboard navigation for poem list
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