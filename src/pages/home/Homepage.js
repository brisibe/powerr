import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userContext from '../../context/UserContext'
import Meter from '../../components/meter/Meter'
import UtilsContext from '../../context/UtilsContext'
import PatternBg from '../../assets/bg_pattern.svg'
import StatusModal from '../../components/modals/StatusModal'
import PaymentTypeModal from '../../components/modals/PaymentTypeModal'
import MeterRequestModal from '../../components/modals/MeterRequestModal'
import { useGetMeterByUserId } from '../../api/meter'
import { Alert, AlertDescription, AlertIcon, AlertTitle, Text } from '@chakra-ui/react'
import { useGetUserWallet } from '../../api/wallet'

const Homepage = () => {
  const {userStateVal} = useContext(userContext)
  const {setUtil} = useContext(UtilsContext);
  const [openPaymentModal, setOpenPaymentModal] = useState(false)
  const [openMeterRequestModal, setOpenMeterRequestModal] = useState(false)
  const userMeter = useGetMeterByUserId(userStateVal?.currentUser?.id)

  const wallet = useGetUserWallet(userStateVal?.currentUser?.id);
 
  // console.log(wallet.data, 'from nam')
  console.log(userMeter.data?.data?.meters[0]?.Id, 'from meter side')


 const router = useNavigate()
  useEffect(()=> {
    if(!userStateVal.isLoggedIn){
      router('/login')
    }
  }, [])

  const handleBuyUnit =() => {
    setUtil((prevState)=> ({
      ...prevState,
      overlayLoading: true
    }))
    setTimeout(()=> {
      setUtil((prevState)=> ({
        ...prevState,
        overlayLoading: false
      }))
    }, 3000)
  }
  return (
<>
   <div className=" min-h-full  flex divide-gray-200 divide-x-2">

    <div className=" w-1/3  min-h-full grid place-items-center ">
  <div className="text-center" style={{backgroundImage: `url(${PatternBg})`}} >
    <p className="text-lg p-4 font-bold text-gray-600">Purchase Meter Units</p>
      <button onClick={() => setOpenPaymentModal(true)} className="button_primary w-40 rounded text-lg">
        Buy now
      </button>
  </div>
    </div>
    <div className='min-h-full  w-2/3 grid place-items-center '>
      {
  (userMeter?.data?.statusCode === 200 && userMeter.data?.data?.meters?.length > 0 && userMeter.data?.data?.isApproved) ? 
  <Meter  availableUnit={userMeter.data?.data?.meters[0]?.availableUnit}  status={userMeter.data?.data?.meters[0]?.status}  discoName={userMeter.data?.data?.meters[0]?.discoName} meterNumber={userMeter.data?.data?.meters[0]?.meterNumber} /> 
  :(userMeter?.data?.statusCode === 200   && !userMeter.data?.data?.isApproved && userMeter.data?.data?.status === 1)? <Alert
  status='info'
  variant='subtle'
  flexDirection='column'
  alignItems='center'
  justifyContent='center'
  textAlign='center'
  height='200px'
  width={'70%'}
>
  <AlertIcon boxSize='40px' mr={0} />
  <AlertTitle mt={4} mb={1} fontSize='lg'>
   Under Review
  </AlertTitle>
  <AlertDescription maxWidth='sm'>
   Please be patient while your request is being processed
  </AlertDescription>
</Alert> :   userMeter?.data?.statusCode === 204? (<div className="text-center">
  <p className="text-lg p-4 font-bold text-gray-600">You don't have an active meter.</p>
    <button onClick={() => setOpenMeterRequestModal(true)} className="button_primary w-40 rounded text-lg">
      Request A Meter
    </button>
</div>): <Text textAlign={'center'}>Your previous meter request was rejected, Contact our customer care for complaints</Text>
}
      
    </div>
 
  </div>
  <MeterRequestModal refresh={userMeter?.refetch} openMeterRequestModal={openMeterRequestModal} closeMeterRequestModal={()=> setOpenMeterRequestModal(false)} />
  <PaymentTypeModal walletId={wallet?.data?.id} amount={500}  title={'wallet will be deducted the sum of NGN500'} isModalOpen={openPaymentModal} closeModal={() =>setOpenPaymentModal(false)} />
  </>
  )
}

export default Homepage