import React, { useState, useEffect } from 'react'
import { apiUrl } from '../../utils/Constants';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InventoryItems = () => {

  const [Orders, setOrders] = useState([]);
  const [SOrders, setSOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [addSOrderDialogOpen, setAddSOrderDialogOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    ordernumber: '',
    companyname: '',
    deliverydate: '',
    amount: '',
    address: '',
    receipt: ''
  });


  useEffect(() => {
    fetchSOrder();
  }, []);

  useEffect(() => {
    const results = Orders.filter( orderdetails=>
      orderdetails.companyname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSOrders(results);
  }, [searchTerm, Orders]);

 
  async function fetchSOrder() {
    try {
      const response = await fetch(`${apiUrl}/suporder`);
      const res = await response.json();

      if (Array.isArray(res)) {
        setOrders(res);
      } else {
        console.error('Data is not an array:', res);
      }
    } catch (error) {
      console.error('Error fetching sorder:', error);
    }
  }

  const handleAddChange = (e) => {
    setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setAddFormData({ ...addFormData, receipt: e.target.files[0] });
  };


  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('ordernumber', addFormData.ordernumber);
      formData.append('companyname', addFormData.companyname);
      formData.append('deliverydate', addFormData.deliverydate);
      formData.append('amount', addFormData.amount);
      formData.append('receipt', addFormData.receipt);
  
      const response = await fetch(`${apiUrl}/suporder`, {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        setAddSOrderDialogOpen(false);
        fetchSOrder();
        toast.success('Details added successfully');
  
        setAddFormData({
          ordernumber: '',
          companyname: '',
          deliverydate: '',
          amount: '',
          receipt: ''
        });
      } else {
        console.error('Failed to add details');
      }
    } catch (error) {
      console.error('Error adding:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div style={{backgroundImage: 'url("https://i.pinimg.com/564x/1a/05/07/1a05071b4b031859c93fa9657f05c53d.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', minHeight: '100vh'}}>
      <br></br>
      <h1 style={{ textAlign: 'center', fontFamily: 'Times New Roman', fontSize: '32px' }} className="text-2xl font-bold mb-4" >Supplier Order details</h1>

      <div className="flex mb-4 mr-4">
            <input
              type="text"
              placeholder="search by company name"
              value={searchTerm}
              onChange={handleSearch}
              className="ml-4 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
      </div>

      <div className="flex mt-4 ml-4">
          <Stack spacing={2} direction="row">
            <Button variant="contained" onClick={() => setAddSOrderDialogOpen(true)} className="mr-2">Add Details</Button>
            
          </Stack>
      </div>

      <br></br>
      <table className="ml-4 border-separate border-spacing-2 border-1 border-gray-400">
          <thead className="bg-cyan-700">
            <tr>
              <th className="px-4 py-2">Order number</th>
              <th className="px-4 py-2">Company name</th>
              <th className="px-4 py-2">Delivery date</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Receipt</th>
              
            </tr>
          </thead>
          <tbody>
            {SOrders.map(orderdetails => (
              <tr key={orderdetails._id}>
                <td className="border px-4 py-2 border-gray-400">{orderdetails.ordernumber}</td>
                <td className="border px-4 py-2 border-gray-400">{orderdetails.companyname}</td>
                <td className="border px-4 py-2 border-gray-400">{orderdetails.deliverydate.split("T")[0]}</td>
                <td className="border px-4 py-2 border-gray-400">{orderdetails.amount}</td>
                <td className="border px-4 py-2 border-gray-400">{orderdetails.receipt}</td>
              
              </tr>
            ))}
          </tbody>
          
        </table>


        <Dialog open={addSOrderDialogOpen} onClose={() => setAddSOrderDialogOpen(false)}>
          <DialogTitle>Add Supplier Order Details</DialogTitle>
          <DialogContent>
            <form onSubmit={handleAddSubmit}>
              <TextField
                id="ordernumber"
                name="ordernumber"
                label="Order Number"
                value={addFormData.ordernumber}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
                required
              />
              <TextField
                id="companyname"
                name="companyname"
                label="Company Name"
                value={addFormData.companyname}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
                required
              />
              <TextField
                id="deliverydate"
                name="deliverydate"
                type="date"
                value={addFormData.deliverydate}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
                required
              />
              <TextField
                id="amount"
                name="amount"
                label="Amount"
                value={addFormData.amount}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
                required
              />
              <br></br>
              <br></br>
              <Input
                type="file"
                id="receipt"
                name="receipt"
                accept="application/pdf"
                onChange={handleChange}
                //style={{ display: 'none' }} // Hide the input visually
              />
              
              {addFormData.receipt && ( // Render the button only if a receipt is selected
                <Button 
                  variant="outlined" 
                  onClick={() => window.open(addFormData.receipt)} // Open the selected receipt in a new tab
                >
                  View Receipt
                </Button>
              )}

              <DialogActions>
                <Button onClick={() => setAddSOrderDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Add Details</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <ToastContainer />
    </div>
  )
}

export default InventoryItems