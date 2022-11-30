import axios from 'axios'

const user = JSON.parse(window.sessionStorage.getItem('user'));
let token;

if(user !== null){
    token = user?.currentUser?.token;
}


export default axios.create({
    baseURL: "https://localhost:7113/api",
    headers: {
        Authorization:  `Bearer ${token}`
    }
    
})