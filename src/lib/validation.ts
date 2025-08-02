// Validation utilities for security

export interface PoemMetadata {
  filename: string;
  tags: string[];
}

// Validate poem metadata structure
export function validatePoemMetadata(data: unknown): data is PoemMetadata[] {
  if (!Array.isArray(data)) {
    return false;
  }
  
  return data.every(item => 
    typeof item === 'object' &&
    item !== null &&
    'filename' in item &&
    'tags' in item &&
    typeof item.filename === 'string' &&
    Array.isArray(item.tags) &&
    item.tags.every((tag: unknown) => typeof tag === 'string') &&
    isValidFilename(item.filename)
  );
}

// Validate filename to prevent path traversal attacks
export function isValidFilename(filename: string): boolean {
  // Must be a .md file
  if (!filename.endsWith('.md')) {
    return false;
  }
  
  // No path traversal characters
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false;
  }
  
  // Allow alphanumeric, spaces, parentheses, and some punctuation
  // but still prevent dangerous characters
  const validFilenameRegex = /^[a-zA-Z0-9\s\-_()'.]+\.md$/;
  return validFilenameRegex.test(filename);
}

// Sanitize filename for URL usage
export function sanitizeFilename(filename: string): string {
  // Prevent path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return 'invalid.md';
  }
  
  // Return the filename as-is if it's valid
  if (isValidFilename(filename)) {
    return filename;
  }
  
  // Otherwise return a safe default
  return 'invalid.md';
}