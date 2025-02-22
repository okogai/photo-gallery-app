import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectDeleteImageLoading, selectImages, selectImagesLoading } from './imageSlice.ts';
import { useEffect, useState } from 'react';
import { deleteImage, fetchImages } from './imageThunk.ts';
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, Dialog, DialogContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import Loader from '../../components/UI/Loader.tsx';
import { selectUser } from '../users/userSlice.ts';
import { toast } from 'react-toastify';
import { GlobalError } from '../../typed';

const ImagesList = () => {
  const images = useAppSelector(selectImages);
  const loading = useAppSelector(selectImagesLoading);
  const deleteLoading = useAppSelector(selectDeleteImageLoading);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  const handleDelete = async (imageId: string) => {
    try {
      await dispatch(deleteImage(imageId)).unwrap();
      await dispatch(fetchImages());
      toast.success("Image deleted successfully");
    } catch (error) {
      const err = error as GlobalError;
      toast.error(err.error || "Something went wrong");
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return <Loader />;
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
                sx={{ padding: 2, cursor: 'pointer' }}
                image={`http://localhost:8000/${image.image}`}
                onClick={() => handleImageClick(`http://localhost:8000/${image.image}`)}
              />
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: '100%' }}>
                <Typography variant="h5">
                  {image.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ marginRight: 1 }}>
                    by:
                  </Typography>
                  <Link to={`/images/${image._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="h6" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                      {image.user.displayName}
                    </Typography>
                  </Link>
                </Box>
                <Box>
                  {user && (user.role === "admin" || user._id === image.user._id) && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(image._id)}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? <CircularProgress size={24} /> : "Delete"}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <DialogContent sx={{padding: 2 }}>
          {selectedImage && (
            <img src={selectedImage} alt="Preview" style={{ maxHeight: "80vh", borderRadius: 8 }} />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ImagesList;
