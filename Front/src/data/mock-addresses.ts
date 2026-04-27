export interface AddressDetail {
  id: string;
  numero: string;
  rue: string;
  type: string;
  prix_m2?: number;
  surface?: number;
  statut: 'Vente' | 'Location' | 'Social';
}

const RUES_PARISIENNES = [
  'Rue de Rivoli', 'Rue du Louvre', 'Avenue de l\'Opéra', 'Rue Saint-Honoré', 'Place Vendôme',
  'Rue de la Paix', 'Boulevard des Italiens', 'Rue Réaumur', 'Rue Montorgueil',
  'Rue de Bretagne', 'Boulevard Beaumarchais', 'Rue des Francs-Bourgeois', 'Rue du Temple',
  'Rue Saint-Antoine', 'Place des Vosges', 'Rue des Rosiers', 'Boulevard Saint-Michel',
  'Rue Mouffetard', 'Rue des Écoles', 'Rue Soufflot', 'Boulevard Saint-Germain',
  'Rue de Rennes', 'Rue d\'Assas', 'Rue Bonaparte', 'Avenue Bosquet',
  'Rue Cler', 'Avenue de la Bourdonnais', 'Rue de Grenelle', 'Avenue des Champs-Élysées',
  'Avenue Montaigne', 'Boulevard Haussmann', 'Rue du Faubourg Saint-Honoré',
  'Rue de la Chaussée d\'Antin', 'Rue des Martyrs', 'Rue Saint-Lazare',
  'Boulevard de Magenta', 'Rue du Faubourg Poissonnière', 'Rue de la Grange aux Belles',
  'Boulevard Voltaire', 'Rue Oberkampf', 'Avenue de la République', 'Rue de la Roquette',
  'Avenue Daumesnil', 'Boulevard Diderot', 'Rue de Charenton', 'Avenue d\'Italie',
  'Boulevard Vincent Auriol', 'Rue de Tolbiac', 'Avenue de Choisy', 'Avenue du Général Leclerc',
  'Boulevard Raspail', 'Rue Daguerre', 'Rue d\'Alésia', 'Rue du Commerce',
  'Rue de Vaugirard', 'Avenue Émile Zola', 'Rue Lecourbe', 'Avenue Victor Hugo',
  'Avenue Foch', 'Rue de Passy', 'Avenue Kléber', 'Avenue des Ternes',
  'Rue de Courcelles', 'Boulevard des Batignolles', 'Avenue de Villiers', 'Rue Lepic',
  'Boulevard Marguerite de Rochechouart', 'Rue Lamarck', 'Rue Ordener', 'Avenue Jean Jaurès',
  'Rue de Crimée', 'Avenue de Flandre', 'Rue Manin', 'Boulevard de Belleville',
  'Rue des Pyrénées', 'Rue de Ménilmontant', 'Avenue Gambetta', 'Rue Lafayette',
  'Rue de Rivoli', 'Boulevard Raspail', 'Avenue de Wagram', 'Avenue Mac-Mahon'
];

// Fonction simple pour générer un nombre pseudo-aléatoire à partir d'une chaîne
function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export const generateMockAddresses = (quartierName: string): AddressDetail[] => {
  const results: AddressDetail[] = [];
  const types = ['Appartement 2P', 'Studio', 'Appartement 3P', 'Local Commercial', 'Maison de ville', 'Appartement 4P', 'Loft'];
  const statuts: ('Vente' | 'Location' | 'Social')[] = ['Vente', 'Vente', 'Location', 'Social', 'Vente', 'Location'];

  // Seed basé sur le nom du quartier pour que les résultats soient toujours les mêmes pour un quartier donné
  const baseSeed = hashString(quartierName);
  
  // Générer entre 10 et 18 transactions par quartier
  const numTransactions = 10 + (baseSeed % 9);

  for (let i = 0; i < numTransactions; i++) {
    const currentSeed = baseSeed + i * 17; // Variation du seed pour chaque itération
    
    const rue = RUES_PARISIENNES[currentSeed % RUES_PARISIENNES.length];
    const numero = (currentSeed % 150) + 1;
    const type = types[currentSeed % types.length];
    const statut = statuts[(currentSeed * 3) % statuts.length];
    
    results.push({
      id: `${quartierName}-${i}`,
      numero: numero.toString() + ((currentSeed % 7 === 0) ? ' bis' : ''),
      rue: rue,
      type: type,
      statut: statut,
      prix_m2: statut === 'Vente' ? 7000 + (currentSeed % 8000) : undefined, // Prix entre 7000 et 15000
      surface: 15 + (currentSeed % 120), // Surface entre 15 et 135
    });
  }
  
  return results;
};
