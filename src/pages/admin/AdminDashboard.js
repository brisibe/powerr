import { Badge, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, FormControl, FormLabel, Grid, GridItem, Heading, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, StackDivider, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { useGetUsers } from '../../api/auth'
import { useGetMeterRequests, useGetMeters } from '../../api/meter'
import UtilsContext from '../../context/UtilsContext'
import http from '../../http'

const AnalysisCard = ({heading, bodyText}) => {
  return <Card variant={'elevated'} size={'lg'} bgColor="white"  w={'64'}>
     <CardHeader >
      <Heading size={'md'} color={'gray.600'}>

      {heading}
      </Heading>
     </CardHeader>

     <CardBody>
      <Heading>

      {bodyText}
      </Heading>
     </CardBody>
  </Card>
}

const AdminDashboard = () => {
  const meterRequest = useGetMeterRequests()
  const meters = useGetMeters();
  const users = useGetUsers();
  const {setUtil} = useContext(UtilsContext)
  const toast = useToast()
  const [acceptPayload, setAcceptPayload] = useState({
    meterRequestId: '',
    MeterId: ''
  })
  const { isOpen, onOpen, onClose } = useDisclosure()

 console.log(acceptPayload)
  const handleChange = (e) => {
    setAcceptPayload((prev) => ({...prev, MeterId: e.target.value}))
}

 const handleReject = async(id)=> {


  try {
    setUtil((prevState)=> ({
      ...prevState,
      overlayLoading: true
    }))
    const res = await http.get(`/Meter/rejectMeterRequest?requestId=${id}`)

    if(res?.status === 201){
    toast({
      position: 'top',
      status: 'success',
      title: "Success",
      description:"Request Rejected Successfully",
      duration: 10000
    })
    meterRequest?.refetch()
    }
  } catch (error) {
    toast({
      position: 'top',
      status: 'error',
      title: "Error",
      description:"Something went wrong, try again"
    })
  }finally{
    setUtil((prevState)=> ({
      ...prevState,
      overlayLoading: false
    }))
  }
 }

 
 const handleAccept = async () => {
  try {
    setUtil((prevState)=> ({
      ...prevState,
      overlayLoading: true
    }))
     onClose()
    const res = await http.post('/Meter/activateMeterRequest', {
      MeterRequestId: acceptPayload.meterRequestId,
      MeterId: Number(acceptPayload.MeterId)
    })

    if(res?.status === 201){
    toast({
      position: 'top',
      status: 'success',
      title: "Success",
      description:"Meter request successfully Granted"
    })

    meterRequest.refetch()
    meters.refetch()
    }
  } catch (error) {
    toast({
      position: 'top',
      status: 'error',
      title: "Error",
      description:"Something went wrong, try again"
    })
  }finally{
    setUtil((prevState)=> ({
      ...prevState,
      overlayLoading: false
    }))
  }
}
    

  let activeMeters = meterRequest?.data?.filter(m => m?.isApproved && m.status === 3 && m.meters?.length > 0);
  let inActiveMeters = meters?.data?.filter(m => m?.isAvailable);
  let newRequests = meterRequest?.data?.filter(m => m?.isApproved === false && m.status === 1 );
  let closedRequests = meterRequest?.data?.filter(m =>  m.status !== 1 );
 


  return (
   
     <Box minH={'full'} h="auto"  bgColor={'gray.100'} >

  

      <Grid w={'full'}   justifyContent={'space-around'} p={'8'}  gap={[64, 16,4]} templateColumns={{base:'repeat(1, 1fr)', md:'repeat(3, 1fr)', lg:'repeat(4, 1fr)' }} >
        <GridItem w={'80%'} h={'auto'}>

         <AnalysisCard  heading={"Active Meters"} bodyText={activeMeters ? activeMeters.length :0 }/>
        </GridItem>
        <GridItem w={'80%'} h={'auto'}>

         <AnalysisCard  heading={"Total Meters"} bodyText={meters?.data ? meters?.data?.length : 0}/>
        </GridItem>
        <GridItem w={'80%'} h={'auto'}>

         <AnalysisCard  heading={"Total Requests"} bodyText={meterRequest?.data ? meterRequest?.data?.length : 0}/>
        </GridItem>
        <GridItem w={'80%'} h={'auto'}>

         <AnalysisCard  heading={"Total Users"} bodyText={users?.data ? users?.data?.length : 0}/>
        </GridItem>
       
      </Grid>

      <Flex w={'100%'} px={'4'}>

      <Box w={'30%'} h={'full'}  bgColor={'white'} m={'4'}>
      <Card minH={80}>
  <CardHeader>
    <Heading size='md'>Active Addresses</Heading>
  </CardHeader>

  <CardBody>
    <Stack divider={<StackDivider />} spacing='4'>

      {
        !meterRequest.isLoading && meterRequest.data !== null && meterRequest.data?.filter((m)=> m?.status === 3 && m?.isApproved === true  ).map(req =>  <Box key={req.meterRequestId}>
          <Flex justifyContent={'space-between'} alignItems="center">
  
          <Heading size='xs' textTransform='uppercase'>
            {req?.fullName}
          </Heading>
          <Text>
            Meter: {req?.meters[0]?.meterNumber}
          </Text>
          </Flex>
          <Text pt='2' fontSize='sm'>
            {req?.address}
          </Text>
        </Box> )
      }

      {meterRequest.isLoading && <Text textAlign={'center'}>Loading...</Text>}
     
      
      
    
    </Stack>
  </CardBody>
</Card>
      </Box>
      <Box  w={'70%'} h={'full'} bgColor={'white'} p='2' px={'8'} m={'4'}>
      {/* <Card align='center'    minH={80} h={'100%'}> */}

  {/* <CardBody> */}
  <Tabs defaultIndex={1} minH={'80'} w={'100%'} isFitted>
    
  <TabList h={'12'} >

<Tab>New Requests <span className={`pl-1 ${newRequests?.length > 0 && 'font-black text-green-600'}`}>({newRequests ? newRequests?.length : 0})</span></Tab>
<Tab>Closed ({closedRequests ? closedRequests.length : 0})</Tab>
</TabList>
  <TabPanels>
    <TabPanel>
      <Stack divider={<StackDivider />} spacing="4">

{
  meterRequest?.data !== null && !meterRequest?.isLoading && newRequests?.map(m =>  <Box key={m.id}>
    <Flex justifyContent={'space-between'} alignItems="center">

<Heading size='xs' textTransform='uppercase'>
{m?.fullName}
</Heading>
<Text fontSize={'sm'}>
{new Date(m.requestedAt).toLocaleString("en-US", {timeZone: "America/New_York"})}
</Text>
</Flex>
<Flex justifyContent={'space-between'}>

<Text pt='2' fontSize='sm'>
{m.address}
</Text>

<Flex className='space-x-4 p-2'>
<Button size={'sm'} onClick={()=>handleReject(m.meterRequestId)} colorScheme="red">Reject</Button>
<Button size={'sm'} onClick={()=> {
  setAcceptPayload((prev) => ({...prev,  meterRequestId: m.meterRequestId}))
  onOpen()
}} colorScheme="green">Accept</Button>

<Modal
     isOpen={isOpen}
     onClose={onClose}
   >
     <ModalOverlay />
     <ModalContent>
       <ModalHeader>Meter Allocation</ModalHeader>
       <ModalCloseButton />
       <ModalBody pb={6}>
         <FormControl>
           <FormLabel>Meter</FormLabel>
           <Select value={acceptPayload.MeterId} onChange={handleChange} >
             <option className='hidden'>Select Meter</option>
             {meters.data !== null && inActiveMeters.map((m) => <option value={m.id}>{`${m.meterNumber} ${m.discoName}`}</option>)}
           </Select>
         </FormControl>

      
       </ModalBody>

       <ModalFooter>
         <Button colorScheme='blue' mr={3} onClick={handleAccept}>
           Assign Meter
         </Button>
         
       </ModalFooter>
     </ModalContent>
   </Modal>
</Flex>
</Flex>
    </Box>
    
    )
}

{!meterRequest.isLoading && !newRequests.length && <Text textAlign={'center'} p="4"> No New Request was found</Text>}
      
      
      </Stack>
    </TabPanel>
    <TabPanel>
    <Stack divider={<StackDivider />} spacing="4">


{
    meterRequest?.data !== null && !meterRequest?.isLoading && closedRequests?.map(m => <Box key={m.id}>
      <Flex justifyContent={'space-between'} alignItems="center">
      
      <Heading size='xs' textTransform='uppercase'>
      {m.fullName}
      </Heading>
      <Text fontSize={'sm'}>
      {new Date(m.requestedAt).toLocaleString("en-US", {timeZone: "America/New_York"})}
      </Text>
      </Flex>
      <Flex justifyContent={'space-between'}>
      
      <Text pt='2' fontSize='sm'>
      {m.address}
      </Text>
      
      <Flex className='space-x-4 p-2'>
        {
          m.status === 3 ?  <Badge colorScheme={'green'}>Accepted</Badge> : m.status === 4 ? <Badge colorScheme={'red'}>Rejected</Badge> : <Badge colorScheme={'gray'}>Unknown</Badge>
        }
     
      </Flex>
      </Flex>
      </Box>
   
    
    )
}

{!meterRequest.isLoading && !closedRequests.length && <Text textAlign={'center'} p="4"> No Record was found</Text>}



</Stack>
    </TabPanel>
  </TabPanels>
  
</Tabs>
  {/* </CardBody> */}
  {/* <CardFooter> */}
    {/* <Button colorScheme='blue'>View here</Button> */}
  {/* </CardFooter> */}
{/* </Card> */}
      </Box>
      </Flex>

     </Box>
  )
}

export default AdminDashboard