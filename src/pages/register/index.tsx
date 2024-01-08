// ** React Imports
import { ReactNode, useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import { useRouter } from 'next/router'

// ** Third Party Imports
import * as yup from 'yup'
import * as bcrypt from 'bcryptjs'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

//** For Date/Time Picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FormLabel } from '@mui/material'

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
  maxWidth: '41rem',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 1000
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    width: '100%'
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const schema = yup.object().shape({
  username: yup.string().required('Username is required.'),
  password: yup.string().required('Password is required.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Passwords do not match.')
    .required('Confirm Password is required.'),
  studentNumber: yup
    .string()
    .matches(/^[0-9\- ]+$/, 'Must contain only numbers, dashes, or spaces.')
    .required('Student Number is required.'),
  firstName: yup.string().required('First Name is required.'),
  lastName: yup.string().required('Last Name is required.'),
  department: yup.string().required('Department is required.'),
  course: yup.string().required('Course is required.'),
  homeAddress: yup.string().required('Home Address is required.'),
  contactNumber: yup.string().required('Contact Number is required.'),
  emailAddress: yup.string().email('Email must be a valid email.').required('Email is required.'),
  birthPlace: yup.string().required('Birth Place is required.'),
  religion: yup.string().required('Religion is required.'),
  citizenship: yup.string().required('Citizenship is required.'),
  elementary: yup.string().required('Elementary School is required.')
})

interface FormData {
  username: string
  password: string
  confirmPassword: string
  studentNumber: string
  firstName: string
  middleName: string
  lastName: string
  department: number
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

interface Department {
  name: string
  id: number
}

const Register = () => {
  // ** States
  const [departments, setDepartments] = useState<Department[]>([])
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()

  // ** Vars
  const { skin } = settings

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const graduateCheckValue = watch('graduateCheck')

  const onSubmit = async (data: FormData) => {
    const password = data.password

    const hashedPassword = await bcrypt.hash(password, 10)

    data.password = hashedPassword

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setLoading(false)
      toast.success('Registered Successfully')
      router.push('/')
    } catch (error) {
      setLoading(false)
      toast.error('Registration Failed')
    }
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className='content-right'>
        {!hidden ? (
          <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            <RegisterIllustrationWrapper>
              <RegisterIllustration alt='login-illustration' src={`/images/wallpaper.png`} />
            </RegisterIllustrationWrapper>
          </Box>
        ) : null}
        <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
          <Box
            sx={{
              p: 12,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'background.paper'
            }}
          >
            <BoxWrapper>
              <Box
                sx={{
                  top: 30,
                  left: 40,
                  display: 'flex',
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg
                  width={35}
                  height={29}
                  version='1.1'
                  viewBox='0 0 30 23'
                  xmlns='http://www.w3.org/2000/svg'
                  xmlnsXlink='http://www.w3.org/1999/xlink'
                >
                  <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                    <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
                      <g id='logo' transform='translate(95.000000, 50.000000)'>
                        <image x='0' y='0' width='25' height='25' xlinkHref='/images/logos/logo.png' />
                      </g>
                    </g>
                  </g>
                </svg>
                <Typography
                  variant='h6'
                  sx={{
                    ml: 3,
                    lineHeight: 1,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '1.5rem !important'
                  }}
                >
                  {themeConfig.templateName}
                </Typography>
              </Box>
              <Box sx={{ mb: 6 }}>
                <TypographyStyled variant='h5'>Register your account!</TypographyStyled>
                <Typography variant='body2'>Please fill-in completely.</Typography>
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={5}>
                  <Grid item sm={12} xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      1. Personal Data
                    </Typography>
                  </Grid>
                  <Grid item sm={6} xs={12}>
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
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='username'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='Username'
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
                  <Grid item sm={6} xs={12}>
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
                      {errors.password && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <InputLabel htmlFor='auth-login-v2-confirm-password'>Confirm Password</InputLabel>
                      <Controller
                        name='confirmPassword'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <OutlinedInput
                            value={value}
                            onBlur={onBlur}
                            label='Confirm Password'
                            onChange={onChange}
                            id='auth-login-v2-confirmPassword'
                            error={Boolean(errors.confirmPassword)}
                            type={showConfirmPassword ? 'text' : 'password'}
                            endAdornment={
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onMouseDown={e => e.preventDefault()}
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  <Icon icon={showConfirmPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        )}
                      />
                      {errors.confirmPassword && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmPassword.message}</FormHelperText>
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
                        defaultValue=''
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
                                setValue('graduationDate', '') // Reset graduationDate when changing graduateCheck
                                setValue('academicHonor', '') // Reset academicHonor when changing graduateCheck
                                setValue('yearLevel', '1st Year') // Reset yearLevel when changing graduateCheck
                                setValue('schoolYear', '') // Reset schoolYear when changing graduateCheck
                                setValue('semester', '1st') // Reset semester when changing graduateCheck
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
                            render={({ field }) => <DatePicker label='Graduation Date' {...field} />}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                          <Controller
                            name='academicHonor'
                            control={control}
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
                        render={({ field }) => <DatePicker label='Birth Date' {...field} />}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='birthPlace'
                        control={control}
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
                        defaultValue='Male'
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
                        render={({ field }) => <DatePicker label='Graduation Date' {...field} />}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item sm={8} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='secondary'
                        control={control}
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
                        render={({ field }) => <DatePicker label='Graduation Date' {...field} />}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item sm={8} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='juniorHigh'
                        control={control}
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
                        render={({ field }) => <DatePicker label='Graduation Date' {...field} />}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item sm={8} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='seniorHigh'
                        control={control}
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
                        render={({ field }) => <DatePicker label='Graduation Date' {...field} />}
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
                        render={({ field }) => <DatePicker label='Graduation Date' {...field} />}
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
                  <Grid item sm={12} xs={12}>
                    <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                      Register
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Typography variant='body2' sx={{ mr: 2 }}>
                        Already have an account?
                      </Typography>
                      <Typography variant='body2'>
                        <LinkStyled href='/login'>Log in instead</LinkStyled>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </BoxWrapper>
          </Box>
        </RightWrapper>
      </Box>
    </LocalizationProvider>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
