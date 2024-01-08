// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useSession } from 'next-auth/react'

// ** MUI Imports
import { Grid, Card, CardContent, Box, Typography, Button, styled } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface ProfileTabCommonType {
  icon: string
  value: string
  property: string
}

interface Staff {
  id: number
  username: string
  password: string
  employeeNumber: string
  firstName: string
  middleName: string
  lastName: string
  address: string
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

const StaffProfile = () => {
  const { data: session } = useSession()
  const [staff, setStaff] = useState<Staff | null>(null)

  const staffID = session?.user.id

  const capitalizeFirstLetter = string => {
    return string?.charAt(0).toUpperCase() + string?.slice(1)
  }

  const data = {
    fullName: capitalizeFirstLetter(session?.user.firstName) + ' ' + capitalizeFirstLetter(session?.user.lastName),
    location: capitalizeFirstLetter(session?.user.location),
    designation: capitalizeFirstLetter(session?.user.role),
    profileImg: '/images/avatars/1.png',
    designationIcon: 'mdi:invert-colors'
  }

  useEffect(() => {
    const fetchStaff = async () => {
      const res = await fetch('/api/profile/staff/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffID)
      })
      const data = await res.json()
      setStaff(data)
    }

    fetchStaff()
  }, [staffID])

  let fullName

  if (staff?.middleName !== null) {
    fullName =
      capitalizeFirstLetter(staff?.firstName) +
      ' ' +
      capitalizeFirstLetter(staff?.middleName) +
      ' ' +
      capitalizeFirstLetter(staff?.lastName)
  } else {
    fullName = capitalizeFirstLetter(staff?.firstName) + ' ' + capitalizeFirstLetter(staff?.lastName)
  }
  const about = {
    profile: [
      { property: 'Employee Number', value: staff?.employeeNumber, icon: 'mdi:account-card-outline' },
      { property: 'Full Name', value: fullName, icon: 'mdi:account-outline' },
      { property: 'Address', value: capitalizeFirstLetter(staff?.address), icon: 'mdi:account-details-outline' }
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
                  {staff?.firstName + ' ' + staff?.lastName}
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
                  <Box
                    sx={{ mr: 5, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}
                  >
                    <Icon icon='mdi:map-marker-outline' />
                    <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>{staff?.address}</Typography>
                  </Box>
                </Box>
              </Box>
              <Button variant='contained' startIcon={<Icon icon='mdi:account-edit-outline' fontSize={20} />}>
                Edit Profile
              </Button>
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

StaffProfile.acl = {
  action: 'read',
  subject: 'staff-profile-page'
}

export default StaffProfile
