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
import EditIcon from '@mui/icons-material/Edit'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface SAData {
  id: number
  username: string
  sa_number: string
  firstName: string
  middleName: string
  lastName: string
  address: string
  departments: Array<{ id: number, name: string }>
  role: 'scheduling' | 'releasing'
  transactionCounts: {
    Scheduled: {
      dailyCount: number
      monthlyCount: number
    }
    Claimed: {
      dailyCount: number
      monthlyCount: number
    }
  }
}

interface Department {
  name: string
  id: number
}

const DialogEditSA = ({ sa, refreshData }) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([])
  const [selectedRole, setSelectedRole] = useState<'scheduling' | 'releasing'>('scheduling')

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<SAData>({
    mode: 'onBlur'
  })

  // Fetch departments list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/departments/list')
        const data = await response.json()
        setDepartments(data)

        // Create a mapping of department names to IDs
        const departmentNameToId = data.reduce((acc, department) => {
          acc[department.name.toLowerCase()] = department.id

          return acc
        }, {})

        // Prepopulate selected departments using the student assistant's department names
        if (sa && sa.departments) {
          const mappedDepartments = sa.departments.map(depName =>
            departmentNameToId[depName.toLowerCase()] // Convert each name to lowercase and find the ID
          )
          setSelectedDepartments(mappedDepartments.filter(id => id !== undefined)) // Filter out any undefined IDs
        }
      } catch (error) {
        console.error('Error fetching departments: ', error)
      }
    }

    fetchData()
  }, [sa])

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const departmentId = Number(event.target.name) // Convert the name to a number
    setSelectedDepartments(prevSelectedDepartments => {
      if (prevSelectedDepartments.includes(departmentId)) {
        return prevSelectedDepartments.filter(dep => dep !== departmentId)
      } else {
        return [...prevSelectedDepartments, departmentId]
      }
    })
  }

  const handleClose = () => {
    setShow(false)
    reset()  // Reset the form fields to their default values
    refreshData()
  }

  const onSubmit = async (data: SAData) => {

    // Prepare data to be sent to the API
    const updatedData = {
      ...data,
      role: selectedRole,
      departments: selectedDepartments // This assumes 'selectedDepartments' holds the IDs of the selected departments
    }

    try {
      // Make the API request to update the student assistant's details
      await axios.put(`/api/admin/student_assistant/edit/${sa?.id}`, updatedData)

      // Handle successful update
      toast.success('Student Assistant Edited Successfully')
      handleClose() // Close the dialog and reset form
    } catch (error) {
      console.error(error)
      toast.error('Error updating Student Assistant details')
    }
  }

  useEffect(() => {
    if (sa) {
      setValue('sa_number', sa.sa_number)
      setValue('username', sa.username)
      setValue('firstName', sa.firstName)
      setValue('middleName', sa.middleName)
      setValue('lastName', sa.lastName)
      setValue('address', sa.address)
      setSelectedRole(sa.role)
    }
  }, [setValue, sa])

  return (
    <Card>
      <Button size='small' startIcon={<EditIcon />} onClick={() => setShow(true)} variant='outlined'  sx={{ mr: 5 }} >
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
                  Edit Student Assistant
                </Typography>
                <Typography variant='body2'>Edit Student Assistant Details, Reassign Department, Reassign Role.</Typography>
              </Box>
              <Grid container spacing={6}>
                <Grid item sm={4} xs={12}>
                  <Controller
                    name='sa_number'
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Student Assistant Number'
                        error={!!errors.sa_number}
                        helperText={errors.sa_number?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      value={selectedRole}
                      label="Role"
                      onChange={(event) => setSelectedRole(event.target.value as 'scheduling' | 'releasing')}
                    >
                      <MenuItem value="Scheduling">Scheduling</MenuItem>
                      <MenuItem value="Releasing">Releasing</MenuItem>
                    </Select>
                  </FormControl>
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
                            name={String(department.id)}
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
    </Card>
  )
}

export default DialogEditSA
