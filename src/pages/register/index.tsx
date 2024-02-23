// ** React Imports
import { ReactNode, useState, useEffect, forwardRef, ReactElement, Ref } from 'react'

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
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Input from '@mui/material/Input'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Checkbox } from '@mui/material'
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import Fade, { FadeProps } from '@mui/material/Fade'

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
import axios from "axios"

// ** Views
import ViewPrompt from 'src/views/pages/register/ViewPrompt'

// ** Transition

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
  maxWidth: '30rem',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '25rem'
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
    .matches(/^[0-9\- ]+$/, 'Must contain only numbers, dashes, or spaces.'),
  firstName: yup.string().required('First Name is required.'),
  lastName: yup.string().required('Last Name is required.'),
  department: yup.string().required('Department is required.'),
  course: yup.string().required('Course is required.'),
  contactNumber: yup.string().required('Contact Number is required.'),
  emailAddress: yup.string().email('Email must be a valid email.').required('Email is required.'),
})

interface FormData {
  username: string
  password: string
  confirmPassword: string
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
  contactNumber: string
  emailAddress: string
  imagePath: string
}

interface Department {
  name: string
  id: number
}

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File>()
  const [viewPromptVisible, setViewPromptVisible] = useState(false)
  const [prompt, setPrompt] = useState({})
  const [isDataPrivacyChecked, setIsDataPrivacyChecked] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // Get Prompt

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/register/prompt')
        const data = await response.json()
        setPrompt(data[0])
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }

    fetchData()
  }, [])

  const graduateCheckValue = watch('graduateCheck')

  const isGraduatedYes = graduateCheckValue === 'yes'

  // Define a function to check if all fields are filled
  const areAllFieldsFilled = () => {
    if (isGraduatedYes) {
      return (
        !!watch('graduationDate') &&
        !!watch('academicHonor')
      )
    } else {
      return (
        !!watch('yearLevel') &&
        !!watch('schoolYear') &&
        !!watch('semester')
      )
    }
  }


  // ** Open dialog handler
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  // ** Close dialog handler
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Define a function to check if an image is attached
  const isImageAttached = !!selectedFile

  const handleDataPrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDataPrivacyChecked(event.target.checked);
  };

  const isRegisterButtonDisabled =
    graduateCheckValue === '' || // Check if "Yes" or "No" is selected
    !areAllFieldsFilled() || // Check if all required fields are filled
    !isImageAttached || // Check if an image is attached
    !isDataPrivacyChecked // Check if the data privacy checkbox is checked

  const handleUpload = async () => {
    try {
      if (!selectedFile) return

      const formData = new FormData()
      formData.append("myImage", selectedFile)

      const response = await axios.post("/api/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return(response.data.imagePath)
    } catch (error) {
      console.error(error)
    }
  }

  const closeDialog = () => {
    setViewPromptVisible(false)
    router.push('/')
  }

  const onSubmit = async (data: FormData) => {
    let path = ''
    try {
      path = await handleUpload()
    } catch (error) {
      console.error('Failed to upload image:', error)
    }

    const password = data.password

    const hashedPassword = await bcrypt.hash(password, 10)

    data.password = hashedPassword
    data.imagePath = path

    let formDataToSend = { ...data };

    if (data.graduateCheck === 'yes') {
      // Keep only fields relevant for graduated students
      formDataToSend = {
        ...formDataToSend,
        graduationDate: data.graduationDate,
        academicHonor: data.academicHonor,

        // Remove fields not relevant for graduated students
        yearLevel: '',
        schoolYear: '',
        semester: '',
      };
    } else {
      // Keep only fields relevant for non-graduated students
      formDataToSend = {
        ...formDataToSend,
        yearLevel: data.yearLevel,
        schoolYear: data.schoolYear,
        semester: data.semester,

        // Remove fields not relevant for non-graduated students
        graduationDate: '',
        academicHonor: '',
      };
    }
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataToSend)
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      toast.success('Registered Successfully')

      if(formDataToSend.graduationDate && formDataToSend.graduationDate.trim() !== '' && formDataToSend.graduationDate <= '2011') {
        setViewPromptVisible(true)
      } else {
        closeDialog()
      }
    } catch (error) {
      toast.error('Registration Failed')
      console.error(error)
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

  // Function to generate school year options
  const getSchoolYearOptions = () => {
    const currentYear = new Date().getFullYear();
    let years = [];
    for (let year = 2018; year <= currentYear; year++) {
      years.push(`${year}-${year + 1}`);
    }

    return years;
  }


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ViewPrompt prompt={prompt} isVisible={viewPromptVisible} closeDialog={closeDialog}/>
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
                            label='Student Number (Optional)'
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
                  <Grid item sm={4} xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <InputLabel>Department</InputLabel>
                      <Controller
                        name='department'
                        control={control}
                        defaultValue=''
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
                            <InputLabel id="schoolYear-label">School Year</InputLabel>
                            <Controller
                              name='schoolYear'
                              control={control}
                              rules={{ required: false }}
                              render={({ field: { value, onChange, onBlur } }) => (
                                <Select
                                  labelId="schoolYear-label"
                                  value={value}
                                  onBlur={onBlur}
                                  onChange={onChange}
                                  label='School Year'
                                  error={!!errors.schoolYear}
                                >
                                  <MenuItem value=''>School Year</MenuItem>
                                  {getSchoolYearOptions().map((year, index) => (
                                    <MenuItem key={index} value={year}>{year}</MenuItem>
                                  ))}
                                </Select>
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
                    <Grid container spacing={6} sx={{ textAlign: 'center' }}>
                      <Grid item sm={12} xs={12}>
                        <Typography variant='body1' sx={{ fontWeight: 600 }}>
                          Upload an image with holding valid ID.
                        </Typography>
                      </Grid>
                      <Grid item sm={12} xs={12}>
                        <FormControl>
                          <Input
                            type="file"
                            id="image-upload"
                            style={{ display: "none" }}
                            onChange={({ target }) => {
                              if (target.files && target.files.length > 0) {
                                const file = target.files[0]
                                setSelectedImage(URL.createObjectURL(file))
                                setSelectedFile(file)
                              }
                            }}
                          />
                          <Button
                            variant="outlined"
                            component="label"
                            htmlFor="image-upload"
                            className="w-40 aspect-video rounded border-2 border-dashed cursor-pointer"
                          >
                            {selectedImage ? (
                              <img src={selectedImage} alt="" style={{ maxWidth: "100%" }} />
                            ) : (
                              "Select Image"
                            )}
                          </Button>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item sm={12} xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isDataPrivacyChecked}
                          onChange={handleDataPrivacyChange}
                          color="primary"
                        />
                      }
                      label={
                        <>
                          I agree to the{' '}
                          <Link
                            href="/"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDialogOpen();
                            }}
                          >
                            data privacy policy
                          </Link>
                          .
                          <Dialog
                            open={dialogOpen}
                            onClose={handleDialogClose}
                            maxWidth='md'
                            scroll='body'
                            TransitionComponent={Transition}
                          >
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
                                onClick={() => handleDialogClose()}
                                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                              >
                                <Icon icon='mdi:close' />
                              </IconButton>
                              <Box sx={{ mb: 8, textAlign: 'center' }}>
                                <Typography variant='h5' sx={{ mb: 3 }}>
                                  Data Privacy Policy
                                </Typography>
                              </Box>
                              {/* Insert your data privacy policy content here */}
                              <strong>Last updated:</strong> February 23, 2024

                              <br/><br/>Father Saturnino Urios University Registrar's Office operates CredentialHub. This page informs you of our policies regarding the collection, use, and disclosure of Personal Information we receive from users of the site.

                              <br/><br/><strong>Information Collection and Use</strong>

                              <br/><br/>While using our site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your name, email address, postal address, phone number, and picture holding valid ID ("Personal Information").

                              <br/><br/><strong>Log Data</strong>

                              <br/><br/> Like many site operators, we collect information that your browser sends whenever you visit our site ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our site that you visit, the time and date of your visit, the time spent on those pages, and other statistics.

                              <br/><br/><strong>Cookies</strong>

                              <br/><br/>Cookies are files with a small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive.

                              <br/><br/>Like many sites, we use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our site.

                              <br/><br/><strong>Security</strong>

                              <br/><br/>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.

                              <br/><br/><strong>Changes to This Privacy Policy</strong>

                              <br/><br/>This Privacy Policy is effective as of February 23, 2024 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.

                              <br/><br/>We reserve the right to update or change our Privacy Policy at any time, and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.

                              <br/><br/><strong>Contact Us</strong>

                              <br/><br/>If you have any questions about this Privacy Policy, please contact us.
                            </DialogContent>
                            <DialogActions
                              sx={{
                                justifyContent: 'center',
                                px: (theme: { spacing: (arg0: number) => any }) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                                pb: (theme: { spacing: (arg0: number) => any }) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                              }}
                            >
                              <Button variant='outlined' color='secondary' onClick={() => handleDialogClose()}>
                                Close
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </>
                      }
                    />
                  </Grid>
                  <Grid item sm={12} xs={12}>
                    <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }} disabled={isRegisterButtonDisabled}>
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
