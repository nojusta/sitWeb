import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, {divIcon, point} from 'leaflet';
import './App.css'; // Import the CSS file
import customIconImage from './components/sit.png'; // Import the custom icon image
import MarkerClusterGroup from "react-leaflet-cluster";

// Fix for default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// custom cluster icon
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
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const markers = [
    {
      geocode: [54.6872, 25.2797],
      popUp: "Hello, I am pop up 1"
    },
    {
      geocode: [54.6822, 25.2767],
      popUp: "Hello, I am pop up 2"
    },
    {
      geocode: [54.6868, 25.2787],
      popUp: "Hello, I am pop up 3"
    }
  ];

const Map = () => {
  return (
    <MapContainer center={[54.6872, 25.2797]} zoom={16} className="map-container">
      <TileLayer
        url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=z10obBgCXC4PuO8FIlWa7gDCACHmHSBcLF8MInJowbcxnfBym1nSgWlJm8M19eco"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
        >
        {markers.map((marker) => (
          <Marker position={marker.geocode} icon={customIcon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
        </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;