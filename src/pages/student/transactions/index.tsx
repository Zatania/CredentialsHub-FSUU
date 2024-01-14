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

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Third Party Props
import axios from 'axios'
import dayjs from 'dayjs'

// ** Views Imports
import DialogViewTransaction from 'src/views/pages/students/ViewTransaction'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

interface StatusObj {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  Submitted: { title: 'Submitted', color: 'primary' },
  Claimed: { title: 'Claimed', color: 'success' },
  Rejected: { title: 'Rejected', color: 'error' },
  Resigned: { title: 'Resigned', color: 'warning' },
  Scheduled: { title: 'Scheduled', color: 'info' }
}

const StudentTransactions = () => {
  // ** States
  const [submittedPagination, setSubmittedPagination] = useState({ page: 0, pageSize: 10 })
  const [scheduledPagination, setScheduledPagination] = useState({ page: 0, pageSize: 10 })
  const [claimedPagination, setClaimedPagination] = useState({ page: 0, pageSize: 10 })
  const [rejectedPagination, setRejectedPagination] = useState({ page: 0, pageSize: 10 })
  const [submittedRows, setSubmittedsRows] = useState<GridRowsProp>([])
  const [scheduledRows, setScheduledRows] = useState<GridRowsProp>([])
  const [claimedRows, setClaimedRows] = useState<GridRowsProp>([])
  const [rejectedRows, setRejectedRows] = useState<GridRowsProp>([])

  // ** Hooks

  // ** Vars

  // Fetch All Transactions
  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = () => {
    axios.get('/api/student/transactions')
      .then(response => {
        const data = response.data;
        setSubmittedsRows(data.Submitted || []);
        setScheduledRows(data.Scheduled || []);
        setClaimedRows(data.Claimed || []);
        setRejectedRows(data.Rejected || []);
      })
      .catch(error => console.error("Error fetching data", error));
  }

  const submittedColumns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 110,
      field: 'requestType', // Change the field name to 'requestType'
      headerName: 'Request Type', // Change the header name to 'Request Type'
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {
            params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
            ''
          }
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.total_amount}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewTransaction transaction={params.row} refreshData={fetchAllTransactions} />
        )
      }
    }
  ]

  const scheduledColumns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 110,
      field: 'requestType', // Change the field name to 'requestType'
      headerName: 'Request Type', // Change the header name to 'Request Type'
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {
            params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
            ''
          }
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.total_amount}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewTransaction transaction={params.row} refreshData={fetchAllTransactions} />
        )
      }
    }
  ]

  const claimedColumns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 110,
      field: 'requestType', // Change the field name to 'requestType'
      headerName: 'Request Type', // Change the header name to 'Request Type'
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {
            params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
            ''
          }
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.total_amount}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewTransaction transaction={params.row} refreshData={fetchAllTransactions} />
        )
      }
    }
  ]

  const rejectedColumns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 110,
      field: 'requestType', // Change the field name to 'requestType'
      headerName: 'Request Type', // Change the header name to 'Request Type'
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {
            params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
            ''
          }
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.total_amount}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewTransaction transaction={params.row} refreshData={fetchAllTransactions} />
        )
      }
    }
  ]

  return (
    <Grid container spacing={8}>
      <Grid item sm={12} xs={12}>
        <Card>
          <CardHeader title='Submitted Transactions' />
          <DataGrid
            autoHeight
            columns={submittedColumns}
            rows={submittedRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={submittedPagination}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setSubmittedPagination}
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
          <CardHeader title='Scheduled Transactions' />
          <DataGrid
            autoHeight
            columns={scheduledColumns}
            rows={scheduledRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={scheduledPagination}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setScheduledPagination}
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
          <CardHeader title='Claimed Transactions' />
          <DataGrid
            autoHeight
            columns={claimedColumns}
            rows={claimedRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={claimedPagination}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setClaimedPagination}
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
          <CardHeader title='Rejected Transactions' />
          <DataGrid
            autoHeight
            columns={rejectedColumns}
            rows={rejectedRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={rejectedPagination}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setRejectedPagination}
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

StudentTransactions.acl = {
  action: 'read',
  subject: 'student-transactions-page'
}

export default StudentTransactions
