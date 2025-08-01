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
    console.log('Starting fetchPoemList...');
    try {
        // Try to fetch the generated poem list file
        console.log('Fetching poems/poems.json...');
        const response = await fetch('poems/poems.json');
        console.log('Response status:', response.status, 'OK:', response.ok);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Parsed JSON data:', data);
            
            // Handle both old format (array of strings) and new format (array of objects)
            if (Array.isArray(data.poems)) {
                console.log('Found poems array with', data.poems.length, 'poems');
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
        console.error('Error fetching poems.json:', error);
        console.log('No poems.json found, fetching directory listing');
    }
    
    // For GitHub Pages: Try to fetch the directory listing
    try {
        const response = await fetch('poems/');
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

// Function to parse markdown to HTML (enhanced for analysis)
function parseMarkdown(markdown, isAnalysis = false) {
    // Remove the first line (title) as we'll display it separately
    const lines = markdown.split('\n');
    const title = lines[0].replace(/^#\s*/, '');
    let content = lines.slice(1).join('\n');
    
    if (isAnalysis) {
        // Enhanced markdown parsing for analysis files
        content = content
            // Parse headers
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            // Parse bold text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            // Parse italic text
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Parse bullet points
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
            // Clean up nested tags
            .replace(/<\/li>\n<li>/g, '</li><li>')
            // Parse paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .trim();
    } else {
        // Basic markdown parsing for poems
        content = content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .trim();
    }
    
    if (content && !content.startsWith('<p>') && !content.startsWith('<h')) {
        content = '<p>' + content;
    }
    if (content && !content.endsWith('</p>') && !content.endsWith('</ul>') && !content.endsWith('</h2>') && !content.endsWith('</h3>')) {
        content = content + '</p>';
    }
    
    return { title, content };
}

// Store current poem data for toggling
let currentPoemData = null;
let currentAnalysisData = null;
let currentView = 'poem'; // 'poem' or 'analysis'

// Function to load analysis
async function loadAnalysis(filename) {
    try {
        const analysisPath = `analyses/${getCleanTitle(filename)} - Analysis.md`;
        const response = await fetch(analysisPath);
        
        if (!response.ok) {
            throw new Error(`Failed to load analysis (HTTP ${response.status})`);
        }
        
        const markdown = await response.text();
        return parseMarkdown(markdown, true);
    } catch (error) {
        console.error('Error loading analysis:', error);
        return null;
    }
}

// Function to display content (poem or analysis)
function displayContent(type = 'poem') {
    poemDisplay.style.opacity = '0';
    
    setTimeout(() => {
        if (type === 'poem' && currentPoemData) {
            poemDisplay.innerHTML = `
                <div class="content-header">
                    <h2>${currentPoemData.title}</h2>
                    <div class="view-toggle">
                        <button class="toggle-btn active" data-view="poem">Poem</button>
                        <button class="toggle-btn" data-view="analysis">Analysis</button>
                    </div>
                </div>
                <div class="poem-text">${currentPoemData.content}</div>
            `;
        } else if (type === 'analysis' && currentAnalysisData) {
            poemDisplay.innerHTML = `
                <div class="content-header">
                    <h2>${currentAnalysisData.title}</h2>
                    <div class="view-toggle">
                        <button class="toggle-btn" data-view="poem">Poem</button>
                        <button class="toggle-btn active" data-view="analysis">Analysis</button>
                    </div>
                </div>
                <div class="analysis-text">${currentAnalysisData.content}</div>
            `;
        }
        
        poemDisplay.style.opacity = '1';
        
        // Add event listeners to toggle buttons
        const toggleBtns = poemDisplay.querySelectorAll('.toggle-btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.getAttribute('data-view');
                if (view !== currentView) {
                    currentView = view;
                    displayContent(view);
                }
            });
        });
    }, 300);
}

// Function to load and display a poem with smooth transitions
async function loadPoem(filename, linkElement) {
    // Reset view to poem
    currentView = 'poem';
    
    // Fade out current content
    poemDisplay.style.opacity = '0';
    
    setTimeout(async () => {
        poemDisplay.innerHTML = '<p class="loading">Loading poem</p>';
        poemDisplay.style.opacity = '1';
        
        try {
            // Try to load the poem file
            const response = await fetch(`poems/${encodeURIComponent(filename)}`);
            
            if (!response.ok) {
                console.error(`Failed to load ${filename}: HTTP ${response.status}`);
                throw new Error(`Failed to load poem (HTTP ${response.status})`);
            }
            
            const markdown = await response.text();
            currentPoemData = parseMarkdown(markdown);
            
            // Load analysis in background
            currentAnalysisData = await loadAnalysis(filename);
            
            // Display the poem
            displayContent('poem');
            
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
    console.log('Creating navigation with', poems.length, 'poems');
    createTagButtons();
    updatePoemList();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded - Initializing...');
    
    // Cache new elements
    navToggleBtn = document.querySelector('.nav-toggle');
    siteNav = document.getElementById('site-nav');
    yearEl = document.getElementById('year');
    
    console.log('Elements found:', {
        poemList: !!poemList,
        poemDisplay: !!poemDisplay,
        tagButtons: !!tagButtons,
        navToggleBtn: !!navToggleBtn,
        siteNav: !!siteNav
    });

    // Footer year
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Setup nav toggle behavior (mobile)
    if (navToggleBtn && siteNav) {
      // Function to toggle menu
      const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Menu toggle clicked');
        
        const isOpen = siteNav.getAttribute('data-open') === 'true';
        console.log('Current state:', isOpen ? 'open' : 'closed');
        
        if (isOpen) {
          siteNav.removeAttribute('data-open');
          navToggleBtn.setAttribute('aria-expanded', 'false');
          console.log('Menu closed');
        } else {
          siteNav.setAttribute('data-open', 'true');
          navToggleBtn.setAttribute('aria-expanded', 'true');
          console.log('Menu opened');
          
          // Don't auto-focus on mobile as it can cause issues
          if (!('ontouchstart' in window)) {
            const firstLink = siteNav.querySelector('a');
            if (firstLink) firstLink.focus();
          }
        }
      };
      
      // Add both click and touchend for better iOS support
      navToggleBtn.addEventListener('click', toggleMenu);
      navToggleBtn.addEventListener('touchend', toggleMenu);

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
        console.log('Fetching poem list...');
        poems = await fetchPoemList();
        console.log('Fetched poems:', poems);
        
        // Clear loading state
        poemList.innerHTML = '';
        
        if (poems.length > 0) {
            console.log('Creating navigation for', poems.length, 'poems');
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