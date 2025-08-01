export const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmado':
      return '#38d39f';
    case 'cancelado':
      return '#ff4d4d';
    case 'pendente':
    case 'expirado':
      return '#ffe066';
    default:
      return '#ccc';
  }
};
