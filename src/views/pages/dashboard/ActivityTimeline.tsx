// ** React Imports
import { useState } from 'react'

// ** MUI Import
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const ActivityTimeline = ({ logs, load, title }) => {
  const [loading, setLoading] = useState(false)

  return (
    <Card>
      <CardHeader
        title={title}
        titleTypographyProps={{ sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' } }}
      />
      <CardContent>
        <Timeline sx={{ my: 0, py: 0 }}>
          {logs.map((log, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color='primary' />
                {index < logs.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent sx={{ pr: 0, mt: 0, mb: theme => `${theme.spacing(1.5)} !important` }}>
                <Box
                  sx={{
                    mb: 2.5,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                    {log.activity}
                  </Typography>
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    {log.date}
                  </Typography>
                </Box>
                <Typography variant='body2'>{log.activity_type}</Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
          <Button
            onClick={load}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </Timeline>
      </CardContent>
    </Card>
  )
}

export default ActivityTimeline
