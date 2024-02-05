import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Link, useLocation } from 'react-router-dom';


import './controls.css';

export default function ProjectTabs(props) {
    const location = useLocation();
    const [value, setValue] = React.useState(props.value ? props.value : 0);
    const [mapIndex, setMapIndex] = React.useState('unselected');
    const [surveyorIndex, setSurveyorIndex] = React.useState('unselected');
    const [activityIndex, setActivityIndex] = React.useState('unselected');

    // needed to keep track of project page location using url
    // shows proper selection in tab bar and movement from previous page
    const segment = location.pathname.split('/');
    const tail = segment[segment.length - 1];
    const segTail = segment[segment.length - 2]

    React.useEffect(() => {
        if(tail === 'activities' || segTail === 'activities') { 
            handleUpdate('activities', 2)
        } else { 
            tail === 'surveyors' ? handleUpdate('surveyors', 1) : handleUpdate('map', 0);
        }
    }, [tail, segTail]);

    const refreshClick = (route) => {
        const link = document.createElement('a');
        link.href = route;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // manual adjustment of selected quality for Mui
    const handleUpdate = (tab, value) => {
        //props.refresh()

        setValue(value);
        if (tab === 'map') {
            setMapIndex('Mui-selected');
            setSurveyorIndex('unselected');
            setActivityIndex('unselected');
        } else if (tab === 'surveyors') {
            setMapIndex('unselected');
            setSurveyorIndex('Mui-selected');
            setActivityIndex('unselected');
        } else if(tab === 'activities') {
            setMapIndex('unselected');
            setSurveyorIndex('unselected');
            setActivityIndex('Mui-selected');
        } else {
            setMapIndex('Mui-selected');
            setSurveyorIndex('unselected');
            setActivityIndex('unselected');
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        console.log(newValue)
        switch (newValue){
            case 0:
                refreshClick('map')
            case 1:
                refreshClick('surveyors')
            case 2:
                refreshClick('activities')
        }
    };

    function LinkTab(props) {
        return (
            <Tab
                id={ props.href }
                label={ props.label }
                component={ Link }
                to={ props.href }
                state={ location.state }
                value={ props.value }
                className={ props.className }
                tabIndex={ 0 }
            />
        );
    }

    return (
        <div id='projectTabs'>
            <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', bgcolor: '#00396D' }}>
                <Tabs 
                    value={ value } 
                    onChange={ handleChange } 
                    aria-label='project tabs' 
                    TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }}
                >
                    <LinkTab value={ 0 } label='Map' href='map' className={ mapIndex } />
                    <LinkTab value={ 1 } label='Surveyors' href='surveyors' className={ surveyorIndex } />
                    <LinkTab value={ 2 } label='Activities' href='activities' className={ activityIndex } />
                </Tabs>
            </Box>
        </div>
    );
}