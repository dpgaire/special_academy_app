export const buildPdfEmbedUrl = (url: string): string => {
  return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
};
