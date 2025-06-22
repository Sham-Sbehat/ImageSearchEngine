import React, { useState, useEffect } from 'react';
import { ImageServiceWithInterceptor, type ImageResult } from '../services/imageServiceWithInterceptor';
import { Box, Card, CardMedia, CardContent, Typography, Button, TextField, CircularProgress, Alert, Stack } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export const ImageSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [images, setImages] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Load trending images on component mount
  useEffect(() => {
    loadTrendingImages();
  }, []);

  const loadTrendingImages = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ImageServiceWithInterceptor.getTrendingImages();
      setImages(response.results);
    
      setHasMore(response.total_pages > 1);
    } catch (err) {
      setError('Failed to load trending images');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await ImageServiceWithInterceptor.searchImages(keyword, 1);
      setImages(response.results);
      setHasMore(response.total_pages > 1);
      setPage(1);
    } catch (err) {
      setError('فشل في البحث عن الصور');
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await ImageServiceWithInterceptor.searchImages(keyword, page + 1);
      setImages((prev) => [...prev, ...response.results]);
      setHasMore(response.total_pages > page + 1);
      setPage(page + 1);
    } catch (err) {
      setError('فشل في تحميل المزيد من الصور');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageId: string) => {
    try {
      await ImageServiceWithInterceptor.downloadImage(imageId);
    } catch (err) {
      setError('فشل في تحميل الصورة');
    }
  };

  return (
    <Box sx={{ width: '100%', px: { xs: 0, md: 2 }, py: 2 }}>
      <form onSubmit={handleSearch}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            label="Search For Image..."
            variant="outlined"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            autoFocus
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
          </Button>
        </Stack>
      </form>
      {error && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>{error}</Alert>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          width: '100%',
          margin: 0,
        }}
      >
        {images.map((image) => (
          <Card key={image.id} sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardMedia
              component="img"
              height="220"
              image={image.urls.small}
              alt={image.alt_description || 'صورة'}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: 18 }}>
                {image.alt_description ||'Image'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
               By: {image.user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ❤️ {image.likes} Likes
              </Typography>
            </CardContent>
            <Button
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload(image.id)}
              sx={{ borderRadius: 0 }}
            >
              Download
            </Button>
          </Card>
        ))}
      </div>
      {hasMore && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleShowMore}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Show More'}
          </Button>
        </Box>
      )}
    </Box>
  );
}; 