import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import Detection from './models/Detection';
import DetectionService from './services/detect';

const DetectionPage = () => {
  const [_loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1); // Zoom level
  const [offsetX, setOffsetX] = useState(0); // Horizontal offset for panning
  const [offsetY, setOffsetY] = useState(0); // Vertical offset for panning
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const startDrag = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 500;
        canvas.height = 300;
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#333';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Upload an image to start detection', canvas.width / 2, canvas.height / 2);
      }
    }
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = event.target.files?.[0];
    if (!file) {
      setLoading(false);
      setError('No file selected');
      return;
    }
    const [boxes, error] = await DetectionService.detect(file);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (!boxes) {
      setError('No object detected!');
      setLoading(false);
      return;
    }
    if (boxes.length === 0) {
      setError('Image is too large');
      setLoading(false);
    }
    drawImageAndBoxes(file, boxes);
  };

  const drawImageAndBoxes = (file: File, boxes: Detection[]) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
  
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      // Set canvas size to match the image's natural dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw the image at its original size
      ctx.drawImage(img, 0, 0, img.width, img.height);
  
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 3;
      ctx.font = '18px serif';
  
      // Draw bounding boxes without scaling
      boxes.forEach(({ x1, y1, x2, y2, label, probability }) => {
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        ctx.font = '8px Arial';
        ctx.fillStyle = '#00FF00';
        const textWidth = ctx.measureText(label).width;
        ctx.fillRect(x1, y1, textWidth, 20);
        ctx.fillStyle = '#000000';
        ctx.fillText(label, x1, y1 + 8);
        ctx.fillText(String(probability.toFixed(3)), x1, y1 + 16);
      });
  
      setLoading(false);
    };
  };
  

  // Handle zoom with mouse wheel
  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const zoomFactor = 0.1;
    let newScale = scale;

    if (event.deltaY < 0) {
      newScale += zoomFactor; // Zoom in
    } else {
      newScale -= zoomFactor; // Zoom out
    }

    // Ensure scale stays within limits
    newScale = Math.max(0.1, Math.min(newScale, 3));
    setScale(newScale);
  };

  // Handle panning on mouse drag
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    startDrag.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;

    const dx = event.clientX - startDrag.current.x;
    const dy = event.clientY - startDrag.current.y;

    setOffsetX(offsetX + dx);
    setOffsetY(offsetY + dy);

    startDrag.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className='w-full h-screen'>
      <p className='w-full text-center text-4xl py-1'>Image Detection</p>
      <div className='w-full h-full justify-center items-center flex'>
        <div>
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            className='block mb-3'
          />
          <canvas
            ref={canvasRef}
            className='block border-solid border-black border-2'
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          ></canvas>
        </div>
      </div>
      <p>{error}</p>
    </div>
  );
};

export default DetectionPage;