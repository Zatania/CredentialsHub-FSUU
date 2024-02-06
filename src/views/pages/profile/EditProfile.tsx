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
import InputLabel from '@mui/material/InputLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import { FormLabel } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import dayjs, { Dayjs } from 'dayjs'

//** For Date/Time Picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface Student {
  id: number
  user_id: number
  username: string
  password: string
  confirmPassword: string
  studentNumber: string
  firstName: string
  middleName: string
  lastName: string
  department: number | ''
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
  birthDate: Dayjs
  birthPlace: string
  religion: string
  citizenship: string
  sex: string
  fatherName: string
  motherName: string
  guardianName: string
  elementary: string
  elementaryGraduated: Dayjs
  secondary: string
  secondaryGraduated: Dayjs
  juniorHigh: string
  juniorHighGraduated: Dayjs
  seniorHigh: string
  seniorHighGraduated: Dayjs
  tertiary: string
  tertiaryGraduated: Dayjs
  employedAt: string
  position: string
}

interface Department {
  name: string
  id: number
}

interface ProfileProps {
  user: Student,
  refresh: () => void
}

const DialogEditProfile = ({ user, refresh }: ProfileProps) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [userDepartmentId, setUserDepartmentId] = useState<number | undefined>();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<Student>({
    mode: 'onBlur',
  })

  // ** EDIT PROFILE ** //
  const graduateCheckValue = watch('graduateCheck')

  const handleClose = () => {
    setShow(false);
    reset();  // Reset the form fields to their default values
    refresh();
  };

  const onSubmit = async (data: Student) => {
    data.user_id = user?.id
    data.username = user?.username
    try {
      const response = await fetch('/api/student/profile/edit', {
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
    }
  }

  // Fetch departments list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/departments/list');
        const data = await response.json();
        setDepartments(data);

        // Find the department ID that matches the user's department name
        const userDept = data.find((department: { name: any }) => department.name === user.department);
        setUserDepartmentId(userDept?.id);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    setValue('department', userDepartmentId || '')
    setValue('graduateCheck', user?.graduateCheck || '')
  }, [setValue, userDepartmentId, user?.graduateCheck])


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                    Edit User Profile
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
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='firstName'
                          control={control}
                          defaultValue={user?.firstName || ''}
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
                          defaultValue={user?.middleName || ''}
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
                          defaultValue={user?.lastName || ''}
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
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel>Department</InputLabel>
                        <Controller
                          name='department'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select {...field} label='Department' error={!!errors.department}>
                              {departments.map((department, index) => (
                                <MenuItem key={department.id || index} value={department.id}>
                                  {department.name}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.department && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.department.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='course'
                          control={control}
                          defaultValue={user?.course || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Course'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.course)}
                            />
                          )}
                        />
                        {errors.course && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.course.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='major'
                          control={control}
                          defaultValue={user?.major || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Major / Specialization'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.major)}
                            />
                          )}
                        />
                        {errors.major && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.major.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='graduateCheck'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <>
                              <FormLabel id='graduatecheck'>Graduated: </FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby='graduateCheck'
                                name='graduatecheck-group'
                                value={value}
                                onBlur={onBlur}
                                onChange={e => {
                                  onChange(e)
                                  setValue('graduationDate', user?.graduationDate) // Reset graduationDate when changing graduateCheck
                                  setValue('academicHonor', user?.academicHonor) // Reset academicHonor when changing graduateCheck
                                  setValue('yearLevel', user?.yearLevel) // Reset yearLevel when changing graduateCheck
                                  setValue('schoolYear', user?.schoolYear) // Reset schoolYear when changing graduateCheck
                                  setValue('semester', user?.semester) // Reset semester when changing graduateCheck
                                }}
                              >
                                <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                                <FormControlLabel value='no' control={<Radio />} label='No' />
                              </RadioGroup>
                            </>
                          )}
                        />
                        {errors.graduateCheck && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.graduateCheck.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    {graduateCheckValue === 'yes' && (
                      <>
                        <Grid item sm={4} xs={12}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                              <Controller
                                name='graduationDate'
                                control={control}
                                defaultValue={user?.graduationDate || ''}
                                render={({ field: { value, onChange, onBlur } }) => (
                                  <TextField
                                    label='Year Graduated'
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    error={Boolean(errors.graduationDate)}
                                  />
                                )}
                              />
                              {errors.graduationDate && (
                                <FormHelperText sx={{ color: 'error.main' }}>{errors.graduationDate.message}</FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                        <Grid item sm={4} xs={12}>
                          <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                              name='academicHonor'
                              control={control}
                              defaultValue={user?.academicHonor || ''}
                              rules={{ required: false }}
                              render={({ field: { value, onChange, onBlur } }) => (
                                <TextField
                                  label='Academic Honor'
                                  value={value}
                                  onBlur={onBlur}
                                  onChange={onChange}
                                  error={Boolean(errors.academicHonor)}
                                />
                              )}
                            />
                            {errors.academicHonor && (
                              <FormHelperText sx={{ color: 'error.main' }}>{errors.academicHonor.message}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    )}
                    {graduateCheckValue === 'no' && (
                      <>
                        <Grid item sm={3} xs={12}>
                          <FormControl fullWidth sx={{ mb: 4 }}>
                            <InputLabel>Year Level</InputLabel>
                            <Controller
                              name='yearLevel'
                              control={control}
                              defaultValue={user?.yearLevel || ''}
                              rules={{ required: true }}
                              render={({ field: { value, onChange, onBlur } }) => (
                                <Select
                                  value={value}
                                  onBlur={onBlur}
                                  onChange={onChange}
                                  label='Year Level'
                                  error={!!errors.yearLevel}
                                >
                                  <MenuItem value=''></MenuItem>
                                  <MenuItem value='1st Year'>1st Year</MenuItem>
                                  <MenuItem value='2nd Year'>2nd Year</MenuItem>
                                  <MenuItem value='3rd Year'>3rd Year</MenuItem>
                                  <MenuItem value='4th Year'>4th Year</MenuItem>
                                </Select>
                              )}
                            />
                            {errors.yearLevel && (
                              <FormHelperText sx={{ color: 'error.main' }}>{errors.yearLevel.message}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                          <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                              name='schoolYear'
                              control={control}
                              defaultValue={user?.schoolYear || ''}
                              rules={{ required: false }}
                              render={({ field: { value, onChange, onBlur } }) => (
                                <TextField
                                  label='School Year'
                                  value={value}
                                  onBlur={onBlur}
                                  onChange={onChange}
                                  error={Boolean(errors.schoolYear)}
                                />
                              )}
                            />
                            {errors.schoolYear && (
                              <FormHelperText sx={{ color: 'error.main' }}>{errors.schoolYear.message}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item sm={2} xs={12}>
                          <FormControl fullWidth sx={{ mb: 4 }}>
                            <InputLabel>Semester</InputLabel>
                            <Controller
                              name='semester'
                              control={control}
                              defaultValue={user?.semester || ''}
                              rules={{ required: false }}
                              render={({ field: { value, onChange, onBlur } }) => (
                                <Select
                                  value={value}
                                  onBlur={onBlur}
                                  onChange={onChange}
                                  label='Semester'
                                  error={!!errors.semester}
                                >
                                  <MenuItem value=''></MenuItem>
                                  <MenuItem value='1st'>1st</MenuItem>
                                  <MenuItem value='2nd'>2nd</MenuItem>
                                </Select>
                              )}
                            />
                            {errors.semester && (
                              <FormHelperText sx={{ color: 'error.main' }}>{errors.semester.message}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    )}
                    <Grid item sm={12} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='homeAddress'
                          control={control}
                          defaultValue={user?.homeAddress || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Home Address'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.homeAddress)}
                            />
                          )}
                        />
                        {errors.homeAddress && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.homeAddress.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='contactNumber'
                          control={control}
                          defaultValue={user?.contactNumber || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Contact Number'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.contactNumber)}
                            />
                          )}
                        />
                        {errors.contactNumber && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.contactNumber.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='emailAddress'
                          control={control}
                          defaultValue={user?.emailAddress || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Email Address'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.emailAddress)}
                            />
                          )}
                        />
                        {errors.emailAddress && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.emailAddress.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='birthDate'
                          control={control}
                          defaultValue={dayjs(user?.birthDate)}
                          render={({ field }) => <DatePicker label='Birth Date' {...field} />}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='birthPlace'
                          control={control}
                          defaultValue={user?.birthPlace || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Birth Place'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.birthPlace)}
                            />
                          )}
                        />
                        {errors.birthPlace && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.birthPlace.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='religion'
                          control={control}
                          defaultValue={user?.religion || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Religion'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.religion)}
                            />
                          )}
                        />
                        {errors.religion && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.religion.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='citizenship'
                          control={control}
                          defaultValue={user?.citizenship || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Citizenship'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.citizenship)}
                            />
                          )}
                        />
                        {errors.citizenship && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.citizenship.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel>Sex</InputLabel>
                        <Controller
                          name='sex'
                          control={control}
                          defaultValue={user?.sex || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Select value={value} onBlur={onBlur} onChange={onChange} label='Sex' error={!!errors.sex}>
                              <MenuItem value='Male'>Male</MenuItem>
                              <MenuItem value='Female'>Female</MenuItem>
                            </Select>
                          )}
                        />
                        {errors.sex && <FormHelperText sx={{ color: 'error.main' }}>{errors.sex.message}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='fatherName'
                          control={control}
                          defaultValue={user?.fatherName || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Name of Father'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.fatherName)}
                            />
                          )}
                        />
                        {errors.fatherName && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.fatherName.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='motherName'
                          control={control}
                          defaultValue={user?.motherName || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Name of Mother'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.motherName)}
                            />
                          )}
                        />
                        {errors.motherName && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.motherName.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='guardianName'
                          control={control}
                          defaultValue={user?.guardianName || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Name of Guardian / Spouse'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.guardianName)}
                            />
                          )}
                        />
                        {errors.guardianName && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.guardianName.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontWeight: 600 }}>
                        2. Preliminary Education
                      </Typography>
                    </Grid>
                    <Grid item sm={8} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='elementary'
                          control={control}
                          defaultValue={user?.elementary || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Elementary School'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.elementary)}
                            />
                          )}
                        />
                        {errors.elementary && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.elementary.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='elementaryGraduated'
                          control={control}
                          defaultValue={dayjs(user?.elementaryGraduated)}
                          render={({ field }) => <DatePicker label='Year Graduated' {...field} />}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item sm={8} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='secondary'
                          control={control}
                          defaultValue={user?.secondary || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Secondary School'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.secondary)}
                            />
                          )}
                        />
                        {errors.secondary && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.secondary.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='secondaryGraduated'
                          control={control}
                          defaultValue={dayjs(user?.secondaryGraduated)}
                          render={({ field }) => <DatePicker label='Year Graduated' {...field} />}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item sm={8} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='juniorHigh'
                          control={control}
                          defaultValue={user?.juniorHigh || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Junior High School'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.juniorHigh)}
                            />
                          )}
                        />
                        {errors.juniorHigh && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.juniorHigh.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='juniorHighGraduated'
                          control={control}
                          defaultValue={dayjs(user?.juniorHighGraduated)}
                          render={({ field }) => <DatePicker label='Year Graduated' {...field} />}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item sm={8} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='seniorHigh'
                          control={control}
                          defaultValue={user?.seniorHigh || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Senior High School'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.seniorHigh)}
                            />
                          )}
                        />
                        {errors.seniorHigh && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.seniorHigh.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='seniorHighGraduated'
                          control={control}
                          defaultValue={dayjs(user?.seniorHighGraduated)}
                          render={({ field }) => <DatePicker label='Year Graduated' {...field} />}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontWeight: 600 }}>
                        3. For Law & Graduate Studies Students
                      </Typography>
                    </Grid>
                    <Grid item sm={8} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='tertiary'
                          control={control}
                          defaultValue={user?.tertiary || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Tertiary School'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.tertiary)}
                            />
                          )}
                        />
                        {errors.tertiary && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.tertiary.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='tertiaryGraduated'
                          control={control}
                          defaultValue={dayjs(user?.tertiaryGraduated)}
                          render={({ field }) => <DatePicker label='Year Graduated' {...field} />}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontWeight: 600 }}>
                        4. Please fill-out below if currently employed
                      </Typography>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='employedAt'
                          control={control}
                          defaultValue={user?.employedAt || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Employed At'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.employedAt)}
                            />
                          )}
                        />
                        {errors.employedAt && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.employedAt.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='position'
                          control={control}
                          defaultValue={user?.position || ''}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='Position'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.position)}
                            />
                          )}
                        />
                        {errors.position && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.position.message}</FormHelperText>
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
    </LocalizationProvider>
  )
}

export default DialogEditProfile
