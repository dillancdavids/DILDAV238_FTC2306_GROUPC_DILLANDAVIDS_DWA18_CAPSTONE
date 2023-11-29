/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'; // Import the CircularProgress component
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

const PodcastDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [podcast, setPodcast] = useState(null); // State to store the podcast details
  const [error, setError] = useState(null); // State to handle API fetch errors

  useEffect(() => {
    console.log("ID:", id); // Add this line to check the value of 'id'
    // Fetch the podcast details and shows from the API using the given id
    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch podcast');
        }
        return response.json();
      })
      .then((data) => setPodcast(data))
      .catch((error) => setError(error.message));
  }, [id]);

  const theme = useTheme(); // Add this line to get the theme

  return (
    <div>
      {podcast ? (
        <>
          <h1>{podcast.title}</h1>
          <p>{podcast.description}</p>
          <p>Seasons: {podcast.seasons.length}</p>
          <ul>
            {podcast.seasons.map((season) => (
              <li key={season.season}>
                <h2>{season.title}</h2>
                <Card sx={{ display: 'flex', alignItems: 'center', my: 2, mx: 0, p: 1 }}>
                  <CardMedia
                    component="img"
                    image={season.image}
                    alt={`Cover for ${season.title}`}
                    sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                  />
                  <CardContent sx={{ flex: '1 0 auto', ml: 2 }}>
                    <Typography variant="h6">{season.title}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      {season.description}
                    </Typography>
                  </CardContent>
                </Card>
                <ul>
                  {season.episodes.map((episode) => (
                    <li key={episode.episode}>
                      <Card sx={{ my: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
                          <CardContent>
                            <Typography variant="h6">{episode.title}</Typography>
                            <Typography variant="body1" color="text.secondary">
                              {episode.description}
                            </Typography>
                          </CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            <audio controls src={episode.file} />
                          </Box>
                        </Box>
                      </Card>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      ) : (
        // Display a CircularProgress while the podcast data is being fetched
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

export default PodcastDetails;