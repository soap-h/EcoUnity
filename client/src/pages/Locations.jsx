import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import DirectionsIcon from '@mui/icons-material/Directions';
import axios from 'axios';

const locations = [
    { name: 'ACE The Place Our Community Club @ Admiralty', lat: 1.4419, lng: 103.8000 },
    { name: 'Aljunied Community Centre', lat: 1.3201, lng: 103.8823 },
    { name: 'Anchorvale Community Club', lat: 1.3877, lng: 103.8918 },
    { name: 'Ang Mo Kio Community Centre', lat: 1.3691, lng: 103.8454 },
    { name: 'Ayer Rajah Community Centre', lat: 1.2971, lng: 103.7893 },
    { name: 'Bedok Community Centre', lat: 1.3244, lng: 103.9311 },
    { name: 'Bishan Community Club', lat: 1.3504, lng: 103.8486 },
    { name: 'Bishan North Community Centre', lat: 1.3596, lng: 103.8476 },
    { name: 'Boon Lay Community Centre', lat: 1.3457, lng: 103.6973 },
    { name: 'Braddell Heights Community Club', lat: 1.3517, lng: 103.8700 },
    { name: 'Bukit Batok Community Club', lat: 1.3492, lng: 103.7498 },
    { name: 'Bukit Batok East Community Club', lat: 1.3477, lng: 103.7553 },
    { name: 'Bukit Merah Community Centre', lat: 1.2776, lng: 103.8227 },
    { name: 'Bukit Panjang Community Club', lat: 1.3816, lng: 103.7620 },
    { name: 'Bukit Timah Community Club', lat: 1.3236, lng: 103.8079 },
    { name: 'Buona Vista Community Club', lat: 1.3099, lng: 103.7913 },
    { name: 'Cairnhill Community Club', lat: 1.3070, lng: 103.8373 },
    { name: 'Canberra Community Club', lat: 1.4456, lng: 103.8290 },
    { name: 'Changi Simei Community Club', lat: 1.3438, lng: 103.9538 },
    { name: 'Cheng San Community Club', lat: 1.3714, lng: 103.8481 },
    { name: 'Chong Pang Community Club', lat: 1.4331, lng: 103.8320 },
    { name: 'Chua Chu Kang Community Club', lat: 1.3859, lng: 103.7445 },
    { name: 'Ci Yuan Community Club', lat: 1.3516, lng: 103.8795 },
    { name: 'Clementi Community Centre', lat: 1.3157, lng: 103.7660 },
    { name: 'Dover Community Centre', lat: 1.3064, lng: 103.7789 },
    { name: 'Eunos Community Club', lat: 1.3244, lng: 103.9058 },
    { name: 'Fengshan Community Club', lat: 1.3238, lng: 103.9366 },
    { name: 'Fuchun Community Club', lat: 1.4352, lng: 103.7857 },
    { name: 'Gek Poh Ville Community Club', lat: 1.3533, lng: 103.7067 },
    { name: 'Geylang Serai Community Club', lat: 1.3171, lng: 103.9003 },
    { name: 'Geylang West Community Club', lat: 1.3144, lng: 103.8822 },
    { name: 'Henderson Community Club', lat: 1.2825, lng: 103.8200 },
    { name: 'Hillview Community Club', lat: 1.3623, lng: 103.7671 },
    { name: 'Hong Kah North Community Club', lat: 1.3732, lng: 103.7543 },
    { name: 'Hougang Community Club', lat: 1.3687, lng: 103.8949 },
    { name: 'Hwi Yoh Community Centre', lat: 1.3741, lng: 103.8635 },
    { name: 'Jalan Besar Community Club', lat: 1.3097, lng: 103.8600 },
    { name: 'Joo Chiat Community Club', lat: 1.3121, lng: 103.9028 },
    { name: 'Jurong Green Community Club', lat: 1.3467, lng: 103.7057 },
    { name: 'Jurong Spring Community Club', lat: 1.3406, lng: 103.7091 },
    { name: 'Kaki Bukit Community Centre', lat: 1.3352, lng: 103.9045 },
    { name: 'Kallang Community Club', lat: 1.3109, lng: 103.8655 },
    { name: 'Kampong Chai Chee Community Club', lat: 1.3298, lng: 103.9162 },
    { name: 'Kampong Glam Community Club', lat: 1.3048, lng: 103.8607 },
    { name: 'Kampong Kembangan Community Club', lat: 1.3230, lng: 103.9133 },
    { name: 'Kampong Ubi Community Centre', lat: 1.3214, lng: 103.9000 },
    { name: 'Katong Community Centre', lat: 1.3059, lng: 103.9056 },
    { name: 'Keat Hong Community Club', lat: 1.3737, lng: 103.7445 },
    { name: 'Kebun Bahru Community Club', lat: 1.3715, lng: 103.8292 },
    { name: 'Kim Seng Community Centre', lat: 1.2891, lng: 103.8348 },
    { name: 'Kolam Ayer Community Club', lat: 1.3196, lng: 103.8716 },
    { name: 'Kreta Ayer Community Club', lat: 1.2839, lng: 103.8411 },
    { name: 'Leng Kee Community Centre', lat: 1.2883, lng: 103.8196 },
    { name: 'MacPherson Community Club', lat: 1.3275, lng: 103.8856 },
    { name: 'Marine Parade Community Club', lat: 1.3057, lng: 103.9066 },
    { name: 'Marsiling Community Club', lat: 1.4358, lng: 103.7820 },
    { name: 'Mountbatten Community Club', lat: 1.3011, lng: 103.8863 },
    { name: 'Nanyang Community Club', lat: 1.3471, lng: 103.6910 },
    { name: 'Nee Soon Central Community Club', lat: 1.4297, lng: 103.8378 },
    { name: 'Nee Soon East Community Club', lat: 1.4201, lng: 103.8220 },
    { name: 'Nee Soon Link Community Centre', lat: 1.4383, lng: 103.8270 },
    { name: 'Nee Soon South Community Club', lat: 1.3959, lng: 103.8373 },
    { name: 'Pasir Ris East Community Club', lat: 1.3720, lng: 103.9446 },
    { name: 'Pasir Ris Elias Community Club', lat: 1.3811, lng: 103.9444 },
    { name: 'Paya Lebar Kovan Community Club', lat: 1.3585, lng: 103.8843 },
    { name: 'Pek Kio Community Centre', lat: 1.3129, lng: 103.8527 },
    { name: 'Potong Pasir Community Club', lat: 1.3336, lng: 103.8682 },
    { name: 'Punggol Community Club', lat: 1.4027, lng: 103.9021 },
    { name: 'Punggol Park Community Centre', lat: 1.3694, lng: 103.8892 },
    { name: 'Queenstown Community Centre', lat: 1.2978, lng: 103.8055 },
    { name: 'Radin Mas Community Club', lat: 1.2781, lng: 103.8273 },
    { name: 'Rivervale Community Centre', lat: 1.3920, lng: 103.9020 },
    { name: 'Sembawang Community Club', lat: 1.4443, lng: 103.8208 },
    { name: 'Sengkang Community Club', lat: 1.3845, lng: 103.8907 },
    { name: 'Senja-Cashew Community Centre', lat: 1.3810, lng: 103.7596 },
    { name: 'Siglap Community Centre', lat: 1.3175, lng: 103.9233 },
    { name: 'Siglap South Community Centre', lat: 1.3086, lng: 103.9191 },
    { name: 'Taman Jurong Community Club', lat: 1.3300, lng: 103.7234 },
    { name: 'Tampines Central Community Club', lat: 1.3543, lng: 103.9431 },
    { name: 'Tampines Changkat Community Club', lat: 1.3457, lng: 103.9556 },
    { name: 'Tampines East Community Club', lat: 1.3521, lng: 103.9613 },
    { name: 'Tampines North Community Club', lat: 1.3683, lng: 103.9300 },
    { name: 'Tampines West Community Club', lat: 1.3498, lng: 103.9373 },
    { name: 'Tanglin Community Club', lat: 1.2955, lng: 103.8202 },
    { name: 'Tanjong Pagar Community Club', lat: 1.2769, lng: 103.8405 },
    { name: 'Teck Ghee Community Club', lat: 1.3753, lng: 103.8397 },
    { name: 'Telok Ayer Hong Lim Green Community Centre', lat: 1.2832, lng: 103.8450 },
    { name: 'Telok Blangah Community Club', lat: 1.2701, lng: 103.8127 },
    { name: 'The Frontier Community Club', lat: 1.3401, lng: 103.7076 },
    { name: 'The Serangoon Community Club', lat: 1.3512, lng: 103.8644 },
    { name: 'Thomson Community Club', lat: 1.3575, lng: 103.8380 },
    { name: 'Tiong Bahru Community Centre', lat: 1.2861, lng: 103.8312 },
    { name: 'Toa Payoh Central Community Club', lat: 1.3321, lng: 103.8478 },
    { name: 'Toa Payoh East Community Club', lat: 1.3378, lng: 103.8601 },
    { name: 'Toa Payoh South Community Club', lat: 1.3317, lng: 103.8567 },
    { name: 'Toa Payoh West Community Club', lat: 1.3348, lng: 103.8484 },
    { name: 'Ulu Pandan Community Club', lat: 1.3221, lng: 103.7857 },
    { name: 'West Coast Community Centre', lat: 1.3072, lng: 103.7654 },
    { name: 'Whampoa Community Club', lat: 1.3229, lng: 103.8561 },
    { name: 'Woodgrove Community Centre', lat: 1.4289, lng: 103.7770 },
    { name: 'Woodlands Community Club', lat: 1.4360, lng: 103.7883 },
    { name: 'Woodlands Galaxy Community Club', lat: 1.4392, lng: 103.7948 },
    { name: 'Yew Tee Community Club', lat: 1.3984, lng: 103.7464 },
    { name: 'Yio Chu Kang Community Club', lat: 1.3795, lng: 103.8448 },
    { name: 'Yuhua Community Club', lat: 1.3443, lng: 103.7384 },
    { name: 'Zhenghua Community Club', lat: 1.3796, lng: 103.7686 }
];

const containerStyle = {
    width: '100%',
    height: '400px',
    marginBottom: '20px',
};

const center = {
    lat: 1.3521, // Singapore's latitude
    lng: 103.8198, // Singapore's longitude
};

function Locations() {
    const [searchText, setSearchText] = useState('');
    const [filteredLocations, setFilteredLocations] = useState(locations);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [nearestLocation, setNearestLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        // Filter locations based on search text
        setFilteredLocations(
            locations.filter((location) =>
                location.name.toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [searchText]);

    useEffect(() => {
        // Get the user's current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCurrentLocation(userLocation);

                // Find the nearest location
                const nearest = findNearestLocation(userLocation, locations);
                setNearestLocation(nearest);
            },
            (error) => console.error('Error getting current location:', error),
            { enableHighAccuracy: true }
        );
    }, []);

    const findNearestLocation = (currentLocation, locations) => {
        let nearest = null;
        let minDistance = Infinity;

        locations.forEach((location) => {
            const distance = getDistance(
                currentLocation.lat,
                currentLocation.lng,
                location.lat,
                location.lng
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearest = location;
            }
        });

        return nearest;
    };

    const getDistance = (lat1, lng1, lat2, lng2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in km

        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const handleDirections = (location) => {
        if (currentLocation) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${location.lat},${location.lng}`,
                '_blank'
            );
        } else {
            alert('Current location not available.');
        }
    };

    return (
        <Box sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                Find Your Nearest Community Centre (CC)
            </Typography>

            {nearestLocation && (
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                    Nearest CC: {nearestLocation.name}
                </Typography>
            )}

            <Button
                variant="contained"
                startIcon={<DirectionsIcon />}
                onClick={() => handleDirections(nearestLocation)}
                sx={{
                    marginBottom: '20px',
                    backgroundColor: '#5a9895',
                    '&:hover': {
                        backgroundColor: '#064e5b',
                    },
                }}
            >
                Directions to the nearest CC right now
            </Button>


            <TextField
                label="Search for a CC"
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{ marginBottom: '20px' }}
            />
            <List>
                {filteredLocations.sort((a, b) => a.name.localeCompare(b.name)).map((location) => (
                    <ListItem
                        key={location.name}
                        button
                        onClick={() => setSelectedLocation(location)}
                    >
                        <ListItemText primary={location.name} />
                        <Button
                            variant="contained"
                            startIcon={<DirectionsIcon />}
                            onClick={() => handleDirections(location)}
                            sx={{
                                backgroundColor: '#5a9895',
                                '&:hover': {
                                    backgroundColor: '#064e5b',
                                },
                            }}
                        >
                            Directions
                        </Button>
                    </ListItem>
                ))}
            </List>
            <LoadScript googleMapsApiKey={"AIzaSyDWAdBJJjrJVw3j2KdRaK9vJ8wn9aPKOIs"}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={selectedLocation || center}
                    zoom={14}
                >
                    {currentLocation && (
                        <Marker position={currentLocation} label="You are here" />
                    )}
                    {selectedLocation && (
                        <Marker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                    )}
                </GoogleMap>
            </LoadScript>
        </Box>
    );
}

export default Locations;
