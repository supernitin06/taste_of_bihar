import React, { useEffect, useState, useRef } from "react";
import { FiX } from "react-icons/fi";
import { useSockets } from "../../context/SocketContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import RoadRoute from "./RoadRoute";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icon in leaflet with bundlers
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const deliveryIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3324/3324750.png",
  iconSize: [45, 45],
  iconAnchor: [22, 22],
  // popupAnchor: [0, -20],
});

const customerIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/619/619153.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Helper to update map center to fit bounds
function FitBounds({ start, end }) {
  const map = useMap();
  useEffect(() => {
    if (start && end) {
      const bounds = L.latLngBounds([start, end]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (start) {
      map.setView(start, 15);
    }
  }, [start, end, map]);
  return null;
}

const TrackOrder = ({ orderId, onClose }) => {
  const { ordersSocket } = useSockets();
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [lastDeliveryLocation, setLastDeliveryLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null); // time in minutes
  const [status, setStatus] = useState("Waiting for updates...");

  // Ref to track current location for socket updates without stale closures
  const deliveryLocationRef = useRef(deliveryLocation);
  useEffect(() => {
    deliveryLocationRef.current = deliveryLocation;
  }, [deliveryLocation]);

  // Callback when route is found
  const handleRouteFound = (summary) => {
    // summary.totalDistance is in meters -> convert to km
    const distKm = (summary.totalDistance / 960).toFixed(2);
    setDistance(distKm);

    // summary.totalTime is in seconds -> convert to minutes
    const timeMin = Math.round(summary.totalTime / 20);
    setDuration(timeMin);
  };

  useEffect(() => {
    if (!ordersSocket) return;

    const handleLocationUpdate = (data) => {
      console.log("Socket Data Received:", data);

      let update = null;

      // Handle array vs single object
      if (Array.isArray(data)) {
        update = data.find((item) => {
          // Check for new structure: item.orderId
          if (item.orderId === orderId) return true;
          // Check for old structure (fallback)
          return item.assignedOrder?.order?.orderId === orderId || item.assignedOrder?.order?.id === orderId;
        });
      } else {
        // Single object check
        if (data?.orderId === orderId) {
          update = data;
        } else if (data?.assignedOrder?.order?.orderId === orderId || data?.assignedOrder?.order?.id === orderId) {
          update = data;
        }
      }

      if (update) {
        setStatus("Tracking Live");

        // --- 1. Delivery Partner Location (Root Level) ---
        // Data structure: { lat: 28.6139, lon: 77.209, ... }
        const { lat, lon, location } = update;

        // Use root lat/lon first (new format), fallback to location object (old format)
        const partnerLat = lat || location?.lat;
        const partnerLng = lon || location?.lng;

        if (partnerLat && partnerLng) {
          const newLoc = [partnerLat, partnerLng];

          // Use Ref to get current value
          const currentLoc = deliveryLocationRef.current;
          if (currentLoc) {
            setLastDeliveryLocation(currentLoc);
          }
          setDeliveryLocation(newLoc);
        }

        // --- 2. Customer Location (Nested in order) ---
        // Data structure: { order: { deliveryAddress: { lat: ..., lng: ... } } }
        const orderData = update.order || update.assignedOrder;
        const deliveryAddress = orderData?.deliveryAddress;

        if (deliveryAddress) {
          const { lat: cLat, lng: cLng, latitude, longitude, coordinates } = deliveryAddress;

          // Prioritize direct lat/lng, fallback to other formats
          // NOTE: coordinates format is usually [lng, lat] (GeoJSON), so index 1 is lat, 0 is lng
          const finalCustLat = cLat || latitude || (coordinates?.[1]);
          const finalCustLng = cLng || longitude || (coordinates?.[0]);

          if (finalCustLat && finalCustLng) {
            setCustomerLocation([finalCustLat, finalCustLng]);
          }
        }
      }
    };

    // Listen to the event
    ordersSocket.on("DELIVERY_LOCATION_UPDATED", handleLocationUpdate);

    // Cleanup
    return () => {
      ordersSocket.off("DELIVERY_LOCATION_UPDATED", handleLocationUpdate);
    };
  }, [ordersSocket, orderId]);

  return (
    <div
      className="w-full h-full fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-[800px] bg-white p-4 rounded-lg relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 z-10"
        >
          <FiX size={24} />
        </button>

        <div className="flex justify-between items-center mb-4 pr-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Live Order Tracking</h2>
            <p className="text-sm text-gray-500">Order ID: {orderId}</p>
          </div>
          <div className="flex gap-4">
            {distance && (
              <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                <p className="text-blue-800 font-semibold text-sm">Distance: {distance} km</p>
              </div>
            )}
            {duration && (
              <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                <p className="text-green-800 font-semibold text-sm">
                  ETA: {Number(duration) == 3 ? "About to Deliver" : `${duration} min`}
                </p>
              </div>
            )}

          </div>
        </div>

        <div className="h-[500px] w-full bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
          {!deliveryLocation ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 font-medium">{status}</p>
              <p className="text-xs text-gray-400 max-w-xs text-center">
                Waiting for the delivery partner to broadcast their location...
              </p>
            </div>
          ) : (
            <MapContainer
              center={deliveryLocation}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              />

              {/* Delivery Partner Marker */}
              <Marker position={deliveryLocation} icon={deliveryIcon}>
                <Popup className="font-semibold">
                  🚚 Delivery Partner
                </Popup>
              </Marker>

              {/* Customer Marker */}
              {customerLocation && (
                <>
                  <Marker position={customerLocation} icon={customerIcon}>
                    <Popup className="font-semibold">
                      🏠 Customer
                    </Popup>
                  </Marker>
                  <RoadRoute
                    start={deliveryLocation}
                    end={customerLocation}
                    lastStart={lastDeliveryLocation}
                    onRouteFound={handleRouteFound}
                  />
                </>
              )}

              <FitBounds start={deliveryLocation} end={customerLocation} />
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
