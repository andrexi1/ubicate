import { Clock3, Milestone, Network } from "lucide-react";

export default function DijkstraVisualizer({
  path,
  distance,
  graph,
  estimatedMinutes,
}) {
  const hasRoute = path.length > 0;

  const routeRows = hasRoute
    ? path.map((node, index) => {
        const previousNode = path[index - 1];
        const edgeWeight = previousNode ? graph?.[previousNode]?.[node]?.weight : 0;
        const cumulativeDistance = path
          .slice(1, index + 1)
          .reduce((total, currentNode, currentIndex) => {
            const from = path[currentIndex];
            return total + (graph?.[from]?.[currentNode]?.weight ?? 0);
          }, 0);

        return {
          node,
          edgeWeight,
          cumulativeDistance,
          detail:
            index === 0
              ? "Punto de partida"
              : index === path.length - 1
                ? "Destino final"
                : edgeWeight
                  ? `Avanza ${edgeWeight.toFixed(2)} km desde el nodo anterior`
                  : "Continua por la ruta sugerida",
        };
      })
    : [];

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black uppercase tracking-wide text-slate-900">
            Ruta sugerida
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-md border border-slate-200 px-4 py-2">
            <Milestone className="h-7 w-7 text-slate-800" />
            <div>
              <p className="text-xs text-slate-500">Distancia total</p>
              <p className="font-black text-[#23633f]">
                {hasRoute ? distance.toFixed(2) : "0.00"} km
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-slate-200 px-4 py-2">
            <Clock3 className="h-7 w-7 text-slate-800" />
            <div>
              <p className="text-xs text-slate-500">Tiempo estimado</p>
              <p className="font-black text-[#23633f]">
                {hasRoute ? estimatedMinutes : 0} min
              </p>
            </div>
          </div>
        </div>
      </div>

      {hasRoute ? (
        <div className="mt-4 max-h-[22rem] overflow-auto pr-1">
          <div className="relative space-y-3 pl-11">
            <div className="absolute bottom-5 left-[1.15rem] top-5 w-px bg-[#c9d8cf]"></div>

            {routeRows.map((row, index) => {
              const isLast = index === routeRows.length - 1;

              return (
                <div key={`${row.node}-${index}`} className="relative">
                  <div
                    className={`absolute -left-11 top-1 grid h-7 w-7 place-items-center rounded-full text-sm font-black text-white ${
                      isLast ? "bg-[#9a682e]" : "bg-[#2f7d52]"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-5 py-3 shadow-sm">
                    <div>
                      <p
                        className={`font-black ${
                          isLast ? "text-[#9a682e]" : "text-slate-900"
                        }`}
                      >
                        {row.node}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{row.detail}</p>
                    </div>
                    <p
                      className={`shrink-0 text-sm font-semibold ${
                        isLast ? "text-[#9a682e]" : "text-slate-600"
                      }`}
                    >
                      {row.cumulativeDistance.toFixed(2)} km
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid min-h-[18rem] place-items-center text-center text-slate-500">
          <div>
            <RoutePlaceholder />
            <p className="mt-4 font-semibold text-slate-700">
              Selecciona dos nodos y calcula la mejor ruta
            </p>
            <p className="mt-1 text-sm">
              Aqui aparecera el recorrido ordenado por Dijkstra.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function RoutePlaceholder() {
  return (
    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eef6f1]">
      <Network className="h-8 w-8 text-[#23633f]" />
    </div>
  );
}
