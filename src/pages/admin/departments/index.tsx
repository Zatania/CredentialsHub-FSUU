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
import DialogAddDepartment from 'src/views/pages/deparments/AddDepartment'
import DialogEditDepartment from 'src/views/pages/deparments/EditDepartment'
import toast from 'react-hot-toast'

interface DepartmentsData {
  id: number
  name: string
  is_deleted: boolean
}

interface DepartmentsProps {
  setDepartments: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
}

function CustomCredentialsToolbar(props: DepartmentsProps) {
  const { setDepartments } = props

  // Refresh list of departments
  const fetchData = () => {
    axios.get('/api/departments/list')
      .then(response => setDepartments(response.data))
      .catch(error => console.error("Error fetching data", error))
  }

  return (
    <GridToolbarContainer style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <DialogAddDepartment refreshData={fetchData}/>
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

const Departments = () => {
  // ** States
  const [departmentPaginationModel, setDepartmentPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [departments, setDepartments] = useState<GridRowsProp>([])

  // ** Hooks

  // ** Vars

  // Fetch Credentials and Packages List
  useEffect(() => {
    fetchData()
  }, [])

  // Call Function For Fetching Credentials List
  const fetchData = () => {
    axios.get('/api/departments/list')
      .then(response => setDepartments(response.data))
      .catch(error => console.error("Error fetching data", error))
  }

  const handleDeleteClick = (id: any) => {
    axios.delete(`/api/departments/delete?id=${id}`)
      .then(() => {
        toast.success('Department deleted successfully')
        fetchData()
      })
      .catch((error) => {
        console.error(error)
        const errorMessage = error.response?.data?.message || "Error deleting data";
        toast.error(errorMessage);
      })
  }

  const departmentsColumns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 200,
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
      minWidth: 150,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <DialogEditDepartment department={params.row} refreshData={fetchData}/>
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
          <CardHeader title='Departments' />
          <DataGrid
            autoHeight
            columns={departmentsColumns}
            rows={departments}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={departmentPaginationModel}
            slots={{ toolbar: CustomCredentialsToolbar }}
            onPaginationModelChange={setDepartmentPaginationModel}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                setDepartments
              }
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

Departments.acl = {
  action: 'read',
  subject: 'departments-page'
}

export default Departments
