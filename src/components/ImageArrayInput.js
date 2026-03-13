import React from 'react';
import { useInput } from 'react-admin';
import ImageUpload from './ImageUpload';

const ImageArrayInput = ({ source, label, multiple = true, maxFiles = 10, folder = 'activites', ...props }) => {
  const {
    field: { value = [], onChange },
    fieldState: { error, invalid }
  } = useInput({ source, ...props });

  const handleUpload = (newUrls) => {
    if (multiple) {
      // Ajouter les nouvelles URLs aux existantes
      const updatedUrls = [...value, ...newUrls];
      onChange(updatedUrls);
    } else {
      // Remplacer par la nouvelle URL
      onChange(newUrls[0] || '');
    }
  };

  const handleRemove = (urlToRemove, index) => {
    if (multiple) {
      const updatedUrls = value.filter((_, i) => i !== index);
      onChange(updatedUrls);
    } else {
      onChange('');
    }
  };

  return (
    <div>
      {label && (
        <div style={{ 
          marginBottom: '8px', 
          fontSize: '0.75rem', 
          color: invalid ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)',
          fontWeight: 400,
          lineHeight: 1.4375,
          letterSpacing: '0.00938em'
        }}>
          {label}
        </div>
      )}
      
      <ImageUpload
        onUpload={handleUpload}
        onRemove={handleRemove}
        existingImages={multiple ? value : (value ? [value] : [])}
        multiple={multiple}
        maxFiles={maxFiles}
        folder={folder}
      />
      
      {error && (
        <div style={{ 
          color: '#d32f2f', 
          fontSize: '0.75rem', 
          marginTop: '3px',
          fontWeight: 400,
          lineHeight: 1.66,
          letterSpacing: '0.03333em'
        }}>
          {error.message}
        </div>
      )}
    </div>
  );
};

export default ImageArrayInput;
