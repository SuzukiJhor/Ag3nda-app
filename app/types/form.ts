export type FormData = {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  servico: string;
  status: string;
  observacoes: string;
};

export const statusOptions: FormData['status'][] = [
  'pendente',
  'confirmado',
  'cancelado',
  'expirado',
];