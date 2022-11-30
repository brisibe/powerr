import http from '../http'
import {useMutation, useQuery} from 'react-query'


 export const loginApi = async (body)=> {
    return await http.post('/auth/login', body )
};
// login hook
export const useLogin =  () =>  useMutation({
        mutationFn: body => loginApi(body),
    });


export const registerApi = async (body) => {
  return await http.post('/auth/register', body);
}

const getUsers = async () => {
  return (await http.get('/auth/allCustomer')).data?.data
}
export const useGetUsers =  () => {
  return useQuery('users', getUsers)
}

//registration hook
// export const useRegistration = async (body) => useMutation({ mutationFn: body => registerApi(body)});




