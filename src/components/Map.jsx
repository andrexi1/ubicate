import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect, useRef } from "react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function RoutingMachine({ start, end }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!start || !end) return;

    // Eliminar ruta anterior
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
      routeWhileDragging: false,
      lineOptions: {
        styles: [{ color: "#22c55e", weight: 7, opacity: 0.9 }],
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
    }).addTo(map);

    // Forzar ocultamiento fuerte del panel
    const hidePanel = () => {
      const panels = document.querySelectorAll(
        ".leaflet-routing-container, .leaflet-routing-alt, .leaflet-control-container",
      );
      panels.forEach((panel) => {
        panel.style.display = "none";
        panel.style.visibility = "hidden";
        panel.style.opacity = "0";
        panel.style.height = "0";
        panel.style.overflow = "hidden";
      });
    };

    // Ejecutar varias veces para asegurar que se oculte
    hidePanel();
    setTimeout(hidePanel, 300);
    setTimeout(hidePanel, 800);
    setTimeout(hidePanel, 1500);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [start, end, map]);

  return null;
}

export default function UbicateMap({ start, end, onSelectPoint, allPoints }) {
  return (
    <MapContainer
      center={[5.535, -73.36]}
      zoom={14}
      style={{ width: "100%", height: "100vh" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {Object.entries(allPoints).map(([name, connections]) => {
        const pos = Object.values(connections)[0];
        return (
          <Marker
            key={name}
            position={[pos.lat, pos.lng]}
            eventHandlers={{
              click: () => onSelectPoint(name, { lat: pos.lat, lng: pos.lng }),
            }}
          >
            <Popup>
              <strong>{name}</strong>
              <br />
              Clic para seleccionar como punto
            </Popup>
          </Marker>
        );
      })}

      {start && <Marker position={[start.lat, start.lng]} />}
      {end && <Marker position={[end.lat, end.lng]} />}

      <RoutingMachine start={start} end={end} />
    </MapContainer>
  );
}
