import express from 'express';
import { createSOrder,getAllSOrders, getOneOrder } from '../controllers/SuporderController.js';


const supplierRouter = express.Router();

import multer from 'multer';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename file to avoid collisions
  }
});

// Create multer instance with specified storage configuration
const upload = multer({ storage });


supplierRouter.post('/', upload.single('receipt'), createSOrder);
supplierRouter.get('/:id', getOneOrder);
supplierRouter.get('/', getAllSOrders);

export default supplierRouter;