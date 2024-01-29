import React, { useState, useEffect, forwardRef } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps
} from 'recharts';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

interface PickerProps {
  start: Date | number
  end: Date | number
}

const CustomTooltip = (data: TooltipProps<any, any>) => {
  const { active, payload } = data;

  if (active && payload) {
    // Calculate the dynamic height. Adjust the '30' based on your item height
    const tooltipHeight = payload.length * 30;

    return (
      <div className='recharts-custom-tooltip'>
        <Typography>{data.label}</Typography>
        <Divider />
        {data &&
          data.payload &&
          data.payload.map((i: any) => {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: i.fill, mr: 2.5 } }} key={i.dataKey}>
                <Icon icon='mdi:circle' fontSize='0.6rem' />
                <Typography variant='body2'>{`${i.dataKey} : ${i.payload[i.dataKey]}`}</Typography>
              </Box>
            )
          })}
      </div>
    )
  }

  return null;
}

const CredentialsChart = () => {
  const [data, setData] = useState([]);
  const [endDate, setEndDate] = useState<DateType>(null)
  const [startDate, setStartDate] = useState<DateType>(null)

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return (
      <TextField
        {...props}
        size='small'
        value={value}
        inputRef={ref}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Icon icon='mdi:bell-outline' />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              <Icon icon='mdi:chevron-down' />
            </InputAdornment>
          )
        }}
      />
    )
  })

  const handleOnChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  useEffect(() => {
    const formatDate = (date) => date ? format(date, 'yyyy-MM-dd') : '';

    axios.get('/api/credentials/count')
      .then((response) => {
        let filteredData = response.data;

        // Filter data based on selected date range
        if (startDate || endDate) {
          const formattedStartDate = formatDate(startDate);
          const formattedEndDate = formatDate(endDate);
          filteredData = filteredData.filter(item => {
            const itemDate = formatDate(new Date(item.date));

            return (!formattedStartDate || itemDate >= formattedStartDate) &&
                   (!formattedEndDate || itemDate <= formattedEndDate);
          });
        }

        setData(filteredData);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [startDate, endDate]);

  // Extract keys (metrics) from the data
  const extractDataKeys = (data) => {
    const allKeys = new Set();
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'date') {
          allKeys.add(key);
        }
      });
    });

    return Array.from(allKeys);
  }

  const dataKeys = extractDataKeys(data);
  console.log("Data Keys:", dataKeys);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  return (
    <Card>
      <CardHeader
        title='Credentials Overview'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <DatePicker
            selectsRange
            endDate={endDate}
            id='recharts-area'
            selected={startDate}
            startDate={startDate}
            onChange={handleOnChange}
            placeholderText='Click to select a date'
            customInput={<CustomInput start={startDate as Date | number} end={endDate as Date | number} />}
          />
        }
      />
      <CardContent>
        <Box sx={{ height: 500 }}>
          <ResponsiveContainer>
            <AreaChart height={500} data={data} margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0
            }}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="date" />
              <YAxis/>
              <Tooltip content={CustomTooltip} />
              {dataKeys.map((key) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId={key}
                  stroke='0'
                  fill={getRandomColor()}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CredentialsChart;
