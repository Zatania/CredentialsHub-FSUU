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
import DialogEditCredential from 'src/views/pages/credentials/EditCredential'
import DialogAddCredential from 'src/views/pages/credentials/AddCredential'
import DialogAddPackage from 'src/views/pages/packages/AddPackage'
import DialogEditPackage from 'src/views/pages/packages/EditPackage'
import toast from 'react-hot-toast'

interface CredentialsData {
  id: number
  name: string
  price: number
}

interface PackagesData {
  id: number
  name: string
  description: string
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
        <DialogAddCredential refreshData={fetchData}/>
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


interface PackagesProps {
  setPackageRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
}

function CustomPackagesToolbar(props: PackagesProps) {
  const { setPackageRows } = props

  // Refresh list of packages
  const fetchPackages = () => {
    axios.get('/api/packages')
      .then(response => setPackageRows(response.data))
      .catch(error => console.error("Error fetching data", error))
  }

  return (
    <GridToolbarContainer style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <DialogAddPackage refreshData={fetchPackages}/>
        <GridToolbarColumnsButton style={{ marginRight: '8px', marginBottom: '8px' }} />
        <GridToolbarFilterButton style={{ marginRight: '8px', marginBottom: '8px' }} />
        <GridToolbarExport style={{ marginBottom: '8px' }} />
      </div>
      <div>
        <Button size='small' variant='outlined' style={{ marginLeft: '8px', marginRight: '8px', marginBottom: '8px' }} onClick={() => fetchPackages()} >
          Refresh
        </Button>
        <GridToolbarQuickFilter style={{ marginBottom: '8px' }} />
      </div>
    </GridToolbarContainer>
  )
}

const Credentials = () => {
  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [credentialsRows, setCredentialsRows] = useState<GridRowsProp>([])
  const [packageRows, setPackageRows] = useState<GridRowsProp>([])

  // ** Hooks

  // ** Vars

  // Fetch Credentials and Packages List
  useEffect(() => {
    fetchData()
    fetchPackages()
  }, [])

  // Call Function For Fetching Credentials List
  const fetchData = () => {
    axios.get('/api/credentials')
      .then(response => setCredentialsRows(response.data))
      .catch(error => console.error("Error fetching data", error))
  }

  // Call Function For Fetching Packages List
  const fetchPackages = () => {
    axios.get('/api/packages')
      .then(response => setPackageRows(response.data))
      .catch(error => console.error("Error fetching data", error))
  }

  const handleDeleteClick = (id: SetStateAction<CredentialsData | null>) => {
    axios.delete(`/api/credentials/${id}`)
      .then(() => {
        toast.success('Credential deleted successfully')
        fetchData()
      })
      .catch(error => console.error("Error deleting data", error))
  }

  const handlePackageDeleteClick = (id: SetStateAction<PackagesData | null>) => {
    axios.delete(`/api/packages/${id}`)
      .then(() => {
        toast.success('Package deleted successfully')
        fetchPackages()
      })
      .catch(error => console.error("Error deleting data", error))
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

  const packageColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 110,
      field: 'package_name',
      headerName: 'Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.package_name}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'package_description',
      headerName: 'Description',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.package_description}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <DialogEditPackage packageId={params.row.package_id} refreshData={fetchData}/>
            <Button size='small' startIcon={<DeleteIcon />} variant='outlined' onClick={() => handlePackageDeleteClick(params.row.package_id)}>
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
          <CardHeader title='Credentials' />
          <DataGrid
            autoHeight
            columns={credentialsColumns}
            rows={credentialsRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={paginationModel}
            slots={{ toolbar: CustomCredentialsToolbar }}
            onPaginationModelChange={setPaginationModel}
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
      <Grid item sm={12} xs={12}>
        <Card>
          <CardHeader title='Packages' />
          <DataGrid
            autoHeight
            columns={packageColumns}
            rows={packageRows}
            getRowId={(row) => row.package_id}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={paginationModel}
            slots={{ toolbar: CustomPackagesToolbar }}
            onPaginationModelChange={setPaginationModel}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                setPackageRows
              }
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

Credentials.acl = {
  action: 'read',
  subject: 'credentials-page'
}

export default Credentials
