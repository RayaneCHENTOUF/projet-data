export interface OverpassAddress {
  id: number;
  numero: string;
  rue: string;
  lat: number;
  lon: number;
}

export async function fetchAddressesInPolygon(coordinates: number[][]): Promise<OverpassAddress[]> {
  // Overpass poly string format: "lat lon lat lon ..."
  // GeoJSON uses [lon, lat], Overpass expects lat lon
  const polyString = coordinates.map(coord => `${coord[1]} ${coord[0]}`).join(' ');

  const query = `[out:json][timeout:25];
(
  node["addr:housenumber"]["addr:street"](poly:"${polyString}");
  way["addr:housenumber"]["addr:street"](poly:"${polyString}");
);
out center;`;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des adresses');
  }

  const data = await response.json();
  const addresses: OverpassAddress[] = [];

  const seen = new Set<string>();

  for (const element of data.elements) {
    const tags = element.tags;
    if (tags && tags['addr:housenumber'] && tags['addr:street']) {
      const numero = tags['addr:housenumber'];
      const rue = tags['addr:street'];
      
      // Nettoyage et déduplication
      const uniqueKey = `${numero}-${rue}`.toLowerCase();
      
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        addresses.push({
          id: element.id,
          numero: numero,
          rue: rue,
          lat: element.lat || element.center?.lat || 0,
          lon: element.lon || element.center?.lon || 0
        });
      }
    }
  }

  // Tri naturel par nom de rue puis par numéro
  return addresses.sort((a, b) => {
    if (a.rue === b.rue) {
      const numA = parseInt(a.numero) || 0;
      const numB = parseInt(b.numero) || 0;
      return numA - numB;
    }
    return a.rue.localeCompare(b.rue, 'fr');
  });
}
