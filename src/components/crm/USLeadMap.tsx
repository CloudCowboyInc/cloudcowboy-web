import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Lead } from "@/data/leads";
import { STATUS_COLORS, READINESS_COLORS, OPERATOR_COLORS } from "./statusConfig";

type ColorMode = "status" | "readiness" | "operator";

interface Props {
  leads: Lead[];
  colorMode: ColorMode;
  onSelect: (lead: Lead) => void;
}

export default function USLeadMap({ leads, colorMode, onSelect }: Props) {
  const colorFor = (l: Lead) =>
    colorMode === "status"
      ? STATUS_COLORS[l.status]
      : colorMode === "operator"
      ? OPERATOR_COLORS[l.operatorType]
      : READINESS_COLORS[l.readiness];

  const plotted = leads.filter((l) => l.lat != null && l.lng != null);

  return (
    <div className="relative z-0 w-full">
      <MapContainer
        center={[39, -100]}
        zoom={5}
        minZoom={3}
        maxZoom={18}
        scrollWheelZoom
        className="h-[520px] w-full rounded-md"
        style={{ background: "hsl(230 25% 8%)" }}
      >
        {/* Dark basemap (CARTO) — streets + city/county labels reveal as you zoom. */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {plotted.map((l) => (
          <CircleMarker
            key={l.id}
            center={[l.lat as number, l.lng as number]}
            radius={l.aerial ? 6 : 4.5}
            pathOptions={{
              color: l.aerial ? "#ffffff" : colorFor(l),
              weight: l.aerial ? 1.5 : 1,
              fillColor: colorFor(l),
              fillOpacity: 0.85,
            }}
            eventHandlers={{ click: () => onSelect(l) }}
          >
            <Tooltip direction="top" offset={[0, -4]} opacity={1}>
              <div className="text-xs">
                <div className="font-semibold">{l.dba || l.name}</div>
                <div className="text-muted-foreground">
                  {l.city}, {l.state} · {l.county} County
                </div>
                <div className="text-muted-foreground">
                  {l.aerial ? "Aerial operator" : "Ground applicator"} · Codes {l.codes.join("/")}
                </div>
                <div className="text-muted-foreground">
                  Status: {l.status}
                  {l.employees ? ` · ~${l.employees} staff` : ""}
                  {l.revenue ? ` · ${l.revenue}` : ""}
                </div>
                <div className="mt-0.5 italic opacity-70">Click for full record</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="mt-1 text-center text-[11px] text-muted-foreground">
        Two-finger / scroll to zoom · drag to pan · streets &amp; labels load as you zoom · click a pin for the full record
      </div>
    </div>
  );
}
