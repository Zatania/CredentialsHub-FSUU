// ** React Imports
import { Ref, useEffect, useState, forwardRef, ReactElement } from 'react'

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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { useRouter } from 'next/router'

import { Controller, useForm } from 'react-hook-form';

import axios from 'axios'
import toast from 'react-hot-toast'
import { FormControl, TextField, FormHelperText } from '@mui/material'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface Prompt {
  id: number
  text: string
  contact_number: string
}

const EditPrompt  = () => {
  const [show, setShow] = useState<boolean>(true)
  const [prompt, setPrompt] = useState<Prompt | null>(null)

  const router = useRouter()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<Prompt>({
    mode: 'onBlur'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/register/prompt')
        const data = await response.json()
        setPrompt(data[0])

        setValue('id', data[0].id)
        setValue('text', data[0].text)
        setValue('contact_number', data[0].contact_number)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }

    fetchData()
  }, [setValue])

  const handleClose = () => {
    setShow(false)
    router.push('/')
  }

  const onSubmit = async (data: Prompt) => {
    axios.put(`/api/admin/prompt/edit`, data)
      .then(() => {
        toast.success('Prompt Edited Successfully')
        handleClose()
      })
      .catch((error) => {
        console.error(error)
        toast.error('Prompt Editing Failed')
      })
  }

  return (
    <Card>
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
                Edit Prompt
              </Typography>
            </Box>
              <Grid container spacing={6}>
                <Grid item sm={12} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='text'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          label='Text'
                          multiline
                          rows={4}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.text)}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                    {errors.text && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.text.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='contact_number'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          label='Contact Number'
                          rows={4}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.contact_number)}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                    {errors.contact_number && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.contact_number.message}</FormHelperText>
                    )}
                  </FormControl>
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
              Submit
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

EditPrompt.acl = {
  action: 'read',
  subject: 'prompt-page'
}

export default EditPrompt
