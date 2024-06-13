import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { apiUrl } from '../../utils/Constants';
import authAxios from '../../utils/authAxios';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import { RadioGroup, FormLabel, Radio, FormControlLabel, FormGroup } from '@mui/material';
import jsPDF from 'jspdf';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function ManageStaff() {

  const [users, setUsers] = useState([]);
  const [openSignupDialog, setOpenSignupDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contactNo: '',
    role: '',
  });

  const [updateFormData, setUpdateFormData] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    role: '',
  });

  const handleUpdateUser = (row) => {
    setOpenUpdateDialog(true);
    setUpdateFormData({
      _id: row._id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      contactNo: row.contactNo,
      role: row.role,
    });
  };

  const handleSignupDialogOpen = () => {
    setOpenSignupDialog(true);
  };

  const handleCreateUser = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleDialogClose = () => {
    setOpenSignupDialog(false);
    setOpenUpdateDialog(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      contactNo: '',
      role: '',
    });
  };

  const handleSubmit = async () => {
    // Phone number validation
    if (formData.contactNo.length !== 10) {
      toast.error('Phone number must be exactly 10 digits!');
      return;
    }

    // Email validation
    if (!formData.email.includes('@gmail.com')) {
      toast.error('Email must be a valid Gmail address!');
      return;
    }

    try {
      const result = await authAxios.post(`${apiUrl}/user/create`, formData);
      if (result) {
        toast.success('Staff Member Account Created Successfully!');
      }
      getUsers();
      setOpenSignupDialog(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const result = await authAxios.put(`${apiUrl}/user/update-account/${updateFormData._id}`, updateFormData);
      if (result) {
        getUsers();
        toast.success('Staff Member Updated Successfully!');
        handleDialogClose();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const result = await authAxios.delete(`${apiUrl}/user/delete-account/${id}`);

      if (result) {
        getUsers();
        toast.warning('Staff Member Deleted Successfully!');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      refreshPage();
    }
  };

  const getUsers = async (roleFilter) => {
    try {
      const res = await authAxios.get(`${apiUrl}/user/all`);
      if (roleFilter) {
        setUsers(res.data.filter(user => user.role === roleFilter));
      } else {
        setUsers(res.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        toast.error('Staff Members not found');
      } else {
        toast.error(error.response?.data?.message || 'An error occurred while getting all staff members!');
      }
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    // Header
    const header = [['First Name', 'Last Name', 'Email', 'Contact No', 'Role']];
    // Data
    const data = users.filter(user => user.role !== 'customer' && user.role !=='driver').map(user => [user.firstName, user.lastName, user.email, user.contactNo, user.role]);
    // Set font size and align center in width
    doc.setFontSize(12);
    doc.text("Our Staff Members", doc.internal.pageSize.width / 2, 10, { align: 'center' });
    // Add header and data to the table

    doc.autoTable({
      head: header,
      body: data,
      startY: 20,
      margin: { top: 20 },
    });

    doc.save("staff_members.pdf");
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container mx-auto p-4" style={{ backgroundColor: '#C1E1C1' }}>
      <h2 className="text-2xl text-center my-4">Manage Staff</h2>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button variant="contained" color="primary" style={{ backgroundColor: '#2E8B57', color: '#000' }} onClick={handleSignupDialogOpen}>Add New Staff</Button>
        </div>
        <div>
          <TextField id="search" label="Search by Role" variant="outlined" size="small" onChange={(e) => getUsers(e.target.value)} />
          <Button variant="contained" color="primary" style={{ backgroundColor: '#2E8B57', color: '#000' }} className="ml-2" onClick={handleGeneratePDF}>Generate PDF</Button>
        </div>
      </div>

      {!isLoading ? (
        <TableContainer component={Paper}>
          <Table style={{ border: '2px solid #2E8B57' }}>
            <TableHead>
              <TableRow style={{ backgroundColor: '#2E8B57' }}>
                <TableCell style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', border: '1px solid #2E8B57' }}>First Name</TableCell>
                <TableCell style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', border: '1px solid #2E8B57' }}>Last Name</TableCell>
                <TableCell style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', border: '1px solid #2E8B57' }}>Email</TableCell>
                <TableCell style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', border: '1px solid #2E8B57' }}>Contact No</TableCell>
                <TableCell style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', border: '1px solid #2E8B57' }}>Role</TableCell>
                <TableCell style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', border: '1px solid #2E8B57' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.filter(user => user.role !== 'customer' && user.role !=='driver').map(user => (
                <TableRow key={user._id} style={{ border: '1px solid #2E8B57' }}>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #2E8B57' }}>{user.firstName}</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #2E8B57' }}>{user.lastName}</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #2E8B57' }}>{user.email}</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #2E8B57' }}>{user.contactNo}</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #2E8B57' }}>{user.role}</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #2E8B57' }}>
                    <Button variant="contained" color="primary" style={{ backgroundColor: '#4CBB17', color: '#000', marginRight: 10 }} onClick={() => handleUpdateUser(user)}>Update</Button>
                    <Button variant="contained" color="error" startIcon={<Delete />} onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Loader />
      )}

      <Dialog open={openSignupDialog} onClose={handleDialogClose}>
        <DialogTitle>Add New Staff</DialogTitle>
        <DialogContent>
          <form>
            <TextField required label="First Name" margin="normal" name="firstName" value={formData.firstName} onChange={(e) => handleCreateUser('firstName', e.target.value)} fullWidth />
            <TextField required label="Last Name" margin="normal" name="lastName" value={formData.lastName} onChange={(e) => handleCreateUser('lastName', e.target.value)} fullWidth />
            <TextField required label="Contact No" margin="normal" name="contactNo" value={formData.contactNo} onChange={(e) => handleCreateUser('contactNo', e.target.value)} fullWidth />
            <TextField required label="Email" margin="normal" name="email" value={formData.email} onChange={(e) => handleCreateUser('email', e.target.value)} fullWidth />
            <TextField required label="Password" margin="normal" name="password" value={formData.password} onChange={(e) => handleCreateUser('password', e.target.value)} fullWidth />
            <FormGroup>
              <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  control={<Radio />}
                  label="Staff"
                  onChange={(e) => handleCheckboxChange('role', 'staff', e.target.checked)}
                  checked={formData.role === 'staff'}
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Supplier"
                  onChange={(e) => handleCheckboxChange('role', 'supplier', e.target.checked)}
                  checked={formData.role === 'supplier'}
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Inventory"
                  onChange={(e) => handleCheckboxChange('role', 'inventory', e.target.checked)}
                  checked={formData.role === 'inventory'}
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Order"
                  onChange={(e) => handleCheckboxChange('role', 'order', e.target.checked)}
                  checked={formData.role === 'order'}
                />
                <FormControlLabel
                  control={<Radio />}
                  label="News"
                  onChange={(e) => handleCheckboxChange('role', 'news', e.target.checked)}
                  checked={formData.role === 'news'}
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Admin"
                  onChange={(e) => handleCheckboxChange('role', 'admin', e.target.checked)}
                  checked={formData.role === 'admin'}
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Feedback"
                  onChange={(e) => handleCheckboxChange('role', 'feedback', e.target.checked)}
                  checked={formData.role === 'feedback'}
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Delivery"
                  onChange={(e) => handleCheckboxChange('role', 'delivery', e.target.checked)}
                  checked={formData.role === 'delivery'}
                />
              </RadioGroup>
            </FormGroup>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">Submit</Button>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateDialog} onClose={handleDialogClose}>
        <DialogTitle>Update Staff</DialogTitle>
        <DialogContent>
          <TextField
            required
            id="outlined-read-only-input"
            label="First Name"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) => setUpdateFormData({ ...updateFormData, firstName: e.target.value })}
            value={updateFormData.firstName}
          />
          <TextField
            required
            id="outlined-read-only-input"
            label="Last Name"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) => setUpdateFormData({ ...updateFormData, lastName: e.target.value })}
            value={updateFormData.lastName}
          />
          <TextField
            required
            id="outlined-read-only-input"
            label="Contact No"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) => setUpdateFormData({ ...updateFormData, contactNo: e.target.value })}
            value={updateFormData.contactNo}
          />
          <TextField
            required
            id="outlined-read-only-input"
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) => setUpdateFormData({ ...updateFormData, email: e.target.value })}
            value={updateFormData.email}
          />
          <TextField
            required
            id="outlined-read-only-input"
            label="Role"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) => setUpdateFormData({ ...updateFormData, role: e.target.value })}
            value={updateFormData.role}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate} color="primary">Submit</Button>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
