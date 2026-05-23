export const tunjaGraph = {
  "Plaza de Bolívar": {
    Catedral: { weight: 0.15, lat: 5.5325, lng: -73.3617 },
    "Casa del Fundador": { weight: 0.25, lat: 5.5318, lng: -73.362 },
    "Templo Santo Domingo": { weight: 0.3, lat: 5.533, lng: -73.3605 },
    "Alcaldía de Tunja": { weight: 0.2, lat: 5.5335, lng: -73.3625 },
  },
  Catedral: {
    "Plaza de Bolívar": { weight: 0.15, lat: 5.5325, lng: -73.3617 },
    "Templo Santo Domingo": { weight: 0.25, lat: 5.533, lng: -73.3605 },
    "Monasterio Santa Clara": { weight: 0.35, lat: 5.5312, lng: -73.3598 },
    "Hotel Girasol": { weight: 0.7, lat: 5.534, lng: -73.363 },
  },
  "Templo Santo Domingo": {
    "Plaza de Bolívar": { weight: 0.3, lat: 5.533, lng: -73.3605 },
    Catedral: { weight: 0.25, lat: 5.533, lng: -73.3605 },
    "Claustro San Agustín": { weight: 0.6, lat: 5.535, lng: -73.358 },
  },
  "Casa del Fundador": {
    "Plaza de Bolívar": { weight: 0.25, lat: 5.5318, lng: -73.362 },
    "Pozo de Hunzahúa": { weight: 1.1, lat: 5.54, lng: -73.355 },
  },
  "Pozo de Hunzahúa": {
    "Casa del Fundador": { weight: 1.1, lat: 5.54, lng: -73.355 },
    "Cojines del Zaque": { weight: 0.6, lat: 5.542, lng: -73.352 },
  },
  "Cojines del Zaque": {
    "Pozo de Hunzahúa": { weight: 0.6, lat: 5.542, lng: -73.352 },
    UPTC: { weight: 2.0, lat: 5.554, lng: -73.352 },
  },
  UPTC: {
    "Cojines del Zaque": { weight: 2.0, lat: 5.554, lng: -73.352 },
    "Universidad de Boyacá": { weight: 1.2, lat: 5.56, lng: -73.35 },
    "Parque Pinzón": { weight: 0.8, lat: 5.554, lng: -73.352 },
    "Gimnasio Moderno": { weight: 1.1, lat: 5.556, lng: -73.35 },
  },
  "Gimnasio Moderno": {
    UPTC: { weight: 1.1, lat: 5.556, lng: -73.35 },
    "Parque Pinzón": { weight: 0.9, lat: 5.554, lng: -73.352 },
  },
  "Universidad de Boyacá": {
    UPTC: { weight: 1.2, lat: 5.56, lng: -73.35 },
    "Viva Tunja": { weight: 0.7, lat: 5.565, lng: -73.348 },
  },
  "Viva Tunja": {
    "Universidad de Boyacá": { weight: 0.7, lat: 5.565, lng: -73.348 },
    "Terminal Tunja": { weight: 2.5, lat: 5.575, lng: -73.34 },
  },
  "Terminal Tunja": {
    "Viva Tunja": { weight: 2.5, lat: 5.575, lng: -73.34 },
  },
  "Parque Pinzón": {
    UPTC: { weight: 0.8, lat: 5.554, lng: -73.352 },
    "Claustro San Agustín": { weight: 1.0, lat: 5.535, lng: -73.358 },
    "Gimnasio Moderno": { weight: 0.9, lat: 5.554, lng: -73.352 },
  },
  "Claustro San Agustín": {
    "Parque Pinzón": { weight: 1.0, lat: 5.535, lng: -73.358 },
    "Templo Santo Domingo": { weight: 0.6, lat: 5.535, lng: -73.358 },
  },
};

export function getCoordinates(name) {
  const connections = tunjaGraph[name];
  if (!connections) return null;
  const first = Object.values(connections)[0];
  return { lat: first.lat, lng: first.lng };
}
