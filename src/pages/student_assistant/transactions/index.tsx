// ** React Imports
import { useState, useEffect, useCallback } from 'react'

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
import { useSession } from 'next-auth/react'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** Views Imports
import DialogViewTransaction from 'src/views/pages/student_assistants/ViewTransaction'

interface StatusObj {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  Submitted: { title: 'Submitted', color: 'primary' },
  Scheduled: { title: 'Scheduled', color: 'info' },
  Done: { title: 'Done', color: 'info' },
  Claimed: { title: 'Claimed', color: 'success' },
  Ready: { title: 'Ready', color: 'secondary' },
}

const SATransactions = () => {
  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [submittedRows, setSubmittedsRows] = useState<GridRowsProp>([])
  const [scheduledRows, setScheduledRows] = useState<GridRowsProp>([])
  const [readyRows, setReadyRows] = useState<GridRowsProp>([])
  const [claimedRows, setClaimedRows] = useState<GridRowsProp>([])
  const [sa, setSA] = useState<any>(null)

  // ** Hooks
  const { data: session } = useSession()

  // ** Vars

  // Fetch All Transactions

  useEffect(() => {
    axios.get(`/api/student_assistant/${session?.user.id}`)
      .then(response => {
        setSA(response.data[0])
      })
  }, [session])

  useEffect(() => {
    fetchAllTransactions()
  }, [])

  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const fetchAllTransactions = () => {
    axios.get('/api/student_assistant/transactions')
      .then(response => {
        const data = response.data
        setSubmittedsRows(data.Submitted || [])
        setScheduledRows(data.Scheduled || [])
        setReadyRows(data.Ready || [])
        setClaimedRows(data.Claimed || [])
      })
      .catch(error => console.error("Error fetching data", error))
  }

  const submittedColumns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 110,
      field: 'requestType',
      headerName: 'Request Type',
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
          {formatNumberWithCommas(params.row.total_amount)}
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
      flex: 0.3,
      minWidth: 110,
      field: 'paymentDate',
      headerName: 'Payment Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.payment_date ? dayjs(params.row.payment_date).format('MMMM DD, YYYY hh:mm A') : ''}
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
      field: 'requestType',
      headerName: 'Request Type',
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
          {formatNumberWithCommas(params.row.total_amount)}
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
      flex: 0.3,
      minWidth: 110,
      field: 'paymentDate',
      headerName: 'Payment Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.payment_date ? dayjs(params.row.payment_date).format('MMMM DD, YYYY hh:mm A') : ''}
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

  const readyColumns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 110,
      field: 'requestType',
      headerName: 'Request Type',
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
          {formatNumberWithCommas(params.row.total_amount)}
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
      flex: 0.3,
      minWidth: 110,
      field: 'paymentDate',
      headerName: 'Payment Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.payment_date ? dayjs(params.row.payment_date).format('MMMM DD, YYYY hh:mm A') : ''}
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
      field: 'requestType',
      headerName: 'Request Type',
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
          {formatNumberWithCommas(params.row.total_amount)}
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
      flex: 0.3,
      minWidth: 110,
      field: 'paymentDate',
      headerName: 'Payment Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.payment_date ? dayjs(params.row.payment_date).format('MMMM DD, YYYY hh:mm A') : ''}
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
      {sa?.role === 'Scheduling' ? (
        <>
          <Grid item sm={12} xs={12}>
            <Card>
              <CardHeader title='Submitted Transactions' />
              <DataGrid
                autoHeight
                columns={submittedColumns}
                rows={submittedRows}
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
          <Grid item sm={12} xs={12}>
            <Card>
              <CardHeader title='Scheduled Transactions' />
              <DataGrid
                autoHeight
                columns={scheduledColumns}
                rows={scheduledRows}
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
        </>
      ) : sa?.role === 'Releasing' ? (
        <>
          <Grid item sm={12} xs={12}>
            <Card>
              <CardHeader title='Ready to Claim Transactions' />
              <DataGrid
                autoHeight
                columns={readyColumns}
                rows={readyRows}
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
          <Grid item sm={12} xs={12}>
            <Card>
              <CardHeader title='Claimed Transactions' />
              <DataGrid
                autoHeight
                columns={claimedColumns}
                rows={claimedRows}
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
        </>
      ) : null}
    </Grid>
  )
}

SATransactions.acl = {
  action: 'read',
  subject: 'sa-transactions-page'
}

export default SATransactions
