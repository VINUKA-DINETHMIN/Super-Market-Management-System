import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../utils/Constants';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import authAxios from '../../utils/authAxios';
import jsPDF from 'jspdf';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Delete } from '@mui/icons-material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

export default function Salary() {
  const [salaries, setSalaries] = useState([]);
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [formData, setFormData] = useState({
    userId: '',
    basic: '',
    attendanceAllowance: '',
    fuelAllowance: '',
    overtime: '',
    totalSalary: '',
  });

  const [updateFormData, setUpdateFormData] = useState({
    _id: '',
    userId: '',
    basic: '',
    attendanceAllowance: '',
    fuelAllowance: '',
    overtime: '',
    totalSalary: '',
  });

  const handleUpdateUser = (row) => {
    setOpenUpdateDialog(true);
    setUpdateFormData({
      _id: row._id,
      userId: row.userId,
      basic: row.basic,
      attendanceAllowance: row.attendanceAllowance,
      fuelAllowance: row.fuelAllowance,
      overtime: row.overtime,
      totalSalary: row.totalSalary,
    });
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setOpenUpdateDialog(false);
    setFormData({
      userId: '',
      basic: '',
      attendanceAllowance: '',
      fuelAllowance: '',
      overtime: '',
      totalSalary: '',
    });
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    // Header
    const header = [['Name', 'Basic', 'Attendance Allowance', 'FuelAllowance', 'Overtime', 'Total Salary']];
    // Data
    const data = salaries.map((salary, index) => [
      salary.userId.firstName,
      salary.basic,
      salary.attendanceAllowance,
      salary.fuelAllowance,
      salary.overtime,
      salary.totalSalary,
    ]);
    // Set font size and align center in width
    doc.setFontSize(12);
    doc.text("Salary Details", doc.internal.pageSize.width / 2, 10, { align: 'center' });
    // Add header and data to the table
    doc.autoTable({
      head: header,
      body: data,
      startY: 20,
      margin: { top: 20 },
    });

    doc.save("Salary.pdf");
  }

  const fetchSalaries = async () => {
    try {
      const response = await authAxios.get(`${apiUrl}/salary`);
      setSalaries(response.data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await authAxios.get(`${apiUrl}/user/all`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchSalaries();
    fetchUsers();
  }, []);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    try {
      const result = await authAxios.put(`${apiUrl}/salary/${updateFormData._id}`, updateFormData);
      if (result) {
        fetchSalaries();
        toast.success('Updated Successfully');
        handleDialogClose();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await authAxios.delete(`${apiUrl}/salary/${id}`);
      if (result) {
        fetchSalaries();
        toast.warning('Deleted Successfully');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleSubmit = async () => {
    console.log(formData);
    try {
      const result = await authAxios.post(`${apiUrl}/salary`, formData)
      if (result) {
        toast.success("Salary created successfully!");
        setOpenDialog(false);
      }
      fetchSalaries();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleCreate = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };


  return (
    <div className="flex flex-col items-center" style={{ backgroundColor: '#C1E1C1', minHeight: '100vh' }}>
      <h2 className="text-xl font-bold mb-4">Salary Details</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" style={{ marginBottom: '20px', marginRight: '50px', backgroundColor: '#009E60', color: '#fff' }} onClick={handleDialogOpen}>Create Salary</Button>
        <Button variant="contained" color="primary" style={{ marginBottom: '20px', backgroundColor: '#009E60', color: '#fff' }} onClick={handleGeneratePDF}>Generate PDF</Button>
      </div>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogContent>
          <DialogTitle>Create Salary</DialogTitle>
          <Select
            value={formData.userId}
            onChange={(e) => handleCreate('userId', e.target.value)}
            label="Select User"
            fullWidth
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>{user.firstName} {user.lastName}</MenuItem>
            ))}
          </Select>
          <TextField
            label="Basic"
            type="number"
            value={formData.basic}
            onChange={(e) => handleCreate('basic', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Attendance Allowance"
            type="number"
            value={formData.attendanceAllowance}
            onChange={(e) => handleCreate('attendanceAllowance', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fuel Allowance"
            type="number"
            value={formData.fuelAllowance}
            onChange={(e) => handleCreate('fuelAllowance', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Overtime"
            type="number"
            value={formData.overtime}
            onChange={(e) => handleCreate('overtime', e.target.value)}
            fullWidth
            margin="normal"
          />
          <DialogActions>
            <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
            <Button onClick={handleDialogClose}>Cancel</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap justify-center">
        {salaries.map((salary) => (
          <Card key={salary._id} className="m-2" style={{ backgroundColor: '#fff', border: '2px solid #009E60', maxWidth: '300px' }}>
            <CardContent>
              <div>
                <strong>User Name:</strong> {salary.userId.firstName} {salary.userId.lastName}
              </div>
              <div>
                <strong>Basic:</strong> {salary.basic.toFixed(2)}
              </div>
              <div>
                <strong>Attendance Allowance:</strong> {salary.attendanceAllowance.toFixed(2)}
              </div>
              <div>
                <strong>Fuel Allowance:</strong> {salary.fuelAllowance.toFixed(2)}
              </div>
              <div>
                <strong>Overtime:</strong> {salary.overtime.toFixed(2)}
              </div>
              <div>
                <strong>Total Salary:</strong> {salary.totalSalary.toFixed(2)}
              </div>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" style={{ backgroundColor: '#009E60', color: '#fff' }} className="mr-2" onClick={() => handleUpdateUser(salary)}>Update</Button>
              <Button variant="contained" color="error" onClick={() => handleDelete(salary._id)}>Delete</Button>
            </CardActions>
          </Card>
        ))}
      </div>

      <Dialog open={openUpdateDialog} onClose={handleDialogClose}>
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <TextField
            required
            id="outlined-read-only-input"
            label="basic"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) => setUpdateFormData({ ...updateFormData, basic: e.target.value })}
            value={updateFormData.basic}
          />
          <TextField
            required
            id="outlined-read-only-input"
            label="Attendance Allowance"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) => setUpdateFormData({ ...updateFormData, attendanceAllowance: e.target.value })}
            value={updateFormData.attendanceAllowance}
          />
          <TextField
            required
            id="outlined-read-only-input"
            label="Fuel Allowance"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) => setUpdateFormData({ ...updateFormData, fuelAllowance: e.target.value })}
            value={updateFormData.fuelAllowance}
          />
          <TextField
            required
            id="outlined-read-only-input"
            label="Overtime"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={(e) => setUpdateFormData({ ...updateFormData, overtime: e.target.value })}
            value={updateFormData.overtime}
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
