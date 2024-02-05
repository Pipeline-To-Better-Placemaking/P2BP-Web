import * as React from 'react';

import Map from '../components/Map';
import './routes.css';

export default function MapPage(props) {
    //props from ProjectPage.js
    const drawers = props.drawers;
    const title = props.title;
    const area = props.area;
    const center = props.center;
    const subAreas = props.subAreas;
    const standingPoints = props.standingPoints;

    //Map Drawers moved inside Maps, serves as selection menu
    return (
        <div id='MapPage'>
            {/* Map type 1 implies viewing project map and activity results */}
            <Map
                title={ title }
                center={ center } 
                zoom={ 16 } 
                type={ 1 }
                drawers={ drawers }
                area={ area }
                standingPoints={ standingPoints }
                subAreas={ subAreas }
                refresh = {props.refresh}
            />
        </div>
    );
}