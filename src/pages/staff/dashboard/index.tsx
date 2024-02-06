// ** React Imports
import { useCallback, useState, useEffect, useRef } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Custome Components Import
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Views Imports
import ActivityTimeline from 'src/views/pages/dashboard/ActivityTimeline'

// ** Next Imports
import { useSession } from 'next-auth/react'

// ** Third Party Imports
import axios from 'axios'
import { ApexOptions } from 'apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import StaffCredentialsTable from 'src/views/tables/StaffCredentialsTable'

const DashboardStaff = () => {
  // ** States
  const [logs, setLogs] = useState<object[]>([])
  const [page, setPage] = useState(1)
  const [submittedDailyCount, setSubmittedDailyCount] = useState()
  const [scheduledDailyCount, setScheduledDailyCount] = useState()
  const [claimedDailyCount, setClaimedDailyCount] = useState()
  const [rejectedDailyCount, setRejectedDailyCount] = useState()
  const [submittedMonthlyCount, setSubmittedMonthlyCount] = useState()
  const [scheduledMonthlyCount, setScheduledMonthlyCount] = useState()
  const [claimedMonthlyCount, setClaimedMonthlyCount] = useState()
  const [rejectedMonthlyCount, setRejectedMonthlyCount] = useState()
  const [submittedYearlyCount, setSubmittedYearlyCount] = useState()
  const [scheduledYearlyCount, setScheduledYearlyCount] = useState()
  const [claimedYearlyCount, setClaimedYearlyCount] = useState()
  const [rejectedYearlyCount, setRejectedYearlyCount] = useState()
  const totalDailyCount = useRef(0)
  const totalMonthlyCount = useRef(0)
  const totalYearlyCount = useRef(0)
  const [submittedCount, setSubmittedCount] = useState()
  const [scheduledCount, setScheduledCount] = useState()
  const [claimedCount, setClaimedCount] = useState()
  const [rejectedCount, setRejectedCount] = useState()
  const totalTransactions = useRef(0)
  const [submittedMonthly, setSubmittedMonthly] = useState()
  const [scheduledMonthly, setScheduledMonthly] = useState()
  const [claimedMonthly, setClaimedMonthly] = useState()
  const [rejectedMonthly, setRejectedMonthly] = useState()
  const totalMonthly = useRef(0)

  // ** Hooks
  const theme = useTheme()
  const { data: session } = useSession()
  const staffID = session?.user?.id

  const fetchLogs = useCallback(async (page: number) => {
    const role = session?.user?.role
    const userId = session?.user?.id
    const response = await axios.get(`/api/logs/${role}?userId=${userId}&page=${page}&limit=5`)
    const newLogs = await response.data
    setLogs(prevLogs => [...prevLogs, ...newLogs])
  }, [session])

  const fetchCounts = useCallback(async () => {
    const userId = session?.user?.id
    const types = ['Submitted Transaction', 'Scheduled Transaction', 'Claimed Transaction', 'Rejected Transaction']

    for (const type of types) {
      const response = await axios.get(`/api/staff/transactions/count/logs/${type}?userId=${userId}`)

      // Set the count based on the type
      switch (type) {
        case 'Submitted Transaction':
          setSubmittedDailyCount(response.data.dailyCount)
          setSubmittedMonthlyCount(response.data.monthlyCount)
          setSubmittedYearlyCount(response.data.yearlyCount)
          break
        case 'Scheduled Transaction':
          setScheduledDailyCount(response.data.dailyCount)
          setScheduledMonthlyCount(response.data.monthlyCount)
          setScheduledYearlyCount(response.data.yearlyCount)
          break
        case 'Claimed Transaction':
          setClaimedDailyCount(response.data.dailyCount)
          setClaimedMonthlyCount(response.data.monthlyCount)
          setClaimedYearlyCount(response.data.yearlyCount)
          break
        case 'Rejected Transaction':
          setRejectedDailyCount(response.data.dailyCount)
          setRejectedMonthlyCount(response.data.monthlyCount)
          setRejectedYearlyCount(response.data.yearlyCount)
          break
        default:
          break
      }
    }

    totalDailyCount.current = (submittedDailyCount || 0) + (scheduledDailyCount || 0) + (claimedDailyCount || 0) + (rejectedDailyCount || 0)
    totalMonthlyCount.current = (submittedMonthlyCount || 0) + (scheduledMonthlyCount || 0) + (claimedMonthlyCount || 0) + (rejectedMonthlyCount || 0)
    totalYearlyCount.current = (submittedYearlyCount || 0) + (scheduledYearlyCount || 0) + (claimedYearlyCount || 0) + (rejectedYearlyCount || 0)
  }, [session, submittedDailyCount, scheduledDailyCount, claimedDailyCount, rejectedDailyCount, submittedMonthlyCount, scheduledMonthlyCount, claimedMonthlyCount, rejectedMonthlyCount, submittedYearlyCount, scheduledYearlyCount, claimedYearlyCount, rejectedYearlyCount])

  const fetchTransactionCounts = useCallback(async () => {
    const userId = session?.user?.id
    const types = ['Submitted', 'Scheduled', 'Claimed', 'Rejected']

    for (const type of types) {
      const response = await axios.get(`/api/staff/transactions/count/${type}?staffId=${userId}`)

      // Set the count based on the type
      switch (type) {
        case 'Submitted':
          setSubmittedCount(response.data.dailyCount)
          setSubmittedMonthly(response.data.monthlyCount)
          break
        case 'Scheduled':
          setScheduledCount(response.data.dailyCount)
          setScheduledMonthly(response.data.monthlyCount)
          break
        case 'Claimed':
          setClaimedCount(response.data.dailyCount)
          setClaimedMonthly(response.data.monthlyCount)
          break
        case 'Rejected':
          setRejectedCount(response.data.dailyCount)
          setRejectedMonthly(response.data.monthlyCount)
          break
        default:
          break
      }
    }
    totalTransactions.current = (submittedCount || 0) + (scheduledCount || 0) + (claimedCount || 0) + (rejectedCount || 0)
    totalMonthly.current = (submittedMonthly || 0) + (scheduledMonthly || 0) + (claimedMonthly || 0) + (rejectedMonthly || 0)
  }
  , [session, submittedCount, scheduledCount, claimedCount, rejectedCount, submittedMonthly, scheduledMonthly, claimedMonthly, rejectedMonthly])

  useEffect(() => {
    fetchCounts()
    fetchTransactionCounts()
  }, [fetchCounts, fetchTransactionCounts])

  useEffect(() => {
    fetchLogs(page)
  }, [page, fetchLogs])

  const loadMoreLogs = () => {
    setPage(prevPage => prevPage + 1)
  }

  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true }
    },
    colors: [
      theme.palette.primary.main,
      hexToRGBA(theme.palette.primary.main, 0.7),
      hexToRGBA(theme.palette.primary.main, 0.5),
      theme.palette.customColors.trackBg
    ],
    stroke: { width: 0 },
    legend: { show: false },
    dataLabels: { enabled: false },
    labels: ['Submitted Transaction', 'Scheduled Transaction', 'Claimed Transaction', 'Rejected Transaction'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      pie: {
        customScale: 0.9,
        donut: {
          size: '80%',
          labels: {
            show: true,
            name: {
              offsetY: 25,
              fontSize: '0.875rem',
              color: theme.palette.text.secondary
            },
            value: {
              offsetY: -15,
              fontWeight: 500,
              formatter: value => `${value}`,
              color: theme.palette.text.primary
            },
            total: {
              show: true,
              fontSize: '0.875rem',
              label: 'Transactions Done',
              color: theme.palette.text.secondary,
              formatter: value => `${value.globals.seriesTotals.reduce((total: number, num: number) => total + num)}`
            }
          }
        }
      }
    }
  }

  const transactionOptions: ApexOptions = {
    chart: {
      sparkline: { enabled: true }
    },
    colors: [
      theme.palette.primary.main,
      hexToRGBA(theme.palette.primary.main, 0.7),
      hexToRGBA(theme.palette.primary.main, 0.5),
      theme.palette.customColors.trackBg
    ],
    stroke: { width: 0 },
    legend: { show: false },
    dataLabels: { enabled: false },
    labels: ['Submitted Transactions', 'Scheduled Transactions', 'Claimed Transactions', 'Rejected Transactions'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      pie: {
        customScale: 0.9,
        donut: {
          size: '80%',
          labels: {
            show: true,
            name: {
              offsetY: 25,
              fontSize: '0.875rem',
              color: theme.palette.text.secondary
            },
            value: {
              offsetY: -15,
              fontWeight: 500,
              formatter: value => `${value}`,
              color: theme.palette.text.primary
            },
            total: {
              show: true,
              fontSize: '0.875rem',
              label: 'Transactions',
              color: theme.palette.text.secondary,
              formatter: value => `${value.globals.seriesTotals.reduce((total: number, num: number) => total + num)}`
            }
          }
        }
      }
    }
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title='Daily Activity Overview'
              titleTypographyProps={{
                sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
              }}
              action={
                <OptionsMenu
                  options={['Today', 'This Month', 'This Year']}
                  iconButtonProps={{ size: 'small', sx: { color: 'text.primary' } }}
                />
              }
            />
            <CardContent>
              <Grid container sx={{ my: [0, 4, 1.625] }}>
                <Grid item xs={12} sm={6} sx={{ mb: [3, 0] }}>
                <ReactApexcharts type='donut' height={220} series={[submittedDailyCount || 0, scheduledDailyCount || 0, claimedDailyCount || 0, rejectedDailyCount || 0]} options={options} />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ my: 'auto' }}>
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant='body2'>Total Transactions</Typography>
                      <Typography variant='h6'>{String(totalDailyCount.current)}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
                  <Grid container>
                    <Grid item xs={6} sx={{ mb: 4 }}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'primary.main' }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Submitted Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(submittedDailyCount)}</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ mb: 4 }}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.primary.main, 0.7) }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Scheduled Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(scheduledDailyCount)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.primary.main, 0.5) }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Claimed Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(claimedDailyCount)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'customColors.trackBg' }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Rejected Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(rejectedDailyCount)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title='Monthly Activity Overview'
              titleTypographyProps={{
                sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
              }}
              action={
                <OptionsMenu
                  options={['Today', 'This Month', 'This Year']}
                  iconButtonProps={{ size: 'small', sx: { color: 'text.primary' } }}
                />
              }
            />
            <CardContent>
              <Grid container sx={{ my: [0, 4, 1.625] }}>
                <Grid item xs={12} sm={6} sx={{ mb: [3, 0] }}>
                  <ReactApexcharts type='donut' height={220} series={[submittedMonthlyCount || 0, scheduledMonthlyCount || 0, claimedMonthlyCount || 0, rejectedMonthlyCount || 0]} options={options} />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ my: 'auto' }}>
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant='body2'>Total Transactions</Typography>
                      <Typography variant='h6'>{String(totalDailyCount.current)}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
                  <Grid container>
                    <Grid item xs={6} sx={{ mb: 4 }}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'primary.main' }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Submitted Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(submittedMonthlyCount)}</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ mb: 4 }}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.primary.main, 0.7) }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Scheduled Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(scheduledMonthlyCount)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.primary.main, 0.5) }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Claimed Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(claimedMonthlyCount)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'customColors.trackBg' }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Rejected Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(rejectedMonthlyCount)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title='Daily Transactions Overview'
              titleTypographyProps={{
                sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
              }}
              action={
                <OptionsMenu
                  options={['Today', 'This Month', 'This Year']}
                  iconButtonProps={{ size: 'small', sx: { color: 'text.primary' } }}
                />
              }
            />
            <CardContent>
              <Grid container sx={{ my: [0, 4, 1.625] }}>
                <Grid item xs={12} sm={6} sx={{ mb: [3, 0] }}>
                  <ReactApexcharts type='donut' height={220} series={[submittedCount || 0, scheduledCount || 0, claimedCount || 0, rejectedCount || 0]} options={transactionOptions} />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ my: 'auto' }}>
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant='body2'>Total Transactions</Typography>
                      <Typography variant='h6'>{String(totalTransactions.current)}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
                  <Grid container>
                    <Grid item xs={6} sx={{ mb: 4 }}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'primary.main' }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Submitted Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(submittedCount)}</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ mb: 4 }}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.primary.main, 0.7) }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Scheduled Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(scheduledCount)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.primary.main, 0.5) }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Claimed Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(claimedCount)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'customColors.trackBg' }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Rejected Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(rejectedCount)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title='Monthly Transactions Overview'
              titleTypographyProps={{
                sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
              }}
              action={
                <OptionsMenu
                  options={['Today', 'This Month', 'This Year']}
                  iconButtonProps={{ size: 'small', sx: { color: 'text.primary' } }}
                />
              }
            />
            <CardContent>
              <Grid container sx={{ my: [0, 4, 1.625] }}>
                <Grid item xs={12} sm={6} sx={{ mb: [3, 0] }}>
                  <ReactApexcharts type='donut' height={220} series={[submittedMonthly || 0, scheduledMonthly || 0, claimedMonthly || 0, rejectedMonthly || 0]} options={transactionOptions} />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ my: 'auto' }}>
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant='body2'>Total Transactions</Typography>
                      <Typography variant='h6'>{String(totalMonthly.current)}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
                  <Grid container>
                    <Grid item xs={6} sx={{ mb: 4 }}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'primary.main' }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Submitted Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(submittedMonthly)}</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ mb: 4 }}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.primary.main, 0.7) }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Scheduled Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(scheduledMonthly)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.primary.main, 0.5) }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Claimed Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(claimedMonthly)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'customColors.trackBg' }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>Rejected Transaction</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(rejectedMonthly)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader title='Overview' />

            <StaffCredentialsTable staff_id={staffID} />
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <ActivityTimeline logs={logs} load={loadMoreLogs} title='Activity Timeline'/>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

DashboardStaff.acl = {
  action: 'read',
  subject: 'staff-page'
}

export default DashboardStaff
