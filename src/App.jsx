import { lazy, Suspense, useMemo, useState } from "react";
import {
  ArrowUpDown,
  Bookmark,
  ChevronDown,
  ChevronUp,
  MapPinned,
  Network,
  Search,
} from "lucide-react";
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
  const [activePoint, setActivePoint] = useState("start");
  const [searchTerm, setSearchTerm] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);

  const filteredNodes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return nodes;
    return nodes.filter((node) => node.toLowerCase().includes(query));
  }, [nodes, searchTerm]);

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

  const swapPoints = () => {
    setStart(end);
    setEnd(start);
    setStartName(endName);
    setEndName(startName);
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
  };

  const estimatedMinutes = result ? Math.max(1, Math.round(result.distance * 4)) : 0;

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <header className="flex items-center justify-between gap-4 px-5 py-4 lg:px-6">
        <div className="flex items-center gap-4">
          <MapPinned className="h-14 w-14 text-[#2f7d52]" strokeWidth={1.8} />
          <div>
            <h1 className="font-serif text-4xl font-black tracking-wide text-slate-900 md:text-5xl">
              UBICATE
            </h1>
            <p className="text-base text-slate-600 md:text-lg">
              Encuentra tu ruta ideal en Tunja
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-md border border-slate-200 bg-white px-5 py-3 shadow-sm md:block">
            <p className="flex items-center gap-3 text-sm">
              <span className="h-3 w-3 rounded-full bg-[#2f7d52]"></span>
              <strong>Punto A:</strong>
              <span>{startName || "Selecciona un nodo"}</span>
            </p>
            <p className="mt-2 flex items-center gap-3 text-sm">
              <span className="h-3 w-3 rounded-full bg-[#9a682e]"></span>
              <strong>Punto B:</strong>
              <span>{endName || "Selecciona un nodo"}</span>
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 pb-5 lg:px-6">
        <section
          className={`relative overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-[height] duration-500 ease-in-out ${
            panelOpen
              ? "h-[24rem] lg:h-[27rem]"
              : "h-[calc(100vh-15rem)] min-h-[28rem]"
          }`}
        >
          <Suspense
            fallback={
              <div className="grid h-full place-items-center bg-slate-100 text-slate-500">
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
              resizeKey={panelOpen}
            />
          </Suspense>

          <div className="absolute left-5 top-5 z-[1000] w-[17rem] rounded-md border border-slate-200 bg-white/95 p-5 shadow-lg backdrop-blur">
            <h2 className="text-xl font-black tracking-wide text-[#23633f]">
              TU RUTA
            </h2>
            <div className="my-4 h-px bg-slate-200"></div>

            <div className="flex gap-3">
              <MapPinned className="mt-1 h-6 w-6 text-[#2f7d52]" />
              <div>
                <p className="text-xs font-black uppercase tracking-wide">
                  Punto A
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {startName || "Selecciona un nodo"}
                </p>
              </div>
            </div>

            <div className="relative my-4 h-px bg-slate-200">
              <button
                type="button"
                onClick={swapPoints}
                disabled={!start || !end}
                className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                aria-label="Intercambiar puntos"
              >
                <ArrowUpDown className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-3">
              <MapPinned className="mt-1 h-6 w-6 text-[#9a682e]" />
              <div>
                <p className="text-xs font-black uppercase tracking-wide">
                  Punto B
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {endName || "Selecciona un nodo"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setPanelOpen((prev) => !prev)}
            className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-[#23633f] shadow-sm transition hover:bg-[#eef6f1]"
            aria-expanded={panelOpen}
            aria-controls="panel-inferior"
          >
            {panelOpen ? (
              <>
                <ChevronUp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                Ocultar panel
              </>
            ) : (
              <>
                <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                Mostrar panel
              </>
            )}
          </button>
        </div>

        <section
          id="panel-inferior"
          className={`grid gap-5 overflow-hidden transition-all duration-500 ease-in-out lg:grid-cols-[minmax(22rem,0.8fr)_minmax(28rem,1.05fr)] ${
            panelOpen
              ? "mt-5 max-h-[200rem] opacity-100"
              : "mt-0 max-h-0 opacity-0"
          }`}
        >
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-2 border-b border-slate-200">
              <button
                type="button"
                className="flex items-center justify-center gap-3 border-r border-slate-200 px-4 py-4 font-bold text-[#23633f]"
              >
                NODOS DISPONIBLES
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-3 px-4 py-4 text-slate-700"
              >
                <Bookmark className="h-5 w-5" />
                MIS RUTAS GUARDADAS
              </button>
            </div>

            <div className="p-4">
              <label className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-slate-500">
                <Search className="h-5 w-5" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="Buscar nodo..."
                />
              </label>
            </div>

            <div className="max-h-[22rem] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white text-slate-700">
                  <tr className="border-y border-slate-200">
                    <th className="px-5 py-3 text-left font-semibold">Nodo</th>
                    <th className="px-4 py-3 text-center font-semibold">A</th>
                    <th className="px-4 py-3 text-center font-semibold">B</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNodes.map((node) => {
                    const isStart = startName === node;
                    const isEnd = endName === node;

                    return (
                      <tr key={node} className="border-b border-slate-200">
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-3">
                            <MapPinned className="h-5 w-5 text-[#2f7d52]" />
                            <div>
                              <div className="font-medium text-slate-900">
                                {node}
                              </div>
                              <div className="text-xs text-slate-500">
                                {Object.keys(tunjaGraph[node]).length}{" "}
                                {Object.keys(tunjaGraph[node]).length === 1
                                  ? "conexion"
                                  : "conexiones"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleSelectNode(node, "start")}
                            className={`h-9 w-9 rounded-full border font-semibold transition ${
                              isStart
                                ? "border-[#2f7d52] bg-[#2f7d52] text-white"
                                : "border-[#7ba18d] text-slate-800 hover:bg-[#eef6f1]"
                            }`}
                            aria-label={`Usar ${node} como punto A`}
                          >
                            A
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleSelectNode(node, "end")}
                            className={`h-9 w-9 rounded-full border font-semibold transition ${
                              isEnd
                                ? "border-[#9a682e] bg-[#9a682e] text-white"
                                : "border-[#7ba18d] text-slate-800 hover:bg-[#eef6f1]"
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

          <Suspense
            fallback={
              <div className="rounded-md border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
                Cargando ruta...
              </div>
            }
          >
            <DijkstraVisualizer
              steps={result?.steps ?? []}
              path={result?.path ?? []}
              distance={result?.distance ?? 0}
              graph={tunjaGraph}
              startName={result?.startName}
              endName={result?.endName}
              estimatedMinutes={estimatedMinutes}
            />
          </Suspense>
        </section>

        <button
          type="button"
          onClick={calculateRoute}
          className="mt-4 flex w-full items-center justify-center gap-4 rounded-md bg-[#23633f] px-6 py-4 text-xl font-black tracking-wide text-white shadow-sm transition hover:bg-[#1c5234]"
        >
          <Network className="h-6 w-6" />
          CALCULAR MEJOR RUTA
        </button>
      </main>
    </div>
  );
}

export default App;
