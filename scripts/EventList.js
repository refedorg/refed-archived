import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import EventCard from './EventCard'
import _ from 'lodash'

const EventList = ({source}) => {
  const [allEvents, setAllEvents] = useState(false)
  useEffect(() => {
    axios.get(`https://caring-ship.cloudvent.net/api/${source}.json`)
      .then(response => {
        setAllEvents(response.data)
        setAllEvents(_.sortBy({allEvents}, {item_date}))
      })
      .catch(error => console.log('error', error))
  }, [])
  // console.log('all list items', allListItems)
  return (
    <>
      <div className="row mt-5">
        <div className="col-12">
          <div className="responsive-card-deck cards-lg-3">
            {allEvents && allEvents.map(event => {
              return <EventCard key={event.id} event={event}/>
            })}
          </div>
        </div>
      </div>  
    </>
  )
}

EventList.propTypes = {
  source: PropTypes.string
}

export default EventList