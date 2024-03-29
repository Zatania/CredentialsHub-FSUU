// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { signOut } from 'next-auth/react'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

// ** Hooks
import { useSession } from 'next-auth/react'

// ** Third Party Imports
import axios from 'axios'

interface Props {
  settings: Settings
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/', redirect: false }).then(() => {
      axios.post('/api/logout', { user: session?.user })
        .then(() => {
          console.log('Logged out successfully.')
        })
        .catch((error) => {
          console.log(error)
          console.error(error)
        })
      router.asPath = '/'
    })
    handleDropdownClose()
  }

  const { data: session } = useSession()

  const goToProfile = () => {
    if (session?.user.role === 'student') {
      router.push('/student/profile')
    } else if (session?.user.role === 'staff') {
      router.push('/staff/profile')
    } else if (session?.user.role === 'admin') {
      router.push('/admin/profile')
    } else {
      router.push('/')
    }

    handleDropdownClose()
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt={session?.user.firstName + ' ' + session?.user.lastName}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={`/api/images/${session?.user.image}`}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar
                alt={session?.user.firstName + ' ' + session?.user.lastName}
                src={`/api/images/${session?.user.image}`}
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            {session?.user.role === 'student' && (
              <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {session?.user.firstName + ' ' + session?.user.lastName}
                </Typography>
                <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                  Student Number: {session?.user.studentNumber}
                </Typography>
              </Box>
            )}
            {session?.user.role === 'staff' && (
              <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {session?.user.firstName + ' ' + session?.user.lastName}
                </Typography>
                <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                  Employee Number: {session?.user.studentNumber}
                </Typography>
              </Box>
            )}
            {session?.user.role === 'student_assistant' && (
              <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {session?.user.firstName + ' ' + session?.user.lastName}
                </Typography>
                <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                  Student Assistant Number: {session?.user.studentNumber}
                </Typography>
              </Box>
            )}
            {session?.user.role === 'admin' && (
              <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {session?.user.firstName + ' ' + session?.user.lastName}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Divider sx={{ mt: '0 !important' }} />
        <MenuItem sx={{ p: 0 }} onClick={() => goToProfile()}>
          <Box sx={styles}>
            <Icon icon='mdi:account-outline' />
            Profile
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:logout-variant' />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
