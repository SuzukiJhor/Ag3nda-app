export const formatDateLocal = (date: string) => {
  // Suporta formatos YYYY-MM-DD ou YYYY/MM/DD
  const [year, month, day] = date.split(/[-/]/);
  return `${day}/${month}/${year}`;
};