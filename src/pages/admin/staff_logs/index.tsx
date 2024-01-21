// ** React Imports
import { useCallback, useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

// ** Third Party Imports
import axios from 'axios'
import dayjs from 'dayjs'

interface StaffLog {
  id: number
  timestamp: string
  staff: string
  student: string
  department: string
  course: string
  schoolYear: string
  payment_date: string
  schedule_date: string
  date_released: string
  task_done: string
  credentials_requested: string
  remarks: string
}

interface GroupedStaffLogs {
  [key: string]: StaffLog[]
}

const StaffLogsPage = () => {
  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [staffLogs, setStaffLogs] = useState<StaffLog[]>([])

  // ** Get Staff Logs
  const fetchStaffLogs = useCallback(async () => {
    const response = await axios.get('/api/admin/staff_logs')
    setStaffLogs(response.data)
  }, [])

  // ** ComponentDidMount
  useEffect(() => {
    fetchStaffLogs()
  }, [fetchStaffLogs])

  const groupByStaff = (logs: StaffLog[]): GroupedStaffLogs => {

    return logs.reduce((acc, log) => {
      const { staff } = log
      acc[staff] = acc[staff] || []
      acc[staff].push(log)

      return acc
    }, {} as GroupedStaffLogs)
  }

  const groupedStaffLogs = groupByStaff(staffLogs)

  const staffLogsColumns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 250,
      field: 'timestamp',
      headerName: 'Transaction Date',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.timestamp ? dayjs(params.row.timestamp).format('MMMM DD, YYYY hh:mm A') : ''}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'staff',
      headerName: 'Staff Name',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.staff}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'student',
      headerName: 'Student',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.student}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'department',
      headerName: 'Department',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.department}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'course',
      headerName: 'Course',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.course}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'schoolYear',
      headerName: 'School Year',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.schoolYear}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 1000,
      field: 'credentials_requested',
      headerName: 'Credentials Requested',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.credentials_requested}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'payment_date',
      headerName: 'Payment Date',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.payment_date ? dayjs(params.row.payment_date).format('MMMM DD, YYYY hh:mm A') : ''}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'schedule_date',
      headerName: 'Schedule Date',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.schedule_date ? dayjs(params.row.schedule_date).format('MMMM DD, YYYY hh:mm A') : ''}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'task_done',
      headerName: 'Task Done',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.task_done ? dayjs(params.row.task_done).format('MMMM DD, YYYY hh:mm A') : 'Ongoing Process'}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'date_released',
      headerName: 'Task Released/Rejected',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.date_released ? dayjs(params.row.date_released).format('MMMM DD, YYYY hh:mm A') : 'Ongoing Process'}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'remarks',
      headerName: 'Remarks',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.remarks}
        </Typography>
      )
    },
  ]

  return (
    <Grid container spacing={6}>
      {Object.entries(groupedStaffLogs).map(([staffName, logs]) => (
        <Grid item sm={12} xs={12} key={staffName}>
          <Card>
            <CardHeader title={staffName} />
            <DataGrid
              autoHeight
              columns={staffLogsColumns}
              rows={logs}
              pageSizeOptions={[5, 10, 50, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              slots={{ toolbar: GridToolbar }}
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
      ))}
    </Grid>
  )
}

StaffLogsPage.acl = {
  action: 'read',
  subject: 'staff-logs-page'
}

export default StaffLogsPage
