import React, { useEffect, useRef } from 'react';

function LocationPicker({ venue, onLocationSelect, onVenueChange }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapInstanceRef.current) {
            const map = new google.maps.Map(mapRef.current, {
                center: { lat: 1.3521, lng: 103.8198 }, // Default to Singapore
                zoom: 12,
            });

            const marker = new google.maps.Marker({
                position: { lat: 1.3521, lng: 103.8198 },
                map: map,
                draggable: true,
            });

            mapInstanceRef.current = map;
            markerRef.current = marker;

            google.maps.event.addListener(marker, 'dragend', function (event) {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();
                onLocationSelect({ lat, lng });
                fetchAddressFromLatLng(lat, lng);
            });
        }
    }, [onLocationSelect]);

    useEffect(() => {
        if (venue && mapInstanceRef.current && markerRef.current) {
            fetchLatLngFromAddress(venue);
        }
    }, [venue]);

    const fetchAddressFromLatLng = (lat, lng) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                onVenueChange(results[0].formatted_address);
            }
        });
    };

    const fetchLatLngFromAddress = (address) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results[0]) {
                const location = results[0].geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                mapInstanceRef.current.setCenter(latLng);
                markerRef.current.setPosition(latLng);
                onLocationSelect(latLng);
            }
        });
    };

    return <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>;
}

export default LocationPicker;
