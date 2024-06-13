import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../utils/Constants';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Home() {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    mobile: '',
    email: '',
    address: '',
    pDescription: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addSupplierDialogOpen, setAddSupplierDialogOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    companyName: '',
    name: '',
    mobile: '',
    email: '',
    address: '',
    pDescription: ''
  });

  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const results = suppliers.filter(supplier =>
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(results);
  }, [searchTerm, suppliers]);

  async function fetchSuppliers() {
    try {
      const response = await fetch(`${apiUrl}/supplier/`);
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  }

  async function fetchAndUpdateSupplier(id) {
    try {
      const response = await fetch(`${apiUrl}/supplier/${id}`);
      const data = await response.json();
      setSelectedSupplier(data);
      setFormData(data);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching supplier:', error);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddChange = (e) => {
    setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/supplier/${selectedSupplier._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setOpenDialog(false);
        fetchSuppliers();
        toast.success('Supplier updated successfully');
      } else {
        console.error('Failed to update supplier');
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/supplier/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addFormData)
      });
      if (response.ok) {
        setAddSupplierDialogOpen(false);
        fetchSuppliers();
        toast.success('Supplier added successfully');

        setAddFormData({
          companyName: '',
          name: '',
          mobile: '',
          email: '',
          address: '',
          pDescription: ''
        });

      } else {
        console.error('Failed to add supplier');
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/supplier/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchSuppliers();
        toast.success('Supplier deleted successfully');

        setDeleteConfirmationDialogOpen(false);
      } else {
        console.error('Failed to delete supplier');
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const isValidEmail = (email) => {
    // Basic email validation using regular expression
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };


  const isValidMobile = (mobile) => {
    // Basic mobile number validation using regular expression
    const regex = /^\d{10}$/;
    return regex.test(mobile);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    // Assuming doc is your PDF document object
    var pageWidth = doc.internal.pageSize.getWidth();
    var textWidth = doc.getStringUnitWidth('Supplier List') * doc.internal.getFontSize() / doc.internal.scaleFactor;

    // Calculate the x-coordinate to center the text
    var x = (pageWidth - textWidth) / 2;

    // Place the text at the calculated position
    doc.text('Supplier List', x, 10);


    const table = document.querySelector('#supplierTable').cloneNode(true);

    const actionColumnIndex = Array.from(table.querySelectorAll('thead th')).findIndex(th => th.textContent.trim().toLowerCase() === 'actions');
    if (actionColumnIndex !== -1) {
      const tableRows = table.querySelectorAll('tr');
      tableRows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length > actionColumnIndex) {
          row.removeChild(cells[actionColumnIndex]);
        }
      });
    }

    doc.autoTable({ html: table });
    doc.save('supplier_list.pdf');
  };

  return (
    <>
      <div className="container mx-auto" style={{backgroundImage: 'url("https://i.pinimg.com/564x/54/ca/0d/54ca0d3bd10058521c6f24f4c0521c09.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', minHeight: '100vh'}}>
        <br></br>
        <h1 style={{ textAlign: 'center', fontFamily: 'Times New Roman', fontSize: '36px' }} className="text-2xl font-bold mb-4">Suppliers List</h1>
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="flex mb-4 ">
            <input
              type="text"
              placeholder="search by company name"
              value={searchTerm}
              onChange={handleSearch}
              className="ml-4 px-3 py-2 border rounded-md focus:outline-none focus:ring"
            />
          </div>

          <div className="flex mt-4">
          <Stack spacing={2} direction="row">
            <Button variant="contained" onClick={() => setAddSupplierDialogOpen(true)} className="mr-2">Add Supplier</Button>
            <Button variant="contained" onClick={generatePDF}>Generate PDF</Button>
          </Stack>
          </div>

        </div>

        <br></br>
        <table id="supplierTable" className="border-separate border-spacing-2 border-2 border-gray-400">
          <thead className="bg-cyan-700">
            <tr>
              <th className="px-4 py-2">Company Name</th>
              <th className="px-4 py-2">Supplier Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Product Description</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map(supplier => (
              <tr key={supplier._id}>
                <td className="border px-4 py-2 border-gray-400">{supplier.companyName}</td>
                <td className="border px-4 py-2 border-gray-400">{supplier.name}</td>
                <td className="border px-4 py-2 border-gray-400">{supplier.mobile}</td>
                <td className="border px-4 py-2 border-gray-400">{supplier.email}</td>
                <td className="border px-4 py-2 border-gray-400">{supplier.address}</td>
                <td className="border px-4 py-2 border-gray-400">{supplier.pDescription}</td>
                <td className="border px-4 py-2 border-gray-400">

                <Stack spacing={2} direction="row">  
                <IconButton aria-label="delete" size="large">
                  <DeleteIcon fontSize="inherit" onClick={() => {
                    // Show delete confirmation dialog
                    setSelectedSupplierId(supplier._id);
                    setDeleteConfirmationDialogOpen(true);
                  }}/>
                </IconButton>
                <IconButton aria-label="edit" size="large">
                  <EditIcon fontSize="inherit" onClick={() => fetchAndUpdateSupplier(supplier._id)}/>
                </IconButton>
                </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Update Supplier</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                id="companyName"
                name="companyName"
                label="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
              />
              <TextField
                id="name"
                name="name"
                label="Supplier Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
              />
              <TextField
                id="mobile"
                name="mobile"
                label="Phone"
                value={formData.mobile}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                error={!isValidMobile(formData.mobile)}
                helperText={!isValidMobile(formData.mobile) && "Invalid mobile number"}
              />
              <TextField
                id="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                error={!isValidEmail(formData.email)}
                helperText={!isValidEmail(formData.email) && "Invalid email address"}
              />

              <TextField
                id="address"
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
              />
              <TextField
                id="pDescription"
                name="pDescription"
                label="Product Description"
                value={formData.pDescription}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
              />
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Update Supplier</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={addSupplierDialogOpen} onClose={() => setAddSupplierDialogOpen(false)}>
          <DialogTitle>Add Supplier</DialogTitle>
          <DialogContent>
            <form onSubmit={handleAddSubmit}>
              <TextField
                id="companyName"
                name="companyName"
                label="Company Name"
                value={addFormData.companyName}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
                required
              />
              <TextField
                id="name"
                name="name"
                label="Supplier Name"
                value={addFormData.name}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
                required
              />
              <TextField
                id="mobile"
                name="mobile"
                label="Phone"
                value={addFormData.mobile}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
                required
                error={addFormData.mobile.trim() !== '' && !isValidMobile(addFormData.mobile)}
                helperText={addFormData.mobile.trim() !== '' && !isValidMobile(addFormData.mobile) && "Invalid mobile number"}
              />
              <TextField
                id="email"
                name="email"
                label="Email"
                value={addFormData.email}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
                required
                error={addFormData.email.trim() !== '' && !isValidEmail(addFormData.email)}
                helperText={addFormData.email.trim() !== '' && !isValidEmail(addFormData.email) && "Invalid email address"}
              />

              <TextField
                id="address"
                name="address"
                label="Address"
                value={addFormData.address}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
                required
              />
              <TextField
                id="pDescription"
                name="pDescription"
                label="Product Description"
                value={addFormData.pDescription}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
                required
              />
              <DialogActions>
                <Button onClick={() => setAddSupplierDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Add Supplier</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteConfirmationDialogOpen} onClose={() => setDeleteConfirmationDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this supplier?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmationDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              handleDelete(selectedSupplierId);
              setDeleteConfirmationDialogOpen(false);
            }} variant="contained" color="primary">Delete</Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </div>
    </>
  );
}
