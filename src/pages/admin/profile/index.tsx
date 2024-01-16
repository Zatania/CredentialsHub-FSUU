// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import { useSession } from 'next-auth/react'

// ** MUI Imports
import { Grid, Card, CardContent, Box, Typography, styled } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Views Imports
import DialogAdminEditProfile from 'src/views/pages/admin/EditProfile'

interface ProfileTabCommonType {
  icon: string
  value: string
  property: string
}

interface Admin {
  id: number
  username: string
  firstName: string
  middleName: string
  lastName: string
}

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const AdminProfile = () => {
  const { data: session } = useSession()
  const [admin, setAdmin] = useState<Admin | null>(null)

  const adminID = session?.user.id

  const capitalizeFirstLetter = (string: string | undefined) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : undefined
  }

  const data = {
    fullName: capitalizeFirstLetter(session?.user.firstName) + ' ' + capitalizeFirstLetter(session?.user.lastName),
    location: capitalizeFirstLetter(session?.user.location),
    designation: capitalizeFirstLetter(session?.user.role),
    profileImg: '/images/avatars/1.png',
    designationIcon: 'mdi:invert-colors'
  }

  const fetchAdmin = useCallback(async () => {
    const res = await fetch('/api/profile/admin/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminID)
    })
    const data = await res.json()
    setAdmin(data)
  }, [adminID])

  useEffect(() => {

    fetchAdmin()
  }, [fetchAdmin])

  let fullName

  if (admin?.middleName !== null) {
    fullName =
      capitalizeFirstLetter(admin?.firstName) +
      ' ' +
      capitalizeFirstLetter(admin?.middleName) +
      ' ' +
      capitalizeFirstLetter(admin?.lastName)
  } else {
    fullName = capitalizeFirstLetter(admin?.firstName) + ' ' + capitalizeFirstLetter(admin?.lastName)
  }
  const about = {
    profile: [
      { property: 'Full Name', value: fullName, icon: 'mdi:account-outline' },
    ]
  }

  const designationIcon = data?.designationIcon || 'mdi:briefcase-outline'

  const renderList = (arr: ProfileTabCommonType[]) => {
    if (arr && arr.length) {
      return arr.map((item, index) => {
        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              '&:not(:last-of-type)': { mb: 4 },
              '& svg': { color: 'text.secondary' }
            }}
          >
            <Box sx={{ display: 'flex', mr: 2 }}>
              <Icon icon={item.icon} />
            </Box>

            <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{item.property}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{item.value}</Typography>
            </Box>
          </Box>
        )
      })
    } else {
      return null
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent
            sx={{
              pt: 0,
              mt: 5,
              display: 'flex',
              alignItems: 'flex-end',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}
          >
            <ProfilePicture src={data.profileImg} alt='profile-picture' />
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                ml: { xs: 0, md: 6 },
                alignItems: 'flex-end',
                flexWrap: ['wrap', 'nowrap'],
                justifyContent: ['center', 'space-between']
              }}
            >
              <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
                <Typography variant='h5' sx={{ mb: 4 }}>
                  {admin?.firstName + ' ' + admin?.lastName}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: ['center', 'flex-start']
                  }}
                >
                  <Box
                    sx={{ mr: 5, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}
                  >
                    <Icon icon={designationIcon} />
                    <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>Staff</Typography>
                  </Box>
                </Box>
              </Box>
              <DialogAdminEditProfile admin={admin} refreshData={fetchAdmin}/>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography variant='caption' sx={{ mb: 5, display: 'block', textTransform: 'uppercase' }}>
                About
              </Typography>
              {renderList(about.profile)}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

AdminProfile.acl = {
  action: 'read',
  subject: 'admin-profile-page'
}

export default AdminProfile
