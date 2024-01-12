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
import EditIcon from '@mui/icons-material/Edit'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Input from '@mui/material/Input'
import Checkbox from '@mui/material/Checkbox'

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

interface StudentData {
  id: number
  studentNumber: number
  firstName: string
  lastName: string
  department: string
  course: string
  image: string
  status: string
}

const DialogViewStudent  = ({ student, refreshData }) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<StudentData>({
    mode: 'onBlur',
    defaultValues: {
      studentNumber: student.studentNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      department: student.department,
      course: student.course,
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
    setLoading(true)

    axios.put(`/api/student/${student.id}`, { status: 'verified' })
      .then(() => {
        setLoading(false)
        toast.success('Student Verified Successfully')
        handleClose()
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
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
                  <img src={`/uploads/${student.image}`} alt='Student Image' style={{ width: '50%', height: 'auto' }} />
                ) : (
                  <Typography variant='body2'>No image attached</Typography>
                )}
              </Box>
              <Grid container spacing={3}>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body2' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Student Number:
                  </Typography>
                  <Typography variant='body2' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.studentNumber}
                  </Typography>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body2' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    First Name:
                  </Typography>
                  <Typography variant='body2' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.firstName}
                  </Typography>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body2' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Last Name:
                  </Typography>
                  <Typography variant='body2' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.lastName}
                  </Typography>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body2' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Department:
                  </Typography>
                  <Typography variant='body2' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.department}
                  </Typography>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body2' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Course:
                  </Typography>
                  <Typography variant='body2' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.course}
                  </Typography>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body2' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Status:
                  </Typography>
                  <Typography variant='body2' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                    {student.status}
                  </Typography>
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
              <Button variant='contained' sx={{ mr: 1 }} type='submit'>
                Verify
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

export default DialogViewStudent
