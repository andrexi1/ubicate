export const nodeCoordinates = {
  "Plaza de Bolivar": { lat: 5.5323217, lng: -73.3616267 },
  Catedral: { lat: 5.5319181, lng: -73.3608458 },
  "Templo Santo Domingo": { lat: 5.5329591, lng: -73.3632526 },
  "Casa del Fundador": { lat: 5.532472, lng: -73.3609683 },
  "Alcaldia de Tunja": { lat: 5.5318155, lng: -73.361972 },
  "Monasterio Santa Clara": { lat: 5.5316669, lng: -73.3590943 },
  "Hotel Girasol": { lat: 5.5292378, lng: -73.3596753 },
  "Pozo de Hunzahua": { lat: 5.5333333, lng: -73.3666667 },
  "Cojines del Zaque": { lat: 5.53821, lng: -73.3695108 },
  UPTC: { lat: 5.55178, lng: -73.35656 },
  "Gimnasio Moderno": { lat: 5.5410196, lng: -73.3576846 },
  "Universidad de Boyaca": { lat: 5.5672993, lng: -73.3382574 },
  "Viva Tunja": { lat: 5.5570086, lng: -73.3463232 },
  "Terminal Tunja": { lat: 5.53079, lng: -73.34515 },
  "Parque Pinzon": { lat: 5.5359289, lng: -73.3593456 },
  "Claustro San Agustin": { lat: 5.5359289, lng: -73.3593456 },
};

export const tunjaGraph = {
  "Plaza de Bolivar": {
    Catedral: { weight: 0.15 },
    "Casa del Fundador": { weight: 0.25 },
    "Templo Santo Domingo": { weight: 0.3 },
    "Alcaldia de Tunja": { weight: 0.2 },
  },
  Catedral: {
    "Plaza de Bolivar": { weight: 0.15 },
    "Templo Santo Domingo": { weight: 0.25 },
    "Monasterio Santa Clara": { weight: 0.35 },
    "Hotel Girasol": { weight: 0.7 },
  },
  "Templo Santo Domingo": {
    "Plaza de Bolivar": { weight: 0.3 },
    Catedral: { weight: 0.25 },
    "Claustro San Agustin": { weight: 0.6 },
  },
  "Casa del Fundador": {
    "Plaza de Bolivar": { weight: 0.25 },
    "Pozo de Hunzahua": { weight: 1.1 },
  },
  "Alcaldia de Tunja": {
    "Plaza de Bolivar": { weight: 0.2 },
  },
  "Monasterio Santa Clara": {
    Catedral: { weight: 0.35 },
    "Hotel Girasol": { weight: 0.45 },
  },
  "Hotel Girasol": {
    Catedral: { weight: 0.7 },
    "Monasterio Santa Clara": { weight: 0.45 },
  },
  "Pozo de Hunzahua": {
    "Casa del Fundador": { weight: 1.1 },
    "Cojines del Zaque": { weight: 0.6 },
  },
  "Cojines del Zaque": {
    "Pozo de Hunzahua": { weight: 0.6 },
    UPTC: { weight: 2.0 },
  },
  UPTC: {
    "Cojines del Zaque": { weight: 2.0 },
    "Universidad de Boyaca": { weight: 1.2 },
    "Parque Pinzon": { weight: 0.8 },
    "Gimnasio Moderno": { weight: 1.1 },
  },
  "Gimnasio Moderno": {
    UPTC: { weight: 1.1 },
    "Parque Pinzon": { weight: 0.9 },
  },
  "Universidad de Boyaca": {
    UPTC: { weight: 1.2 },
    "Viva Tunja": { weight: 0.7 },
  },
  "Viva Tunja": {
    "Universidad de Boyaca": { weight: 0.7 },
    "Terminal Tunja": { weight: 2.5 },
  },
  "Terminal Tunja": {
    "Viva Tunja": { weight: 2.5 },
  },
  "Parque Pinzon": {
    UPTC: { weight: 0.8 },
    "Claustro San Agustin": { weight: 1.0 },
    "Gimnasio Moderno": { weight: 0.9 },
  },
  "Claustro San Agustin": {
    "Parque Pinzon": { weight: 1.0 },
    "Templo Santo Domingo": { weight: 0.6 },
  },
};

export function getCoordinates(name) {
  return nodeCoordinates[name] ?? null;
}
