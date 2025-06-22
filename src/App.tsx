import './App.css'
import { ImageSearch } from './components/ImageSearch'
import { Container, Box, Typography, AppBar, Toolbar } from '@mui/material'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'

function App() {
  return (
    <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh' }}>
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <PhotoLibraryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
         Image Search Engine
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
        <ImageSearch />
      </Container>
    </Box>
  )
}

export default App
