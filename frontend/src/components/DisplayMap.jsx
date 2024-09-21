import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure Leaflet to use the correct icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const DisplayMap = ({ lat, lng }) => {
    lat = 34.0522;
    lng = -118.2437;
    const handleGoogleMapsRedirect = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, '_blank');
    };

    return (
        <div>
            <MapContainer center={[lat, lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        Location: {lat}, {lng}
                    </Popup>
                </Marker>
            </MapContainer>
            <button onClick={handleGoogleMapsRedirect} style={{ marginTop: '10px' }}>
                Open in Google Maps
            </button>
        </div>
    );
};

export default DisplayMap;
