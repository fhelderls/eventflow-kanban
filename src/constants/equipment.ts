export const REQUIRED_EQUIPMENT_CATEGORIES = [
  { category: 'chopeira', label: 'Chopeira', quantity: 1 },
  { category: 'cilindro_co2', label: 'Cilindro de CO2', quantity: 1 },
  { category: 'manometro', label: 'Manômetro', quantity: 1 },
  { category: 'pingadeira', label: 'Pingadeira', quantity: 1 },
  { category: 'extratora', label: 'Extratora', quantity: 1 }
] as const;

export type EquipmentCategory = typeof REQUIRED_EQUIPMENT_CATEGORIES[number]['category'];
