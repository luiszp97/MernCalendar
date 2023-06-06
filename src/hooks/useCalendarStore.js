import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleatedEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";


export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } =  useSelector( state => state.calendar );
    const { user } =  useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) )
    };

    const startSavingEvent = async ( calendarEvent ) => {


        if( calendarEvent._id ){

            dispatch( onUpdateEvent( {...calendarEvent} ) );

        } else {

            const { data } = await calendarApi.post( '/events', calendarEvent );

            dispatch( onAddNewEvent({ ...calendarEvent, id: data.savedEvent.id, user} ) );

        }

    };

    const startDeletingEvent = ()=> {

        dispatch( onDeleatedEvent() );

    }

    const startLoadingEvents = async ( ) =>{

        try {
            
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents( data.events );
            dispatch( onLoadEvents( events ) )
            

        } catch (error) {
            
            console.log(error)

        }

    }
  

    return{

        //* Propiedades

            events,
            activeEvent,
            hasEventSelected: !!activeEvent,

        //* Metodos

            setActiveEvent,
            startSavingEvent,
            startDeletingEvent,
            startLoadingEvents
    }
}