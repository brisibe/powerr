import { useToast } from '@chakra-ui/react';
import React, { useContext, useState } from 'react'
import { useGetMeterByUserId } from '../../api/meter';
import userContext from '../../context/UserContext';
import http from '../../http';

const Meter = ({meterNumber, status, discoName, availableUnit}) => {

  const {userStateVal} = useContext(userContext)

  const userMeter = useGetMeterByUserId(userStateVal?.currentUser?.id)

  let meterId = userMeter.data?.data?.meters[0]?.id

    const [digits, setDigits] = useState("")
    const [isMeterOn, setIsMeterOn] = useState(true);
    const [isBooting, setIsBooting] = useState(false);
    const [bootingMsg, setBootingMsg] = useState("");
    const toast = useToast();

    const handleRecharge = async() => {
        try {
          const res  = await http.post('/recharge/rechargeMeter', {
          meterId : meterId,
          token: digits 
          })
        if(res.status === 200){

          toast({
            position:'top',
            status:'success',
            description:'Recharge successful'
            , duration: 8000
          })
        }
        } catch (error) {
            toast({
              position:'top',
              status:'error',
            description: error?.response?.data?.message,
            duration:8000
            })
        }
    }


  const handlePowerOn =()=> {
      if(isMeterOn) return;
      setIsBooting(true);
      setBootingMsg("Booting...")
      setTimeout(() => {
        setIsBooting(false);
        setBootingMsg("")
        setIsMeterOn(true);
      }, 3000)



  }

  const handlePowerOff =()=> {
        if(!isMeterOn) return;
        setIsBooting(true);
        setBootingMsg("Shutting down...")
        setTimeout(() => {
          setIsBooting(false);
          setBootingMsg("")
          setIsMeterOn(false);
        }, 3000)
  }


    const handleDigitAdd =(num)=> {
        let currentState =digits.concat(num)
        setDigits(currentState)
    }
    const handleRemoveDigit = () => {
        if(digits === 0) return
        let currentState = digits.slice(0, -1)

        setDigits(currentState)
    }

  return (
    
    <div className="w-full h-full flex justify-center items-center  bg-gray-100 min-h-full select-none">
	<div className="p-4 min-h-[70%] shadow-md shadow-gray-300 bg-black rounded w-1/2 ">
		<div className="flex justify-center space-x-2">
			<div  className={`rounded-full ${isBooting ? "bg-orange-400" : !isBooting && isMeterOn? "bg-green-400":"bg-gray-400 " }  w-3 h-3`}> </div>
			{
        status === 0  && isMeterOn ?  <div   className=" rounded-full bg-green-400 w-3 h-3"></div> :  status === 1  && isMeterOn ?   <div   className=" rounded-full bg-red-400 w-3 h-3"></div>:   <div   className=" rounded-full bg-gray-400 w-3 h-3"></div>
      }
     
		</div>

		<div className="bg-gray-500 rounded w-full h-24 my-2 flex flex-col p-2 justify-center">
            {isBooting &&  <p className="digits text-black font-bold font-mono text-2xl ">{bootingMsg}</p>}
			{isMeterOn && !isBooting && <>
            <div className='flex justify-between items-center '>
                <p id="input-digits" className="digits text-black font-bold font-mono text-2xl ">Units: {availableUnit}</p>
                  {
                   status === 1 ?  <p className='text-xs'>Disconnected</p> :<p className='text-xs'>Connected</p> 

                  }
                  </div>
              
               <p id="result" className="digits text-black font-bold font-mono text-3xl h-1/2">{ digits}</p>
            </>
            }
            {/* add unit sceen */}
		</div>

		<div className="p-2">
			<div className="flex justify-between m-3">
				<button className="bg-orange-400 w-24 h-20 rounded active:bg-orange-500 text-white" onClick={handlePowerOn}>ON</button>
				<button className="bg-gray-300 w-24 h-20 rounded active:bg-gray-700 text-gray-700" onClick={handlePowerOff}>OFF</button>
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" onClick={handleRemoveDigit} value="%">Del</button>
				<button className="bg-green-600 w-24 h-20 rounded active:bg-gray-700 text-white" value="/" onClick={() =>handleRecharge()}>Enter</button>
			</div>

			<div className="flex justify-between m-3">
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" onClick={() => handleDigitAdd("1")} >1</button>
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" onClick={() => handleDigitAdd("2")} >2</button>
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" onClick={() => handleDigitAdd("3")} >3</button>
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" onClick={() => handleDigitAdd("4")} >4</button>
			</div>

			<div className="flex justify-between m-3">
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" onClick={() => handleDigitAdd("5")} >5</button>
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" onClick={() => handleDigitAdd("6")} >6</button>
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" onClick={() => handleDigitAdd("7")} >7</button>
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" onClick={() => handleDigitAdd("8")} >8</button>
			</div>

			<div className="flex justify-between m-3">
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" onClick={() => handleDigitAdd("9")} >9</button>
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" onClick={() => handleDigitAdd("0")} >0</button>
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" value="3"></button>
				<button className="bg-gray-500 w-24 h-20 rounded active:bg-gray-700 text-white" value="+"></button>
			</div>

			
		</div>

	</div>
</div>
  )
}

export default Meter;