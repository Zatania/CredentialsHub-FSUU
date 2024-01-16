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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface FormData {
  id: number
  username: string
  firstName: string
  middleName: string
  lastName: string
  address: string
}

const DialogStaffEditProfile = ({ staff, refreshData }) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur',
  })

  const handleClose = () => {
    setShow(false)
    reset()  // Reset the form fields to their default values
    refreshData()
  }

  const onSubmit = async (data: FormData) => {
    data.id = staff?.id
    try {
      const response = await fetch('/api/staff/profile/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      toast.success('Profiled Edited Successfully')
      handleClose()
    } catch (error) {
      toast.error('Profiled Edited Failed')
      console.error(error)
    }
  }

  useEffect(() => {
    setValue('username', staff?.username)
    setValue('firstName', staff?.firstName)
    setValue('middleName', staff?.middleName)
    setValue('lastName', staff?.lastName)
    setValue('address', staff?.address)
  }, [setValue, staff])


  return (
    <Card>
      <Button variant='contained' onClick={() => setShow(true)} startIcon={<Icon icon='mdi:account-edit-outline' fontSize={20} />}>
        Edit Profile
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
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
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
                  Edit Staff Profile
                </Typography>
                <Typography variant='body2'>Update and fill up all required fields.</Typography>
              </Box>
                <Grid container spacing={6}>
                  <Grid item sm={12} xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      1. Personal Data
                    </Typography>
                  </Grid>
                  {/* <Grid item sm={3} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='studentNumber'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='Student Number'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.studentNumber)}
                          />
                        )}
                      />
                      {errors.studentNumber && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.studentNumber.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid> */}
                  <Grid item sm={12} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='username'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='User Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.username)}
                          />
                        )}
                      />
                      {errors.username && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='firstName'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='First Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.firstName)}
                          />
                        )}
                      />
                      {errors.firstName && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='middleName'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='Middle Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.middleName)}
                          />
                        )}
                      />
                      {errors.middleName && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.middleName.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='lastName'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='Last Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.lastName)}
                          />
                        )}
                      />
                      {errors.lastName && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item sm={12} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='address'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='Home Address'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.address)}
                          />
                        )}
                      />
                      {errors.address && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
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

export default DialogStaffEditProfile
