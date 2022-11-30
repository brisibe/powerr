
import { Route, Routes, BrowserRouter as Router, redirect } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Homepage from './pages/home/Homepage';
import NotFound from './pages/notfound/NotFound';
import AuthLayout from './components/layout/AuthLayout';
import Login from './pages/auth/login/Login';
import Register from './pages/auth/registration/Registration';
import Spinner from './components/spinner/Spinner';
import { useContext } from 'react';
import UtilsContext from './context/UtilsContext';
import AdminDashboard from './pages/admin/AdminDashboard';
import userContext from './context/UserContext';

function App() {
  const {util} = useContext(UtilsContext)
  const {userStateVal} = useContext(userContext)
  console.log(util)
  return (<>
    <Router>
    <Routes>
       <Route path="/" element={<Layout />}>
          {/* <Route index  element={<Homepage />} /> */}
          {
            userStateVal?.currentUser?.userType === 1 ? <Route index element={<AdminDashboard />} /> : <Route index element={<Homepage />} />
          }
          {/* <Route path='/home' element={<Homepage />} /> */}
          
          {
            userStateVal?.currentUser?.userType === 1 ? <Route path='/dashboard' element={<AdminDashboard />} /> : <Route path='/dashboard' element={<Homepage />} />
          }
          {/* <Route path="about" element={<About />} /> */}
          {/* <Route path="dashboard" element={<Dashboard />} /> */}

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
              routes for. */}

            
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AuthLayout />}>
           <Route path='/login' element={<Login />} />
           <Route path='/register' element={<Register />}/>
        </Route>
    </Routes>
  </Router>
  {util?.overlayLoading && <Spinner />}
  </>
  );
}

export default App;
