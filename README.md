# UBICATE

UBICATE es una aplicacion web para seleccionar puntos de interes en Tunja, visualizar sus ubicaciones en un mapa interactivo y calcular la ruta mas corta entre dos nodos usando el algoritmo de Dijkstra.

El mapa se renderiza con Leaflet y OpenStreetMap. La ruta visual sobre calles se consulta con OSRM mediante `leaflet-routing-machine`.

## Requisitos

Antes de empezar, instala:

- Node.js 18 o superior
- npm, incluido con Node.js
- Git, si vas a clonar el repositorio
- Conexion a internet para cargar el mapa, las teselas de OpenStreetMap, los iconos externos de Leaflet y el servicio de rutas OSRM

Comprueba las versiones con:

```bash
node -v
npm -v
git --version
```

## Instalacion

Clona el repositorio y entra a la carpeta del proyecto:

```bash
git clone <URL_DEL_REPOSITORIO>
cd ubicate
```

Instala dependencias desde el lockfile:

```bash
npm ci
```

Si no tienes `package-lock.json` o `npm ci` falla por cambios de dependencias:

```bash
npm install
```

## Ejecutar en desarrollo

Inicia Vite:

```bash
npm run dev
```

Abre la URL que muestre la terminal. Normalmente sera:

```text
http://localhost:5173/
```

## Como usar la aplicacion

1. Espera a que cargue el mapa.
2. Usa `Elegir Punto A` o `Elegir Punto B` para indicar que punto quieres editar.
3. Selecciona un nodo desde la tabla o haz clic sobre un marcador del mapa.
4. Presiona `CALCULAR MEJOR RUTA`.
5. Revisa la distancia, la ruta optima y el procedimiento de Dijkstra.
6. Usa `Reiniciar` para limpiar la seleccion.

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: compila la aplicacion para produccion.
- `npm run preview`: sirve localmente la version compilada en `dist/`.
- `npm run lint`: revisa el codigo con ESLint.

## Version de produccion

Genera los archivos optimizados:

```bash
npm run build
```

El resultado queda en `dist/`.

Para revisarlo localmente:

```bash
npm run preview
```

## Estructura principal

```text
ubicate/
  public/
    favicon.svg
    icons.svg
    robots.txt
  src/
    components/
      Map.jsx
      DijkstraVisualizer.jsx
    utils/
      dijkstra.js
      tunjaGraph.js
    App.jsx
    index.css
    main.jsx
  eslint.config.js
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  vite.config.js
```

## Componentes y responsabilidades

- `src/App.jsx`: coordina el estado principal de la aplicacion. Guarda Punto A, Punto B, el resultado de Dijkstra, el panel lateral y el punto activo que se esta editando.
- `src/components/Map.jsx`: renderiza el mapa con React Leaflet, crea marcadores personalizados y dibuja la ruta usando `leaflet-routing-machine`.
- `src/components/DijkstraVisualizer.jsx`: muestra los pasos del algoritmo, las distancias parciales y la ruta final.
- `src/utils/dijkstra.js`: implementa el algoritmo de Dijkstra sobre un grafo ponderado.
- `src/utils/tunjaGraph.js`: define las coordenadas de cada nodo y las conexiones ponderadas entre nodos.
- `src/index.css`: contiene Tailwind y estilos personalizados para Leaflet y marcadores.

## Dependencias principales

- React
- Vite
- Tailwind CSS
- Leaflet
- React Leaflet
- Leaflet Routing Machine
- Lucide React

## Solucion de problemas

Si el mapa no aparece:

- Verifica la conexion a internet.
- Revisa si el navegador esta bloqueando peticiones a OpenStreetMap, CDNJS u OSRM.
- Abre la consola del navegador para ver errores de red.

Si `npm run dev` no funciona:

```bash
npm install
npm run dev
```

Si el puerto `5173` esta ocupado, Vite puede abrir otro puerto automaticamente. Usa la URL exacta que aparezca en la terminal.

Si quieres medir Lighthouse:

```bash
npm run build
npm run preview
```

Ejecuta Lighthouse contra la URL de `preview`, no contra `npm run dev`, porque el servidor de desarrollo no esta optimizado para performance.
