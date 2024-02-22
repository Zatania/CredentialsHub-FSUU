// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import {
  GridRowsProp,
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRenderCellParams,
 } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import PrintIcon from '@mui/icons-material/PrintOutlined'
import Button from '@mui/material/Button'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Third Party Props
import axios from 'axios'
import dayjs from 'dayjs'
import download from 'downloadjs'
import { useSession } from 'next-auth/react'

// ** Views Imports
import DialogViewTransaction from 'src/views/pages/students/ViewTransaction'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** PDF Fill
import { PDFDocument } from 'pdf-lib'

interface Transaction {
  id: number
  transaction_date: string
  total_amount: string
  credentials: Credential[]
}

interface Credential {
  name: string
  total_quantity: string
  total_price: string
}

interface StatusObj {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  Submitted: { title: 'Submitted', color: 'primary' },
  Ready: { title: 'Ready', color: 'secondary' },
  Claimed: { title: 'Claimed', color: 'success' },
  Rejected: { title: 'Rejected', color: 'error' },
  Scheduled: { title: 'Scheduled', color: 'info' }
}

const StudentTransactions = () => {
  // ** States
  const [submittedPagination, setSubmittedPagination] = useState({ page: 0, pageSize: 10 })
  const [scheduledPagination, setScheduledPagination] = useState({ page: 0, pageSize: 10 })
  const [readyPagination, setReadyPagination] = useState({ page: 0, pageSize: 10 })
  const [claimedPagination, setClaimedPagination] = useState({ page: 0, pageSize: 10 })
  const [rejectedPagination, setRejectedPagination] = useState({ page: 0, pageSize: 10 })
  const [submittedRows, setSubmittedsRows] = useState<GridRowsProp>([])
  const [scheduledRows, setScheduledRows] = useState<GridRowsProp>([])
  const [readyRows, setReadyRows] = useState<GridRowsProp>([])
  const [claimedRows, setClaimedRows] = useState<GridRowsProp>([])
  const [rejectedRows, setRejectedRows] = useState<GridRowsProp>([])

  const { data: session } = useSession()

  // ** Hooks

  // ** Vars

  // Fetch All Transactions
  useEffect(() => {
    fetchAllTransactions()
  }, [])

  const fetchAllTransactions = () => {
    axios.get('/api/student/transactions')
      .then(response => {
        const data = response.data
        setSubmittedsRows(data.Submitted || [])
        setScheduledRows(data.Scheduled || [])
        setReadyRows(data.Ready || [])
        setClaimedRows(data.Claimed || [])
        setRejectedRows(data.Rejected || [])
      })
      .catch(error => console.error("Error fetching data", error))
  }

  function formatNumberWithCommas(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const printPDF = async (transaction_id: number) => {
    const formUrl = 'http://localhost:3000/pdf/fsuu-request-form.pdf'
    const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(formPdfBytes)

    const form = pdfDoc.getForm()

    // Fetch user data
    const userResponse = await axios.get(`/api/print/user/${session?.user.id}`);

    // Fetch transaction data
    const transactionResponse = await axios.get(`/api/print/credentials/${transaction_id}`);

    if (userResponse.data && transactionResponse.data) {
      const userData = userResponse.data;
      const transactionData = transactionResponse.data;

      const dateFilled = form.getTextField('Date filled')
      const studentNumber = form.getTextField('Student#')
      const nameOfStudent = form.getTextField('Name of Student')
      const course = form.getTextField('Course')
      const major = form.getTextField('MajorSpecialization')
      const graduatedYes = form.getTextField('Yes')
      const graduatedNo = form.getTextField('No')
      const graduationDate = form.getTextField('Date of Graduation')
      const academicHonor = form.getTextField('Academic Honor Received')
      const yearLevel = form.getTextField('If not graduated Year Level')
      const lastSchoolYear = form.getTextField('School Year')
      const semester = form.getTextField('Semester')
      const homeAddress = form.getTextField('Home Address')
      const contactNumber = form.getTextField('Contact No')
      const email = form.getTextField('Email Add')
      const birthDate = form.getTextField('Birth Date')
      const birthPlace = form.getTextField('Birth Place')
      const religion = form.getTextField('Religion')
      const citizenship = form.getTextField('Citizenship')
      const sex = form.getTextField('Sex')
      const nameOfFather = form.getTextField('Name of Father')
      const nameOfMother = form.getTextField('Name of Mother')
      const nameOfGuardian = form.getTextField('Name of GuardianSpouse')
      const elementary = form.getTextField('Elementary')
      const elementaryYear = form.getTextField('Elementary Year Graduated')
      const secondary = form.getTextField('Secondary')
      const secondaryYear = form.getTextField('Secondary Year Graduated')
      const juniorHigh = form.getTextField('Junior High')
      const juniorHighYear = form.getTextField('Junior High Year Graduated')
      const seniorHigh = form.getTextField('Senior High')
      const seniorHighYear = form.getTextField('Senior High Year Graduated')
      const tertiary = form.getTextField('Tertiary')
      const tertiaryYear = form.getTextField('Tertiary Year Graduated')
      const employedAt = form.getTextField('Employed at')
      const position = form.getTextField('Position')
      const transcriptCheck = form.getTextField('Transcript of Records')
      const transcriptCopies = form.getTextField('Transcript Copies')
      const transcriptAmount = form.getTextField('Transcript Amount')
      const dismissalCheck = form.getTextField('Honorable Dismissal')
      const dismissalCopies = form.getTextField('Dismissal Copies')
      const dismissalAmount = form.getTextField('Dismissal Amount')
      const moralCharacterCheck = form.getTextField('Good Moral Character')
      const moralCharacterCopies = form.getTextField('Moral Character Copies')
      const moralCharacterAmount = form.getTextField('Moral Character Amount')
      const diplomaCheck = form.getTextField('Diploma')
      const diplomaCopies = form.getTextField('Diploma Copies')
      const diplomaAmount = form.getTextField('Diploma Amount')
      const authenticationCheck = form.getTextField('Authentication')
      const authenticationCopies = form.getTextField('Authentication Copies')
      const authenticationAmount = form.getTextField('Authentication Amount')
      const courseDescriptionCheck = form.getTextField('Course Description')
      const courseDescriptionCopies = form.getTextField('Course Description Copies')
      const courseDescriptionAmount = form.getTextField('Course Description Amount')
      const certificationCheck = form.getTextField('Certification')
      const certificationType = form.getTextField('Certification Type')
      const certificationCopies = form.getTextField('Certification Copies')
      const certificationAmount = form.getTextField('Certification Amount')
      const cavRedRibbonCheck = form.getTextField('CAV')
      const cavRedRibbonCopies = form.getTextField('CAV Copies')
      const cavRedRibbonAmount = form.getTextField('CAV Amount')
      const totalAmount = form.getTextField('Total Amount')
      const purpose = form.getTextField('Purpose')
      const assistedBy = form.getTextField('Assisted by')

      // Fill textfields from form data
      transactionData.forEach((transaction: Transaction) => {
        dateFilled.setText(transaction.transaction_date)
      })
      studentNumber.setText(userData[0].studentNumber ||  '')
      nameOfStudent.setText(userData[0].firstName + ' ' + userData[0].lastName ||  '')
      course.setText(userData[0].course ||  '')
      major.setText(userData[0].major ||  '')
      if (userData[0].graduateCheck === 'yes') {
        graduatedYes.setText('X')
        graduationDate.setText(userData[0].graduationDate ||  '')
        academicHonor.setText(userData[0].academicHonor ||  '')
      } else {
        graduatedNo.setText('X')
        yearLevel.setText(userData[0].yearLevel ||  '')
        lastSchoolYear.setText(userData[0].schoolYear ||  '')
        semester.setText(userData[0].semester ||  '')
      }
      homeAddress.setText(userData[0].homeAddress ||  '')
      contactNumber.setText(userData[0].contactNumber ||  '')
      email.setText(userData[0].emailAddress ||  '')
      birthDate.setText(userData[0].birthDate != 'Invalid Date' ? userData[0].birthDate :  '')
      birthPlace.setText(userData[0].birthPlace ||  '')
      religion.setText(userData[0].religion ||  '')
      citizenship.setText(userData[0].citizenship ||  '')
      sex.setText(userData[0].sex ||  '')
      if (userData[0].fatherName) {
        nameOfFather.setText(userData[0].fatherName ||  '')
      }
      if (userData[0].motherName) {
        nameOfMother.setText(userData[0].motherName ||  '')
      }
      if (userData[0].guardianName) {
        nameOfGuardian.setText(userData[0].guardianName ||  '')
      }
      elementary.setText(userData[0].elementary ||  '')
      elementaryYear.setText(userData[0].elementaryGraduated != 'Invalid Date' ? userData[0].elementaryGraduated :  '')
      if (userData[0].secondary) {
        secondary.setText(userData[0].secondary ||  '')
        secondaryYear.setText(userData[0].secondaryGraduated != 'Invalid Date' ? userData[0].secondaryGraduated :  '')
      } else {
        juniorHigh.setText(userData[0].juniorHigh ||  '')
        juniorHighYear.setText(userData[0].juniorHighGraduated != 'Invalid Date' ? userData[0].juniorHighGraduated :  '')
        seniorHigh.setText(userData[0].seniorHigh ||  '')
        seniorHighYear.setText(userData[0].seniorHighGraduated != 'Invalid Date' ? userData[0].seniorHighGraduated :  '')
      }
      if (userData[0].tertiary) {
        tertiary.setText(userData[0].tertiary ||  '')
        tertiaryYear.setText(userData[0].tertiaryGraduated != 'Invalid Date' ? userData[0].tertiaryGraduated :  '')
      }
      if (userData[0].employedAt) {
        employedAt.setText(userData[0].employedAt ||  '')
        position.setText(userData[0].position ||  '')
      }

      transactionData.forEach((transaction: Transaction) => {
        let hasNonZeroQuantity = false; // Flag to check for non-zero quantities

        transaction.credentials.forEach(credential => {
          switch (credential.name) {
            case 'Transcript of Records':
              if (credential.total_quantity !== '0') {
                hasNonZeroQuantity = true; // Set flag if quantity is not zero
                transcriptCheck.setText('X');
                transcriptCopies.setText(credential.total_quantity);
                transcriptAmount.setText(credential.total_price);
              }
              break;
            case 'Honorable Dismissal':
              if (credential.total_quantity !== '0') {
                hasNonZeroQuantity = true; // Set flag if quantity is not zero
                dismissalCheck.setText('X');
                dismissalCopies.setText(credential.total_quantity);
                dismissalAmount.setText(credential.total_price);
              }
              break;
            case 'Good Moral Character':
              if (credential.total_quantity !== '0') {
                hasNonZeroQuantity = true; // Set flag if quantity is not zero
                moralCharacterCheck.setText('X');
                moralCharacterCopies.setText(credential.total_quantity);
                moralCharacterAmount.setText(credential.total_price);
              }
              break;
            case 'Diploma':
              if (credential.total_quantity !== '0') {
                hasNonZeroQuantity = true; // Set flag if quantity is not zero
                diplomaCheck.setText('X');
                diplomaCopies.setText(credential.total_quantity);
                diplomaAmount.setText(credential.total_price);
              }
              break;
            case 'Authentication':
              if (credential.total_quantity !== '0') {
                hasNonZeroQuantity = true; // Set flag if quantity is not zero
                authenticationCheck.setText('X');
                authenticationCopies.setText(credential.total_quantity);
                authenticationAmount.setText(credential.total_price);
              }
              break;
            case 'Course Description/Outline':
              if (credential.total_quantity !== '0') {
                hasNonZeroQuantity = true; // Set flag if quantity is not zero
                courseDescriptionCheck.setText('X');
                courseDescriptionCopies.setText(credential.total_quantity);
                courseDescriptionAmount.setText(credential.total_price);
              }
              break;
            case 'Certification':
              if (credential.total_quantity !== '0') {
                hasNonZeroQuantity = true; // Set flag if quantity is not zero
                certificationCheck.setText('X');
                certificationCopies.setText(credential.total_quantity);
                certificationAmount.setText(credential.total_price);
              }
              break;
            case 'CAV / Red Ribbon':
              if (credential.total_quantity !== '0') {
                hasNonZeroQuantity = true; // Set flag if quantity is not zero
                cavRedRibbonCheck.setText('X');
                cavRedRibbonCopies.setText(credential.total_quantity);
                cavRedRibbonAmount.setText(credential.total_price);
              }
              break;
          }
        });

        // Set totalAmount for the transaction if any credential has a non-zero quantity
        if (hasNonZeroQuantity) {
          totalAmount.setText(transaction.total_amount.toString());
        }
      })
      assistedBy.setText('Online Filled by: ' + userData[0].firstName + ' ' + userData[0].lastName)

      // save pdf
      const pdfBytes = await pdfDoc.save()

      transactionData.forEach((transaction: Transaction) => {
        download(pdfBytes, '(' + transaction.transaction_date + ')' + ' - ' + userData[0].firstName + ' ' + userData[0].lastName + ' - CredentialRequest.pdf', 'application/pdf')
      })
    }
  }

  const submittedColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 100,
      field: 'id',
      headerName: 'ID',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'requestType', // Change the field name to 'requestType'
      headerName: 'Request Type', // Change the header name to 'Request Type'
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {
            params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
            ''
          }
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatNumberWithCommas(params.row.total_amount)}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'paymentDate',
      headerName: 'Payment Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.payment_date ? dayjs(params.row.payment_date).format('MMMM DD, YYYY hh:mm A') : ''}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 250,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <DialogViewTransaction transaction={params.row} refreshData={fetchAllTransactions} />
            <Button size='small' sx={{ ml: 5}} startIcon={<PrintIcon />} variant='outlined' onClick={() => printPDF(params.row.id)}>
              Print
            </Button>
          </>
        )
      }
    }
  ]

  const scheduledColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 100,
      field: 'id',
      headerName: 'ID',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'requestType', // Change the field name to 'requestType'
      headerName: 'Request Type', // Change the header name to 'Request Type'
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {
            params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
            ''
          }
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatNumberWithCommas(params.row.total_amount)}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'paymentDate',
      headerName: 'Payment Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.payment_date ? dayjs(params.row.payment_date).format('MMMM DD, YYYY hh:mm A') : ''}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewTransaction transaction={params.row} refreshData={fetchAllTransactions} />
        )
      }
    }
  ]


  const readyColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 100,
      field: 'id',
      headerName: 'ID',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'requestType', // Change the field name to 'requestType'
      headerName: 'Request Type', // Change the header name to 'Request Type'
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {
            params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
            ''
          }
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatNumberWithCommas(params.row.total_amount)}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'paymentDate',
      headerName: 'Payment Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.payment_date ? dayjs(params.row.payment_date).format('MMMM DD, YYYY hh:mm A') : ''}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewTransaction transaction={params.row} refreshData={fetchAllTransactions} />
        )
      }
    }
  ]

  const claimedColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 100,
      field: 'id',
      headerName: 'ID',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'requestType', // Change the field name to 'requestType'
      headerName: 'Request Type', // Change the header name to 'Request Type'
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {
            params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
            ''
          }
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatNumberWithCommas(params.row.total_amount)}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'paymentDate',
      headerName: 'Payment Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.payment_date ? dayjs(params.row.payment_date).format('MMMM DD, YYYY hh:mm A') : ''}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewTransaction transaction={params.row} refreshData={fetchAllTransactions} />
        )
      }
    }
  ]

  const rejectedColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 100,
      field: 'id',
      headerName: 'ID',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'requestType', // Change the field name to 'requestType'
      headerName: 'Request Type', // Change the header name to 'Request Type'
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {
            params.row.packages.length > 0 ? 'Package' :
            params.row.individualCredentials.length > 0 ? 'Credential/s' :
            ''
          }
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatNumberWithCommas(params.row.total_amount)}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'transactionDate',
      headerName: 'Transaction Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.transaction_date).format('MMMM DD, YYYY hh:mm A')}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'paymentDate',
      headerName: 'Payment Date',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.payment_date ? dayjs(params.row.payment_date).format('MMMM DD, YYYY hh:mm A') : ''}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'action',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DialogViewTransaction transaction={params.row} refreshData={fetchAllTransactions} />
        )
      }
    }
  ]

  return (
    <Grid container spacing={8}>
      <Grid item sm={12} xs={12}>
        <Card>
          <CardHeader title='Submitted Transactions' />
          <DataGrid
            autoHeight
            columns={submittedColumns}
            rows={submittedRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={submittedPagination}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setSubmittedPagination}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                showQuickFilter: true,
              }
            }}
          />
        </Card>
      </Grid>
      <Grid item sm={12} xs={12}>
        <Card>
          <CardHeader title='Scheduled Transactions' />
          <DataGrid
            autoHeight
            columns={scheduledColumns}
            rows={scheduledRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={scheduledPagination}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setScheduledPagination}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                showQuickFilter: true,
              }
            }}
          />
        </Card>
      </Grid>
      <Grid item sm={12} xs={12}>
        <Card>
          <CardHeader title='Ready To Claim Transactions' />
          <DataGrid
            autoHeight
            columns={readyColumns}
            rows={readyRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={readyPagination}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setReadyPagination}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                showQuickFilter: true,
              }
            }}
          />
        </Card>
      </Grid>
      <Grid item sm={12} xs={12}>
        <Card>
          <CardHeader title='Claimed Transactions' />
          <DataGrid
            autoHeight
            columns={claimedColumns}
            rows={claimedRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={claimedPagination}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setClaimedPagination}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                showQuickFilter: true,
              }
            }}
          />
        </Card>
      </Grid>
      <Grid item sm={12} xs={12}>
        <Card>
          <CardHeader title='Rejected Transactions' />
          <DataGrid
            autoHeight
            columns={rejectedColumns}
            rows={rejectedRows}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={rejectedPagination}
            slots={{ toolbar: GridToolbar }}
            onPaginationModelChange={setRejectedPagination}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                showQuickFilter: true,
              }
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

StudentTransactions.acl = {
  action: 'read',
  subject: 'student-transactions-page'
}

export default StudentTransactions
