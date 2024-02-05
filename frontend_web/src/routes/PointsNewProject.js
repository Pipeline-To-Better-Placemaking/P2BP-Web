import * as React from 'react';
import Map from '../components/Map';
import { useLocation } from 'react-router-dom';

export default function NewProjectPoints() {
    const loc = useLocation();
    //recieves location data from New Project Area

    const values  = {
        center: loc.state.center,
        title: loc.state.title,
        area: loc.state.area,
        zoom: loc.state.zoom
    };
    
    return(
        <div id='newPoints'>
            {/* Empty New Project page, Google map component w/ searchable locations for new projects */}
            <Map center={ values.center } title={ values.title } area={ values.area } type={3} zoom={ values.zoom } />
        </div>
    );
}