import { useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Footer from './components/Footer'
import Routes from './components/routes/Routes'
import 'animate.css'
import { FaPowerOff, FaSlidersH } from 'react-icons/fa'

import { logout } from './api/users'
import { useMutation, useQuery } from 'react-query'

import HeaderGuest from './components/HeaderGuest'
import HeaderAuthorized from './components/HeaderAuthorized'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const App = () => {
  const requestObj = {
    schemaVersion: '1.0',
    requestId: uuidv4(),
    timestamp: Date.now(),
    channelName: 'WEB',
    serviceName: 'API_PURCHASE',
    serviceParams: {
      merchantUid: process.env.REACT_APP_MERCHANT_U_ID,
      apiUserId: process.env.REACT_APP_API_USER_ID,
      apiKey: process.env.REACT_APP_API_KEY,
      paymentMethod: 'mwallet_account',
      payerInfo: {
        accountNo: '252615301507',
      },
      transactionInfo: {
        referenceId: uuidv4(),
        invoiceId: uuidv4(),
        amount: 1,
        currency: 'USD',
        description: 'test',
      },
    },
  }

  const EVC = () => {
    const basicRequest = async () => {
      const { data } = await axios.post(
        `https://sandbox.safarifoneict.com/asm`,
        requestObj
      )
      console.log(data)
    }
    basicRequest()
  }

  const { mutateAsync } = useMutation(logout, () => {})
  useQuery('userInfo', () => {})

  let userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')).token
    : null

  useEffect(() => {
    window.addEventListener('storage', () => {
      if (userInfo) mutateAsync({})
    })
    window.addEventListener('click', () => {
      if (userInfo) {
        const decoded = jwt_decode(userInfo && userInfo)

        if (decoded.exp * 1000 < Date.now()) mutateAsync({})
      }
    })
    window.addEventListener('focus', () => {
      if (userInfo) {
        const decoded = jwt_decode(userInfo && userInfo)
        if (decoded.exp * 1000 < Date.now()) mutateAsync({})
      }
    })
  }, [mutateAsync, userInfo])

  const style = {
    display: 'flex',
  }

  const logoutHandler = () => {
    mutateAsync({})
  }

  const toggler = () => {
    const sidebar = document.querySelector('#sidebar')
    sidebar.classList.toggle('active')
  }

  return (
    <Router>
      <div className='wrapper' style={userInfo && style}>
        {userInfo ? <HeaderAuthorized toggler={toggler} /> : <HeaderGuest />}
        <main>
          {userInfo && (
            <nav className='navbar navbar-expand-sm navbar-dark sticky-top'>
              <div className='container-fluid'>
                <button
                  onClick={toggler}
                  className='navbar-brand btn btn-transparent shadow-none border-0'
                >
                  <FaSlidersH />
                </button>

                <ul className='navbar-nav d-flex flex-row'>
                  <li className='nav-item'>
                    <Link to='/' onClick={logoutHandler} className='nav-link'>
                      <FaPowerOff className='mb-1' /> Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          )}

          <div
            className={`${!userInfo ? 'container' : 'container'}`}
            id='mainContainer'
          >
            {/* <button onClick={() => EVC()} className='btn btn-primary btn-sm'>
              Send Request
            </button> */}
            <Route component={Routes} />
          </div>
          <Footer />
        </main>
      </div>
    </Router>
  )
}

export default App
