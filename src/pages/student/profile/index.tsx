// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useSession } from 'next-auth/react'

// ** MUI Imports
import { Grid, Card, CardContent, Box, Typography, styled } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks Imports
import dayjs from 'dayjs'

// ** Views Imports
import DialogEditProfile from 'src/views/pages/profile/EditProfile'

interface ProfileTabCommonType {
  icon: string
  value: string
  property: string
}

interface Student {
  id: number
  username: string
  password: string
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

const ProfilePage = () => {
  const { data: session } = useSession()
  const [user, setUser] = useState<Student | null>(null)

  const userID = session?.user.id

  const capitalizeFirstLetter = (string: string | null | undefined) => {
    if (string === null) {
      return ' '; // Return a blank space if the string is null
    }

    return string?.charAt(0).toUpperCase() + string?.slice(1)
  }

  const formatDate = (date: string) => {
    if (date === null) {
      return ' '; // Return a blank space if the date is null
    }

    return dayjs(date).format('MMMM DD, YYYY');
  }

  const data = {
    fullName: capitalizeFirstLetter(session?.user.firstName) + ' ' + capitalizeFirstLetter(session?.user.lastName),
    location: capitalizeFirstLetter(session?.user.location),
    designation: capitalizeFirstLetter(session?.user.role),
    profileImg: `/uploads/${session?.user.image}`,
    designationIcon: 'mdi:invert-colors'
  }

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/profile/student/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userID)
      })
      const data = await res.json()
      setUser(data)
    }

    fetchUser()
  }, [userID])

  let fullName

  if (user?.middleName !== null) {
    fullName =
      capitalizeFirstLetter(user?.firstName) +
      ' ' +
      capitalizeFirstLetter(user?.middleName) +
      ' ' +
      capitalizeFirstLetter(user?.lastName)
  } else {
    fullName = capitalizeFirstLetter(user?.firstName) + ' ' + capitalizeFirstLetter(user?.lastName)
  }
  const about = {
    profile: [
      { property: 'Student Number', value: user?.studentNumber, icon: 'mdi:account-card-outline' },
      { property: 'Full Name', value: fullName, icon: 'mdi:account-outline' },
      { property: 'Department', value: capitalizeFirstLetter(user?.department), icon: 'mdi:account-details-outline' },
      { property: 'Course', value: capitalizeFirstLetter(user?.course), icon: 'mdi:account-details-outline' },
      { property: 'Major', value: capitalizeFirstLetter(user?.major), icon: 'mdi:account-details-outline' },
      ...(user?.graduateCheck === 'yes'
        ? [
            {
              property: 'Graduation Date',
              value: formatDate(user?.graduationDate),
              icon: 'mdi:account-school-outline'
            },
            {
              property: 'Academic Honor',
              value: capitalizeFirstLetter(user?.academicHonor),
              icon: 'mdi:account-school-outline'
            }
          ]
        : []),
      ...(user?.graduateCheck === 'no'
        ? [
            {
              property: 'Year Level',
              value: capitalizeFirstLetter(user?.yearLevel),
              icon: 'mdi:account-school-outline'
            },
            {
              property: 'School Year',
              value: capitalizeFirstLetter(user?.schoolYear),
              icon: 'mdi:account-school-outline'
            },
            {
              property: 'Semester',
              value: capitalizeFirstLetter(user?.semester),
              icon: 'mdi:account-school-outline'
            }
          ]
        : []),
      { property: 'Home Address', value: capitalizeFirstLetter(user?.homeAddress), icon: 'mdi:home-outline' },
      {
        property: 'Contact Number',
        value: capitalizeFirstLetter(user?.contactNumber),
        icon: 'mdi:card-account-phone-outline'
      },
      { property: 'Email Address', value: capitalizeFirstLetter(user?.emailAddress), icon: 'mdi:email-outline' },
      {
        property: 'Birth Date',
        value: formatDate(user?.birthDate),
        icon: 'mdi:cake-variant-outline'
      },
      { property: 'Birth Place', value: capitalizeFirstLetter(user?.birthPlace), icon: 'mdi:cake-variant-outline' },
      { property: 'Religion', value: capitalizeFirstLetter(user?.religion), icon: 'mdi:book-open-outline' },
      { property: 'Citizenship', value: capitalizeFirstLetter(user?.citizenship), icon: 'mdi:account-group-outline' },
      { property: 'Sex', value: capitalizeFirstLetter(user?.sex), icon: 'mdi:human-male-female' },
      { property: 'Father Name', value: capitalizeFirstLetter(user?.fatherName), icon: 'mdi:face-man' },
      { property: 'Mother Name', value: capitalizeFirstLetter(user?.motherName), icon: 'mdi:face-woman' },
      { property: 'Guardian Name', value: capitalizeFirstLetter(user?.guardianName), icon: 'mdi:account-child' },
    ],
    education: [

      {
        property: 'Elementary School',
        value: capitalizeFirstLetter(user?.elementary),
        icon: 'mdi:account-school-outline'
      },
      {
        property: 'Graduation Date',
        value: formatDate(user?.elementaryGraduated),
        icon: 'mdi:account-school-outline'
      },
      {
        property: 'Secondary School',
        value: capitalizeFirstLetter(user?.secondary),
        icon: 'mdi:account-school-outline'
      },
      {
        property: 'Graduation Date',
        value: formatDate(user?.secondaryGraduated),
        icon: 'mdi:account-school-outline'
      },
      {
        property: 'Junior High School',
        value: capitalizeFirstLetter(user?.juniorHigh),
        icon: 'mdi:account-school-outline'
      },
      {
        property: 'Graduation Date',
        value: formatDate(user?.juniorHighGraduated),
        icon: 'mdi:account-school-outline'
      },
      {
        property: 'Senior High School',
        value: capitalizeFirstLetter(user?.seniorHigh),
        icon: 'mdi:account-school-outline'
      },
      {
        property: 'Graduation Date',
        value: formatDate(user?.seniorHighGraduated),
        icon: 'mdi:account-school-outline'
      },
      { property: 'Tertiary School', value: capitalizeFirstLetter(user?.tertiary), icon: 'mdi:account-school-outline' },
      {
        property: 'Graduation Date',
        value: formatDate(user?.tertiaryGraduated),
        icon: 'mdi:account-school-outline'
      }
    ],
    others: [
      { property: 'Employed At', value: capitalizeFirstLetter(user?.employedAt), icon: 'mdi:briefcase-outline' },
      { property: 'Position', value: capitalizeFirstLetter(user?.position), icon: 'mdi:briefcase-outline' }
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
                  {data.fullName}
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
                    <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>{data.designation}</Typography>
                  </Box>
                  <Box
                    sx={{ mr: 5, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}
                  >
                    <Icon icon='mdi:map-marker-outline' />
                    <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>{data.location}</Typography>
                  </Box>
                </Box>
              </Box>
              <DialogEditProfile user={user} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
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
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography variant='caption' sx={{ mb: 5, display: 'block', textTransform: 'uppercase' }}>
                Education
              </Typography>
              {renderList(about.education)}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography variant='caption' sx={{ mb: 5, display: 'block', textTransform: 'uppercase' }}>
                Others
              </Typography>
              {renderList(about.others)}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

ProfilePage.acl = {
  action: 'read',
  subject: 'profile-page'
}

export default ProfilePage
