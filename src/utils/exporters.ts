import TurndownService from 'turndown';

export type ExportFormat = "html" | "md" | "txt";

export const exportAsHTML = (content: string) => {
  return content;
};

export const exportAsMarkdown = (content: string) => {
  const turndownService = new TurndownService();
  return turndownService.turndown(content);
};

export const exportAsText = (content: string) => {
  const div = document.createElement('div');
  div.innerHTML = content;
  return div.textContent || div.innerText || '';
};