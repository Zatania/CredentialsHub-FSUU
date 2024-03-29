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

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** Views Imports
import DialogViewAdminTransactions from 'src/views/pages/admin/ViewTransaction'
import { set } from 'nprogress'

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
  Ready: { title: 'Ready', color: 'secondary' },
  Scheduled: { title: 'Scheduled', color: 'info' }
}

const AdminTransactions = () => {
  // ** States
  const [submittedPaginationModel, setSubmittedPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [scheduledPaginationModel, setScheduledPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [readyPaginationModel, setReadyPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [claimedPaginationModel, setClaimedPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [rejectedPaginationModel, setRejectedPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [submittedRows, setSubmittedsRows] = useState<GridRowsProp>([])
  const [scheduledRows, setScheduledRows] = useState<GridRowsProp>([])
  const [readyRows, setReadyRows] = useState<GridRowsProp>([])
  const [claimedRows, setClaimedRows] = useState<GridRowsProp>([])
  const [rejectedRows, setRejectedRows] = useState<GridRowsProp>([])

  // ** Hooks

  // ** Vars

  // Fetch All Transactions
  useEffect(() => {
    fetchAllTransactions();
  }, []);

  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const fetchAllTransactions = () => {
    axios.get('/api/admin/transactions')
      .then(response => {
        const data = response.data;
        setSubmittedsRows(data.Submitted || []);
        setScheduledRows(data.Scheduled || []);
        setReadyRows(data.Ready || []);
        setClaimedRows(data.Claimed || []);
        setRejectedRows(data.Rejected || []);
      })
      .catch(error => console.error("Error fetching data", error));
  }

  const submittedColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 50,
      field: 'id',
      headerName: 'TN',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      ),
      valueGetter: (params) => params.row.id
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'firstName',
      headerName: 'First Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.firstName}
        </Typography>
      ),
      valueGetter: (params) => params.row.firstName
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'lastName',
      headerName: 'Last Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.lastName}
        </Typography>
      ),
      valueGetter: (params) => params.row.lastName
    },
    {
      flex: 0.3,
      minWidth: 150,
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
      ),
      valueGetter: (params) => {
        return params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
                '';
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatNumberWithCommas(params.row.total_amount)}
        </Typography>
      ),
      valueGetter: (params) => params.row.total_amount
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      ),
      valueGetter: (params) => dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')
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
      },
      valueGetter: (params) => params.row.status
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewAdminTransactions transaction={params.row} refreshData={fetchAllTransactions} />
        )
      }
    }
  ]

  const scheduledColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 50,
      field: 'id',
      headerName: 'TN',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      ),
      valueGetter: (params) => params.row.id
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'firstName',
      headerName: 'First Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.firstName}
        </Typography>
      ),
      valueGetter: (params) => params.row.firstName
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'lastName',
      headerName: 'Last Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.lastName}
        </Typography>
      ),
      valueGetter: (params) => params.row.lastName
    },
    {
      flex: 0.3,
      minWidth: 150,
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
      ),
      valueGetter: (params) => {
        return params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
                '';
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatNumberWithCommas(params.row.total_amount)}
        </Typography>
      ),
      valueGetter: (params) => params.row.total_amount
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      ),
      valueGetter: (params) => dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')
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
      },
      valueGetter: (params) => params.row.status
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewAdminTransactions transaction={params.row} refreshData={fetchAllTransactions} />
        )
      }
    }
  ]

  const readyColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 50,
      field: 'id',
      headerName: 'TN',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      ),
      valueGetter: (params) => params.row.id
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'firstName',
      headerName: 'First Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.firstName}
        </Typography>
      ),
      valueGetter: (params) => params.row.firstName
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'lastName',
      headerName: 'Last Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.lastName}
        </Typography>
      ),
      valueGetter: (params) => params.row.lastName
    },
    {
      flex: 0.3,
      minWidth: 150,
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
      ),
      valueGetter: (params) => {
        return params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
                '';
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatNumberWithCommas(params.row.total_amount)}
        </Typography>
      ),
      valueGetter: (params) => params.row.total_amount
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      ),
      valueGetter: (params) => dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'paymentDate',
      headerName: 'Payment Date',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.payment_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      ),
      valueGetter: (params) => dayjs(params.row.payment_date).format('MMMM DD, YYYY hh:mm A')
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
      },
      valueGetter: (params) => params.row.status
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewAdminTransactions transaction={params.row} refreshData={fetchAllTransactions} />
        )
      }
    }
  ]

  const claimedColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 50,
      field: 'id',
      headerName: 'TN',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      ),
      valueGetter: (params) => params.row.id
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'firstName',
      headerName: 'First Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.firstName}
        </Typography>
      ),
      valueGetter: (params) => params.row.firstName
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'lastName',
      headerName: 'Last Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.lastName}
        </Typography>
      ),
      valueGetter: (params) => params.row.lastName
    },
    {
      flex: 0.3,
      minWidth: 150,
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
      ),
      valueGetter: (params) => {
        return params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
                '';
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatNumberWithCommas(params.row.total_amount)}
        </Typography>
      ),
      valueGetter: (params) => params.row.total_amount
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      ),
      valueGetter: (params) => dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')
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
      },
      valueGetter: (params) => params.row.status
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewAdminTransactions transaction={params.row} refreshData={fetchAllTransactions} />
        )
      }
    }
  ]

  const rejectedColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 50,
      field: 'id',
      headerName: 'TN',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      ),
      valueGetter: (params) => params.row.id
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'firstName',
      headerName: 'First Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.firstName}
        </Typography>
      ),
      valueGetter: (params) => params.row.firstName
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'lastName',
      headerName: 'Last Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.lastName}
        </Typography>
      ),
      valueGetter: (params) => params.row.lastName
    },
    {
      flex: 0.3,
      minWidth: 150,
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
      ),
      valueGetter: (params) => {
        return params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
                '';
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatNumberWithCommas(params.row.total_amount)}
        </Typography>
      ),
      valueGetter: (params) => params.row.total_amount
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      ),
      valueGetter: (params) => dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')
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
      },
      valueGetter: (params) => params.row.status
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewAdminTransactions transaction={params.row} refreshData={fetchAllTransactions} />
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
            paginationModel={submittedPaginationModel}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setSubmittedPaginationModel}
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
          <CardHeader title='Schedule Transactions' />
          <DataGrid
            autoHeight
            columns={scheduledColumns}
            rows={scheduledRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={scheduledPaginationModel}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setScheduledPaginationModel}
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
          <CardHeader title='Ready To Claim Transactions' />
          <DataGrid
            autoHeight
            columns={readyColumns}
            rows={readyRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={readyPaginationModel}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setReadyPaginationModel}
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
            paginationModel={claimedPaginationModel}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setClaimedPaginationModel}
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
            paginationModel={rejectedPaginationModel}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setRejectedPaginationModel}
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

AdminTransactions.acl = {
  action: 'read',
  subject: 'admin-transactions-page'
}

export default AdminTransactions
