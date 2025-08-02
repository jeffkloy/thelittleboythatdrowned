import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked for standard markdown (used for analysis)
const analysisOptions = {
  gfm: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
};

// Configure marked for poetry (preserve line breaks)
const poemOptions = {
  gfm: true,
  breaks: true,  // Convert line breaks to <br> for poetry
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
};

export function parsePoemMarkdown(md: string) {
  const lines = md.split('\n');
  const title = lines[0]?.replace(/^#\s*/, '') || '';
  const rawContent = lines.slice(1).join('\n');
  
  marked.setOptions(poemOptions);
  const unsafeHtml = marked(rawContent);
  const content = DOMPurify.sanitize(unsafeHtml, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
  
  return { title, content };
}

export function parseAnalysisMarkdown(md: string) {
  const lines = md.split('\n');
  const title = lines[0]?.replace(/^#\s*/, '') || '';
  const rawContent = lines.slice(1).join('\n');
  
  marked.setOptions(analysisOptions);
  const unsafeHtml = marked(rawContent);
  const content = DOMPurify.sanitize(unsafeHtml, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: []
  });
  
  return { title, content };
}