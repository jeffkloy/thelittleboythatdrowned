export function parsePoemMarkdown(md: string) {
  const lines = md.split('\n');
  const title = lines[0]?.replace(/^#\s*/, '') || '';
  let content = lines.slice(1).join('\n');
  content = content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>').trim();
  if (content && !content.startsWith('<p>') && !content.startsWith('<h')) content = '<p>' + content;
  if (
    content &&
    !content.endsWith('</p>') &&
    !content.endsWith('</ul>') &&
    !content.endsWith('</h2>') &&
    !content.endsWith('</h3>')
  ) {
    content = content + '</p>';
  }
  return { title, content };
}

export function parseAnalysisMarkdown(md: string) {
  const lines = md.split('\n');
  const title = lines[0]?.replace(/^#\s*/, '') || '';
  let content = lines.slice(1).join('\n');
  content = content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/<\/li>\n<li>/g, '</li><li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .trim();
  if (content && !content.startsWith('<p>') && !content.startsWith('<h')) content = '<p>' + content;
  if (
    content &&
    !content.endsWith('</p>') &&
    !content.endsWith('</ul>') &&
    !content.endsWith('</h2>') &&
    !content.endsWith('</h3>')
  ) {
    content = content + '</p>';
  }
  return { title, content };
}