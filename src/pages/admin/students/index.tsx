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
  GridToolbar,
  GridRenderCellParams,
 } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'

// ** Third Party Props
import axios from 'axios'

// ** Views Imports
import DialogViewStudent from 'src/views/pages/students/ViewStudent'
import ChangePassword from 'src/views/popups/students/ChangePassword'

const AdminStudents = () => {
  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [unverifiedPaginationModel, setUnverifiedPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [studentsRows, setStudentsRows] = useState<GridRowsProp>([])
  const [unverifiedRows, setUnverifiedRows] = useState<GridRowsProp>([])

  // ** Hooks

  // ** Vars

  // Fetch Credentials and Packages List
  useEffect(() => {
    fetchData()
    fetchUnverified()
  }, [])

  const fetchAll = () => {
    fetchData()
    fetchUnverified()
  }

  // Call Function For Fetching Credentials List
  const fetchData = () => {
    const status = 'Verified'

    axios.get(`/api/admin/student/list/${status}`)
      .then(response => setStudentsRows(response.data))
      .catch(error => console.error("Error fetching data", error))
  }

  // Call Function For Fetching Packages List
  const fetchUnverified = () => {
    const status = 'Unverified'

    axios.get(`/api/admin/student/list/${status}`)
      .then(response => setUnverifiedRows(response.data))
      .catch(error => console.error("Error fetching data", error))
  }

  const studentsColumns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 150,
      field: 'studentNumber',
      headerName: 'Student Number',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.studentNumber}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'firstName',
      headerName: 'First Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.firstName}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'lastName',
      headerName: 'Last Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.lastName}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 150,
      field: 'department',
      headerName: 'department',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.department}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 150,
      field: 'course',
      headerName: 'course',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.course}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 325,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <DialogViewStudent student={params.row} refreshData={fetchAll} actionType="unverify"/>
            <ChangePassword student={params.row} refreshData={fetchAll}/>
          </>
        )
      }
    }
  ]

  const unverifiedColumns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 110,
      field: 'studentNumber',
      headerName: 'Student Number',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.studentNumber}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'firstName',
      headerName: 'First Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.firstName}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'lastName',
      headerName: 'Last Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.lastName}
        </Typography>
      )
    },
    {
      flex: 0.5,
      minWidth: 110,
      field: 'department',
      headerName: 'department',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.department}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'course',
      headerName: 'course',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.course}
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
          <DialogViewStudent student={params.row} refreshData={fetchAll} actionType="verify"/>
        )
      }
    }
  ]

  return (
    <Grid container spacing={8}>
      <Grid item sm={12} xs={12}>
        <Card>
          <CardHeader title='Verification Clients' />
          <DataGrid
            autoHeight
            columns={unverifiedColumns}
            rows={unverifiedRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={unverifiedPaginationModel}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setUnverifiedPaginationModel}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                showQuickFilter: true,
              }
            }}
          />
        </Card>
      </Grid>
      <Grid item sm={12} xs={12}>
        <Card>
          <CardHeader title='Verified Students' />
          <DataGrid
            autoHeight
            columns={studentsColumns}
            rows={studentsRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={paginationModel}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setPaginationModel}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                showQuickFilter: true,
              }
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

AdminStudents.acl = {
  action: 'read',
  subject: 'admin-students-page'
}

export default AdminStudents
