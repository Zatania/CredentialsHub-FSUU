// ** React Imports
import { ChangeEvent, Ref, useState, forwardRef, ReactElement, useEffect, SetStateAction } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarExport } from '@mui/x-data-grid'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Hooks Imports
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

//** For Date/Time Picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})
interface DataGridRowType {
  id: number
  user_id: number
  staff_id: number
  dateFilled: string
  transcriptCopies: number
  transcriptSchedule: string
  dismissalCopies: number
  dismissalSchedule: string
  moralCharacterCopies: number
  moralCharacterSchedule: string
  diplomaCopies: number
  diplomaSchedule: string
  authenticationCopies: number
  authenticationSchedule: string
  courseDescriptionCopies: number
  courseDescriptionSchedule: string
  certificationType: string
  certificationCopies: number
  certificationSchedule: string
  cavRedRibbonCopies: number
  cavRedRibbonSchedule: string
  totalAmount: number
  purpose: string
  status: string
}

interface Student {
  id: number
  username: string
  password: string
  studentNumber: string
  firstName: string
  middleName: string
  lastName: string
  department: string
  course: string
  major: string
  graduateCheck: string
  graduationDate: string
  academicHonor: string
  yearLevel: string
  schoolYear: string
  semester: string
  homeAddress: string
  contactNumber: string
  emailAddress: string
  birthDate: string
  birthPlace: string
  religion: string
  citizenship: string
  sex: string
  fatherName: string
  motherName: string
  guardianName: string
  elementary: string
  elementaryGraduated: string
  secondary: string
  secondaryGraduated: string
  juniorHigh: string
  juniorHighGraduated: string
  seniorHigh: string
  seniorHighGraduated: string
  tertiary: string
  tertiaryGraduated: string
  employedAt: string
  position: string
}

interface TransactionHistory {
  id: number
  transaction_id: number
  user_id: number
  staff_id: number
  action: string
  date: string
}
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

const escapeRegExp = (value: string) => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const DashboardAdmin = () => {
  // ** States
  const [data, setData] = useState<DataGridRowType[]>([])
  const [dailyData, setDailyData] = useState<TransactionHistory[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<DataGridRowType | null>(null)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<DataGridRowType[]>([])
  const [selectedUser, setSelectedUser] = useState<Student | null>(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [show, setShow] = useState<boolean>(false)
  const { data: session } = useSession()
  const staffID = session?.user?.id || null

  const {
    control,
    reset,
    formState: { errors }
  } = useForm<DataGridRowType>({
    mode: 'onBlur'
  })

  const handleClose = () => {
    setShow(false)
  }

  const fetchUser = async (userID: any) => {
    try {
      const res = await fetch('/api/profile/student/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userID)
      })
      const data = await res.json()
      setSelectedUser(data)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }
  const handleViewDetails = async (row: SetStateAction<DataGridRowType | null>) => {
    setSelectedTransaction(row)

    if (row?.user_id) {
      await fetchUser(row?.user_id)
    }

    reset()
    setShow(true)
  }

  const fetchTransactions = async (staffID: number | null) => {
    try {
      const response = await fetch(`/api/transactions/staff-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ staff_id: staffID })
      })
      const transactionList = await response.json()
      setData(transactionList) // Assuming the API response is an array of transactions
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const fetchDailyTransactions = async () => {
    try {
      const response = await fetch('/api/admin/staff/daily-history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const transactionList = await response.json()
      console.log('Daily History', transactionList)
      setDailyData(transactionList)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }
  useEffect(() => {
    fetchTransactions(staffID)
    fetchDailyTransactions()
  }, [staffID])

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = data.filter(row => {
      return Object.keys(row).some(field => {
        // @ts-ignore
        return searchRegex.test(row[field].toString())
      })
    })
    if (searchValue.length) {
      setFilteredData(filteredRows)
    } else {
      setFilteredData([])
    }
  }

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      type: 'id',
      minWidth: 50,
      headerName: 'ID',
      field: 'id',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      flex: 0.2,
      type: 'date',
      minWidth: 120,
      headerName: 'Date',
      field: 'dateFilled',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.dateFilled).format('MM/DD/YYYY')}
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
          {params.row.totalAmount}
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
      flex: 0.2,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Button variant='contained' onClick={() => handleViewDetails(params.row)}>
              View
            </Button>

            {/* Dialog */}
            <Dialog
              fullWidth
              open={show}
              maxWidth='md'
              scroll='body'
              onClose={handleClose}
              TransitionComponent={Transition}
              onBackdropClick={handleClose}
            >
              <DialogContent
                sx={{
                  position: 'relative',
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                <IconButton
                  size='small'
                  onClick={handleClose}
                  sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                >
                  <Icon icon='mdi:close' />
                </IconButton>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                  <Typography variant='h5' sx={{ mb: 3 }}>
                    Request Credentials
                  </Typography>
                  <Typography variant='body2'>
                    Only fill the number of copies of the credentials yoou wanted to request.
                  </Typography>
                </Box>
                <Grid container spacing={6}>
                  <>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body2' sx={{ textAlign: 'center' }}>
                        Student Information
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        value={selectedUser?.studentNumber}
                        fullWidth
                        label='Student Number'
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        value={selectedUser?.firstName + ' ' + selectedUser?.lastName}
                        fullWidth
                        label='Full Name'
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        value={selectedUser?.department}
                        fullWidth
                        label='Department'
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        value={selectedUser?.contactNumber}
                        fullWidth
                        label='Contact Number'
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        value={selectedUser?.emailAddress}
                        fullWidth
                        label='Email Address'
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        value={selectedUser?.homeAddress}
                        fullWidth
                        label='Home Address'
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                    {selectedTransaction?.transcriptCopies !== 0 ? (
                      <>
                        <Grid item sm={12} xs={12}>
                          <Typography variant='body2' sx={{ textAlign: 'center' }}>
                            Transcript of Records
                          </Typography>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <Controller
                            name='transcriptCopies'
                            control={control}
                            defaultValue={selectedTransaction?.transcriptCopies || 0}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Number of Copy'
                                error={!!errors.transcriptCopies}
                                helperText={errors.transcriptCopies?.message}
                                InputProps={{
                                  readOnly: true
                                }}
                              />
                            )}
                          />
                        </Grid>
                        {['Scheduled', 'Claimed'].includes(selectedTransaction?.status) ? (
                          <Grid item xs={6}>
                            <TextField
                              value={dayjs(selectedTransaction?.transcriptSchedule).format('MM/DD/YYYY')}
                              fullWidth
                              label='Schedule'
                              InputProps={{
                                readOnly: true
                              }}
                            />
                          </Grid>
                        ) : (
                          <Grid item sm={6} xs={12}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                              <Controller
                                name='transcriptSchedule'
                                control={control}
                                value={selectedTransaction?.transcriptSchedule || ''}
                                render={({ field }) => <DatePicker label='Schedule' {...field} />}
                              />
                            </FormControl>
                          </Grid>
                        )}
                      </>
                    ) : null}
                    {selectedTransaction?.dismissalCopies !== 0 ? (
                      <>
                        <Grid item sm={12} xs={12}>
                          <Typography variant='body2' sx={{ textAlign: 'center' }}>
                            Honorable Dismissal
                          </Typography>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <Controller
                            name='dismissalCopies'
                            control={control}
                            defaultValue={selectedTransaction?.dismissalCopies || 0}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Number of Copy'
                                error={!!errors.dismissalCopies}
                                helperText={errors.dismissalCopies?.message}
                                InputProps={{
                                  readOnly: true
                                }}
                              />
                            )}
                          />
                        </Grid>
                        {['Scheduled', 'Claimed'].includes(selectedTransaction?.status) ? (
                          <Grid item xs={6}>
                            <TextField
                              value={dayjs(selectedTransaction?.dismissalSchedule).format('MM/DD/YYYY')}
                              fullWidth
                              label='Schedule'
                              InputProps={{
                                readOnly: true
                              }}
                            />
                          </Grid>
                        ) : (
                          <Grid item sm={6} xs={12}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                              <Controller
                                name='dismissalSchedule'
                                control={control}
                                render={({ field }) => <DatePicker label='Schedule' {...field} />}
                              />
                            </FormControl>
                          </Grid>
                        )}
                      </>
                    ) : null}
                    {selectedTransaction?.moralCharacterCopies !== 0 ? (
                      <>
                        <Grid item sm={12} xs={12}>
                          <Typography variant='body2' sx={{ textAlign: 'center' }}>
                            Good Moral Character
                          </Typography>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <Controller
                            name='moralCharacterCopies'
                            control={control}
                            defaultValue={selectedTransaction?.moralCharacterCopies || 0}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Number of Copy'
                                error={!!errors.moralCharacterCopies}
                                helperText={errors.moralCharacterCopies?.message}
                                InputProps={{
                                  readOnly: true
                                }}
                              />
                            )}
                          />
                        </Grid>
                        {['Scheduled', 'Claimed'].includes(selectedTransaction?.status) ? (
                          <Grid item xs={6}>
                            <TextField
                              value={dayjs(selectedTransaction?.moralCharacterSchedule).format('MM/DD/YYYY')}
                              fullWidth
                              label='Schedule'
                              InputProps={{
                                readOnly: true
                              }}
                            />
                          </Grid>
                        ) : (
                          <Grid item sm={6} xs={12}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                              <Controller
                                name='moralCharacterSchedule'
                                control={control}
                                render={({ field }) => <DatePicker label='Schedule' {...field} />}
                              />
                            </FormControl>
                          </Grid>
                        )}
                      </>
                    ) : null}
                    {selectedTransaction?.diplomaCopies !== 0 ? (
                      <>
                        <Grid item sm={12} xs={12}>
                          <Typography variant='body2' sx={{ textAlign: 'center' }}>
                            Diploma
                          </Typography>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <Controller
                            name='diplomaCopies'
                            control={control}
                            defaultValue={selectedTransaction?.diplomaCopies || 0}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Number of Copy'
                                error={!!errors.diplomaCopies}
                                helperText={errors.diplomaCopies?.message}
                                InputProps={{
                                  readOnly: true
                                }}
                              />
                            )}
                          />
                        </Grid>
                        {['Scheduled', 'Claimed'].includes(selectedTransaction?.status) ? (
                          <Grid item xs={6}>
                            <TextField
                              value={dayjs(selectedTransaction?.diplomaSchedule).format('MM/DD/YYYY')}
                              fullWidth
                              label='Schedule'
                              InputProps={{
                                readOnly: true
                              }}
                            />
                          </Grid>
                        ) : (
                          <Grid item sm={6} xs={12}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                              <Controller
                                name='diplomaSchedule'
                                control={control}
                                render={({ field }) => <DatePicker label='Schedule' {...field} />}
                              />
                            </FormControl>
                          </Grid>
                        )}
                      </>
                    ) : null}
                    {selectedTransaction?.authenticationCopies !== 0 ? (
                      <>
                        <Grid item sm={12} xs={12}>
                          <Typography variant='body2' sx={{ textAlign: 'center' }}>
                            Authentication
                          </Typography>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <Controller
                            name='authenticationCopies'
                            control={control}
                            defaultValue={selectedTransaction?.authenticationCopies || 0}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Number of Copy'
                                error={!!errors.authenticationCopies}
                                helperText={errors.authenticationCopies?.message}
                                InputProps={{
                                  readOnly: true
                                }}
                              />
                            )}
                          />
                        </Grid>
                        {['Scheduled', 'Claimed'].includes(selectedTransaction?.status) ? (
                          <Grid item xs={6}>
                            <TextField
                              value={dayjs(selectedTransaction?.authenticationSchedule).format('MM/DD/YYYY')}
                              fullWidth
                              label='Schedule'
                              InputProps={{
                                readOnly: true
                              }}
                            />
                          </Grid>
                        ) : (
                          <Grid item sm={6} xs={12}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                              <Controller
                                name='authenticationSchedule'
                                control={control}
                                render={({ field }) => <DatePicker label='Schedule' {...field} />}
                              />
                            </FormControl>
                          </Grid>
                        )}
                      </>
                    ) : null}
                    {selectedTransaction?.courseDescriptionCopies !== 0 ? (
                      <>
                        <Grid item sm={12} xs={12}>
                          <Typography variant='body2' sx={{ textAlign: 'center' }}>
                            Course Description / Outline
                          </Typography>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <Controller
                            name='courseDescriptionCopies'
                            control={control}
                            defaultValue={selectedTransaction?.courseDescriptionCopies || 0}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Number of Copy'
                                error={!!errors.courseDescriptionCopies}
                                helperText={errors.courseDescriptionCopies?.message}
                                InputProps={{
                                  readOnly: true
                                }}
                              />
                            )}
                          />
                        </Grid>
                        {['Scheduled', 'Claimed'].includes(selectedTransaction?.status) ? (
                          <Grid item xs={6}>
                            <TextField
                              value={dayjs(selectedTransaction?.courseDescriptionSchedule).format('MM/DD/YYYY')}
                              fullWidth
                              label='Schedule'
                              InputProps={{
                                readOnly: true
                              }}
                            />
                          </Grid>
                        ) : (
                          <Grid item sm={6} xs={12}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                              <Controller
                                name='courseDescriptionSchedule'
                                control={control}
                                render={({ field }) => <DatePicker label='Schedule' {...field} />}
                              />
                            </FormControl>
                          </Grid>
                        )}
                      </>
                    ) : null}
                    {selectedTransaction?.certificationCopies !== 0 ? (
                      <>
                        <Grid item sm={12} xs={12}>
                          <Typography variant='body2' sx={{ textAlign: 'center' }}>
                            Certification
                          </Typography>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                          <Controller
                            name='certificationType'
                            control={control}
                            defaultValue={selectedTransaction?.certificationType || ''}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Type of Certification'
                                error={!!errors.certificationType}
                                helperText={errors.certificationType?.message}
                                InputProps={{
                                  readOnly: true
                                }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item sm={4} xs={12}>
                          <Controller
                            name='certificationCopies'
                            control={control}
                            defaultValue={selectedTransaction?.certificationCopies || 0}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Number of Copy'
                                error={!!errors.certificationCopies}
                                helperText={errors.certificationCopies?.message}
                                InputProps={{
                                  readOnly: true
                                }}
                              />
                            )}
                          />
                        </Grid>
                        {['Scheduled', 'Claimed'].includes(selectedTransaction?.status) ? (
                          <Grid item xs={6}>
                            <TextField
                              value={dayjs(selectedTransaction?.certificationSchedule).format('MM/DD/YYYY')}
                              fullWidth
                              label='Schedule'
                              InputProps={{
                                readOnly: true
                              }}
                            />
                          </Grid>
                        ) : (
                          <Grid item sm={4} xs={12}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                              <Controller
                                name='certificationSchedule'
                                control={control}
                                render={({ field }) => <DatePicker label='Schedule' {...field} />}
                              />
                            </FormControl>
                          </Grid>
                        )}
                      </>
                    ) : null}
                    {selectedTransaction?.cavRedRibbonCopies !== 0 ? (
                      <>
                        <Grid item sm={12} xs={12}>
                          <Typography variant='body2' sx={{ textAlign: 'center' }}>
                            CAV / Red Ribbon
                          </Typography>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <Controller
                            name='cavRedRibbonCopies'
                            control={control}
                            defaultValue={selectedTransaction?.cavRedRibbonCopies || 0}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Number of Copy'
                                error={!!errors.cavRedRibbonCopies}
                                helperText={errors.cavRedRibbonCopies?.message}
                                InputProps={{
                                  readOnly: true
                                }}
                              />
                            )}
                          />
                        </Grid>
                        {['Scheduled', 'Claimed'].includes(selectedTransaction?.status) ? (
                          <Grid item xs={6}>
                            <TextField
                              value={dayjs(selectedTransaction?.cavRedRibbonSchedule).format('MM/DD/YYYY')}
                              fullWidth
                              label='Schedule'
                              InputProps={{
                                readOnly: true
                              }}
                            />
                          </Grid>
                        ) : (
                          <Grid item sm={6} xs={12}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                              <Controller
                                name='cavRedRibbonSchedule'
                                control={control}
                                render={({ field }) => <DatePicker label='Schedule' {...field} />}
                              />
                            </FormControl>
                          </Grid>
                        )}
                      </>
                    ) : null}
                    <Grid item sm={12} xs={12}>
                      <Divider sx={{ mb: '0 !important' }} />
                    </Grid>
                    {selectedTransaction?.purpose !== '' ? (
                      <Grid item sm={12} xs={12}>
                        <Controller
                          name='purpose'
                          control={control}
                          defaultValue={selectedTransaction?.purpose || ''}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='Purpose of Request'
                              error={!!errors.purpose}
                              helperText={errors.purpose?.message}
                              InputProps={{
                                readOnly: true
                              }}
                            />
                          )}
                        />
                      </Grid>
                    ) : null}
                  </>
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  justifyContent: 'center',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                <Button variant='outlined' color='secondary' onClick={handleClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )
      }
    }
  ]

  const staffColumns: GridColDef[] = [
    {
      flex: 0.1,
      type: 'id',
      minWidth: 50,
      headerName: 'ID',
      field: 'id',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      flex: 0.2,
      type: 'date',
      minWidth: 120,
      headerName: 'Date',
      field: 'date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.date).format('MM/DD/YYYY')}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'student',
      headerName: 'Student',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.user.firstname}
        </Typography>
      )
    }
  ]

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card>
        <CardHeader title='Staffs Daily Request Count' />
        <DataGrid
          autoHeight
          columns={staffColumns}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={paginationModel}
          slots={{ toolbar: QuickSearchToolbar }}
          onPaginationModelChange={setPaginationModel}
          rows={filteredData.length ? filteredData : dailyData}
          slotProps={{
            baseButton: {
              variant: 'outlined'
            },
            toolbar: {
              value: searchText,
              clearSearch: () => handleSearch(''),
              onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
            }
          }}
        />
      </Card>
      <Card>
        <CardHeader title='Staffs Monthly Request Count' />
        <DataGrid
          autoHeight
          columns={staffColumns}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={paginationModel}
          slots={{ toolbar: QuickSearchToolbar }}
          onPaginationModelChange={setPaginationModel}
          rows={filteredData.length ? filteredData : data}
          slotProps={{
            baseButton: {
              variant: 'outlined'
            },
            toolbar: {
              value: searchText,
              clearSearch: () => handleSearch(''),
              onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
            }
          }}
        />
      </Card>
      <Card>
        <CardHeader title='Transactions' />
        <DataGrid
          autoHeight
          columns={columns}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={paginationModel}
          slots={{ toolbar: QuickSearchToolbar }}
          onPaginationModelChange={setPaginationModel}
          rows={filteredData.length ? filteredData : data}
          slotProps={{
            baseButton: {
              variant: 'outlined'
            },
            toolbar: {
              value: searchText,
              clearSearch: () => handleSearch(''),
              onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
            }
          }}
        />
      </Card>
    </LocalizationProvider>
  )
}

DashboardAdmin.acl = {
  action: 'read',
  subject: 'admin-page'
}

export default DashboardAdmin
