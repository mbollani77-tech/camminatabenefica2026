// Logica prezzi centralizzata: modifica solo qui per aggiornare le quote ovunque.
// Nota GDPR: la categoria "agevolata" copre disabilità/altre condizioni senza
// chiedere il motivo esplicito nel form, per evitare di raccogliere dati sensibili.

export const CATEGORIES = {
  adulto: { label: 'Adulto', amount: 15.0 },
  bambino: { label: 'Bambino (fino a 13 anni)', amount: 5.0 },
  senior: { label: 'Over 65', amount: 0.0 },
  agevolata: { label: 'Disabili', amount: 0.0 },
};

export function getAmountForCategory(category) {
  const entry = CATEGORIES[category];
  if (!entry) throw new Error('Categoria non valida');
  return entry.amount;
}
