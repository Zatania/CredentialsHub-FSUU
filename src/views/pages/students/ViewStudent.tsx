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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
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
  lastName: string
  department: string
  course: string
  graduateCheck: string
  graduationDate: string
  yearLevel: string
  schoolYear: string
  semester: string
  contactNumber: string
  emailAddress: string
  image: string
  status: string
}

const DialogViewStudent  = ({ student, refreshData, actionType }) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)

  const {
    handleSubmit,
    reset  } = useForm<StudentData>({
    mode: 'onBlur',
    defaultValues: {
      studentNumber: student.studentNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      department: student.department,
      course: student.course,
      graduateCheck: student.graduateCheck,
      graduationDate: student.graduationDate,
      yearLevel: student.yearLevel,
      schoolYear: student.schoolYear,
      semester: student.semester,
      contactNumber: student.contactNumber,
      emailAddress: student.emailAddress,
      image: student.image,
      status: student.status
    }
  })

  const handleClose = () => {
    setShow(false)
    reset()  // Reset the form fields to their default values
    refreshData()
  }

  const onSubmit = async () => {

    const newStatus = actionType === 'verify' ? 'Verified' : 'Unverified';

    axios.put(`/api/student/${student.id}?status=${newStatus}`)
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

  return (
    <Card>
      <Button size='small' startIcon={<EditIcon />} onClick={() => setShow(true)} variant='outlined' >
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
              <Grid container spacing={3} sx={{ textAlign: 'center' }}>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Student Number:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.studentNumber}
                  </Typography>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    First Name:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.firstName}
                  </Typography>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Last Name:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.lastName}
                  </Typography>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Department:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.department}
                  </Typography>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Course:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.course}
                  </Typography>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Status:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.status}
                  </Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Contact Number:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.contactNumber}
                  </Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Email Address:
                  </Typography>
                  <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.emailAddress}
                  </Typography>
                </Grid>
                {student.graduateCheck === 'yes' ? (
                  <Grid item sm={12} xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                      Graduation Date:
                    </Typography>
                    <Typography variant='body1'>{dayjs(student.graduationDate).format('MMMM DD, YYYY')}</Typography>
                  </Grid>
                ) : student.graduateCheck === 'no' ? (
                  <Grid item sm={12} xs={12}>
                    <Grid container spacing={6}>
                      <Grid item sm={4} xs={12}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          Year Level:
                        </Typography>
                        <Typography variant='body1'>{student.yearLevel}</Typography>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          School Year:
                        </Typography>
                        <Typography variant='body1'>{student.schoolYear}</Typography>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          Semester:
                        </Typography>
                        <Typography variant='body1'>{student.semester}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}
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
                <Button variant='contained' sx={{ mr: 1 }} type='submit'>
                  Verify
                </Button>
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
