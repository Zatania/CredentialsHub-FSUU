import React, { useState, useEffect, forwardRef } from 'react';

// ** MUI Imports
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

interface PickerProps {
  start: Date | number
  end: Date | number
}

const StaffCredentialsTable = (props) => {
  const { staff_id } = props;

  const [data, setData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
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

    axios.get(`/api/credentials/table/${staff_id}`)
      .then((response) => {
        let raw_data = response.data;

        // Filter data based on selected date range
        if (startDate || endDate) {
          const formattedStartDate = formatDate(startDate);
          const formattedEndDate = formatDate(endDate);
          raw_data = raw_data.filter(item => {
            const itemDate = formatDate(new Date(item.date));

            return (!formattedStartDate || itemDate >= formattedStartDate) &&
                   (!formattedEndDate || itemDate <= formattedEndDate);
          });
        }

        let departmentAggregate = {};
        raw_data.forEach(item => {
          item.departments.forEach(department => {

            if (!departmentAggregate[department.department]) {
              departmentAggregate[department.department] = {
                id: department.department.replace(/\s+/g, '_').toLowerCase(),
                department: department.department,
              };
            }
            // Aggregate for each credential
            department.credentials.forEach(credential => {
              // Initialize credential quantity if it does not exist
              if (!departmentAggregate[department.department][credential.name]) {
                departmentAggregate[department.department][credential.name] = 0;
              }

              // Sum the credential quantity
              departmentAggregate[department.department][credential.name] += credential.quantity;
            });

            department.packages.forEach(pkgItem => {
              // Initialize package quantity if it does not exist
              if (!departmentAggregate[department.department][pkgItem.name]) {
                departmentAggregate[department.department][pkgItem.name] = 0;
              }

              // Sum the package quantity
              departmentAggregate[department.department][pkgItem.name] += pkgItem.quantity;
            })
          });
        });

        const aggregatedData = Object.values(departmentAggregate);
        setData(aggregatedData);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [startDate, endDate, staff_id]);

  const staffCredentialsColumns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 250,
      field: 'department',
      headerName: 'Department',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.department}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'Transcript of Records', // Ensure this matches the key in your data
      headerName: 'Transcript of Records',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row['Transcript of Records'] ? params.row['Transcript of Records'] : '0'}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'Diploma',
      headerName: 'Diploma',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row['Diploma'] ? params.row['Diploma'] : '0'}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'CAV / Red Ribbon',
      headerName: 'CAV / Red Ribbon',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row['CAV / Red Ribbon'] ? params.row['CAV / Red Ribbon'] : '0'}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'Grade Slip',
      headerName: 'Grade Slip',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row['Grade Slip'] ? params.row['Grade Slip'] : '0'}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'PRC Board Examination',
      headerName: 'PRC Board Examination',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row['PRC Board Examination'] ? params.row['PRC Board Examination'] : '0'}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'Transfer Credentials',
      headerName: 'Transfer Credentials',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row['Transfer Credentials'] ? params.row['Transfer Credentials'] : '0'}
        </Typography>
      )
    },
  ]

  return (
    <CardContent>
      <CardHeader
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
      <DataGrid
        autoHeight
        columns={staffCredentialsColumns}
        rows={data}
        pageSizeOptions={[5, 10, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          baseButton: {
            variant: 'outlined'
          },
          toolbar: {
            showQuickFilter: true,
          }
        }}
      />
    </CardContent>
  );
};

export default StaffCredentialsTable;
