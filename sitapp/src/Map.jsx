import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { divIcon, point } from 'leaflet';
import './App.css'; // Import the CSS file
import axios from 'axios';
import customIconImage from './components/sit.png'; // Import the custom icon image
import MarkerClusterGroup from 'react-leaflet-cluster';
import Sidebar from './Sidebar'; // Import the custom sidebar component

// Fix for default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
});

// Custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true)
  });
};

// Create a custom icon
const customIcon = L.icon({
  iconUrl: customIconImage, // Replace with your custom icon URL
  iconSize: [65, 65], // Size of the icon
  iconAnchor: [19, 38], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -38], // Point from which the popup should open relative to the iconAnchor
});

const initialMarkers = [
  {
    name: "Centras",
    geocode: [54.687157, 25.279652],
    details: "This is the first marker",
    address: "Gedimino pr. 9, Vilnius 01103, Lithuania"
  },
  {
    name: "Midas",
    geocode: [54.6822, 25.2767],
    details: "This is the second marker",
    address: "Konstitucijos pr. 7, Vilnius, Lithuania"
  },
  {
    name: "Vilnius",
    geocode: [54.6868, 25.2787],
    details: "This is the third marker",
    address: "Vilniaus g. 10, Vilnius, Lithuania"
  }
];

const Map = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markers, setMarkers] = useState(initialMarkers);
  const [newMarker, setNewMarker] = useState({ name: '', geocode: '', details: '', address:'' });
  const [address, setAddress] = useState('');
  const [fullCoords, setFullCoords] = useState({ lat: null, lng: null });

  const onMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setAddress(marker.address);
    setSidebarOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMarker({ ...newMarker, [name]: value });
  };

  const reverseGeocode = async (lat, lng) => {
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
  if (!apiKey) {
    console.error('OpenCage API key is missing!');
    return 'Unknown address';
  }
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      const address = response.data.results[0].formatted;
      return address;
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Unknown address';
    }
  };

  const handleAddMarker = (e) => {
    e.preventDefault();
    const [lat, lng] = newMarker.geocode.split(",").map(Number);
    const marker = { ...newMarker, geocode: [lat, lng] };
    setMarkers([...markers, marker]);
    setNewMarker({ name: "", geocode: "", details: "", address: "" });
    setAddress('');
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        const address = await reverseGeocode(lat, lng);
        console.log('Map clicked at:', lat, lng);
        setFullCoords({ lat, lng });
        setNewMarker({ ...newMarker, geocode: `${lat}, ${lng}`, address });
        setAddress(address);
      },
    });
    return null;
  };

  return (
    <div style ={{display: 'flex'}}>
      <MapContainer center={[54.6872, 25.2797]} zoom={16} className="map-container" style={{flex: 1}}>
        <TileLayer
          url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=z10obBgCXC4PuO8FIlWa7gDCACHmHSBcLF8MInJowbcxnfBym1nSgWlJm8M19eco"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.geocode}
              icon={customIcon}
              eventHandlers={{
                click: () => onMarkerClick(marker),
              }}
            >
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      <form onSubmit={handleAddMarker} className="marker-form">
        <input
          type="text"
          name="name"
          value={newMarker.name}
          onChange={handleInputChange}
          placeholder="Marker Name"
          required
        />
        <input
          type="text"
          name="geocode"
          value={newMarker.geocode}
          onChange={handleInputChange}
          placeholder="Latitude, Longitude"
          required
          readOnly
        />
        <input
          type="text"
          name="address"
          value={address}
          onChange={handleInputChange}
          placeholder="Address"
          required
          readOnly
        />
        <input
          type="text"
          name="details"
          value={newMarker.details}
          onChange={handleInputChange}
          placeholder="Marker Details"
          required
        />
        <button type="submit">Add Marker</button>
      </form>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedMarker={selectedMarker}
        address={address}
      />
    </div>
  );
};

export default Map;