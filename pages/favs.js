/* eslint-disable */


import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import { createClient } from '@supabase/supabase-js';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Link from 'next/link';

const supabase = createClient(
    "https://yitliolscvqdehcsxkqz.supabase.co", // Replace with your Supabase URL
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGxpb2xzY3ZxZGVoY3N4a3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEyNzEwNjYsImV4cCI6MjAwNjg0NzA2Nn0.dD85xBerc96yv2rOxk9wdXBzZmjei6LU026la0xKI7Q" // Replace with your Supabase public key
  );

export default function Favs() {
    const [podcasts, setPodcasts] = useState([]);
    const [favoritePodcasts, setFavoritePodcasts] = useState([]); // State to store user's favorite podcasts
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
      // Fetch the podcasts from the API
      fetch('https://podcast-api.netlify.app/')
        .then((response) => response.json())
        .then((data) => setPodcasts(data))
        .catch((error) => console.error('Error fetching podcasts:', error));


        // Fetch user's favorite podcasts from Supabase and initialize the state
    const fetchFavorites = async () => {
        const user = supabase.auth.user(); // Get the authenticated user
        if (user) {
          const { data, error } = await supabase
            .from('favorites')
            .select('podcast_id, podcast_name')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching user favorites:', error);
          } else {
            setFavoritePodcasts(data);
          }
        }
      };

      fetchFavorites();
    }, []);


// Function to toggle favorite status
const toggleFavorite = async (podcast) => {
    const user = supabase.auth.user(); // Get the authenticated user
    if (!user) {
      // If the user is not authenticated, show an error message or redirect to login
      console.error('User is not authenticated');
      return;
    }

    const podcastId = podcast.id;
    const podcastName = podcast.title; // Assuming the podcast object has a 'title' property

    const isFavorite = favoritePodcasts.some((favorite) => favorite.podcast_id === podcastId);

    if (isFavorite) {
      // If the podcast is already in favorites, remove it
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('podcast_id', podcastId);

      if (error) {
        console.error('Error removing podcast from favorites:', error);
      } else {
        setFavoritePodcasts((prevFavorites) =>
          prevFavorites.filter((favorite) => favorite.podcast_id !== podcastId)
        );
      }
    } else {
      // If the podcast is not in favorites, add it
      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        podcast_id: podcastId,
        podcast_name: podcastName,
      });

      if (error) {
        console.error('Error adding podcast to favorites:', error);
      } else {
        setFavoritePodcasts((prevFavorites) => [...prevFavorites, { podcast_id: podcastId, podcast_name: podcastName }]);
      }
    }
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

        {filteredPodcasts.map((podcast) => {
          const isFavorite = favoritePodcasts.some((favorite) => favorite.podcast_id === podcast.id);

          return (
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
                  onClick={() => toggleFavorite(podcast)}
                  color={isFavorite ? 'error' : 'default'}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Box>
              <Link href={`/podcast/${podcast.id}`} key={podcast.id}>
                <CardMedia
                  component="img"
                  sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                  image={podcast.image}
                  alt={`Cover for ${podcast.title}`}
                />
              </Link>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
