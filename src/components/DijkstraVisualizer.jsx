export default function DijkstraVisualizer({
  steps,
  path,
  distance,
  graph,
  startName,
  endName,
}) {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl text-white max-h-[700px] overflow-auto">
      <h3 className="text-2xl font-bold mb-4 text-green-400">
          Procedimiento Dijkstra
      </h3>

      {steps.map((step, i) => (
        <div
          key={i}
          className="mb-6 border-l-4 border-blue-500 pl-4 py-3 bg-gray-800 rounded-xl"
        >
          <p className="font-semibold text-yellow-400 mb-3">
            Paso {i + 1}: Visitando <strong>{step.current}</strong>
          </p>

          <div className="text-sm space-y-1">
            {Object.entries(step.distances)
              .filter(([_, dist]) => dist !== Infinity)
              .sort((a, b) => a[1] - b[1])
              .slice(0, 15)
              .map(([node, dist]) => (
                <div key={node} className="flex justify-between items-center">
                  <span className="text-gray-300">{node}</span>
                  <span className="font-mono font-bold text-green-400">
                    {dist.toFixed(2)} km
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Ruta Óptima */}
      {path && (
        <div className="mt-6 p-6 bg-emerald-900 rounded-2xl border border-emerald-600">
          <p className="text-xl font-bold text-emerald-300">
              Ruta Más Corta (Óptima)
          </p>
          <p className="text-3xl font-bold mt-2">{distance.toFixed(2)} km</p>
          <p className="mt-3 text-lg font-medium text-emerald-200">
            {path.join(" → ")}
          </p>
        </div>
      )}

      {/* Rutas Alternativas */}
      {startName && endName && graph && (
        <div className="mt-6 p-6 bg-orange-900/70 rounded-2xl border border-orange-600">
          <p className="text-xl font-bold text-orange-300 mb-3">
            🔄 Otras Rutas Posibles
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Rutas alternativas (más largas)
          </p>

          {/* Aquí puedes agregar lógica para mostrar 2-3 rutas alternativas */}
          <div className="text-orange-200 text-sm">
            Ejemplo de ruta alternativa:
            <br />
            {startName} → Catedral → Templo Santo Domingo → {endName}
            <br />
            (aprox. +0.8 km más)
          </div>
        </div>
      )}
    </div>
  );
}
