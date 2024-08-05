export const download = async (filename: string, content: Blob) => {
  const url = URL.createObjectURL(content);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

  a.click();

  URL.revokeObjectURL(url);
}