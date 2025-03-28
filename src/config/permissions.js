export const roles = {
  admin: {
    access: ['*'], // Acesso total
    description: 'Administrador do sistema'
  },
  judge: {
    access: [
      'view:competitions',
      'create:scores',
      'edit:own_scores'
    ],
    description: 'Juiz - Pode lançar e visualizar notas'
  },
  technical: {
    access: [
      'view:athletes',
      'edit:athletes'
    ],
    description: 'Técnico - Gerencia atletas vinculados'
  },
  athlete: {
    access: [
      'view:own_profile',
      'view:own_scores'
    ],
    description: 'Atleta - Acesso restrito ao próprio perfil'
  }
};