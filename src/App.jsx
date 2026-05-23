import { useState } from "react";
import UbicateMap from "./components/Map";
import DijkstraVisualizer from "./components/DijkstraVisualizer";
import { tunjaGraph } from "./utils/tunjaGraph";
import { dijkstra } from "./utils/dijkstra";

function App() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [startName, setStartName] = useState("");
  const [endName, setEndName] = useState("");
  const [result, setResult] = useState(null);
  const [showPanel, setShowPanel] = useState(false);

  const handleSelectPoint = (name, coords) => {
    if (!start) {
      setStart(coords);
      setStartName(name || "Punto A");
    } else if (!end) {
      setEnd(coords);
      setEndName(name || "Punto B");
    }
  };

  const calculateRoute = () => {
    if (!start || !end) {
      alert("Selecciona Punto A y Punto B haciendo clic en los marcadores");
      return;
    }

    const res = dijkstra(tunjaGraph, startName, endName);

    setResult({
      ...res,
      startName,
      endName,
    });
    setShowPanel(true);
  };

  const reset = () => {
    setStart(null);
    setEnd(null);
    setStartName("");
    setEndName("");
    setResult(null);
    setShowPanel(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* HEADER FIJO */}
      <header className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-indigo-700 py-5 shadow-2xl z-50 relative flex-shrink-0">
        <div className="flex items-center justify-center gap-4 px-4">
          <div className="text-5xl md:text-6xl animate-bounce">🗺️</div>
          <div>
            <h1
              className="text-5xl md:text-7xl font-black tracking-tighter 
                           bg-gradient-to-r from-purple-200 via-violet-300 to-fuchsia-200 
                           bg-clip-text text-transparent drop-shadow-2xl animate-pulse"
            >
              UBICATE
            </h1>
            <p className="text-center text-indigo-100 text-base md:text-xl font-medium">
              Encuentra tu ruta ideal en Tunja
            </p>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mapa */}
        <div className="flex-1 relative">
          <UbicateMap
            start={start}
            end={end}
            onSelectPoint={handleSelectPoint}
            allPoints={tunjaGraph}
          />
        </div>

        {/* Panel Lateral */}
        <div
          className={`
          w-full lg:w-96 bg-gray-900 border-l border-gray-700 overflow-auto z-40
          fixed lg:relative inset-y-0 right-0 transition-transform duration-300
          ${showPanel ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="p-6 space-y-6">
            {/* Botón cerrar en móvil */}
            <button
              onClick={() => setShowPanel(false)}
              className="lg:hidden text-3xl absolute top-4 right-4 text-gray-400"
            >
              ✕
            </button>

            <div className="bg-gray-800 p-5 rounded-3xl">
              <p className="text-lg">
                <strong>Punto A:</strong> {startName || "Toca un marcador"}
              </p>
              <p className="text-lg mt-2">
                <strong>Punto B:</strong> {endName || "Toca un marcador"}
              </p>
            </div>

            <button
              onClick={calculateRoute}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-5 rounded-3xl text-xl font-bold hover:brightness-110 transition"
            >
                CALCULAR MEJOR RUTA
            </button>

            <button
              onClick={reset}
              className="w-full bg-gradient-to-r from-purple-500 to-violet-600 py-4 rounded-3xl text-lg font-bold hover:brightness-110 transition"
            >
                Reiniciar
            </button>

            {result && (
              <DijkstraVisualizer
                steps={result.steps}
                path={result.path}
                distance={result.distance}
                startName={result.startName}
                endName={result.endName}
              />
            )}
          </div>
        </div>
      </div>

      {/* Botón flotante para abrir panel en móviles */}
      <button
        onClick={() => setShowPanel(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-violet-600 text-white p-5 rounded-full shadow-2xl text-2xl z-50"
      >
        📍
      </button>
    </div>
  );
}

export default App;
