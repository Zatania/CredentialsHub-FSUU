// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

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
import ListSubheader from '@mui/material/ListSubheader'
import Checkbox from '@mui/material/Checkbox'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'

//** For Date/Time Picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import toast from 'react-hot-toast'
import axios from 'axios'
import dayjs from 'dayjs'

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
interface DialogViewTransactionProps {
  transaction: TransactionData
  refreshData: () => void
}

const DialogViewTransaction = ({ transaction, refreshData }: DialogViewTransactionProps) => {
  const [show, setShow] = useState<boolean>(false)
  const [selectedCredentials, setSelectedCredentials] = useState<CredentialsData[]>([])
  const [editing, setEditing] = useState<boolean>(false)
  const [originalTotalAmount, setOriginalTotalAmount] = useState<number>(transaction.total_amount)
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File>()
  const [selectedDate, setSelectedDate] = useState<Date | null>()

  const { data: session } = useSession()
  const user = session?.user

  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ', ');
  }

  useEffect(() => {
    // Initialize selectedCredentials based on the credentials with quantity > 0
    const initialSelectedCredentials = transaction.individualCredentials.filter((credential) => credential.quantity > 0)
    setSelectedCredentials(initialSelectedCredentials)
  }, [transaction])

  useEffect(() => {
    // Update the total amount based on the selected credentials
    const newTotalAmount = selectedCredentials.reduce((total, credential) => {
      return total + credential.quantity * credential.price
    }, 0)
    setOriginalTotalAmount(newTotalAmount)
  }, [selectedCredentials])

  useEffect(() => {
    // Reset selectedCredentials only when editing mode is canceled and dialog is closed
    if (!show && !editing) {
      setSelectedCredentials(
        transaction.individualCredentials.filter((credential) => credential.quantity > 0)
      )
    }
  }, [show, editing, transaction])

  useEffect(() => {
    // Reset the editing state when the dialog is closed
    if (!show) {
      setEditing(false)
    }
  }, [show])

  const handleCancelEdit = () => {
    // If editing is canceled, reset the selectedCredentials to their
    // original quantities and set editing to false.
    setSelectedCredentials(
      selectedCredentials.map((c) => ({
        ...c,
        quantity: transaction.individualCredentials.find((ic) => ic.id === c.id)?.quantity || 0,
      }))
    )
    setEditing(false)
    setSelectedImage("")
    setSelectedFile(undefined)
  }

  const handleToggle = (credential: CredentialsData) => {
    const existingCredential = selectedCredentials.find(c => c.id === credential.id)
    if (existingCredential) {
      setSelectedCredentials(selectedCredentials.filter(c => c.id !== credential.id))
    } else {
      setSelectedCredentials([...selectedCredentials, { ...credential, quantity: 0 }])
    }
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    setSelectedCredentials(selectedCredentials.map(c => c.id === id ? { ...c, quantity: quantity } : c))
  }

  const handleClose = () => {
    setShow(false)
    setSelectedImage("")
    setSelectedFile(undefined)
    setSelectedDate(null)
    refreshData()
  }

  const handleEditClose = () => {
    setShow(false)
    setSelectedImage("")
    setSelectedFile(undefined)
    setSelectedDate(null)
    refreshData()
  }

  const handleEditClick = () => {
    setEditing(true)
  }

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`/api/student/transactions/${transaction.id}`)
      toast.success('Transaction deleted successfully.')
      handleEditClose()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleSaveClick = async () => {
    let path = ''
    try {
      path = await handleUpload()
    } catch (error) {
      console.error('Failed to upload image:', error)
    }

    try {
      const updatedCredentials = transaction.individualCredentials.map(credential => {
        const selectedCredential = selectedCredentials.find(c => c.id === credential.id)

        return {
          id: credential.id,
          quantity: selectedCredential ? selectedCredential.quantity : 0,
          price: credential.price
        }
      })

      const updatedTotalAmount = updatedCredentials.reduce(
        (total, credential) => total + credential.quantity * credential.price, 0
      )

      // Check if there are changes in the transaction
      if (updatedCredentials && updatedTotalAmount && !path && !selectedDate) {
        // Update only total_amount
        await axios.put(`/api/student/transactions/${transaction.id}`, {
          credentials: updatedCredentials,
          totalAmount: updatedTotalAmount,
          user: user,
        })
      } else if (updatedCredentials && updatedTotalAmount && path && !selectedDate) {
        // Update total_amount and image
        await axios.put(`/api/student/transactions/${transaction.id}`, {
          credentials: updatedCredentials,
          totalAmount: updatedTotalAmount,
          user: user,
          imagePath: path
        })
      } else if (updatedCredentials && updatedTotalAmount && !path && selectedDate) {
        // Update total_amount and payment_date
        await axios.put(`/api/student/transactions/${transaction.id}`, {
          credentials: updatedCredentials,
          totalAmount: updatedTotalAmount,
          user: user,
          payment_date: selectedDate
        })
      } else if (updatedCredentials && updatedTotalAmount && path && selectedDate) {
        // Update total_amount, image and payment_date
        await axios.put(`/api/student/transactions/${transaction.id}`, {
          credentials: updatedCredentials,
          totalAmount: updatedTotalAmount,
          user: user,
          imagePath: path,
          payment_date: selectedDate
        })
      }
      toast.success('Individual Transactions updated successfully.')
      handleEditClose()
    } catch (error) {
      console.log(error)
    }
  }

  const handlePackageUpload = async () => {
    let path = ''
    try {
      path = await handleUpload()
    } catch (error) {
      console.error('Failed to upload image:', error)
    }

    try {
      if (path && !selectedDate) {
        await axios.put(`/api/student/transactions/${transaction.id}`, {
          user: user,
          imagePath: path
        })
      } else if (!path && selectedDate) {
        await axios.put(`/api/student/transactions/${transaction.id}`, {
          user: user,
          payment_date: selectedDate
        })
      } else {
        await axios.put(`/api/student/transactions/${transaction.id}`, {
          user: user,
          imagePath: path,
          payment_date: selectedDate
        })
      }

      toast.success('Package Transaction updated successfully.')
      handleClose()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  const handleUpload = async () => {
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
                <Typography variant='body1'>{dayjs(transaction.transaction_date).format('MM DD, YYYY HH:mm:ss A')}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                  Total Amount:
                </Typography>
                <Typography variant='body1'>{editing ? formatNumberWithCommas(originalTotalAmount) : formatNumberWithCommas(transaction.total_amount)}</Typography>
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
                            <ListItemText primary={credential.name + '( Php ' + formatNumberWithCommas(credential.price) + ' )'} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                </>
              ) : transaction.individualCredentials.length > 0 ? (
                  <Grid item sm={12} xs={12}>
                    <List
                      subheader={
                        <ListSubheader component="div">
                          Credentials
                        </ListSubheader>
                      }
                    >
                      {transaction.individualCredentials.map((credential) => {
                        const isSelected = selectedCredentials.some(c => c.id === credential.id)
                        const foundCredential = selectedCredentials.find(c => c.id === credential.id)

                        return (
                          <ListItem
                            sx={{
                              marginTop: '8px'
                            }}
                            key={credential.id}
                            secondaryAction={
                              <>
                                <Checkbox
                                  edge="end"
                                  onChange={() => handleToggle(credential)}
                                  checked={isSelected}
                                  disabled={!editing}
                                />
                                {isSelected && (
                                  <TextField
                                    size='small'
                                    type='number'
                                    value={foundCredential?.quantity || 0}
                                    onChange={(e) => handleQuantityChange(credential.id, parseInt(e.target.value))}
                                    InputProps={{
                                      startAdornment: <InputAdornment position='start'>Qty</InputAdornment>,
                                    }}
                                    sx={{ width: '100px' }}
                                  />
                                )}
                              </>
                            }
                            disablePadding
                          >
                            <ListItemText primary={`${credential.name} (${formatNumberWithCommas(credential.price)})`} />
                          </ListItem>
                        )
                      })}
                    </List>
                  </Grid>
              ) : null}
            {transaction.status === 'Submitted' && transaction.individualCredentials.length > 0 ? (
              editing ? (
                <>
                  <Grid item sm={12} xs={12}>
                    <Grid container spacing={6}>
                      <Grid item sm={12} xs={12}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          Upload Proof of Payment
                        </Typography>
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
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
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
                  </Grid>
                </>
              )
            ) : transaction.status === 'Submitted' && transaction.packages.length > 0 ? (
              (transaction.image != null && transaction.image != '')? (
                <>
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
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item sm={12} xs={12}>
                    <Grid container spacing={6}>
                      <Grid item sm={12} xs={12}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          Upload Proof of Payment
                        </Typography>
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
                          <Button
                            onClick={handlePackageUpload}
                            variant="outlined"
                            disabled={!selectedFile && !selectedDate}
                          >
                            {selectedFile && !selectedDate
                              ? "Upload Image"
                              : !selectedFile && selectedDate
                              ? "Add Payment Date"
                              : "Upload Image and Add Payment Date"}
                          </Button>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )
            ) : null }
            {transaction.status === 'Scheduled' ? (
              <Grid item sm={6} xs={12}>
                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                  Schedule:
                </Typography>
                <Typography variant='body1'>{dayjs(transaction.schedule).format('MMMM DD, YYYY HH:mm:ss A')}</Typography>
              </Grid>
            ) : null}
            {transaction.status === 'Claimed' ? (
              <>
                <Box sx={{ mb: 2}}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Proof of Payment
                  </Typography>
                  {transaction.image ? (
                    <img src={`/api/images/${transaction.image}`} alt='Student Image' style={{ width: '80%', height: 'auto' }} />
                  ) : (
                    <Typography variant='body1'>No image attached</Typography>
                  )}
                </Box>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Claimed on:
                  </Typography>
                  <Typography variant='body1'>{dayjs(transaction.claim).format('MMMM DD, YYYY')}</Typography>
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
                <Box sx={{ mb: 2}}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Proof of Payment
                  </Typography>
                  {transaction.image ? (
                    <img src={`/api/images/${transaction.image}`} alt='Student Image' style={{ width: '80%', height: 'auto' }} />
                  ) : (
                    <Typography variant='body1'>No image attached</Typography>
                  )}
                </Box>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Rejected on:
                  </Typography>
                  <Typography variant='body1'>{dayjs(transaction.reject).format('MMMM DD, YYYY')}</Typography>
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
            {transaction.status === 'Submitted' && transaction.individualCredentials.length > 0 ? (
              editing ? (
                selectedCredentials.length === 0 ? (
                  <>
                    <Button variant='contained' color='error' sx={{ mr: 1 }} onClick={handleDeleteClick}>
                      Delete
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant='contained' sx={{ mr: 1 }} onClick={handleSaveClick}>
                      Save
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </>
                )
              ) : (
                <Button variant='contained' sx={{ mr: 1 }} onClick={handleEditClick}>
                  Edit
                </Button>
              )
            ) : transaction.status === 'Submitted' && transaction.packages.length > 0 ? (
              <Button variant='contained' color='error' sx={{ mr: 1 }} onClick={handleDeleteClick}>
                Delete
              </Button>
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

export default DialogViewTransaction
