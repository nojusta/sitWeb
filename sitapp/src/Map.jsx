import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css'; // Import the CSS file
import customIconImage from './components/sit.png'; // Import the custom icon image

// Fix for default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Create a custom icon
const customIcon = L.icon({
  iconUrl: customIconImage, // Replace with your custom icon URL
  iconSize: [65, 65], // Size of the icon
  iconAnchor: [19, 38], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -38], // Point from which the popup should open relative to the iconAnchor
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = () => {
  return (
    <MapContainer center={[54.6872, 25.2797]} zoom={16} className="map-container">
      <TileLayer
        url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=z10obBgCXC4PuO8FIlWa7gDCACHmHSBcLF8MInJowbcxnfBym1nSgWlJm8M19eco"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[54.6872, 25.2797]} icon={customIcon}>
        <Popup>
          sit
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;