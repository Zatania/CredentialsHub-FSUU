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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})


const DialogViewPrompt  = ({ prompt, isVisible, closeDialog }) => {

  const handleClose = () => {
    // Call the closeDialog function to close the dialog
    closeDialog();
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={isVisible}
        maxWidth='md'
        scroll='body'
        onClose={() => handleClose()}
        TransitionComponent={Transition}
        onBackdropClick={() => handleClose()}
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
            onClick={() => handleClose()}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Attention!
            </Typography>
          </Box>
          <Grid container spacing={3} sx={{ textAlign: 'center' }}>
            <Grid item sm={12} xs={12}>
              <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                {prompt.text}
              </Typography>
            </Grid>
            <Grid item sm={12} xs={12}>
              <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                Contact Number:
              </Typography>
              <Typography variant='body1' sx={{ fontSize: '16px', marginBottom: '4px' }}>
                {prompt.contact_number}
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
          <Button variant='outlined' color='secondary' onClick={() => handleClose()}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DialogViewPrompt
