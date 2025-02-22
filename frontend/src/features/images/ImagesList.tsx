import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectImages, selectImagesLoading } from './imageSlice.ts';
import { useEffect } from 'react';
import { fetchImages } from './imageThunk.ts';
import { Box, Card, CardContent, CardMedia, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import Loader from '../../components/UI/Loader.tsx';

const ImagesList = () => {
  const images = useAppSelector(selectImages);
  const loading = useAppSelector(selectImagesLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {images && images.map((image) => (
          <Grid size={4} key={image._id}>
            <Card sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                alt={image.title}
                height="300"
                sx={{padding: 2}}
                image={`http://localhost:8000/${image.image}`}
              />
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: '100%', }}>
                <Typography variant="h5">
                    {image.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{marginRight: 1}}>
                    by:
                  </Typography>
                  <Link to={`/images/${image._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="h6" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                      {image.user.displayName}
                    </Typography>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ImagesList;