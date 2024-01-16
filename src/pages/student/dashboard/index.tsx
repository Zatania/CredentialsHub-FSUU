// ** React Imports
import { useCallback, useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Custome Components Import
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Views Imports
import ActivityTimeline from 'src/views/pages/dashboard/ActivityTimeline'

// ** Next Imports
import { useSession } from 'next-auth/react'

// ** Third Party Imports
import axios from 'axios'

const DashboardStudent = () => {
  // ** States
  const [logs, setLogs] = useState<object[]>([])
  const [page, setPage] = useState(1)
  const [submittedCount, setSubmittedCount] = useState({ })
  const [scheduledCount, setScheduledCount] = useState({ })
  const [claimedCount, setClaimedCount] = useState({ })
  const [rejectedCount, setRejectedCount] = useState({ })
  const { data: session } = useSession()

  const fetchLogs = useCallback(async (page: number) => {
    const role = session?.user?.role
    const userId = session?.user?.id
    const response = await axios.get(`/api/logs/${role}?userId=${userId}&page=${page}&limit=5`)
    const newLogs = await response.data
    setLogs(prevLogs => [...prevLogs, ...newLogs])
  }, [session])

  const fetchCounts = useCallback(async () => {
    const userId = session?.user?.id
    const types = ['submitted', 'scheduled', 'claimed', 'rejected']

    for (const type of types) {
      const response = await axios.get(`/api/student/transactions/count/${type}?userId=${userId}`)

      // Set the count based on the type
      switch (type) {
        case 'submitted':
          setSubmittedCount(response.data)
          break
        case 'scheduled':
          setScheduledCount(response.data)
          break
        case 'claimed':
          setClaimedCount(response.data);
          break;
        case 'rejected':
          setRejectedCount(response.data);
          break;
        default:
          break;
      }
    }
  }, [session])

  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  useEffect(() => {
    fetchLogs(page)
  }, [page, fetchLogs])

  const loadMoreLogs = () => {
    setPage(prevPage => prevPage + 1)
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={3}>
          <CardStatisticsVerticalComponent
            stats={String(submittedCount)}
            trend={undefined}
            trendNumber=''
            title='Submitted Transactions'
            subtitle=''
            icon={<Icon icon='mdi:briefcase-variant-outline' />}
            optionsMenuProps={{ options: ['Refresh'] }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <CardStatisticsVerticalComponent
            stats={String(scheduledCount)}
            trend={undefined}
            trendNumber=''
            title='Scheduled Transactions'
            subtitle=''
            icon={<Icon icon='mdi:briefcase-variant-outline' />}
            optionsMenuProps={{ options: ['Refresh'] }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <CardStatisticsVerticalComponent
            stats={String(claimedCount)}
            trend={undefined}
            trendNumber=''
            title='Claimed Transactions'
            subtitle=''
            icon={<Icon icon='mdi:briefcase-variant-outline' />}
            optionsMenuProps={{ options: ['Refresh'] }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <CardStatisticsVerticalComponent
            stats={String(rejectedCount)}
            trend={undefined}
            trendNumber=''
            title='Rejected Transactions'
            subtitle=''
            icon={<Icon icon='mdi:briefcase-variant-outline' />}
            optionsMenuProps={{ options: ['Refresh'] }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <ActivityTimeline logs={logs} load={loadMoreLogs}/>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

DashboardStudent.acl = {
  action: 'read',
  subject: 'student-page'
}

export default DashboardStudent
