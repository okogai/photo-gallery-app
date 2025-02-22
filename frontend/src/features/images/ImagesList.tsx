import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import {
  selectDeleteImageLoading,
  selectImages,
  selectImagesLoading,
} from "./imageSlice.ts";
import { useEffect, useState } from "react";
import { deleteImage, fetchImages, fetchImagesByUser } from "./imageThunk.ts";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Link, useLocation, useParams } from "react-router-dom";
import Loader from "../../components/UI/Loader.tsx";
import { selectUser } from "../users/userSlice.ts";
import { toast } from "react-toastify";
import { GlobalError } from "../../typed";

const ImagesList = () => {
  const { userId } = useParams();
  const images = useAppSelector(selectImages);
  const loading = useAppSelector(selectImagesLoading);
  const deleteLoading = useAppSelector(selectDeleteImageLoading);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchImagesByUser(userId));
    } else {
      dispatch(fetchImages());
    }
  }, [dispatch, userId]);

  const handleDelete = async (imageId: string) => {
    try {
      await dispatch(deleteImage(imageId)).unwrap();
      if (userId) {
        dispatch(fetchImagesByUser(userId));
      } else {
        dispatch(fetchImages());
      }
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
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        {location.pathname === "/"
          ? "All images"
          : images && images.length > 0
            ? `Gallery of ${images[0].user.displayName}`
            : "No images yet"}
      </Typography>
      <Grid container spacing={3}>
        {images &&
          images.map((image) => (
            <Grid size={4} key={image._id}>
              <Card sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  alt={image.title}
                  height="300"
                  sx={{ padding: 2, cursor: "pointer" }}
                  image={`http://localhost:8000/${image.image}`}
                  onClick={() =>
                    handleImageClick(`http://localhost:8000/${image.image}`)
                  }
                />
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="h5">{image.title}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ marginRight: 1 }}>
                      by:
                    </Typography>
                    <Link
                      to={`/images/author/${image.user._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          cursor: "pointer",
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        {image.user.displayName}
                      </Typography>
                    </Link>
                  </Box>
                  <Box>
                    {user &&
                      (user.role === "admin" ||
                        user._id === image.user._id) && (
                        <IconButton
                          onClick={() => handleDelete(image._id)}
                          disabled={deleteLoading}
                          color="error"
                        >
                          {deleteLoading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            <ClearIcon />
                          )}
                        </IconButton>
                      )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <DialogContent
          sx={{ padding: 2, display: "flex", justifyContent: "center" }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              style={{ height: "80vh", width: "100%", borderRadius: 8 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ImagesList;
