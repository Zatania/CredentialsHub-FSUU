// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import dayjs, { Dayjs } from 'dayjs'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useSession } from 'next-auth/react'
import axios from 'axios'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface UserData {
  id: number
  username: string
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

const RequestCredentials = () => {
  // ** States
  const [show, setShow] = useState<boolean>(true)
  const [packages, setPackages] = useState<PackageData[]>([])
  const [selectedCredentials, setSelectedCredentials] = useState([])
  const [selectedPackage, setSelectedPackage] = useState<number | 'others'>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [individualCredentials, setIndividualCredentials] = useState([])
  const [user, setUser] = useState<UserData | null>(null)

  // ** Hooks
  const router = useRouter()
  const { data: session } = useSession()
  const userID = session?.user?.id

  // Fetch user data
  useEffect(() => {
    if (userID) {
      axios.get(`/api/print/user/${userID}`)
        .then(response => {
          // Set the user data to the state
          setUser(response.data[0])
        })
        .catch(error => console.error('Error fetching user data:', error))
    }
  }, [userID])

  useEffect(() => {
    if (user) {
      if (
        !user.studentNumber ||
        !user.firstName ||
        !user.middleName ||
        !user.lastName ||
        !user.department ||
        !user.course ||
        !user.major ||
        (user.graduateCheck === "yes" && (!user.graduationDate || user.graduationDate === 'Invalid Date' || !user.academicHonor)) ||
        (user.graduateCheck === "no" && (!user.yearLevel || !user.semester || !user.schoolYear)) ||
        !user.homeAddress ||
        !user.contactNumber ||
        !user.emailAddress ||
        !user.birthDate ||
        !user.birthPlace ||
        !user.religion ||
        !user.citizenship ||
        !user.sex/*  ||
        !user.elementary ||
        (!user.elementaryGraduated || user.elementaryGraduated === 'Invalid Date') ||
        (user.secondary && user.secondaryGraduated === 'Invalid Date') ||
        (user.juniorHigh && user.juniorHighGraduated === 'Invalid Date') ||
        (user.seniorHigh && user.seniorHighGraduated === 'Invalid Date') ||
        (user.tertiary && user.tertiaryGraduated === 'Invalid Date') */
      ) {
        toast.error('Your information is incomplete. Please complete your profile first.');
        router.push('/student/profile');
      }
    }
  }, [user, router]);


  // Fetch all credentials on mount (or based on some condition)
  useEffect(() => {
    axios.get('/api/credentials')
      .then(response => setIndividualCredentials(response.data))
      .catch(error => console.error("Error fetching credentials", error))
  }, [])

  // Fetch packages on mount
  useEffect(() => {
    axios.get('/api/packages')
      .then(response => setPackages(response.data))
      .catch(error => console.error("Error fetching packages", error))
  }, [])

  useEffect(() => {
    if (selectedPackage !== 'others' && selectedPackage !== 0) {
      axios.get(`/api/packages/${selectedPackage}`)
        .then(response => {
          setSelectedCredentials(response.data.credentials || [])
        })
        .catch(error => console.error("Error fetching package credentials", error))
    } else if (selectedPackage === 'others') {
      setSelectedCredentials(individualCredentials.map(cred => ({ ...cred, quantity: 0 })))
    }
  }, [selectedPackage, individualCredentials])

  const findCredentialIdByName = (name) => {
    const credential = individualCredentials.find(c => c.name === name);

    return credential ? credential.id : null;
  }

  const TRANSCRIPT_ID = findCredentialIdByName('Transcript of Records');
  const DIPLOMA_ID = findCredentialIdByName('Diploma');
  const DOCUMENTARY_STAMP_ID = findCredentialIdByName('Documentary Stamp');

  const handleCredentialQuantityChange = (credentialId, quantity) => {
    setSelectedCredentials(prevCredentials => {
        // Update the quantity for the selected credential
        const updatedCredentials = prevCredentials.map(cred =>
            cred.id === credentialId ? { ...cred, quantity: parseInt(quantity, 10) || 0 } : cred
        );

        // Calculate the total quantity for Transcript and Diploma
        const transcriptQuantity = updatedCredentials.find(c => c.id === TRANSCRIPT_ID)?.quantity || 0;
        const diplomaQuantity = updatedCredentials.find(c => c.id === DIPLOMA_ID)?.quantity || 0;
        const totalQuantity = transcriptQuantity + diplomaQuantity;

        // Update the quantity of Documentary Stamp
        return updatedCredentials.map(cred =>
            cred.id === DOCUMENTARY_STAMP_ID ? { ...cred, quantity: totalQuantity } : cred
        );
    });
}


  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  useEffect(() => {
    const total = selectedCredentials.reduce((acc, cred) => acc + (cred.price * cred.quantity), 0)
    setTotalAmount(total)
  }, [selectedCredentials])

  const handlePackageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPackage(event.target.value as number | 'others')
  }

  // ** CHECK IF STUDENT IS VERIFED OR NOT
  // Redirect unverified users
  useEffect(() => {
    if (session && session.user.status !== 'Verified') {
      toast.error('You are not verified yet')
      router.push('/') // Redirect to a specific page for unverified users
    }
  }, [session, router])

  const {
    handleSubmit
  } = useForm<>({
    mode: 'onBlur'
  })

  // Change up and down
  const handleIncrement = (credentialId) => {
    // Logic to increment the quantity
    handleCredentialQuantityChange(credentialId, (selectedCredentials.find(c => c.id === credentialId)?.quantity || 0) + 1);
  }

  const handleDecrement = (credentialId) => {
      // Logic to decrement the quantity
      handleCredentialQuantityChange(credentialId, (selectedCredentials.find(c => c.id === credentialId)?.quantity || 0) - 1);
  }

  const handleClose = () => {
    // Set show to false
    setShow(false)

    // Redirect to the main index
    router.push('/')
  }

  const onSubmit = async () => {
    try {

      // Assuming you have the user's ID in the session data
      const userId = session?.user?.id
      const packageId = selectedPackage

      // Prepare the data to be sent
      const transactionData = {
        userId,
        totalAmount,
        packageId
      }

      if (packageId === 'others') {
        const credentials = selectedCredentials.map(cred => ({
          credentialId: cred.id,
          quantity: cred.quantity,
          price: cred.price
        }))
        transactionData.credentials = credentials
      }

      // Send a POST request to your API endpoint
      await axios.post('/api/transactions/new', transactionData)

      toast.success('Transaction submitted successfully!')
      router.push('/student/transactions')
    } catch (error) {
      console.error('Error submitting transaction:', error)
      toast.error('Failed to submit transaction')
    }
  }

  return (
    <Dialog
      fullWidth
      open={show}
      maxWidth='md'
      scroll='body'
      onClose={handleClose}
      TransitionComponent={Transition}
      onBackdropClick={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            position: 'relative',
            pb: (theme: { spacing: (arg0: number) => any }) => `${theme.spacing(8)} !important`,
            px: (theme: { spacing: (arg0: number) => any }) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: (theme: { spacing: (arg0: number) => any }) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <IconButton
            size='small'
            onClick={() => handleClose()}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Request Credential
            </Typography>
            <Typography variant='body2'>Choose from packages or individual credentials.</Typography>
          </Box>
            <Grid container spacing={6} sx={{ textAlign: 'left' }}>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <Select
                    value={selectedPackage}
                    onChange={handlePackageChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value={0} disabled>
                      Select a Package
                    </MenuItem>
                    {packages.map((pkg) => (
                      <MenuItem key={pkg.package_id} value={pkg.package_id}>{pkg.package_name} - {pkg.package_description}</MenuItem>
                    ))}
                    <MenuItem value="others">Others</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {selectedPackage !== 'others' && selectedCredentials.map(cred => (
                <Grid item xs={12} sm={12} key={cred.id}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={10}>
                      <Typography>{cred.name} (₱ {formatNumberWithCommas(cred.price)})</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>Quantity: {cred.quantity}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
              {selectedPackage === 'others' && individualCredentials.map(cred => (
                <Grid item sm={12} xs={12} key={cred.id} sx={{mb:5}}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={9}>
                      <Typography>{cred.name} (₱ {formatNumberWithCommas(cred.price)})</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Quantity"
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        value={selectedCredentials.find(c => c.id === cred.id)?.quantity || 0}
                        onChange={(e) => handleCredentialQuantityChange(cred.id, e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => handleDecrement(cred.id)} size="small">
                                -
                              </IconButton>
                              <IconButton onClick={() => handleIncrement(cred.id)} size="small">
                                +
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                    </Grid>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Total Amount: ₱ {formatNumberWithCommas(totalAmount)}
                </Typography>
              </Grid>
            </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: (theme: { spacing: (arg0: number) => any }) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: (theme: { spacing: (arg0: number) => any }) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 1 }} type='submit'>
            Submit
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleClose()}>
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

RequestCredentials.acl = {
  action: 'read',
  subject: 'request-page'
}

export default RequestCredentials
