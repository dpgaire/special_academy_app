export const buildPdfEmbedUrl = (url: string): string => {
  // Handle Google Drive PDF URLs
  if (url.includes("drive.google.com")) {
    const match = url.match(/\/d\/([^\/]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }
  
  // For other PDFs, use Google Docs viewer
  return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
};

