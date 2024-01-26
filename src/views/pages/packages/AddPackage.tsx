// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
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
import AddIcon from '@mui/icons-material/Add'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import ListSubheader from '@mui/material/ListSubheader'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required')
});

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})


interface PackagesData {
  id: number
  name: string
  description: string
}

interface CredentialsData {
  id: number
  name: string
  price: number
  quantity: number
}

const DialogAddPackage = ({ refreshData }) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [credentials, setCredentials] = useState<CredentialsData[]>([])
  const [selectedCredentials, setSelectedCredentials] = useState<CredentialsData[]>([])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PackagesData>({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema)
  })

  // Fetch credentials list
  useEffect(() => {
    if(show) {
      axios.get('/api/credentials')
      .then(response => {
        setCredentials(response.data)
      })
      .catch(error => console.error("Error fetching credentials", error))
    }
  }, [show])

  const handleToggle = (credential: CredentialsData) => {
    const existingCredential = selectedCredentials.find(c => c.id === credential.id)
    if (existingCredential) {
      setSelectedCredentials(selectedCredentials.filter(c => c.id !== credential.id))
    } else {
      setSelectedCredentials([...selectedCredentials, { ...credential, quantity: 1 }])
    }
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    setSelectedCredentials(selectedCredentials.map(c => c.id === id ? { ...c, quantity: quantity } : c))
  }

  const handleClose = () => {
    setShow(false);
    reset();  // Reset the form fields to their default values
    refreshData()
  };

  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ', ');
  }

  const onSubmit = async (data: PackagesData) => {
    const packageData = {
      ...data,
      credentials: selectedCredentials
    }

    axios.post(`/api/packages`, packageData)
      .then(() => {
        toast.success('Package Added Successfully')
        handleClose()
      })
      .catch((error) => {
        console.error(error)
        toast.error('Package Adding Failed')
      })
  }

  return (
    <>
      <Button size='small' onClick={() => setShow(true)} startIcon={<AddIcon />} variant='outlined' style={{ marginLeft: '8px', marginRight: '8px', marginBottom: '8px' }}>
        Add Record
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
                  Add Package
                </Typography>
                <Typography variant='body2'>Add new package with corresponding credentials.</Typography>
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
                          />
                        )}
                      />
                      {errors.description && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <List
                      subheader={
                        <ListSubheader component="div">
                          Select Credentials
                        </ListSubheader>
                      }
                    >
                      {credentials.map((credential) => {
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
                                />
                                {isSelected && (
                                  <TextField
                                    size='small'
                                    type='number'
                                    value={foundCredential?.quantity || 1}
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
    </>
  )
}

export default DialogAddPackage
