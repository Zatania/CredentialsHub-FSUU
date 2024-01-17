// ** React Imports
import { Ref, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import toast from 'react-hot-toast'
import axios from 'axios'
import dayjs from 'dayjs'

// ** Next Imports
import { useSession } from 'next-auth/react'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface TransactionData {
  id: number
  user_id: number
  firstName: string
  lastName: string
  course: string
  major: string
  graduateCheck: string
  graduationDate: string
  yearLevel: string
  schoolYear: string
  semester: string
  total_amount: number
  transaction_date: string
  status: string
  image: string
  payment_date: string
  remarks: string
  schedule: string
  claim: string
  claimed_remarks: string
  reject: string
  rejected_remarks: string
  packages: PackageData[]
  individualCredentials: individualCredentialsData[]
}

interface PackageData {
  package: any
  id: number
  name: string
  description: string
  credentials: CredentialsData[]
}

interface individualCredentialsData {
  id: number
  name: string
  price: number
  quantity: number
  subtotal: number
}

interface CredentialsData {
  id: number
  name: string
  price: number
  quantity: number
}
interface DialogViewAdminTransactionsProps {
  transaction: TransactionData
  refreshData: () => void
}

const DialogViewAdminTransactions = ({ transaction, refreshData }: DialogViewAdminTransactionsProps) => {
  const [show, setShow] = useState<boolean>(false)
  const [scheduleDate, setScheduleDate] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [remarksError, setRemarksError] = useState('')
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File>()
  const [selectedDate, setSelectedDate] = useState<Date | null>()


  const { data: session } = useSession()
  const user = session?.user

  const handleClose = () => {
    setShow(false)
    setScheduleDate(null)
    setRemarks('')
    refreshData()
  }

  const validateRemarks = () => {
    let isValid = true
    if (!remarks.trim()) {
      setRemarksError('Remarks are required')
      isValid = false
    } else {
      setRemarksError('')
    }

    return isValid
  }
  const handleSchedule = async () => {
    if (!validateRemarks()) return

    try {
      await axios.put(`/api/admin/transactions/${transaction.id}/schedule`, {
        scheduleDate: scheduleDate,
        remarks: remarks,
        user: user
      })
      toast.success('Transaction Scheduled successfully.')
      handleClose()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleReject = async () => {
    if (!validateRemarks()) return
    try {
      await axios.put(`/api/admin/transactions/${transaction.id}/reject`, {
        rejected_remarks: remarks,
        user: user
      })
      toast.success('Transaction Rejected successfully.')
      handleClose()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleClaim = async () => {
    if (!validateRemarks()) return
    try {
      await axios.put(`/api/admin/transactions/${transaction.id}/claim`, {
        claimed_remarks: remarks,
        user: user
      })
      toast.success('Transaction Claimed successfully.')
      handleClose()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleImageUpload = async () => {
    try {
      if (!selectedFile) return

      const formData = new FormData()
      formData.append("myImage", selectedFile)

      const response = await axios.post("/api/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return(response.data.imagePath)
    } catch (error) {
      console.log(error)
      console.error(error)
    }
  }

  const handleUpload = async () => {
    let path = '';
    try {
      path = await handleImageUpload();
    } catch (error) {
      console.error('Failed to upload image:', error);
    }

    try {
      if (path && selectedDate) {
        await axios.put(`/api/admin/transactions/${transaction.id}/update`, {
          imagePath: path,
          payment_date: selectedDate,
          user: user
        })
      } else if (path && !selectedDate) {
        await axios.put(`/api/admin/transactions/${transaction.id}/update`, {
          imagePath: path,
          user: user
        })
      } else if (!path && selectedDate) {
        await axios.put(`/api/admin/transactions/${transaction.id}/update`, {
          payment_date: selectedDate,
          user: user
        })
      }

      toast.success('Transaction Updated successfully.')
      handleClose()
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card>
        <Button size='small' onClick={() => setShow(true)} variant='outlined'>
          View
        </Button>
        <Dialog
          fullWidth
          open={show}
          maxWidth='md'
          scroll='body'
          onClose={() => handleClose()}
          TransitionComponent={Transition}
          onBackdropClick={() => handleClose()}
        >
          <DialogContent
            sx={{
              position: 'relative',
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton
              size='small'
              onClick={handleClose}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>
            <Box sx={{ mb: 8}}>
              <Typography variant='h5' sx={{ mb: 3 }}>
                Transaction Details
              </Typography>
              {transaction.status === 'Submitted' && transaction.individualCredentials.length > 0 ? (
                <Typography variant='body1'>Individual Credential Requests can be edited.</Typography>
              ) : transaction.status === 'Submitted' && transaction.packages.length > 0 ? (
                <Typography variant='body1'>Package Requests can be deleted.</Typography>
              ) : null}
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                  Transaction ID:
                </Typography>
                <Typography variant='body1'>{transaction.id}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                  Transaction Date:
                </Typography>
                <Typography variant='body1'>{dayjs(transaction.transaction_date).format('MMMM DD, YYYY HH:mm:ss A')}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                  Total Amount:
                </Typography>
                <Typography variant='body1'>{transaction.total_amount}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                  Request Type:
                </Typography>
                <Typography variant='body1'>
                  {
                    (transaction.packages.length > 0) ? (
                      'Package'
                    ) : transaction.individualCredentials.length > 0 ? (
                      'Individual Credential/s'
                    ) : null
                  }
                </Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                  First Name:
                </Typography>
                <Typography variant='body1'>{transaction.firstName}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                  Last Name:
                </Typography>
                <Typography variant='body1'>{transaction.lastName}</Typography>
              </Grid>
              {transaction.course && transaction.major ? (
                <>
                  <Grid item sm={6} xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                      Course:
                    </Typography>
                    <Typography variant='body1'>{transaction.course}</Typography>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                      Major:
                    </Typography>
                    <Typography variant='body1'>{transaction.major}</Typography>
                  </Grid>
                </>
              ) : (
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Course:
                  </Typography>
                  <Typography variant='body1'>{transaction.course}</Typography>
                </Grid>
              ) }
              {transaction.graduateCheck === 'yes' ? (
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Year Graduated:
                  </Typography>
                  <Typography variant='body1'>{transaction.graduationDate}</Typography>
                </Grid>
              ) : transaction.graduateCheck === 'no' ? (
                <Grid item sm={12} xs={12}>
                  <Grid container spacing={6}>
                    <Grid item sm={4} xs={12}>
                      <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                        Year Level:
                      </Typography>
                      <Typography variant='body1'>{transaction.yearLevel}</Typography>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                        School Year:
                      </Typography>
                      <Typography variant='body1'>{transaction.schoolYear}</Typography>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                        Semester:
                      </Typography>
                      <Typography variant='body1'>{transaction.semester}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}
              {(transaction.packages.length > 0) ? (
                <>
                  <Grid item sm={12} xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                      Details:
                    </Typography>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                      Package Name:
                    </Typography>
                    <Typography variant='body1'>{transaction.packages[0].package.name}</Typography>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                      Package Description:
                    </Typography>
                    <Typography variant='body1'>{transaction.packages[0].package.description}</Typography>
                  </Grid>
                  <Grid item sm={12} xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                      Package Credentials:
                    </Typography>
                    <Box sx={{ mb: 8}}>
                      <List sx={{ width: '50%', bgcolor: 'background.paper'}}>
                        {transaction.packages[0].package.credentials.map((credential, index) => (
                          <ListItem key={index} secondaryAction={
                            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                              {credential.quantity}
                            </Typography>
                          }>
                            <ListItemText primary={credential.name + '( Php ' + credential.price + ' )'} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                </>
              ) : transaction.individualCredentials.length > 0 ? (
                  <Grid item sm={12} xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                      Credentials:
                    </Typography>
                    <Box sx={{ mb: 8}}>
                      <List sx={{ width: '50%', bgcolor: 'background.paper'}}>
                        {transaction.individualCredentials.map((credential, index) => (
                          <ListItem key={index} secondaryAction={
                            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                              {credential.quantity}
                            </Typography>
                          }>
                            <ListItemText primary={credential.name + '( Php ' + credential.price + ' )'} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
              ) : null}
            {transaction.status === 'Submitted' ? (
              <>
                {transaction.image && transaction.payment_date ? (
                  <Grid container spacing={6}>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                        Proof of Payment
                      </Typography>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      {transaction.image ? (
                        <img src={`/api/images/${transaction.image}`} alt='Student Image' style={{ width: '80%', height: 'auto' }} />
                      ) : (
                        <Typography variant='body1'>No image attached</Typography>
                      )}
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      {transaction.payment_date ? (
                        <Typography variant='body1'>Payment Date: {dayjs(transaction.payment_date).format('MMMM DD, YYYY')}</Typography>
                      ) : (
                        <Typography variant='body1'>No Payment Date</Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Grid container spacing={6}>
                        <Grid item sm={12} xs={12}>
                          <DateTimePicker
                            label="Schedule Date"
                            value={scheduleDate}
                            onChange={(newValue) => setScheduleDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                          <TextField
                            label="Remarks"
                            margin="normal"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            error={!!remarksError}
                            helperText={remarksError}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : !transaction.image && !transaction.payment_date ? (
                  <>
                    <Grid item sm={12} xs={12}>
                      <Grid container spacing={6}>
                        <Grid item sm={12} xs={12}>
                          <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                            Upload Proof of Payment
                          </Typography>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                          <FormControl>
                            <Input
                              type="file"
                              id="image-upload"
                              style={{ display: "none" }}
                              onChange={({ target }) => {
                                if (target.files && target.files.length > 0) {
                                  const file = target.files[0]
                                  setSelectedImage(URL.createObjectURL(file))
                                  setSelectedFile(file)
                                }
                              }}
                            />
                            <Button
                              sx={{mb:10}}
                              variant="outlined"
                              component="label"
                              htmlFor="image-upload"
                              className="w-40 aspect-video rounded border-2 border-dashed cursor-pointer"
                            >
                              {selectedImage ? (
                                <img src={selectedImage} alt="" style={{ maxWidth: "100%" }} />
                              ) : (
                                "Select Image"
                              )}
                            </Button>
                          </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                          <FormControl sx={{ mb: 4 }}>
                            <DatePicker
                              label='Payment Date'
                              value={selectedDate}
                              onChange={(date) => setSelectedDate(date)}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                ) : transaction.image && !transaction.payment_date ? (

                  <>
                    <Grid item sm={12} xs={12}>
                      <Grid container spacing={6}>
                        <Grid item sm={12} xs={12}>
                          <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                            Proof of Payment
                          </Typography>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                          {transaction.image ? (
                            <img src={`/api/images/${transaction.image}`} alt='Student Image' style={{ width: '80%', height: 'auto' }} />
                          ) : (
                            <Typography variant='body1'>No image attached</Typography>
                          )}
                        </Grid>
                        <Grid item sm={12} xs={12}>
                          <FormControl sx={{ mb: 4 }}>
                            <DatePicker
                              label='Payment Date'
                              value={selectedDate}
                              onChange={(date) => setSelectedDate(date)}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                ) : !transaction.image && transaction.payment_date ? (
                  <>
                    <Grid item sm={12} xs={12}>
                      <Grid container spacing={6}>
                        <Grid item sm={12} xs={12}>
                          <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                            Upload Proof of Payment
                          </Typography>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                          <FormControl>
                            <Input
                              type="file"
                              id="image-upload"
                              style={{ display: "none" }}
                              onChange={({ target }) => {
                                if (target.files && target.files.length > 0) {
                                  const file = target.files[0]
                                  setSelectedImage(URL.createObjectURL(file))
                                  setSelectedFile(file)
                                }
                              }}
                            />
                            <Button
                              sx={{mb:10}}
                              variant="outlined"
                              component="label"
                              htmlFor="image-upload"
                              className="w-40 aspect-video rounded border-2 border-dashed cursor-pointer"
                            >
                              {selectedImage ? (
                                <img src={selectedImage} alt="" style={{ maxWidth: "100%" }} />
                              ) : (
                                "Select Image"
                              )}
                            </Button>
                          </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                          {transaction.payment_date ? (
                            <Typography variant='body1'>Payment Date: {dayjs(transaction.payment_date).format('MMMM DD, YYYY')}</Typography>
                          ) : (
                            <Typography variant='body1'>No Payment Date</Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                ) : null}
              </>
            ) : null }
            {transaction.status === 'Scheduled' ? (
              <>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Schedule:
                  </Typography>
                  <Typography variant='body1'>{dayjs(transaction.schedule).format('MMMM DD, YYYY')}</Typography>
                </Grid>
                <TextField
                  fullWidth
                  sx={{ mt: 5 }}
                  label="Remarks"
                  margin="normal"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  error={!!remarksError}
                  helperText={remarksError}
                />
              </>
            ) : null}
            {transaction.status === 'Claimed' ? (
              <>
                <Grid item xs={12} sm={12}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Proof of Payment
                  </Typography>
                  {transaction.image ? (
                    <img src={`/api/images/${transaction.image}`} alt='Student Image' style={{ width: '80%', height: 'auto' }} />
                  ) : (
                    <Typography variant='body1'>No image attached</Typography>
                  )}
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Claimed on:
                  </Typography>
                  <Typography variant='body1'>{dayjs(transaction.claim).format('MMMM DD, YYYY HH:mm:ss A')}</Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Remarks:
                  </Typography>
                  <Typography variant='body1'>{transaction.claimed_remarks}</Typography>
                </Grid>
              </>
            ) : null }
            {transaction.status === 'Rejected' ? (
              <>
                <Grid item xs={12} sm={12}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Proof of Payment
                  </Typography>
                  {transaction.image ? (
                    <img src={`/api/images/${transaction.image}`} alt='Student Image' style={{ width: '80%', height: 'auto' }} />
                  ) : (
                    <Typography variant='body1'>No image attached</Typography>
                  )}
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Rejected on:
                  </Typography>
                  <Typography variant='body1'>{dayjs(transaction.reject).format('MMMM DD, YYYY HH:mm:ss A')}</Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Remarks:
                  </Typography>
                  <Typography variant='body1'>{transaction.rejected_remarks}</Typography>
                </Grid>
              </>
            ) : null }
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: (theme) => theme.spacing(5),
              pb: (theme) => theme.spacing(8)
              }}
          >
            {transaction.status === 'Submitted' ? (
              <>
                {
                  transaction.image && transaction.payment_date ?
                    <Button variant='contained' color='primary' onClick={handleSchedule}>
                      Schedule
                    </Button>
                  :
                    <Button variant='contained' color='primary' onClick={handleUpload}>
                      Upload
                    </Button>
                }
                <Button variant='contained' color='error' onClick={handleReject}>
                  Reject
                </Button>
              </>
            ) : null}
            {transaction.status === 'Scheduled' ? (
              <>
                <Button variant='contained' color='primary' onClick={() => handleClaim()}>
                  Claim
                </Button>
              </>
            ) : null}
            <Button variant='outlined' color='secondary' onClick={() => handleClose()}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </LocalizationProvider>
  )
}

export default DialogViewAdminTransactions
