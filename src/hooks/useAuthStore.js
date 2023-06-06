import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { useState } from "react";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store/auth/authSlice";


export const useAuthStore = () => {

    const { status, errorMessage, user } = useSelector( state => state.auth );

    const dispatch = useDispatch();

    const startLogin = async ({email, password})=>{

        dispatch( onChecking() );

        try {
            
            const { data } = await calendarApi.post( '/auth', { email, password } );

            localStorage.setItem('__Token__', data.token);
            localStorage.setItem('__Token-init-date__', new Date().getTime() );

            dispatch( onLogin({ name: data.name, uid: data.uid }) );
            

        } catch (error) {

            dispatch( onLogout( 'Credenciales incorrectas') );
            
            setTimeout( ()=>{

                dispatch( clearErrorMessage() );

            }, 10 )

        }

    };

    const startregisterUser = async ({ email, password, name, password2 }) =>{

        const isSamePassword = password === password2
        const validName = name.length !== 0;


        if( isSamePassword && password.length > 6 && validName ){


           try {
            
            const { data } = await calendarApi.post( '/auth/new', { name, email, password } );
            
            localStorage.setItem('__Token__', data.token);
            localStorage.setItem('__Token-init-date__', new Date().getTime() );

            dispatch( onLogin( {name: data.name, uid: data.uid, token: data.token} ) )

           } catch ({response}) {
            
            if(response.data.msg){

                dispatch( onLogout( response.data.msg) );

            } else if( response.data.errors.name ){
                 
                dispatch( onLogout( response.data.errors.name.msg ) );
                
            }else if( response.data.errors.password ){
                
                dispatch( onLogout( response.data.errors.password.msg ) );
                
            } 
                
            setTimeout( ()=>{
                dispatch( clearErrorMessage() );

            }, 10 )
           }

        } else {

            if(password.length < 6){

                dispatch( onLogout( 'Las contrase;a debe tener mas de 6 caracteres ' ) );  

            } else if( !validName ){

                dispatch( onLogout( 'El nombre es obligatorio' ) );  

            } else {

                dispatch( onLogout( 'Las contrase;a no coincide' ) );  

            }

            setTimeout( ()=>{
                dispatch( clearErrorMessage() );

            }, 10 )

        }

    };

    const checkAuthToken = async () =>{

        const token = localStorage.getItem('__Token__');

        if( !token )return dispatch( onLogout() );

        try {
            
            const { data } = await calendarApi.get('/auth/renew');
            localStorage.setItem('__Token__', data.token);
            localStorage.setItem('__Token-init-date__', new Date().getTime() );

            dispatch( onLogin( {name: data.name, uid: data.uid}) )

        } catch (error) {

            localStorage.clear()
            dispatch( onLogout() )

        }

    }

    const startLogout = ()=>{
        localStorage.removeItem('__Token__')
        localStorage.removeItem('__Token-init-date__')
        dispatch( onLogout() )
    }


  return {
        status, 
        errorMessage, 
        user,
        startLogin,
        startregisterUser,
        checkAuthToken,
        startLogout
  }
}