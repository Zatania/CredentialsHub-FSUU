// ** React Imports
import { Ref, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import EditIcon from '@mui/icons-material/Edit'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface StudentData {
  id: number
  studentNumber: number
  firstName: string
  middleName: string
  lastName: string
  department: string
  course: string
  major: string
  graduateCheck: string
  graduationDate: string
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
  image: string
  status: string
  remarks: string
}

const DialogViewStudent  = ({ student, refreshData, actionType }) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [remarks, setRemarks] = useState<string>('')
  const [remarksError, setRemarksError] = useState('')

  const { data:session } = useSession()

  const {
    handleSubmit,
    reset  } = useForm<StudentData>({
    mode: 'onBlur',
    defaultValues: {
      studentNumber: student.studentNumber,
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      department: student.department,
      course: student.course,
      major: student.major,
      graduateCheck: student.graduateCheck,
      graduationDate: student.graduationDate,
      yearLevel: student.yearLevel,
      schoolYear: student.schoolYear,
      semester: student.semester,
      homeAddress: student.homeAddress,
      contactNumber: student.contactNumber,
      emailAddress: student.emailAddress,
      birthDate: student.birthDate,
      birthPlace: student.birthPlace,
      religion: student.religion,
      citizenship: student.citizenship,
      sex: student.sex,
      fatherName: student.fatherName,
      motherName: student.motherName,
      guardianName: student.guardianName,
      elementary: student.elementary,
      elementaryGraduated: student.elementaryGraduated,
      secondary: student.secondary,
      secondaryGraduated: student.secondaryGraduated,
      juniorHigh: student.juniorHigh,
      juniorHighGraduated: student.juniorHighGraduated,
      seniorHigh: student.seniorHigh,
      seniorHighGraduated: student.seniorHighGraduated,
      tertiary: student.tertiary,
      tertiaryGraduated: student.tertiaryGraduated,
      employedAt: student.employedAt,
      position: student.position,
      image: student.image,
      status: student.status,
      remarks: student.remarks
    }
  })

  const handleClose = () => {
    setShow(false)
    reset()  // Reset the form fields to their default values
    refreshData()
    setRemarks('')
  }

  const validateRemarks = () => {
    let isValid = true
    if (!remarks.trim()) {
      setRemarksError('Remarks are required')
      isValid = false
    } else {
      setRemarksError('')
    }

    return isValid
  }

  const onSubmit = async () => {
    if (!validateRemarks()) return
    const newStatus = actionType === 'verify' ? 'Verified' : 'Unverified';

    axios.put(`/api/student/${student.id}?status=${newStatus}`, {
      remarks: remarks,
      session: session
    })
      .then(() => {
        if (actionType === 'verify') {
          toast.success('Student Verified Successfully')
        } else {
          toast.success('Student Unverified Successfully')
        }
        handleClose()
      })
      .catch((error) => {
        console.error(error)
        toast.error('Verifying Student Failed')
      })
  }

  const handleSendRemarks = async () => {
    if (!validateRemarks()) return
    axios.put(`/api/student/${student.id}`, {
      remarks: remarks
    })
      .then(() => {
        toast.success('Remarks Sent Successfully')
        handleClose()
      })
      .catch((error) => {
        console.error(error)
        toast.error('Sending Remarks Failed')
      })
  }

  return (
    <Card>
      <Button size='small' startIcon={<EditIcon />} onClick={() => setShow(true)} variant='outlined'>
        View
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
                  Student Details
                </Typography>
              </Box>
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                {student.image ? (
                  <img src={`/api/images/${student.image}`} alt='Student Image' style={{ width: '50%', height: 'auto' }} />
                ) : (
                  <Typography variant='body1'>No image attached</Typography>
                )}
              </Box>
              <Grid container spacing={3} sx={{ textAlign: 'left' }}>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Student Number:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.studentNumber}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    First Name:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.firstName}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Middle Name:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.middleName}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Last Name:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.lastName}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Department:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.department || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Course:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.course || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Major:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.major || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Home Address:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.homeAddress || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Contact Number:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.contactNumber || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Email Address:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.emailAddress || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                {student.graduateCheck === 'yes' ? (
                  <Grid item sm={12} xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                      Year Graduated:
                    </Typography>
                    <Typography variant='body1'>{student.graduationDate}</Typography>
                  </Grid>
                ) : student.graduateCheck === 'no' ? (
                  <Grid item sm={12} xs={12}>
                    <Grid container spacing={6}>
                      <Grid item sm={12} xs={12}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          Year Level:
                        </Typography>
                        <Typography variant='body1'>{student.yearLevel}</Typography>
                      </Grid>
                      <Grid item sm={12} xs={12}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          School Year:
                        </Typography>
                        <Typography variant='body1'>{student.schoolYear}</Typography>
                      </Grid>
                      <Grid item sm={12} xs={12}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          Semester:
                        </Typography>
                        <Typography variant='body1'>{student.semester}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Birth Date:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.birthDate ? dayjs(student.birthDate).format('MMMM DD, YYYY') : '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Birth Place:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.birthPlace || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Religion:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.religion || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Citizenship:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.citzenship || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Sex:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.sex || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Father's Name:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.fatherName || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Mother's Name:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.motherName || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Guardian's Name:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.guardianName || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Elementary School:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.elementary || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Date Graduated:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.elementaryGraduated ? dayjs(student.elementaryGraduated).format('MMMM DD, YYYY') : '[FIELD IS BLANK]'}
                  </Typography>
                </Grid>
                {student.secondary ? (
                  <>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Secondary High School:
                      </Typography>
                      <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                        {student.secondary || '[FIELD IS BLANK] '}
                      </Typography>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Date Graduated:
                      </Typography>
                      <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                        {student.secondaryGraduated ? dayjs(student.secondaryGraduated).format('MMMM DD, YYYY') : '[FIELD IS BLANK]'}
                      </Typography>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Junior High School:
                      </Typography>
                      <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                        {student.juniorHigh || '[FIELD IS BLANK] '}
                      </Typography>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Date Graduated:
                      </Typography>
                      <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                        {student.juniorHighGraduated ? dayjs(student.juniorHighGraduated).format('MMMM DD, YYYY') : '[FIELD IS BLANK]'}
                      </Typography>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Senior High School:
                      </Typography>
                      <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                        {student.seniorHigh || '[FIELD IS BLANK] '}
                      </Typography>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Date Graduated:
                      </Typography>
                      <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                        {student.seniorHighGraduated ? dayjs(student.seniorHighGraduated).format('MMMM DD, YYYY') : '[FIELD IS BLANK]'}
                      </Typography>
                    </Grid>
                  </>
                )}
                {student.tertiary ? (
                  <>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Tertiary School:
                      </Typography>
                      <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                        {student.tertiary || '[FIELD IS BLANK] '}
                      </Typography>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Date Graduated:
                      </Typography>
                      <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                        {student.tertiaryGraduated ? dayjs(student.tertiaryGraduated).format('MMMM DD, YYYY') : '[FIELD IS BLANK]'}
                      </Typography>
                    </Grid>
                  </>
                ) : null}
                {student.employedAt ? (
                  <>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Employed At:
                      </Typography>
                      <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                        {student.employedAt || '[FIELD IS BLANK]'}
                      </Typography>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Position:
                      </Typography>
                      <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                        {student.position || '[FIELD IS BLANK]'}
                      </Typography>
                    </Grid>
                  </>
                ) : null}
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Status:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.status || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Remarks:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.remarks || '[FIELD IS BLANK] '}
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body1' sx={{ mb: 1 }}>
                    Remarks:
                  </Typography>
                  <TextField
                    multiline
                    rows={2}
                    variant='outlined'
                    value={remarks}
                    error={!!remarksError}
                    helperText={remarksError}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
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
              {student.status === 'Unverified' ? (
                <>
                  <Button variant='contained' sx={{ mr: 1 }} type='submit'>
                    Verify
                  </Button>
                  <Button variant='contained' color='warning' sx={{ mr: 1 }} onClick={handleSendRemarks}>
                    Send Remarks
                  </Button>
                </>
              ) : student.status === 'Verified' ?(
                <Button variant='contained' sx={{ mr: 1 }} type='submit'>
                  Unverify
                </Button>
              ) : null}
              <Button variant='outlined' color='secondary' onClick={() => handleClose()}>
                Close
              </Button>
            </DialogActions>
          </form>
        </Dialog>
    </Card>
  )
}

export default DialogViewStudent
