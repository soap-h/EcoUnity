import React from 'react';
import { Grid, MenuList, MenuItem, Chip, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CategoryIcon from '@mui/icons-material/Category';
import LockIcon from '@mui/icons-material/Lock';
import SortIcon from '@mui/icons-material/Sort';
import { Link, useLocation } from 'react-router-dom';

function ForumNavigation() {
    const location = useLocation(); // Get current route location

    const getCategoryChipColor = (categoryName) => {
        switch (categoryName.toLowerCase()) {
            case 'biodiversity':
                return 'error';
            case 'energy':
                return 'warning';
            case 'conservation':
                return 'success';
            case 'agriculture':
                return 'primary';
            case 'recycling':
                return 'secondary';
            case 'climate change':
                return 'info';
            default:
                return 'default';
        }
    };

    // Function to determine if the link is active
    const isActive = (path) => location.pathname === path;

    return (
        <Grid item xs={3} sx={{ position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}>
            <MenuList>
                <MenuItem component={Link} to="/forum" selected={isActive('/forum')}>
                    <HomeIcon sx={{ mr: 1 }} /> Home
                </MenuItem>
                <MenuItem component={Link} to="/trending" selected={isActive('/trending')}>
                    <TrendingUpIcon sx={{ mr: 1 }} /> Trending
                </MenuItem>
                <MenuItem component={Link} to="/bookmarks" selected={isActive('/bookmarks')}>
                    <BookmarkIcon sx={{ mr: 1 }} /> Saved
                </MenuItem>
                <MenuItem component={Link} to="/thread/user/:userId" selected={isActive('/thread/user/:userId')}>
                    <PostAddIcon sx={{ mr: 1 }} /> Posted
                </MenuItem>
            </MenuList>

            <Divider sx={{ my: 2 }} />

            <MenuList>
                <MenuItem>
                    <LockIcon sx={{ mr: 1 }} /> Private
                </MenuItem>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                        <CategoryIcon sx={{ mr: 1 }} /> Categories
                    </AccordionSummary>
                    <AccordionDetails>
                        <MenuList>
                            <MenuItem component={Link} to="/thread/Biodiversity">
                                <Chip label={"Biodiversity"} color={getCategoryChipColor("Biodiversity")} sx={{ mr: 1 }} />
                            </MenuItem>
                            <MenuItem component={Link} to="/thread/Energy">
                                <Chip label={"Energy"} color={getCategoryChipColor("Energy")} sx={{ mr: 1 }} />
                            </MenuItem>
                            <MenuItem component={Link} to="/thread/Conservation">
                                <Chip label={"Conservation"} color={getCategoryChipColor("Conservation")} sx={{ mr: 1 }} />
                            </MenuItem>
                            <MenuItem component={Link} to="/thread/Agriculture">
                                <Chip label={"Agriculture"} color={getCategoryChipColor("Agriculture")} sx={{ mr: 1 }} />
                            </MenuItem>
                            <MenuItem component={Link} to="/thread/Recycling">
                                <Chip label={"Recycling"} color={getCategoryChipColor("Recycling")} sx={{ mr: 1 }} />
                            </MenuItem>
                            <MenuItem component={Link} to="/thread/Climate Change">
                                <Chip label={"Climate Change"} color={getCategoryChipColor("Climate Change")} sx={{ mb: 2 }} />
                            </MenuItem>
                        </MenuList>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                        <SortIcon sx={{ mr: 1 }} /> Sort by:
                    </AccordionSummary>
                    <AccordionDetails>
                        <MenuList>
                            <MenuItem>Most Popular</MenuItem>
                            <MenuItem>Most Recent</MenuItem>
                            <MenuItem>Top Rated</MenuItem>
                            <MenuItem>Oldest</MenuItem>
                        </MenuList>
                    </AccordionDetails>
                </Accordion>
            </MenuList>
        </Grid>
    );
}

export default ForumNavigation;
