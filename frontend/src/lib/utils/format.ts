// src/lib/utils/format.ts

// Formate une date au format français
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

// Formate la monnaie en FCFA (XAF) comme demandé dans le guide
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('XAF', 'FCFA'); // Remplacement cosmétique si nécessaire
}

// Formate un nom complet (Ex: "jean dupont" -> "Jean Dupont")
export function formatName(firstName: string, lastName: string): string {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return `${capitalize(firstName)} ${capitalize(lastName)}`;
}