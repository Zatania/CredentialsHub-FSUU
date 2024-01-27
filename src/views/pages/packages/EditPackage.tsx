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
import FormControl from '@mui/material/FormControl'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormHelperText from '@mui/material/FormHelperText'
import EditIcon from '@mui/icons-material/Edit'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Input from '@mui/material/Input'
import Checkbox from '@mui/material/Checkbox'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .integer('Price must be an integer')
    .positive('Price must be positive')
    .max(999999, 'Price cannot exceed 999999'), // Adjust the maximum value as needed
})

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})


interface CredentialsData {
  id: number
  name: string
  price: number
}

interface PackageData {
  id: number
  name: string
  description: string
  credentials: CredentialsData[]
}

const DialogEditPackage  = ({ packageId, refreshData }) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [allCredentials, setAllCredentials] = useState<CredentialsData[]>([])
  const [selectedCredentials, setSelectedCredentials] = useState<{ [key: number]: { data: CredentialsData, quantity: number } }>({})

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<PackageData>({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    if(show) {
      // Fetch all credentials
      axios.get('/api/credentials')
      .then(response => setAllCredentials(response.data))
      .catch(error => console.error("Error fetching all credentials", error))

      // Fetch package details including credentials
      axios.get(`/api/packages/${packageId}`)
      .then(response => {
        const packageData = response.data

        const credentialsWithQuantity = packageData.credentials.reduce((acc: { [x: string]: { data: any, quantity: any } }, credential: { id: string | number, quantity: any }) => {
          acc[credential.id] = { data: credential, quantity: credential.quantity }

          return acc
        }, {})

        setSelectedCredentials(credentialsWithQuantity)

        // Set values after fetching data
        setValue('name', packageData.name)
        setValue('description', packageData.description)
      })
      .catch(error => console.error("Error fetching package details", error))
    }
  }, [show, packageId, setValue])

  const handleCredentialToggle = (credential: CredentialsData) => {
    setSelectedCredentials(prev => {
      const newSelected = { ...prev }
      if (newSelected[credential.id]) {
        delete newSelected[credential.id]
      } else {
        newSelected[credential.id] = { data: credential, quantity: 1 } // Default quantity can be adjusted
      }

      return newSelected
    })
  }

  const handleClose = () => {
    setShow(false)
    reset()  // Reset the form fields to their default values
    refreshData()
  }

  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const onSubmit = async (data: PackageData) => {
    const updatedPackageData = {
      name: data.name,
      description: data.description,
      credentials: Object.values(selectedCredentials).map(item => ({
        id: item.data.id,
        quantity: item.quantity
      }))
    }

    axios.put(`/api/packages/${packageId}`, updatedPackageData)
      .then(() => {
        toast.success('Package Edited Successfully')
        handleClose()
      })
      .catch((error) => {
        console.error(error)
        toast.error('Package Editing Failed')
      })
  }

  return (
    <Card>
      <Button size='small' startIcon={<EditIcon />} onClick={() => setShow(true)} variant='outlined'  style={{ marginRight: '8px' }} >
        Edit
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
                  Edit Credential
                </Typography>
                <Typography variant='body2'>Change the name and price of the credential.</Typography>
              </Box>
                <Grid container spacing={6}>
                  <Grid item sm={6} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='name'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.name)}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                      {errors.name && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='Description'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.description)}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                      {errors.description && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item sm={12} xs={12}>
                    <List dense>
                      {allCredentials.map((credential) => (
                        <ListItem key={credential.id}>
                          <Checkbox
                            checked={!!selectedCredentials[credential.id]}
                            onChange={() => handleCredentialToggle(credential)}
                          />
                          <ListItemText primary={`${credential.name} (Php ${formatNumberWithCommas(credential.price)})`} />
                          {selectedCredentials[credential.id] && (
                            <Input
                              type="number"
                              value={selectedCredentials[credential.id].quantity}
                              onChange={(e) => setSelectedCredentials(prev => ({
                                ...prev,
                                [credential.id]: { ...prev[credential.id], quantity: parseInt(e.target.value) }
                              }))}
                              inputProps={{ min: 1 }}
                              size="small"
                            />
                          )}
                        </ListItem>
                      ))}
                    </List>
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
    </Card>
  )
}

export default DialogEditPackage
