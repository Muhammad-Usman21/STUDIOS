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
    const handleGoogleMapsRedirect = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, '_blank');
    };

    return (
        <div className='w-full relative block'>
           <h1 className="text-2xl font-semibold mb-2">Location:</h1>

            <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Maps_icon_%282015-2020%29.svg"
                alt="Google Maps Icon"
                onClick={handleGoogleMapsRedirect}
                style={{
                    position: 'absolute',
                    bottom: '10px',  // adjust the positioning as needed
                    left: '10px',
                    width: '40px',
                    height: '40px',
                    zIndex: 1000, 
                    cursor: 'pointer',
                }}
            />

            {/* Map Container */}
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
        </div>

    );
};

export default DisplayMap;
