import * as React from 'react';
import Map from '../components/Map';
import { useLocation } from 'react-router-dom';

function NewArea() {
    //recieves location data from NewProject.js
    const loc = useLocation();

    const values = {
        center: loc.state.center,
        title: loc.state.title, 
        zoom: loc.state.zoom
    };

    return (
        <div id='newArea' className='pages'>
            {/* Empty New Project page, Google map component w/ searchable locations for new projects */}
            <Map center={ values.center } title={ values.title } type={ 4 } zoom={ values.zoom } />
        </div>
    );
}

export default NewArea;