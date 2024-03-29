// ** React Imports
import { Ref, useState, forwardRef, ReactElement } from 'react'

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
  price: yup
    .number()
    .typeError('Price must be a number')
    .integer('Price must be an integer')
    .positive('Price must be positive')
    .max(999999, 'Price cannot exceed 999999'), // Adjust the maximum value as needed
});

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

const DialogAddCredential = ({ refreshData }) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CredentialsData>({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema)
  })

  const handleClose = () => {
    setShow(false);
    reset();  // Reset the form fields to their default values
    refreshData()
  };

  const onSubmit = async (data: CredentialsData) => {
    axios.post(`/api/credentials`, data)
      .then(() => {
        toast.success('Credential Added Successfully')
        handleClose()
      })
      .catch((error) => {
        console.error(error)
        toast.error('Credential Adding Failed')
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
                  Add Credential
                </Typography>
                <Typography variant='body2'>Add new credential with corresponding price.</Typography>
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
                        name='price'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='Price'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.price)}
                          />
                        )}
                      />
                      {errors.price && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.price.message}</FormHelperText>
                      )}
                    </FormControl>
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

export default DialogAddCredential
