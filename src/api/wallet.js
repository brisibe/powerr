import { useQuery } from "react-query";
import http from "../http";

 const getUserWallet = async (userId)=> {
    return await (await (http.get(`/Wallet/getWalletByUserId?userId=${userId}` ))).data?.data
};


export const useGetUserWallet = (userId)=> {
    return useQuery(['wallet', userId],  () => getUserWallet(userId))
}