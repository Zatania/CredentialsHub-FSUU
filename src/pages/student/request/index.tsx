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
import Divider from '@mui/material/Divider'
import { FormControlLabel, FormGroup, Checkbox } from '@mui/material'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface TransactionData {
  user_id: number
  dateFilled: string
  transcriptCopies: number
  transcriptAmount: number
  dismissalCopies: number
  dismissalAmount: number
  moralCharacterCopies: number
  moralCharacterAmount: number
  diplomaCopies: number
  diplomaAmount: number
  authenticationCopies: number
  authenticationAmount: number
  courseDescriptionCopies: number
  courseDescriptionAmount: number
  certificationType: string
  certificationCopies: number
  certificationAmount: number
  cavRedRibbonCopies: number
  cavRedRibbonAmount: number
  totalAmoount: number
  purpose: string
}

const RequestCredentials = () => {
  // ** States
  const [show, setShow] = useState<boolean>(true)

  // ** Hooks
  const router = useRouter()
  const { data: session } = useSession()

  // ** Transaction Price
  const transcriptPrice = 500
  const dismissalPrice = 500
  const moralCharacterPrice = 100
  const diplomaPrice = 500
  const authenticationPrice = 50
  const courseDescriptionPrice = 500
  const certificationPrice = 100
  const cavRedRibbonPrice = 300

  const [showFields, setShowFields] = useState({
    transcript: false,
    dismissal: false,
    moralCharacter: false,
    diploma: false,
    authentication: false,
    courseDescription: false,
    certification: false,
    cavRedRibbon: false
  })

  const handleCheckboxChange = field => {
    setShowFields(prevShowFields => ({
      ...prevShowFields,
      [field]: !prevShowFields[field]
    }))
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<TransactionData>({
    mode: 'onBlur'
  })

  const handleClose = () => {
    // Set show to false
    setShow(false)

    // Redirect to the main index
    router.push('/')
  }

  const onSubmit = async (data: TransactionData) => {
    const dateToday = dayjs().format('YYYY-MM-DD')
    const user_id = session?.user?.id

    // ** Calculate Amount
    const transcriptAmount = (data.transcriptCopies || 0) * transcriptPrice
    const dismissalAmount = (data.dismissalCopies || 0) * dismissalPrice
    const moralCharacterAmount = (data.moralCharacterCopies || 0) * moralCharacterPrice
    const diplomaAmount = (data.diplomaCopies || 0) * diplomaPrice
    const authenticationAmount = (data.authenticationCopies || 0) * authenticationPrice
    const courseDescriptionAmount = (data.courseDescriptionCopies || 0) * courseDescriptionPrice
    const certificationAmount = (data.certificationCopies || 0) * certificationPrice
    const cavRedRibbonAmount = (data.cavRedRibbonCopies || 0) * cavRedRibbonPrice

    // ** Calculate Total Amount
    const totalAmount =
      transcriptAmount +
      dismissalAmount +
      moralCharacterAmount +
      diplomaAmount +
      authenticationAmount +
      courseDescriptionAmount +
      certificationAmount +
      cavRedRibbonAmount

    // ** Insert dateToday, user_id, transcriptAmount, dismissalAmount, moralCharacterAmount, diplomaAmount, authenticationAmount, courseDescriptionAmount, certificationAmount, cavRedRibbonAmount, totalAmount into data

    data = {
      ...data,
      user_id,
      dateFilled: dateToday,
      transcriptAmount,
      dismissalAmount,
      moralCharacterAmount,
      diplomaAmount,
      authenticationAmount,
      courseDescriptionAmount,
      certificationAmount,
      cavRedRibbonAmount,
      totalAmount
    }

    // Parse number fields to integers
    const numericFields = [
      'transcriptCopies',
      'dismissalCopies',
      'moralCharacterCopies',
      'diplomaCopies',
      'authenticationCopies',
      'courseDescriptionCopies',
      'certificationCopies',
      'cavRedRibbonCopies'
    ]

    numericFields.forEach(field => {
      data[field] = parseInt(data[field], 10) || 0
    })

    try {
      const response = await fetch('/api/transactions/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      toast.success('Request Submission Successful')
      router.push('/')
    } catch (error) {
      toast.error('Request Submission Failed')
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
              Request Credentials
            </Typography>
            <Typography variant='body2'>
              Only fill the number of copies of the credentials yoou wanted to request.
            </Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item sm={12} xs={12}>
              <FormGroup row>
                <FormControlLabel
                  label='Transcript of Records'
                  control={
                    <Checkbox
                      name='transcript'
                      checked={showFields.transcript}
                      onChange={() => handleCheckboxChange('transcript')}
                    />
                  }
                />
                <FormControlLabel
                  label='Honorable Dismissal'
                  control={
                    <Checkbox
                      name='dismissal'
                      checked={showFields.dismissal}
                      onChange={() => handleCheckboxChange('dismissal')}
                    />
                  }
                />
                <FormControlLabel
                  label='Good Moral Character'
                  control={
                    <Checkbox
                      name='moralCharacter'
                      checked={showFields.moralCharacter}
                      onChange={() => handleCheckboxChange('moralCharacter')}
                    />
                  }
                />
                <FormControlLabel
                  label='Diploma'
                  control={
                    <Checkbox
                      name='diploma'
                      checked={showFields.diploma}
                      onChange={() => handleCheckboxChange('diploma')}
                    />
                  }
                />
                <FormControlLabel
                  label='Authentication'
                  control={
                    <Checkbox
                      name='authentication'
                      checked={showFields.authentication}
                      onChange={() => handleCheckboxChange('authentication')}
                    />
                  }
                />
                <FormControlLabel
                  label='Course Description / Outline'
                  control={
                    <Checkbox
                      name='courseDescription'
                      checked={showFields.courseDescription}
                      onChange={() => handleCheckboxChange('courseDescription')}
                    />
                  }
                />
                <FormControlLabel
                  label='Certification'
                  control={
                    <Checkbox
                      name='certification'
                      checked={showFields.certification}
                      onChange={() => handleCheckboxChange('certification')}
                    />
                  }
                />
                <FormControlLabel
                  label='CAV / Red Ribbon'
                  control={
                    <Checkbox
                      name='cavRedRibbon'
                      checked={showFields.cavRedRibbon}
                      onChange={() => handleCheckboxChange('cavRedRibbon')}
                    />
                  }
                />
              </FormGroup>
            </Grid>
            {showFields.transcript && (
              <>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    Transcript of Records
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Controller
                    name='transcriptCopies'
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='number'
                        label='Number of Copy'
                        error={!!errors.transcriptCopies}
                        helperText={errors.transcriptCopies?.message}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
            {showFields.dismissal && (
              <>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    Honorable Dismissal
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Controller
                    name='dismissalCopies'
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='number'
                        label='Number of Copy'
                        error={!!errors.dismissalCopies}
                        helperText={errors.dismissalCopies?.message}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
            {showFields.moralCharacter && (
              <>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    Good Moral Character
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Controller
                    name='moralCharacterCopies'
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='number'
                        label='Number of Copy'
                        error={!!errors.moralCharacterCopies}
                        helperText={errors.moralCharacterCopies?.message}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
            {showFields.diploma && (
              <>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    Diploma
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Controller
                    name='diplomaCopies'
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='number'
                        label='Number of Copy'
                        error={!!errors.diplomaCopies}
                        helperText={errors.diplomaCopies?.message}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
            {showFields.authentication && (
              <>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    Authentication
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Controller
                    name='authenticationCopies'
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='number'
                        label='Number of Copy'
                        error={!!errors.authenticationCopies}
                        helperText={errors.authenticationCopies?.message}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
            {showFields.courseDescription && (
              <>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    Course Description / Outline
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Controller
                    name='courseDescriptionCopies'
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='number'
                        label='Number of Copy'
                        error={!!errors.courseDescriptionCopies}
                        helperText={errors.courseDescriptionCopies?.message}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
            {showFields.certification && (
              <>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    Certification
                  </Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Controller
                    name='certificationType'
                    control={control}
                    rules={{ required: 'This field is required' }}
                    defaultValue=''
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Type of Certification'
                        error={!!errors.certificationType}
                        helperText={errors.certificationType?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Controller
                    name='certificationCopies'
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='number'
                        label='Number of Copy'
                        error={!!errors.certificationCopies}
                        helperText={errors.certificationCopies?.message}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
            {showFields.cavRedRibbon && (
              <>
                <Grid item sm={12} xs={12}>
                  <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    CAV / Red Ribbon
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Controller
                    name='cavRedRibbonCopies'
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='number'
                        label='Number of Copy'
                        error={!!errors.cavRedRibbonCopies}
                        helperText={errors.cavRedRibbonCopies?.message}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
            <Grid item sm={12} xs={12}>
              <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item sm={12} xs={12}>
              <Controller
                name='purpose'
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Purpose of Request'
                    error={!!errors.purpose}
                    helperText={errors.purpose?.message}
                  />
                )}
              />
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

RequestCredentials.acl = {
  action: 'read',
  subject: 'request-page'
}

export default RequestCredentials
