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

// ** Views Imports
import DialogAddSA from 'src/views/pages/student_assistants/AddSA'
import DialogEditSA from 'src/views/pages/student_assistants/EditSA'
import DeleteSA from 'src/views/popups/SA/DeleteSA'

interface SAData {
  id: number
  username: string
  sa_number: string
  firstName: string
  middleName: string
  lastName: string
  address: string
  role: 'scheduling' | 'releasing'
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
  }
}

interface SAProps {
  setSARows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
}

function customToolbar(props: SAProps) {
  const { setSARows } = props

  // Refresh list of credentials
  const fetchSA = () => {
    axios.get('/api/admin/student_assistant')
      .then(response => {
        // Assuming the response data is structured correctly
        setSARows(response.data)
      })
      .catch(error => console.error("Error fetching data", error))
  }

  return (
    <GridToolbarContainer style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <DialogAddSA refreshData={fetchSA}/>
        <GridToolbarColumnsButton style={{ marginRight: '8px', marginBottom: '8px' }} />
        <GridToolbarFilterButton style={{ marginRight: '8px', marginBottom: '8px' }} />
        <GridToolbarExport style={{ marginBottom: '8px' }} />
      </div>
      <div>
        <Button size='small' variant='outlined' style={{ marginLeft: '8px', marginRight: '8px', marginBottom: '8px' }} onClick={() => fetchSA()} >
          Refresh
        </Button>
        <GridToolbarQuickFilter style={{ marginBottom: '8px' }} />
      </div>
    </GridToolbarContainer>
  )
}

const SAList = () => {
  // ** States
  const [saPaginationModel, setSAPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [saRows, setSARows] = useState<Array<SAData>>([])

  // ** Hooks

  // ** Vars

  // Fetch Student Assisntants and their Departments
  const fetchSA = () => {
    axios.get('/api/admin/student_assistant')
      .then(response => {
        setSARows(response.data)
      })
      .catch(error => console.error("Error fetching data", error))
  }

  useEffect(() => {
    fetchSA()
  }, [])

  const saColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 250,
      field: 'sa_number',
      headerName: 'Student Assistant Number',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.sa_number}
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
      minWidth: 200,
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
      minWidth: 200,
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
      minWidth: 200,
      field: 'monthlyClaimed',
      headerName: 'Monthly Claimed',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.transactionCounts.Claimed_Transaction.monthlyCount}
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
            <DialogEditSA sa={params.row} refreshData={fetchSA}/>
            <DeleteSA sa={params.row} refreshData={fetchSA}/>
          </>
        )
      }
    }
  ]

  return (
    <Grid container spacing={8}>
      <Grid item sm={12} xs={12} sx={{ width: "100%" }}>
        <Card>
          <CardHeader title='Student Assistants' />
          <DataGrid
            autoHeight
            columns={saColumns}
            rows={saRows}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={saPaginationModel}
            slots={{ toolbar: customToolbar }}
            onPaginationModelChange={setSAPaginationModel}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                setSARows
              }
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

SAList.acl = {
  action: 'read',
  subject: 'sa-list-page'
}

export default SAList
