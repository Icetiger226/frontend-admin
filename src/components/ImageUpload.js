import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, LinearProgress, Card, CardMedia, IconButton, Chip } from '@mui/material';
import { CloudUpload, Delete, CheckCircle, Error } from '@mui/icons-material';

const ImageUpload = ({ onUpload, onRemove, existingImages = [], multiple = true, maxFiles = 10, folder = 'activites' }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState([]);

  const uploadToCloudinary = async (files) => {
    setUploading(true);
    setUploadProgress(0);
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append(multiple ? 'images' : 'image', file);
      formData.append('folder', folder);

      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/upload/${multiple ? 'images' : 'image'}`, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (result.success) {
          if (multiple && result.data.successful) {
            results.push(...result.data.successful.map(img => ({
              url: img.url,
              publicId: img.publicId,
              originalName: img.originalName,
              status: 'success'
            })));
          } else if (!multiple && result.data) {
            results.push({
              url: result.data.url,
              publicId: result.data.publicId,
              originalName: result.data.originalName,
              status: 'success'
            });
          }
        } else {
          results.push({
            originalName: file.name,
            error: result.message,
            status: 'error'
          });
        }
      } catch (error) {
        results.push({
          originalName: file.name,
          error: 'Erreur de connexion',
          status: 'error'
        });
      }

      setUploadProgress(((i + 1) / files.length) * 100);
    }

    setUploadResults(results);
    setUploading(false);
    
    // Passer les URLs réussies au parent
    const successfulUrls = results.filter(r => r.status === 'success').map(r => r.url);
    if (onUpload && successfulUrls.length > 0) {
      onUpload(successfulUrls);
    }

    return results;
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      uploadToCloudinary(acceptedFiles);
    }
  }, [multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple,
    maxFiles: multiple ? maxFiles : 1,
    disabled: uploading
  });

  const removeImage = (imageUrl, index) => {
    if (onRemove) {
      onRemove(imageUrl, index);
    }
  };

  return (
    <Box>
      {/* Zone de Drop */}
      <Card
        {...getRootProps()}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          p: { xs: 2.25, sm: 3 },
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transform: isDragActive ? 'scale(1.01)' : 'scale(1)',
          transition: 'transform 160ms ease, border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease',
          background:
            'radial-gradient(900px circle at 10% 10%, rgba(37,99,235,0.12), transparent 42%), radial-gradient(700px circle at 90% 20%, rgba(79,70,229,0.10), transparent 45%)',
          boxShadow: isDragActive ? '0 18px 45px rgba(37, 99, 235, 0.14)' : undefined,
          '&:hover': {
            borderColor: uploading ? 'divider' : 'primary.main',
            boxShadow: uploading ? undefined : '0 18px 45px rgba(37, 99, 235, 0.10)',
          },
          '&:active': {
            transform: uploading ? 'scale(1)' : 'scale(0.995)',
          },
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            mx: 'auto',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: uploading ? 'text.disabled' : 'primary.main',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.10)' : 'rgba(37,99,235,0.08)',
            border: (theme) =>
              theme.palette.mode === 'dark' ? '1px solid rgba(148,163,184,0.16)' : '1px solid rgba(37,99,235,0.12)',
            transition: 'transform 160ms ease',
            transform: isDragActive ? 'scale(1.06)' : 'scale(1)',
          }}
        >
          <CloudUpload sx={{ fontSize: 30 }} />
        </Box>
        <Typography variant="h6" gutterBottom>
          {uploading ? 'Upload en cours...' : 
           isDragActive ? 'Déposez les images ici' : 
           `Glissez-déposez vos images ici ou cliquez pour sélectionner`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {multiple ? `Maximum ${maxFiles} images` : '1 image'} • 
          Formats acceptés: JPG, PNG, WebP, GIF • Max 10MB par image
        </Typography>
      </Card>

      {/* Barre de progression */}
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Upload en cours: {Math.round(uploadProgress)}%
          </Typography>
        </Box>
      )}

      {/* Résultats d'upload */}
      {uploadResults.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Résultats d'upload:
          </Typography>
          {uploadResults.map((result, index) => (
            <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              {result.status === 'success' ? (
                <CheckCircle color="success" fontSize="small" />
              ) : (
                <Error color="error" fontSize="small" />
              )}
              <Typography variant="body2" sx={{ flex: 1 }}>
                {result.originalName}
              </Typography>
              <Chip 
                label={result.status === 'success' ? 'Succès' : 'Erreur'}
                color={result.status === 'success' ? 'success' : 'error'}
                size="small"
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Images existantes */}
      {existingImages.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Images actuelles:
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 2 }}>
            {existingImages.map((imageUrl, index) => (
              <Card
                key={index}
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                  borderRadius: 3,
                  transform: 'translateY(0px)',
                  transition: 'transform 160ms ease, box-shadow 160ms ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.12)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="100%"
                  image={imageUrl}
                  alt={`Image ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <IconButton
                  onClick={() => removeImage(imageUrl, index)}
                  sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(2,6,23,0.55)' : 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(2,6,23,0.70)' : 'rgba(255,255,255,0.95)'
                    }
                  }}
                  size="small"
                >
                  <Delete fontSize="small" color="error" />
                </IconButton>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
