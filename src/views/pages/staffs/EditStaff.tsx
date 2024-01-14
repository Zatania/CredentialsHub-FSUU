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
import EditIcon from '@mui/icons-material/Edit'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

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

interface StaffData {
  id: number
  username: string
  employeeNumber: string
  firstName: string
  middleName: string
  lastName: string
  address: string
  departments: Array<{ id: number, name: string }>
  transactionCounts: {
    Scheduled: {
      dailyCount: number
      monthlyCount: number
    }
    Claimed: {
      dailyCount: number
      monthlyCount: number
    }
    Rejected: {
      dailyCount: number
      monthlyCount: number
    }
    Submitted: {
      dailyCount: number
      monthlyCount: number
    }
  }
}

interface Department {
  name: string
  id: number
}

const DialogEditStaff = ({ staff, refreshData }) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<StaffData>({
    mode: 'onBlur'
  })

  // Fetch departments list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/departments/list');
        const data = await response.json();
        setDepartments(data);

        // Create a mapping of department names to IDs
        const departmentNameToId = data.reduce((acc, department) => {
          acc[department.name.toLowerCase()] = department.id;

          return acc;
        }, {});

        // Prepopulate selected departments using the staff's department names
        if (staff && staff.departments) {
          const mappedDepartments = staff.departments.map(depName =>
            departmentNameToId[depName.toLowerCase()] // Convert each name to lowercase and find the ID
          );
          setSelectedDepartments(mappedDepartments.filter(id => id !== undefined)); // Filter out any undefined IDs
        }
      } catch (error) {
        console.error('Error fetching departments: ', error);
      }
    };

    fetchData();
  }, [staff]);

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const departmentId = Number(event.target.name); // Convert the name to a number
    setSelectedDepartments(prevSelectedDepartments => {
      if (prevSelectedDepartments.includes(departmentId)) {
        return prevSelectedDepartments.filter(dep => dep !== departmentId);
      } else {
        return [...prevSelectedDepartments, departmentId];
      }
    });
  };

  const handleClose = () => {
    setShow(false);
    reset();  // Reset the form fields to their default values
    refreshData()
  };

  const onSubmit = async (data: StaffData) => {
    setLoading(true);

    // Prepare data to be sent to the API
    const updatedData = {
      ...data,
      departments: selectedDepartments // This assumes 'selectedDepartments' holds the IDs of the selected departments
    };

    try {
      // Make the API request to update the staff details
      await axios.put(`/api/admin/staff/edit/${staff?.id}`, updatedData);

      // Handle successful update
      toast.success('Staff Edited Successfully');
      handleClose(); // Close the dialog and reset form
    } catch (error) {
      console.error(error);
      toast.error('Error updating staff details');
    } finally {
      setLoading(false); // Reset loading state in both success and error cases
    }
  }

  useEffect(() => {
    if (staff) {
      setValue('employeeNumber', staff.employeeNumber)
      setValue('username', staff.username)
      setValue('firstName', staff.firstName)
      setValue('middleName', staff.middleName)
      setValue('lastName', staff.lastName)
      setValue('address', staff.address)
    }
  }, [setValue, staff])

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
                  Edit Staff
                </Typography>
                <Typography variant='body2'>Edit Staff Details or Reassign Department.</Typography>
              </Box>
              <Grid container spacing={6}>
                <Grid item sm={6} xs={12}>
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
                <Grid item sm={6} xs={12}>
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

export default DialogEditStaff
