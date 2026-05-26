import { lazy, Suspense, useState } from "react";
import { getCoordinates, tunjaGraph } from "./utils/tunjaGraph";
import { dijkstra } from "./utils/dijkstra";

const UbicateMap = lazy(() => import("./components/Map"));
const DijkstraVisualizer = lazy(() => import("./components/DijkstraVisualizer"));

function App() {
  const nodes = Object.keys(tunjaGraph);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [startName, setStartName] = useState("");
  const [endName, setEndName] = useState("");
  const [result, setResult] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [activePoint, setActivePoint] = useState("start");

  const handleSelectPoint = (name, coords) => {
    const pointName = name || (activePoint === "start" ? "Punto A" : "Punto B");

    if (activePoint === "start") {
      setStart(coords);
      setStartName(pointName);
      setActivePoint("end");
    } else {
      setEnd(coords);
      setEndName(pointName);
      setActivePoint("start");
    }

    setResult(null);
  };

  const handleSelectNode = (name, type) => {
    const coords = getCoordinates(name);
    if (!coords) return;

    if (type === "start") {
      setStart(coords);
      setStartName(name);
      setActivePoint("end");
    } else {
      setEnd(coords);
      setEndName(name);
      setActivePoint("start");
    }

    setResult(null);
  };

  const calculateRoute = () => {
    if (!start || !end) {
      alert("Selecciona Punto A y Punto B desde la tabla o desde los marcadores");
      return;
    }

    if (startName === endName) {
      alert("Selecciona dos nodos diferentes para calcular una ruta");
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
    setActivePoint("start");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      <header className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-indigo-700 py-5 shadow-2xl z-50 relative flex-shrink-0">
        <div className="flex items-center justify-center gap-4 px-4">
          <div className="text-5xl md:text-6xl animate-bounce" aria-hidden="true">
            🗺️
          </div>
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

      <main className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 relative">
          <Suspense
            fallback={
              <div className="h-full min-h-[520px] bg-gray-900 grid place-items-center text-gray-300">
                Cargando mapa...
              </div>
            }
          >
            <UbicateMap
              start={start}
              end={end}
              startName={startName}
              endName={endName}
              activePoint={activePoint}
              onSelectPoint={handleSelectPoint}
              allPoints={tunjaGraph}
            />
          </Suspense>
        </div>

        <aside
          className={`
          w-full lg:w-96 bg-gray-900 border-l border-gray-700 overflow-auto z-40
          fixed lg:relative inset-y-0 right-0 transition-transform duration-300
          ${showPanel ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
          aria-label="Panel de seleccion de ruta"
        >
          <div className="p-6 space-y-6">
            <button
              type="button"
              onClick={() => setShowPanel(false)}
              aria-label="Cerrar panel de resultados"
              className="lg:hidden text-3xl absolute top-4 right-4 text-gray-400"
            >
              x
            </button>

            <div className="bg-gray-800 p-5 rounded-3xl">
              <p className="text-lg">
                <strong>Punto A:</strong> {startName || "Selecciona un nodo"}
              </p>
              <p className="text-lg mt-2">
                <strong>Punto B:</strong> {endName || "Selecciona un nodo"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActivePoint("start")}
                className={`py-3 rounded-2xl font-bold transition ${
                  activePoint === "start"
                    ? "bg-emerald-500 text-gray-950"
                    : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                }`}
              >
                Elegir Punto A
              </button>
              <button
                type="button"
                onClick={() => setActivePoint("end")}
                className={`py-3 rounded-2xl font-bold transition ${
                  activePoint === "end"
                    ? "bg-orange-500 text-gray-950"
                    : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                }`}
              >
                Elegir Punto B
              </button>
            </div>

            <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
              <div className="px-4 py-3 border-b border-gray-700">
                <h2 className="text-lg font-bold text-violet-200">
                  Nodos disponibles
                </h2>
              </div>

              <div className="max-h-80 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-900 text-gray-300">
                    <tr>
                      <th className="px-3 py-3 text-left font-semibold">
                        Nodo
                      </th>
                      <th className="px-3 py-3 text-center font-semibold">
                        A
                      </th>
                      <th className="px-3 py-3 text-center font-semibold">
                        B
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((node) => {
                      const isStart = startName === node;
                      const isEnd = endName === node;

                      return (
                        <tr
                          key={node}
                          className={`border-t border-gray-700/70 ${
                            isStart || isEnd ? "bg-violet-950/50" : ""
                          }`}
                        >
                          <td className="px-3 py-3 text-gray-100">
                            <div className="font-semibold">{node}</div>
                            <div className="text-xs text-gray-400">
                              {Object.keys(tunjaGraph[node]).length} conexiones
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleSelectNode(node, "start")}
                              className={`h-9 w-9 rounded-full font-bold transition ${
                                isStart
                                  ? "bg-emerald-500 text-gray-950"
                                  : "bg-gray-700 text-gray-200 hover:bg-emerald-600"
                              }`}
                              aria-label={`Usar ${node} como punto A`}
                            >
                              A
                            </button>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleSelectNode(node, "end")}
                              className={`h-9 w-9 rounded-full font-bold transition ${
                                isEnd
                                  ? "bg-orange-500 text-gray-950"
                                  : "bg-gray-700 text-gray-200 hover:bg-orange-600"
                              }`}
                              aria-label={`Usar ${node} como punto B`}
                            >
                              B
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="button"
              onClick={calculateRoute}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-5 rounded-3xl text-xl font-bold hover:brightness-110 transition"
            >
              CALCULAR MEJOR RUTA
            </button>

            <button
              type="button"
              onClick={reset}
              className="w-full bg-gradient-to-r from-purple-500 to-violet-600 py-4 rounded-3xl text-lg font-bold hover:brightness-110 transition"
            >
              Reiniciar
            </button>

            {result && (
              <Suspense
                fallback={
                  <div className="rounded-2xl bg-gray-800 p-5 text-gray-300">
                    Cargando resultado...
                  </div>
                }
              >
                <DijkstraVisualizer
                  steps={result.steps}
                  path={result.path}
                  distance={result.distance}
                  startName={result.startName}
                  endName={result.endName}
                />
              </Suspense>
            )}
          </div>
        </aside>
      </main>

      <button
        type="button"
        onClick={() => setShowPanel(true)}
        aria-label="Abrir panel de seleccion"
        className="lg:hidden fixed bottom-6 right-6 bg-violet-600 text-white p-5 rounded-full shadow-2xl text-2xl z-50"
      >
        +
      </button>
    </div>
  );
}

export default App;
