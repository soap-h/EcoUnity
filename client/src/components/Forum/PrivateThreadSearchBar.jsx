import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import http from '../../http'; // Adjust import based on your file structure
import './ForumSearchBar.css'; // Import the CSS file

const PrivateThreadSearchBar = ({ onSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async (event) => {
        if (event.key === 'Enter') {
            try {
                const response = await http.get('/thread/privatethreads/why', { params: { search: searchTerm } });
                onSearchResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearchResults([]); // Clear the search results
    };

    return (
        <div className="search-bar-container">
            <TextField
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search threads..."
                variant="outlined"
                size="small"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {searchTerm && (
                                <IconButton onClick={handleClear}>
                                    <ClearIcon />
                                </IconButton>
                            )}
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
};

export default PrivateThreadSearchBar;
