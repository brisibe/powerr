import { useToast } from "@chakra-ui/react";
import { Dialog, Transition } from "@headlessui/react";
import {  useFormik } from "formik";
import { Fragment, useContext, useState } from "react";
import { useCreateMeterRequest } from "../../api/meter";
import userContext from "../../context/UserContext";
import UtilsContext from "../../context/UtilsContext";
import { Input } from "../Input";

export default function MeterRequestModal(props) {
  const createMeterReqMutation = useCreateMeterRequest();
  const {setUtil} = useContext(UtilsContext)
  const {userStateVal} = useContext(userContext)
  const toast = useToast()
  



  const handleFormSubmit = async(val)=>{
    setUtil((prevState)=> ({
      ...prevState,
      overlayLoading: true
    }))
  try {

       createMeterReqMutation.mutate(val, {
        onSuccess(res){
             toast({
              position: 'top',
              duration:10000,
              status:'success',
              description:'Awaiting Confirmation'
             })
             props.refresh()
        },
        onError(err){
          toast({
            position: 'top',
            duration:10000,
            status:'error',
            description:'Oops something went wrong'
           })
        }
        
       })
    
  } catch (error) {
    console.log(error)
  }finally{
    setUtil((prevState)=> ({
      ...prevState,
      overlayLoading: false
    }))
  }
  }
 
  const formik = useFormik({
    initialValues: {
      Address: "",
      LGA: "",
    },
    onSubmit(val) {
     handleFormSubmit({
      
      UserId: userStateVal?.currentUser?.id,
      Address: val.Address,
      LGA: val.LGA  
     })
    },
  });
 
  return (
    <>
      <Transition appear show={props.openMeterRequestModal} as={Fragment}>
        <Dialog as="div" className=" relative z-10" onClose={props.closeMeterRequestModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
 
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Request Meter
                  </Dialog.Title>
                  <div className="mt-2">
                   
                    <form
                      onSubmit={formik.handleSubmit}
                      className="flex flex-col w-100 bg-gray-50 p-10"
                    >
 
                      <Input label="Address"  onChange={formik.handleChange}
                          value={formik.values.Address}
                          id="Address"
                          name="Address"
                          type={"text"}
                          className="custom-input" />
                      <Input label="LGA"  onChange={formik.handleChange}
                          value={formik.values.LGA}
                          id="LGA"
                          name="LGA"
                          type={"text"}
                          className="custom-input" />
                     
                    
                    
 
                      <div className="flex justify-end mt-4 space-x-4">
                       
                        <button
                          type={"submit"}
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={props.closeMeterRequestModal}
                        >
                          Confirm
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
 
