// URL utility functions

export function getPoemUrl(filename: string): string {
  // Remove .md extension for cleaner URLs
  const cleanName = filename.replace('.md', '');
  const params = new URLSearchParams({ poem: cleanName });
  return `?${params.toString()}`;
}

export function getAnalysisUrl(filename: string): string {
  // Remove .md extension for cleaner URLs
  const cleanName = filename.replace('.md', '');
  const params = new URLSearchParams({ analysis: cleanName });
  return `?${params.toString()}`;
}

export function cleanPoemTitle(filename: string): string {
  return filename.replace('.md', '');
}

export function addMdExtension(poemName: string): string {
  // Add .md extension if not present
  return poemName.endsWith('.md') ? poemName : `${poemName}.md`;
}