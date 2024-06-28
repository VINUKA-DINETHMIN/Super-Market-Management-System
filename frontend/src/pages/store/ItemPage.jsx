import { useParams } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Rating from '@mui/material/Rating';
import { Button, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useAuth } from '../common/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../utils/Constants';
import authAxios from '../../utils/authAxios';
import { toast } from 'react-toastify';

export default function ItemPage() {
    const { userRole } = useAuth();
    const { id } = useParams();
    const [item, setItem] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({
        productId: id,
        rate: '',
        review: '',
    });
    const [updateFormData, setUpdateFormData] = useState({
        _id: '',
        rate: '',
        review: '',
    });

    useEffect(() => {
        getUserDetails();
        getReviews();
        getItem();
    }, []);

    const getUserDetails = async () => {
        try {
            const response = await authAxios.get(`${apiUrl}/user/get-user`);
            setUser(response.data);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getReviews = async () => {
        try {
            const response = await authAxios.get(`${apiUrl}/review/product/${id}`);
            setReviews(response.data.Data);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getItem = async () => {
        try {
            const response = await authAxios.get(`${apiUrl}/item/get-one/${id}`);
            setItem(response.data);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (itemId) => {
        try {
            const response = await authAxios.post(`${apiUrl}/cart/${itemId}`);
            if (response) {
                toast.success("Added to cart");
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await authAxios.post(`${apiUrl}/review/product`, formData);
            toast.success(response.data.message);
            getReviews();
            setOpen(false);
        } catch (error) {
            handleError(error);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await authAxios.put(`${apiUrl}/review/product/${updateFormData._id}`, updateFormData);
            toast.success('Review Updated Successfully');
            getReviews();
            setOpen2(false);
        } catch (error) {
            handleError(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await authAxios.delete(`${apiUrl}/review/product/${id}`);
            toast.warning('Review Deleted Successfully');
            getReviews();
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error) => {
        if (error.response && error.response.status === 404) {
            toast.error('Not found');
        } else {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="flex flex-col md:flex-row -mx-4">
                <div className="md:flex-1 px-4">
                    <div className="h-64 md:h-80 rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
                        <img src={item.img} alt="Product Image" className='h-full' />
                    </div>
                </div>
                <div className="md:flex-1 px-4">
                    <h2 className="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">{item.itemName}</h2>
                    <p className="text-gray-500 text-sm">By <a href="#" className="text-indigo-600 hover:underline">{item.category}</a></p>
                    <div className="flex items-center space-x-4 my-4">
                        <div className="rounded-lg bg-gray-100 flex py-2 px-3">
                            <span className="text-indigo-400 mr-1 mt-1">Rs. </span>
                            <span className="font-bold text-indigo-600 text-3xl">{item.price}.00</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-green-500 text-xl font-semibold">Save 12%</p>
                            <p className="text-gray-400 text-sm">Inclusive of all Taxes.</p>
                        </div>
                    </div>
                    {userRole === 'customer' && (
                        <div className="flex py-4 space-x-4">
                            <button 
                                type="button" 
                                className="h-14 px-6 py-2 font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
                                onClick={() => addToCart(id)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <Typography variant="h5" gutterBottom className="text-center">
                    Reviews
                </Typography>
                {userRole === 'customer' && (
                    <div className="mb-3">
                        <Button variant="outlined" onClick={() => setOpen(true)}>Add Review</Button>
                    </div>
                )}
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    PaperProps={{ style: { width: '33%', minWidth: '200px', maxWidth: '500px' } }}
                >
                    <DialogTitle id="alert-dialog-title">Publish Review</DialogTitle>
                    <DialogContent>
                        <Typography component="legend">Email</Typography>
                        <TextField fullWidth value={user.email} disabled />
                        <Typography component="legend">Rate</Typography>
                        <Rating
                            name="simple-controlled"
                            value={formData.rate}
                            onChange={(e) => setFormData({...formData, rate: e.target.value })}
                        />
                        <Typography component="legend">Feedback</Typography>
                        <TextField
                            id="outlined-multiline-static"
                            multiline
                            rows={4}
                            fullWidth
                            value={formData.review}
                            onChange={(e) => setFormData({...formData, review: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSubmit}>Publish</Button>
                        <Button onClick={() => setOpen(false)} autoFocus>Cancel</Button>
                    </DialogActions>
                </Dialog>
                {reviews.map((review, index) => (
                    <Accordion key={review._id} expanded={expanded === index} onChange={(e, isExpanded) => setExpanded(isExpanded? index : false)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            {review.userId && (
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    {review.userId.firstName} {review.userId.lastName}
                                </Typography>
                            )}
                            <Rating name="disabled" value={review.rate} disabled />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{review.review}</Typography>
                            {review.userId && user._id === review.userId._id && (
    <div className="text-right">
        <IconButton aria-label="edit" onClick={() => {
            setOpen2(true);
            setUpdateFormData({ _id: review._id, rate: review.rate, review: review.review });
        }}>
            <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => handleDelete(review._id)}>
            <DeleteIcon />
        </IconButton>
    </div>
)}

                            
                        </AccordionDetails>
                    </Accordion>
                ))}
                <Dialog
                    open={open2}
                    onClose={() => setOpen2(false)}
                    aria-labelledby="alert-dialog-title"
                    PaperProps={{ style: { width: '33%', minWidth: '200px', maxWidth: '500px' } }}
                >
                    <DialogTitle id="alert-dialog-title">Update Review</DialogTitle>
                    <DialogContent>
                        <Typography component="legend">Email</Typography>
                        <TextField fullWidth value={user.email} disabled />
                        <Typography component="legend">Rate</Typography>
                        <Rating
                            name="simple-controlled"
                            value={updateFormData.rate}
                            onChange={(e) => setUpdateFormData({...updateFormData, rate: e.target.value })}
                        />
                        <Typography component="legend">Feedback</Typography>
                        <TextField
                            id="outlined-multiline-static"
                            multiline
                            rows={4}
                            fullWidth
                            value={updateFormData.review}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, review: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpdate}>Publish</Button>
                        <Button onClick={() => setOpen2(false)} autoFocus>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}
