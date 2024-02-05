import * as React from 'react';
import Map from '../components/Map';

function NewSection(props) {
    //recieves location data from NewSection.js
    // const loc = useLocation();

    const values = {
        center: props.center,
        title: props.title, 
        area: props.area,
        subAreas: props.subareas
    };

    return (
        <div id='newSection' className='pages'>
            {/* Empty New Project page, Google map component w/ searchable locations for new projects */}
            <Map 
                center={ values.center } 
                title={ values.title } 
                type={ 10 } 
                zoom={ 16 } 
                area={ values.area }
                subareas={ values.subAreas }
            />
        </div>
    );
}

export default NewSection;