// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import {
  GridRowsProp,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridRenderCellParams,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter
 } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'

// ** Third Party Props
import axios from 'axios'
import toast from 'react-hot-toast'

// ** Views Imports
import DialogAddStaff from 'src/views/pages/staffs/AddStaff'
import DialogEditStaff from 'src/views/pages/staffs/EditStaff'

interface StaffData {
  id: number
  username: string
  employeeNumber: string
  firstName: string
  middleName: string
  lastName: string
  address: string
  departments: Array<{ id: number, name: string }>
  transactionCounts: {
    Scheduled: {
      dailyCount: number
      monthlyCount: number
    }
    Claimed: {
      dailyCount: number
      monthlyCount: number
    }
    Rejected: {
      dailyCount: number
      monthlyCount: number
    }
    Submitted: {
      dailyCount: number
      monthlyCount: number
    }
  }
}

interface StaffsProps {
  setStaffsRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
}

function customToolbar(props: StaffsProps) {
  const { setStaffsRows } = props

  // Refresh list of credentials
  const fetchStaffs = () => {
    axios.get('/api/admin/staff')
      .then(response => {
        // Assuming the response data is structured correctly
        setStaffsRows(response.data)
      })
      .catch(error => console.error("Error fetching data", error))
  }

  return (
    <GridToolbarContainer style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <DialogAddStaff refreshData={fetchStaffs}/>
        <GridToolbarColumnsButton style={{ marginRight: '8px', marginBottom: '8px' }} />
        <GridToolbarFilterButton style={{ marginRight: '8px', marginBottom: '8px' }} />
        <GridToolbarExport style={{ marginBottom: '8px' }} />
      </div>
      <div>
        <Button size='small' variant='outlined' style={{ marginLeft: '8px', marginRight: '8px', marginBottom: '8px' }} onClick={() => fetchStaffs()} >
          Refresh
        </Button>
        <GridToolbarQuickFilter style={{ marginBottom: '8px' }} />
      </div>
    </GridToolbarContainer>
  )
}

const StaffsList = () => {
  // ** States
  const [credentialPaginationModel, setCredentialPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [staffsRows, setStaffsRows] = useState<Array<StaffData>>([])

  // ** Hooks

  // ** Vars

  // Fetch Staffs and their Departments
  const fetchStaffs = () => {
    axios.get('/api/admin/staff')
      .then(response => {
        setStaffsRows(response.data)
      })
      .catch(error => console.error("Error fetching data", error))
  }

  useEffect(() => {
    fetchStaffs()
  }, [])

  const handleDeleteClick = (id: any) => {
    axios.delete(`/api/admin/staff/delete/${id}`)
      .then(() => {
        toast.success('Staff deleted successfully');
        fetchStaffs(); // Assuming this function refreshes the list of staffs
      })
      .catch((error) => {
        console.error(error);
        const errorMessage = error.response?.data?.message || "Error deleting data";
        toast.error(errorMessage);
      });
  }

  const staffsColumn: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 150,
      field: 'employeeNumber',
      headerName: 'Employee Number',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.employeeNumber}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'fullName',
      headerName: 'Full Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.firstName + ' ' + params.row.middleName + ' ' + params.row.lastName}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'dailyScheduled',
      headerName: 'Daily Scheduled',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.transactionCounts.Scheduled_Transaction.dailyCount}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'dailyClaimed',
      headerName: 'Daily Claimed',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.transactionCounts.Claimed_Transaction.dailyCount}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'dailyRejected',
      headerName: 'Daily Rejected',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.transactionCounts.Rejected_Transaction.dailyCount}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'monthlyScheduled',
      headerName: 'Monthly Scheduled',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.transactionCounts.Scheduled_Transaction.monthlyCount}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'monthlyClaimed',
      headerName: 'Monthly Claimed',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.transactionCounts.Claimed_Transaction.monthlyCount}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'monthlyRejected',
      headerName: 'Monthly Rejected',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.transactionCounts.Rejected_Transaction.monthlyCount}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <DialogEditStaff staff={params.row} refreshData={fetchStaffs}/>
            <Button size='small' startIcon={<DeleteIcon />} variant='outlined' onClick={() => handleDeleteClick(params.row.id)}>
              Delete
            </Button>
          </>
        )
      }
    }
  ]

  return (
    <Grid container spacing={8}>
      <Grid item sm={12} xs={12} sx={{ width: "100%" }}>
        <Card>
          <CardHeader title='Staffs' />
          <DataGrid
            autoHeight
            columns={staffsColumn}
            rows={staffsRows}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={credentialPaginationModel}
            slots={{ toolbar: customToolbar }}
            onPaginationModelChange={setCredentialPaginationModel}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                setStaffsRows
              }
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

StaffsList.acl = {
  action: 'read',
  subject: 'staffs-list-page'
}

export default StaffsList
