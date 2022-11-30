import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../../components/Input'
import * as yup from 'yup'
import {useFormik} from 'formik'

const validationSchema = yup.object({
  email: yup.string().required("Email is required").email("Email is invalid"),
  password: yup.string().required("Password is required")
})

const Login = () => {
  const router = useNavigate()

     const formik = useFormik({
      initialValues: {
        email: "",
        password: ""
      },
      onSubmit(val, {setSubmitting}){
        setTimeout(() => {
          console.log(val)
          setSubmitting(false)
          router('/home')
        }, 2000);
      },
      validationSchema: validationSchema
     })

  return (
    <div className='grid place-items-center mt-8 ' >
      <h2 className='font-bold text-lg text-gray-600'>Login</h2>
      <form className='flex flex-col w-[100%] md:w-2/3' onSubmit={formik.handleSubmit}>
      <Input label={"Email"} type={"email"}  onChange={formik.handleChange} id={"email"} errorMessage={formik.errors.email && formik.touched.email ? formik.errors.email : ""}/>
      <Input label='Password' type={'password'} onChange={formik.handleChange} id={"password"} errorMessage={formik.errors.password && formik.touched.password ? formik.errors.password : ""}/>
      <button type='submit' style={{backgroundColor: "#0685BC"}} className='button_primary' disabled={formik.isSubmitting}> {formik.isSubmitting? "Submitting" : "Login"}</button>
      </form>
      <div className='flex space-x-2 p-6'><p>Don't have an account?</p> <Link className='font-bold text-sky-700' to={'/register'}>Register</Link></div>
    </div>
  )
}

export default Login