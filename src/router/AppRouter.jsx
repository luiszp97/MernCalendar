import { Navigate, Route, Routes } from "react-router-dom"

import { LoginPage } from "../auth"
import { CalendarPage } from "../calendar"
import { useAuthStore } from "../hooks"
import { useEffect } from "react"

export const AppRouter = () => {

  const { checkAuthToken, status } = useAuthStore();

  useEffect(() => {
 
    checkAuthToken()
   
  }, [])
  
    // const authStatus = 'not-authenticated';

    if( status === 'cheking' ){
      return(<h3>Cargando....</h3>)
    }


  return (
    <Routes>

        {
            ( status === 'not-authenticated' )
            ? (
              <>

                <Route path="/auth/*" element = {<LoginPage/>} />
                <Route path="/*" element = {<Navigate to='/auth/login' />}/>

              </>
            )
            : (
              <>

                <Route path="/" element={ <CalendarPage/> }  /> 
                <Route path="/*" element = {<Navigate to='/' />}/>

              </>

            )

        }

        
       
    </Routes>
  )
}