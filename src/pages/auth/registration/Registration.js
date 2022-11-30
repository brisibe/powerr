import React from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../../../components/Input'
import * as yup from 'yup'
import {useFormik} from 'formik'
import {useNavigate, useNavigation} from 'react-router-dom'
import { registerApi } from '../../../api/auth'
import { useToast } from '@chakra-ui/react'

const validationSchema = yup.object({
  fname: yup.string().required("First Name is required"),
  lname: yup.string().required("last name is required"),
  email: yup.string().required("Email is required").email("Email is invalid"),
  password: yup.string().required("Password is required")
})

const Registration = () => {
  const toast = useToast()
  const router = useNavigate()
  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      password: ""
    },
    onSubmit(val, {setSubmitting}){
      registerApi({
        FirstName: val.fname,
    LastName: val.lname,
    Email: val.email,
    Password: val.password
      }).then((res) => {
        toast({
          position: "top",
          status: "success",
          description: res.data.message,
          duration: 8000,
          isClosable: true
        })
        router('/login');
      }).catch(err => {
        toast({
          position: "top",
          status: "error",
          description: err?.response?.data?.message,
          duration: 8000,
          isClosable: true
        })
      }).finally(() => {
        setSubmitting(false)
      })
    },
    validationSchema: validationSchema
   })

  return (
    <div className='grid place-items-center mt-8 ' >
    <h2 className='font-bold text-lg text-gray-600'>Registration</h2>
    <form onSubmit={formik.handleSubmit} className='flex flex-col w-[100%] md:w-2/3'>
    <Input label={"First Name"} type={'text'}  onChange={formik.handleChange} id={"fname"} errorMessage={formik.errors.fname && formik.touched.fname ? formik.errors.fname : ""}/>
    <Input label={"Last Name"} type={'text'}  onChange={formik.handleChange} id={"lname"} errorMessage={formik.errors.lname && formik.touched.lname ? formik.errors.lname : ""}/>
    <Input label={"Email"} type={"email"}  onChange={formik.handleChange} id={"email"} errorMessage={formik.errors.email && formik.touched.email ? formik.errors.email : ""}/>
      <Input label='Password' type={'password'} onChange={formik.handleChange} id={"password"} errorMessage={formik.errors.password && formik.touched.password ? formik.errors.password : ""}/>
    <button type='submit' className='button_primary' disabled={formik.isSubmitting}> {formik.isSubmitting? "Submitting" : "Register"}</button>
    </form>
    <div className='flex space-x-2 p-6'><p>Already have an account?</p> <Link className='font-bold text-sky-700' to={'/login'}>Login</Link></div>
  </div>
  )
}

export default Registration