import React from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      onImageUpload(acceptedFiles[0]);
    },
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <p>Drag & drop an image here, or click to select one</p>
    </div>
  );
};

export default ImageUpload;
