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

  // Define a function to check if an image is attached
  const isImageAttached = !!selectedFile

  const isRegisterButtonDisabled =
    graduateCheckValue === '' || // Check if "Yes" or "No" is selected
    !areAllFieldsFilled() || // Check if all required fields are filled
    !isImageAttached // Check if an image is attached

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
      router.push('/')
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
                    <Grid container spacing={6} sx={{ textAlign: 'center' }}>
                      <Grid item sm={12} xs={12}>
                        <Typography variant='body1' sx={{ fontWeight: 600 }}>
                          Upload Photo with your face and valid id in the same image.
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
