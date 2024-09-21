import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationPicker = ({ pickLocation, lat, lng, currentLocation }) => {
	const [position, setPosition] = useState([lat, lng]); // To store the user's current location
	const [coordinates, setCoordinates] = useState({ lat: lat, lng: lng }); // To store the coordinates after clicking

	// Fetch the user's current location on component mount
	useEffect(() => {
		if (currentLocation) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(pos) => {
						const { latitude, longitude } = pos.coords;
						setPosition([latitude, longitude]);
						setCoordinates({ lat: latitude, lng: longitude });
					},
					(error) => {
						console.error("Error fetching user location:", error);
					}
				);
			} else {
				alert("Geolocation is not supported by your browser");
			}
		}
	}, []);

	// Handle map clicks to update the marker position
	const HandleMapClick = () => {
		useMapEvents({
			click(e) {
				const { lat, lng } = e.latlng;
				setPosition([lat, lng]);
				setCoordinates({ lat, lng });
				pickLocation({ lat, lng });
			},
		});
		return null;
	};

	return (
		<div className="my-3 mt-5">
			<h2 className="text-center my-2 text-lg">Pick a Location</h2>

				<MapContainer
					center={position}
					zoom={13}
					style={{ height: "400px", width: "100%" }}>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					<Marker position={position} />
					<HandleMapClick /> {/* Enable click functionality on the map */}
				</MapContainer>

			{coordinates.lat && coordinates.lng && (
				<div className="mt-2 text-center">
					<p>Latitude: {coordinates.lat}</p>
					<p>Longitude: {coordinates.lng}</p>
				</div>
			)}
		</div>
	);
};

export default LocationPicker;
