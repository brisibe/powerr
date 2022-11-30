import { useMutation, useQuery } from "react-query";
import http from "../http";

export const getMeterRequests = async (body)=> {
    return await (await (http.get('/Meter/getAllMeterRequests' ))).data?.data
};

export const useGetMeterRequests = ()=> {
    return useQuery('meterRequests', getMeterRequests)
}


 const getMeters = async (body)=> {
    return await (await (http.get('/Meter/getAllMeters' ))).data?.data
};


export const useGetMeters = ()=> {
    return useQuery('meters', getMeters)
}


const getUserMeterByUserId = async (userId) => {
    return await (await (http.get(`/Meter/getMeterRequestByUserId?userId=${userId}`))).data;
}

export const useGetMeterByUserId = (userId)=> {
    return useQuery(['usermeter', userId],  () => getUserMeterByUserId(userId))
}

const createMeterRequest = async (body) => {
    return await http.post('/Meter/createMeterRequest', body)
}

export const useCreateMeterRequest = () => useMutation({
    mutationFn: body => createMeterRequest(body),
});

