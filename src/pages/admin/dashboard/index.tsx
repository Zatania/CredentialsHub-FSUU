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

// ** Third Party Imports
import axios from 'axios'
import { ApexOptions } from 'apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface Department {
  name: string
  id: number
}

interface TransactionCount {
  daily: number
  monthly: number
  yearly: number
}

interface DepartmentCount {
  id: number
  name: string
  submitted: TransactionCount
  scheduled: TransactionCount
  claimed: TransactionCount
  rejected: TransactionCount
  totalDaily?: number
  totalMonthly?: number
  totalYearly?: number
}

const DashboardAdmin = () => {
  // ** States
  const [departments, setDepartments] = useState<Department[]>([])
  const [departmentTransactionCounts, setDepartmentTransactionCounts] = useState<any[]>([])
  const [submittedDaily, setSubmittedDaily] = useState()
  const [scheduledDaily, setScheduledDaily] = useState()
  const [claimedDaily, setClaimedDaily] = useState()
  const [rejectedDaily, setRejectedDaily] = useState()
  const totalDaily = useRef(0)
  const [submittedMonthly, setSubmittedMonthly] = useState()
  const [scheduledMonthly, setScheduledMonthly] = useState()
  const [claimedMonthly, setClaimedMonthly] = useState()
  const [rejectedMonthly, setRejectedMonthly] = useState()
  const totalMonthly = useRef(0)

  // ** Hooks
  const theme = useTheme()

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get('/api/departments/list')
      const data = await response.data
      setDepartments(data)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }, [])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  const fetchDepartmentCounts = useCallback(async () => {
    const types = ['Submitted', 'Scheduled', 'Claimed', 'Rejected']

    // Initialize the state for storing the counts for each department
    const departmentCounts: DepartmentCount[] = departments.map(department => ({
      id: department.id,
      name: department.name,
      submitted: { daily: 0, monthly: 0, yearly: 0 },
      scheduled: { daily: 0, monthly: 0, yearly: 0 },
      claimed: { daily: 0, monthly: 0, yearly: 0 },
      rejected: { daily: 0, monthly: 0, yearly: 0 },
    }))

    for (const department of departments) {
      let totalDaily = 0
      let totalMonthly = 0
      let totalYearly = 0

      for (const type of types) {
        try {
          const id = department.id
          const response = await axios.get(`/api/admin/transaction/count/department/${id}?type=${type}`)
          const data = response.data
          const transactionType = type.toLowerCase();

          // Update the corresponding department's transaction counts
          const departmentIndex = departmentCounts.findIndex(dept => dept.id === department.id);
          if (departmentIndex !== -1) {
            const departmentCount = departmentCounts[departmentIndex];
            if (transactionType === 'submitted' || transactionType === 'scheduled' || transactionType === 'claimed' || transactionType === 'rejected') {
              departmentCount[transactionType].daily = data.dailyCount;
              departmentCount[transactionType].monthly = data.monthlyCount;
              departmentCount[transactionType].yearly = data.yearlyCount;
            }
          }

          totalDaily += data.dailyCount
          totalMonthly += data.monthlyCount
          totalYearly += data.yearlyCount
        } catch (error) {
          console.error(`Error fetching data for department ${department.name}: `, error)
        }

        const departmentIndex = departmentCounts.findIndex(dept => dept.id === department.id)
        if (departmentIndex !== -1) {
          departmentCounts[departmentIndex].totalDaily = totalDaily
          departmentCounts[departmentIndex].totalMonthly = totalMonthly
          departmentCounts[departmentIndex].totalYearly = totalYearly
        }
      }
    }

    // Update your state with the fetched data
    // Assuming you have a state variable to store this data
    setDepartmentTransactionCounts(departmentCounts)
  }, [departments])

  useEffect(() => {
    if (departments.length > 0) {
      fetchDepartmentCounts()
    }
  }, [fetchDepartmentCounts, departments])

  const departmentsTransactionsOptions: ApexOptions = {
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
    labels: departments.map(department => department.name),
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
        customScale: 1,
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

  const fetchTransactionCounts = useCallback(async () => {
    const types = ['Submitted', 'Scheduled', 'Claimed', 'Rejected']

    for (const type of types) {
      const response = await axios.get(`/api/admin/transaction/count?type=${type}`)

      // Set the count based on the type
      switch (type) {
        case 'Submitted':
          setSubmittedDaily(response.data.dailyCount)
          setSubmittedMonthly(response.data.monthlyCount)
          break
        case 'Scheduled':
          setScheduledDaily(response.data.dailyCount)
          setScheduledMonthly(response.data.monthlyCount)
          break
        case 'Claimed':
          setClaimedDaily(response.data.dailyCount)
          setClaimedMonthly(response.data.monthlyCount)
          break
        case 'Rejected':
          setRejectedDaily(response.data.dailyCount)
          setRejectedMonthly(response.data.monthlyCount)
          break
        default:
          break
      }
    }
    totalDaily.current = (submittedDaily || 0) + (scheduledDaily || 0) + (claimedDaily || 0) + (rejectedDaily || 0)
    totalMonthly.current = (submittedMonthly || 0) + (scheduledMonthly || 0) + (claimedMonthly || 0) + (rejectedMonthly || 0)
  }
  , [submittedDaily, scheduledDaily, claimedDaily, rejectedDaily, submittedMonthly, scheduledMonthly, claimedMonthly, rejectedMonthly])

  useEffect(() => {
    fetchTransactionCounts()
  }, [fetchTransactionCounts])

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
                  <ReactApexcharts type='donut' height={220} series={[submittedDaily || 0, scheduledDaily || 0, claimedDaily || 0, rejectedDaily || 0]} options={transactionOptions} />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ my: 'auto' }}>
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant='body2'>Total Transactions</Typography>
                      <Typography variant='h6'>{String(totalDaily.current)}</Typography>
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
                        <Typography variant='body2'>Submitted Transactions</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(submittedDaily)}</Typography>
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
                        <Typography variant='body2'>Scheduled Transactions</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(scheduledDaily)}</Typography>
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
                        <Typography variant='body2'>Claimed Transactions</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(claimedDaily)}</Typography>
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
                        <Typography variant='body2'>Rejected Transactions</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(rejectedDaily)}</Typography>
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
                        <Typography variant='body2'>Submitted Transactions</Typography>
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
                        <Typography variant='body2'>Scheduled Transactions</Typography>
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
                        <Typography variant='body2'>Claimed Transactions</Typography>
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
                        <Typography variant='body2'>Rejected Transactions</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{String(rejectedMonthly)}</Typography>
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
              title='Daily Departments Overview'
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
                <ReactApexcharts
                  type='donut'
                  height={220}
                  series={departmentTransactionCounts.map(dept => dept.totalDaily)}
                  options={departmentsTransactionsOptions}
                />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ my: 'auto' }}>
                  {departmentTransactionCounts.map(dept => (
                    <Grid container key={dept.id}>
                      <Grid item xs={12} sx={{ mb: 4 }}>
                        <Box
                          sx={{
                            mb: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'primary.main' }
                          }}
                        >
                          <Icon icon='mdi:circle' />
                          <Typography variant='body2'>{dept.name}</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 600 }}>{String(dept.totalDaily)}</Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title='Monthly Departments Overview'
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
                <ReactApexcharts
                  type='donut'
                  height={220}
                  series={departmentTransactionCounts.map(dept => dept.totalMonthly)}
                  options={departmentsTransactionsOptions}
                />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ my: 'auto' }}>
                  {departmentTransactionCounts.map(dept => (
                    <Grid container key={dept.id}>
                      <Grid item xs={12} sx={{ mb: 4 }}>
                        <Box
                          sx={{
                            mb: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'primary.main' }
                          }}
                        >
                          <Icon icon='mdi:circle' />
                          <Typography variant='body2'>{dept.name}</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 600 }}>{String(dept.totalMonthly)}</Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

DashboardAdmin.acl = {
  action: 'read',
  subject: 'admin-page'
}

export default DashboardAdmin
