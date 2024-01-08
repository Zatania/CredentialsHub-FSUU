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
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import { FormControlLabel, FormGroup, Checkbox } from '@mui/material'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as bcrypt from 'bcryptjs'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useSession } from 'next-auth/react'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface StaffData {
  id: number
  username: string
  password: string
  employeeNumber: number
  firstName: string
  middleName: string
  lastName: string
  address: string
  departments: number[]
}

interface Department {
  name: string
  id: number
}

const AddStaff = () => {
  // ** States
  const [show, setShow] = useState<boolean>(true)
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([])
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hooks
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<StaffData>({
    mode: 'onBlur'
  })

  const handleClose = () => {
    // Set show to false
    setShow(false)

    // Redirect to the main index
    router.push('/')
  }

  // Fetch departments list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/departments/list')
        const data = await response.json()
        setDepartments(data)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }

    fetchData()
  }, [])

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const departmentId = Number(event.target.name) // Convert the name to a number (assuming id is a number)

    setSelectedDepartments(prevSelectedDepartments => {
      if (prevSelectedDepartments.includes(departmentId)) {
        return prevSelectedDepartments.filter(dep => dep !== departmentId)
      } else {
        return [...prevSelectedDepartments, departmentId]
      }
    })
  }

  const onSubmit = async (data: StaffData) => {
    const password = data.password

    const hashedPassword = await bcrypt.hash(password, 10)

    data.password = hashedPassword

    try {
      const response = await fetch('/api/admin/staff/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data, departments: selectedDepartments })
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      toast.success('Staff Added Successfully')
      router.push('/')
    } catch (error) {
      toast.error('Staff Added Successfully')
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
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Add Staff
            </Typography>
            <Typography variant='body2'>Fill Staff Data</Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item sm={4} xs={12}>
              <Controller
                name='employeeNumber'
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Employee Number'
                    error={!!errors.employeeNumber}
                    helperText={errors.employeeNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Controller
                name='username'
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Username'
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='auth-login-v2-password'>Password</InputLabel>
                <Controller
                  name='password'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item sm={4} xs={12}>
              <Controller
                name='firstName'
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='First Name'
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Controller
                name='middleName'
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Middle Name'
                    error={!!errors.middleName}
                    helperText={errors.middleName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Controller
                name='lastName'
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Last Name'
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item sm={12} xs={12}>
              <Controller
                name='address'
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Address'
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup row>
                {departments.map(department => (
                  <FormControlLabel
                    key={department.id}
                    control={
                      <Checkbox
                        checked={selectedDepartments.includes(department.id)}
                        onChange={handleDepartmentChange}
                        name={String(department.id)} // Use department.id as the name
                      />
                    }
                    label={department.name}
                  />
                ))}
              </FormGroup>
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
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

AddStaff.acl = {
  action: 'read',
  subject: 'add-staff-page'
}

export default AddStaff
