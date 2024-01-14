// ** React Imports
import { useState, useEffect, SetStateAction } from 'react'

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

// ** Views Imports
import DialogAddStaff from 'src/views/pages/staffs/AddStaff'

import DialogEditCredential from 'src/views/pages/credentials/EditCredential'
import toast from 'react-hot-toast'

interface CredentialsData {
  id: number
  name: string
  price: number
}

interface CredentialsProps {
  setCredentialsRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
}

function CustomCredentialsToolbar(props: CredentialsProps) {
  const { setCredentialsRows } = props

  // Refresh list of credentials
  const fetchData = () => {
    axios.get('/api/credentials')
      .then(response => setCredentialsRows(response.data))
      .catch(error => console.error("Error fetching data", error))
  }

  return (
    <GridToolbarContainer style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <DialogAddStaff refreshData={fetchData}/>
        <GridToolbarColumnsButton style={{ marginRight: '8px', marginBottom: '8px' }} />
        <GridToolbarFilterButton style={{ marginRight: '8px', marginBottom: '8px' }} />
        <GridToolbarExport style={{ marginBottom: '8px' }} />
      </div>
      <div>
        <Button size='small' variant='outlined' style={{ marginLeft: '8px', marginRight: '8px', marginBottom: '8px' }} onClick={() => fetchData()} >
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
  const [credentialsRows, setCredentialsRows] = useState<GridRowsProp>([])
  const [staffsRows, setStaffsRows] = useState<GridRowsProp>([])

  // ** Hooks

  // ** Vars

  // Fetch Credentials and Packages List
  useEffect(() => {
    fetchData()
    fetchStaffs()
  }, [])

  // Call Function For Fetching Credentials List
  const fetchData = () => {
    axios.get('/api/credentials')
      .then(response => setCredentialsRows(response.data))
      .catch(error => console.error("Error fetching data", error))
  }

  const fetchStaffs = () => {
    axios.get('/api/admin/staff')
      .then(response => setStaffsRows(response.data))
      .catch(error => console.error("Error fetching data", error))
  }

  console.log(staffsRows)
  const handleDeleteClick = (id: SetStateAction<CredentialsData | null>) => {
    axios.delete(`/api/credentials/${id}`)
      .then(() => {
        toast.success('Credential deleted successfully')
        fetchData()
      })
      .catch((error) => {
        console.error(error)
        const errorMessage = error.response?.data?.message || "Error deleting data";
        toast.error(errorMessage);
      })
  }

  const credentialsColumns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 110,
      field: 'name',
      headerName: 'name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.name}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'price',
      headerName: 'price',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.price}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <DialogEditCredential credential={params.row} refreshData={fetchData}/>
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
      <Grid item sm={12} xs={12}>
        <Card>
          <CardHeader title='Staffs' />
          <DataGrid
            autoHeight
            columns={credentialsColumns}
            rows={credentialsRows}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={credentialPaginationModel}
            slots={{ toolbar: CustomCredentialsToolbar }}
            onPaginationModelChange={setCredentialPaginationModel}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                setCredentialsRows
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
