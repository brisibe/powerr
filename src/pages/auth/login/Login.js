import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../../components/Input'
import * as yup from 'yup'
import {useFormik} from 'formik'
import userContext from '../../../context/UserContext'
import {  useLogin } from '../../../api/auth'

const validationSchema = yup.object({
  email: yup.string().required("Email is required").email("Email is invalid"),
  password: yup.string().required("Password is required")
})

const Login = () => {
  const router = useNavigate()
  const loginMutation = useLogin()
  const {userStateVal, setUserStateVal} = useContext(userContext)
  const [errMsg, setErrMsg] = useState("")



  useEffect(() => {
    
    if(userStateVal.isLoggedIn){
         router('/')
    }
  }
  , [])

     const formik = useFormik({
      initialValues: {
        email: "",
        password: ""
      },
      onSubmit(val, {setSubmitting}){
      
        loginMutation.mutate({
          Email: val.email,
          Password: val.password
        }, {
          onSettled(res){

              if(res?.status  === 200){
                setSubmitting(false)
                setUserStateVal(prev => ({
                  isLoggedIn: true,
                  currentUser: {
                    id: res?.data?.id,
                    email: res?.data?.email,
                    firstName: res?.data?.firstName,
                    userType : res?.data?.userType,
                    token: res?.data?.token
                  }
                }));

                window.sessionStorage.setItem('user',JSON.stringify( {
                  isLoggedIn: true,
                  currentUser: {
                    id: res?.data?.id,
                    email: res?.data?.email,
                    userType : res?.data?.userType,
                    firstName: res?.data?.firstName,
                    token: res?.data?.token
                  }
                }))
         router('/')
              }
          },
          onError(err){
            setErrMsg(err?.response?.data?.message)  
            setSubmitting(false)
          }
        })
        
      },
      validationSchema: validationSchema
     })

  return (
    <div className='grid place-items-center mt-8 ' >
      <h2 className='font-bold text-lg text-gray-600'>Login</h2>
      <form className='flex flex-col w-[100%] md:w-2/3' onSubmit={formik.handleSubmit}>
      <Input label={"Email"} type={"email"}  onChange={formik.handleChange} id={"email"} errorMessage={formik.errors.email && formik.touched.email ? formik.errors.email : ""}/>
      <Input label='Password' type={'password'} onChange={formik.handleChange} id={"password"} errorMessage={formik.errors.password && formik.touched.password ? formik.errors.password : ""}/>
      {errMsg && <p className='text-sm text-red-500 py-4'>{errMsg}</p>}

      <button type='submit' style={{backgroundColor: "#0685BC"}} className='button_primary' disabled={formik.isSubmitting}> {formik.isSubmitting? "Submitting" : "Login"}</button>
      </form>
      <div className='flex space-x-2 p-6'><p>Don't have an account?</p> <Link className='font-bold text-sky-700' to={'/register'}>Register</Link></div>
    </div>
  )
}

export default Login