import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect, useRef } from "react";
import { getCoordinates } from "../utils/tunjaGraph";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const markerIcons = {
  default: L.divIcon({
    className: "ubicate-marker",
    html: '<span class="ubicate-marker-pin ubicate-marker-default"></span>',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38],
  }),
  start: L.divIcon({
    className: "ubicate-marker",
    html: '<span class="ubicate-marker-pin ubicate-marker-start"><span class="ubicate-marker-label">A</span></span>',
    iconSize: [34, 46],
    iconAnchor: [17, 46],
    popupAnchor: [0, -42],
  }),
  end: L.divIcon({
    className: "ubicate-marker",
    html: '<span class="ubicate-marker-pin ubicate-marker-end"><span class="ubicate-marker-label">B</span></span>',
    iconSize: [34, 46],
    iconAnchor: [17, 46],
    popupAnchor: [0, -42],
  }),
};

function RoutingMachine({ start, end, routePath }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!start || !end) return;

    // Eliminar ruta anterior
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    const waypoints =
      routePath && routePath.length >= 2
        ? routePath
            .map((name) => getCoordinates(name))
            .filter(Boolean)
            .map((coords) => L.latLng(coords.lat, coords.lng))
        : [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)];

    routingControlRef.current = L.Routing.control({
      waypoints,
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
        ".leaflet-routing-container, .leaflet-routing-alt",
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
  }, [start, end, routePath, map]);

  return null;
}

function MapResizer({ trigger }) {
  const map = useMap();
  useEffect(() => {
    const timers = [50, 250, 550].map((delay) =>
      setTimeout(() => map.invalidateSize(), delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [trigger, map]);
  return null;
}

export default function UbicateMap({
  start,
  end,
  startName,
  endName,
  activePoint,
  onSelectPoint,
  allPoints,
  resizeKey,
  routePath,
}) {
  return (
    <MapContainer
      center={[5.535, -73.36]}
      zoom={14}
      zoomControl={false}
      doubleClickZoom={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <ZoomControl position="topright" />

      {Object.keys(allPoints).map((name) => {
        const pos = getCoordinates(name);
        if (!pos) return null;
        const markerType =
          name === startName ? "start" : name === endName ? "end" : "default";

        return (
          <Marker
            key={name}
            position={[pos.lat, pos.lng]}
            icon={markerIcons[markerType]}
            eventHandlers={{
              click: (event) => {
                event.originalEvent?.stopPropagation();
                onSelectPoint(name, { lat: pos.lat, lng: pos.lng });
                event.target.openPopup();
              },
            }}
          >
            <Popup>
              <strong>{name}</strong>
              <br />
              Seleccionado como {activePoint === "start" ? "Punto A" : "Punto B"}
            </Popup>
          </Marker>
        );
      })}

      <RoutingMachine start={start} end={end} routePath={routePath} />
      <MapResizer trigger={resizeKey} />
    </MapContainer>
  );
}
