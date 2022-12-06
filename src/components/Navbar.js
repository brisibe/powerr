import { Button, Flex, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Switch, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useGetMeterByUserId, useGetMeterRequests, useGetMeters } from '../api/meter'
import { useGetUserWallet } from '../api/wallet'
import Logo from '../assets/colored_logo.svg'
import userContext from '../context/UserContext'
import UtilsContext from '../context/UtilsContext'
import http from '../http'
import { Input } from './Input'

function CreateMeterModal({isOpen, onClose, userId}) {
  const [disco, setDisco]=useState({
    value: ''
  });

  const meters = useGetMeters()

  

  const {setUtil} = useContext(UtilsContext)


 const toast = useToast()
  const handleChange = (e) => {
      setDisco({value: e.target.value})
  }

  const handleSubmit = async () => {
   
    try {
      setUtil((prevState)=> ({
        ...prevState,
        overlayLoading: true
      }))
       onClose()
      const res = await http.post('/Meter/createMeter', {
        DiscoName: disco.value
      })

      if(res?.status === 201){
      toast({
        position: 'top',
        status: 'success',
        title: "Success",
        description:"Meter was successfully Created"
      })

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

  return (
    <>
  
      <Modal
     
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new meter</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Disco Name</FormLabel>
              <Select value={disco.value} onChange={handleChange} >
                <option className='hidden'>Select Disco</option>
                <option value={'IKEDC'}>IKEDC</option>
                <option value={'EKEDC'}>EKEDC</option>
              </Select>
            </FormControl>

         
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Add meter
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
function FundWalletModal({isOpen, close, walletId, refetch}) {
  const [walletPayload, setWalletPayload]=useState({
    
    walletId: '',
    fundAmount: ''

  });
  
  const {setUtil} = useContext(UtilsContext)
 const toast = useToast()
  const handleChange = (e) => {
      setWalletPayload((prev) => ({ walletId: 55, fundAmount: Number(e.target.value)}))
  }

  const handleSubmit = async () => {
    try {
      setUtil((prevState)=> ({
        ...prevState,
        overlayLoading: true
      }))
      const res = await http.post('/Wallet/fundWallet', {
        walletId: walletId,
        fundAmount: walletPayload.fundAmount
      })


      if(res?.data?.statusCode === 200){
      toast({
        position: 'top',
        status: 'success',
        title: "Fund Deposited",
        description:"Wallet has been funded"
      })
      }
      close(false)
      refetch()
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

  return (
    <>
  
      <Modal
     
        isOpen={isOpen}
        onClose={close}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fund Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input id={'amount'} name='amount' type={'number'} label={'Amount'} onChange={handleChange} placeholder={'500.00'}/>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Fund Wallet
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

const router = useNavigate()
const {userStateVal, setUserStateVal} = useContext(userContext)
const [isToggled, setIsToggled] = useState(false);
const {util, setUtil} = useContext(UtilsContext)
const wallet = useGetUserWallet(userStateVal?.currentUser?.id);
const [walletModalOpen, setWalletModalOpen] = useState(false)
const userMeter = useGetMeterByUserId(userStateVal?.currentUser?.id)

console.log(userMeter.data, 'from here')

const handleLogout =()=> {
  setUserStateVal(prev => ({
     isLoggedIn: false,
     currentUser: null
     
  }))

  window.sessionStorage.removeItem('user');
}

const fetchFunction = async () => {
    const res = await http.post('/Meter/load', {
      meterId: userMeter.data?.data?.meters[0]?.id,
      unit: 1
    })
    
    
    userMeter.refetch()

    if(res?.data.statusCode === 201){
      toast({
        status: 'warning',
        title: 'Notice',
        description: res.data?.message,
        duration: 6000,
        position: 'top',
        isClosable: true
      })

      setUtil((prev) => ({...prev, isFridgeOn: false}))
    }


}

const loadRef = useRef()

const deductMeter =()=> {
  if(util.isFridgeOn === true){
  fetchFunction()
}
}

useEffect(() => {
  
 if(util.isFridgeOn === false){
   clearTimeout(loadRef.current)
 }
}, [util.isFridgeOn])

useEffect(()=> {
  loadRef.current = setInterval(deductMeter, 4000)
  
  return () => clearInterval(loadRef.current)
}, [util.isFridgeOn])




  return (
    <>
    <CreateMeterModal isOpen={isOpen} onClose={onClose} />
    <FundWalletModal isOpen={walletModalOpen} close={setWalletModalOpen}  walletId={wallet?.data?.id} refetch={wallet?.refetch}/>
    <nav className='flex justify-between  shadow-sm shadow-slate-300 h-20 flex items-center px-8'>
    <div className=' '>
        <img src={Logo}  className="w-32 h-16 "  alt="logo"/>
    </div>
    {userStateVal?.currentUser?.userType ===1 && <Text textDecoration={'underline'} fontWeight="bold" color="blue.500" onClick={onOpen} p='2' cursor={'pointer'}>
      Add Meter
    </Text>}
    {userStateVal?.currentUser?.userType ===2 && <Text  fontWeight="bold" color="blue.500"  p='2' cursor={'pointer'} onClick={() => setWalletModalOpen(true)}>
      Wallet Balance: N{wallet?.data?.balance?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
    </Text>}

    {userStateVal?.currentUser?.userType ===2 && <Flex className='space-x-2' alignItems={'center'} fontSize='14px' fontWeight={'bold'}><Text >Fridge:</Text><Switch disabled={userMeter.data?.statusCode === 204 || !userMeter.data?.data?.meters?.length || userMeter.data?.data?.meters[0]?.status === 1 } isChecked={util.isFridgeOn} onChange={() => setUtil((prev)=>({...prev,isFridgeOn: !util.isFridgeOn }))} size={'md'} /></Flex>}
        <Flex className='space-x-6 items-center'>
          <Text>Hi, {userStateVal?.currentUser?.firstName}</Text>
          <button className='button_primary w-20 h-10 rounded' onClick={userStateVal.isLoggedIn ? () => handleLogout() : router('login') }>
            { userStateVal.isLoggedIn ? "Logout" : "Login" }
          </button>
        </Flex>
</nav>
    </>
  )
}

export default Navbar