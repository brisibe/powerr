import { Fragment, useContext, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon,InformationCircleIcon } from '@heroicons/react/24/outline'
import http from '../../http'
import { useClipboard, FormControl, FormLabel, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, useDisclosure, useToast, ModalFooter, Button } from '@chakra-ui/react'
import UtilsContext from '../../context/UtilsContext'


export default function PaymentTypeModal(props) {
  const {setUtil} = useContext(UtilsContext);
  const [token, setToken ] = useState('')
  const toast = useToast()
  const [selectedPrice, setSelectedPrice] = useState('');
  const { onCopy, value, setValue, hasCopied } = useClipboard("");

  
  const {
    isOpen,
    onClose,
    onOpen,
  } = useDisclosure()

  const handleChange = (e) => {
    setSelectedPrice(e.target.value)
  }
  const handleTokenGeneration = async () => {
    setUtil((prev) => ({
      ...prev,
      overlayLoading: true
    }))
      try {
        const res = await (await http.post('/recharge/generateToken',{
          WalletId : props.walletId,
          Value: Number(selectedPrice)
        } )).data

        if(res?.statusCode === 200 && res?.data !== null){
          props.closeModal();
            setToken(res?.data?.token)
            setValue(res?.data?.token)
            
            onOpen();

            toast({
              position:'top-right',
              status:'success',
              description:'Token generation successful',
              title:'Success',
              isClosable: true
              
            })
        }
       props.refresh()


      } catch (error) {
        toast({
          position: "top",
          status: 'error',
          duration: 8000,
          description: error?.response?.data?.message,
          isClosable: true
        })
      }
      finally{
        setUtil((prev) => ({
          ...prev,
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
       <ModalHeader>Token Generated Successfully</ModalHeader>
       <ModalCloseButton />
       <ModalBody pb={6}>
        <Heading textAlign={'center'} fontWeight={'bold'} fontSize={'lg'}>{token}</Heading>
       </ModalBody>
       <ModalFooter>
        <Button onClick={onCopy} size={'sm'}>{hasCopied? "Copied!" : "Copy"}</Button>
       </ModalFooter>
      </ModalContent>
   </Modal>
   
    
    <Transition.Root show={props?.isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10"  onClose={props.closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <InformationCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        {/* {props?.title} */}
                      </Dialog.Title>
                      <div className="mt-2 w-96" >
                        {/* <p className="text-sm text-gray-500">
                         {props?.body}
                        </p> */}

                        <FormControl w="100%" mb="4">
                          <FormLabel pl={'4'} fontSize={'sm'}>Account</FormLabel>
                          <Select disabled _disabled={{color: 'black'}} >
                            <option>Wallet N{props.walletAmount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</option>
                          </Select>
                        </FormControl>
                        <FormControl w="100%" >
                          <FormLabel pl={'4'} fontSize={'sm'}>Packages</FormLabel>
                          <Select value={selectedPrice} onChange={handleChange} >
                            <option style={{display: 'none'}}>Select Plan</option>
                            <option value={200}>N200 for 20 units</option>
                            <option value={500}>N500 for 50 units</option>
                            <option value={1000}>N1,000 for 120 units</option>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    disabled={selectedPrice === ''}
                    
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none disabled:bg-green-400 disabled:hover:bg-green-400 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleTokenGeneration}
                  >
                    Proceed
                  </button>
                 
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
          </>
  )
}