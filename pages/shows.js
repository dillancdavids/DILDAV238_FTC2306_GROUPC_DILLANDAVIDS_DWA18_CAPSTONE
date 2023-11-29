/* eslint-disable */

import  { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
// import { useTheme } from '@mui/material/styles';
import { createClient } from '@supabase/supabase-js'; // Import Supabase client
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite'; // Heart icon
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Empty heart icon
import Link from 'next/link'; // <-- Corrected import statement

export default function MediaControlCard() {
//   const theme = useTheme();
  const [podcasts, setPodcasts] = useState([]); // State to store the fetched podcasts
  const [favoritePodcastIds, setFavoritePodcastIds] = useState([]); // State to store favorite podcast IDs
  const [searchTerm, setSearchTerm] = useState(''); // State to store the search term
  const [searchResults, setSearchResults] = useState([]); // State to store the filtered search results

  useEffect(() => {
    // Fetch the podcasts from the API
    fetch('https://podcast-api.netlify.app/')
      .then((response) => response.json())
      .then((data) => setPodcasts(data))
      .catch((error) => console.error('Error fetching podcasts:', error));

    // Fetch user's favorite podcast IDs from local storage and initialize the state
    const favoriteIdsFromStorage = JSON.parse(localStorage.getItem('favoritePodcastIds')) || [];
    setFavoritePodcastIds((prevIds) => {
      // Use the fetched IDs only if they exist, otherwise, initialize with an empty array
      return favoriteIdsFromStorage.length > 0 ? favoriteIdsFromStorage : prevIds;
    });
  }, []);

  const supabase = createClient(
    "https://yitliolscvqdehcsxkqz.supabase.co", // Replace with your Supabase URL
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGxpb2xzY3ZxZGVoY3N4a3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEyNzEwNjYsImV4cCI6MjAwNjg0NzA2Nn0.dD85xBerc96yv2rOxk9wdXBzZmjei6LU026la0xKI7Q" // Replace with your Supabase public key
  );
 // Function to toggle favorite status
 const toggleFavorite = async (podcast) => {
  const podcastId = podcast.id;
  const podcastName = podcast.title; // Assuming the podcast object has a 'title' property

  if (favoritePodcastIds.includes(podcastId)) {
    // If the podcast is already in favorites, remove it
    setFavoritePodcastIds((prevIds) => prevIds.filter((id) => id !== podcastId));

    // Remove the podcast from the Supabase table
    const { data, error } = await supabase
      .from('favorites')
      .delete()
      .eq('podcast_id', podcastId);
  } else {
    // If the podcast is not in favorites, add it
    setFavoritePodcastIds((prevIds) => [...prevIds, podcastId]);

    // Add the podcast to the Supabase table
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ podcast_id: podcastId, podcast_name: podcastName }]);
  }

  // Save the updated favorite podcast IDs to local storage
  localStorage.setItem('favoritePodcastIds', JSON.stringify(favoritePodcastIds));
};
  // Function to handle search
const handleSearch = (event) => {
  setSearchTerm(event.target.value);

  // Clone the podcasts array before using it with Fuse.js
  const podcastsClone = JSON.parse(JSON.stringify(podcasts));

  // Use Fuse.js to search the cloned podcasts based on the search term
  const fuse = new Fuse(podcastsClone, {
    keys: ['title', 'artist', 'seasons'],
    threshold: 0.4,
  });
  const results = fuse.search(event.target.value);
  setSearchResults(results.map((result) => result.item));
};
// Define filteredPodcasts here
const filteredPodcasts = searchTerm ? searchResults : podcasts;

  return (
    <Box className="container mx-auto">
      <div className="mb-4">
        {/* Add search input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for a show..."
          className="w-full py-2 px-4 rounded-lg border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>

      {filteredPodcasts.map((podcast) => (
        <Card key={podcast.id} sx={{ width: 'calc(50% - 8px)', marginBottom: 16 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <CardContent>
              <Typography component="div" variant="h5">
                {podcast.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                {podcast.artist}
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                Seasons: {podcast.seasons}
              </Typography>
            </CardContent>
            <IconButton
              aria-label="favorite"
              onClick={() => toggleFavorite(podcast)} // Pass the podcast object to toggleFavorite
              color={favoritePodcastIds.includes(podcast.id) ? 'error' : 'default'}
            >
              {favoritePodcastIds.includes(podcast.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          <Link href={`/podcast/${podcast.id}`} key={podcast.id}>
            {/* Use React Router's Link component */}
            <CardMedia
              component="img"
              sx={{ width: '100%', height: 200, objectFit: 'cover' }}
              image={podcast.image} // Assuming the podcast object has an 'image' property with the URL to the image
              alt={`Cover for ${podcast.title}`}
            />
          </Link>
        </Card>
      ))}
    </Box>
    </Box>

  );
}
