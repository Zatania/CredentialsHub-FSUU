// ** React Imports
import { useCallback, useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Views Imports
import ActivityTimeline from 'src/views/pages/dashboard/ActivityTimeline'

// ** Third Party Imports
import axios from 'axios'

const LogsPage = () => {
  // ** States
  const [studentLogs, setStudentLogs] = useState<object[]>([])
  const [staffLogs, setStaffLogs] = useState<object[]>([])
  const [adminLogs, setAdminLogs] = useState<object[]>([])
  const [saLogs, setSALogs] = useState<object[]>([])
  const [page, setPage] = useState(1)

  const fetchRoleLogs = useCallback(async (role: any, setter: (arg0: (prevLogs: any) => any[]) => void) => {
    const response = await axios.get(`/api/admin/logs/${role}?page=${page}&limit=5`)
    const newLogs = await response.data
    setter(prevLogs => [...prevLogs, ...newLogs])
  }, [page])

  useEffect(() => {
    fetchRoleLogs('student', setStudentLogs)
    fetchRoleLogs('staff', setStaffLogs)
    fetchRoleLogs('admin', setAdminLogs)
    fetchRoleLogs('student_assistant', setSALogs)
  }, [fetchRoleLogs])

  const loadMoreLogs = () => {
    setPage(prevPage => prevPage + 1)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12}>
        <ActivityTimeline logs={studentLogs} load={loadMoreLogs} title="Student Logs"/>
      </Grid>
      <Grid item xs={12} md={12}>
        <ActivityTimeline logs={staffLogs} load={loadMoreLogs} title="Staff Logs"/>
      </Grid>
      <Grid item xs={12} md={12}>
        <ActivityTimeline logs={saLogs} load={loadMoreLogs} title="Student Assistant Logs"/>
      </Grid>
      <Grid item xs={12} md={12}>
        <ActivityTimeline logs={adminLogs} load={loadMoreLogs} title="Admin Logs"/>
      </Grid>
    </Grid>
  )
}

LogsPage.acl = {
  action: 'read',
  subject: 'logs-page'
}

export default LogsPage
