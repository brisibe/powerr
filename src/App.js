import logo from './logo.svg';
import './App.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Homepage from './pages/home/Homepage';
import NotFound from './pages/notfound/NotFound';
import AuthLayout from './components/layout/AuthLayout';
import Login from './pages/auth/login/Login';
import Register from './pages/auth/registration/Registration';

function App() {
  return (
    <Router>
    <Routes>
       <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path='/home' element={<Homepage />} />
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
  );
}

export default App;
