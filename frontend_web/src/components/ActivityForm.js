import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Form } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';

const testNames = [
    { label: 'People in Place', type: 'stationary_maps' },
    { label: 'People in Motion', type: 'moving_maps' },
    { label: 'Absence of Order Locator', type: 'order_maps' },
    { label: 'Spatial Boundaries', type: 'boundaries_maps' },
    { label: 'Lighting Profile', type: 'light_maps' },
    { label: 'Nature Prevalence', type: 'nature_maps' },
    { label: 'Acoustical Profile', type: 'sound_maps' },
    { label: 'Identifying Access', type: 'access_maps' },
    { label: 'Identifying Program', type: 'program_maps'},
    { label: 'Section Cutter', type: 'section_maps'},
];

export default function ActivityForm(props) {
    const loc = useLocation();
    const [form, setForm] = React.useState(
        {
            title: '',
            activity: 'stationary_maps',
            date: new Date().toISOString().split('T')[0],
            timer: 15
        }
    );

    const handleChange = (key, ver) => (e) => {
        setForm({ ...form, [key]: e.target.value });
    };
    
    const handleRoute = (activity) => 
    {
        if(activity === 'section_maps')
            return 'section_cutter';
        else if(activity === 'program_maps')
            return 'identifying_program';
        else
            return 'times';

    }


    // Form info is sent to NewActivityTimes.js for time slots
    return(
        <div id='ActivityForm'>
            <div className='form-group'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' id='activityName' className='dateTimePickers' value={form.title} onChange={handleChange('title')} />
            </div>
            <div className='form-group'>
                <Form.Label>Activity Type</Form.Label>
                <Form.Select id='activitySelect' placeholder='Select an activity type' value={form.activity} aria-label='activitySelect' onChange={handleChange('activity')}>
                    {testNames.map((label) => (
                        <option
                            key={label.label}
                            value={label.type}
                        >
                            {label.label}
                        </option>
                    ))}
                </Form.Select>
            </div>
            <div className='form-group'>
                <Form.Label>Date</Form.Label>
                <Form.Control type='date' className='dateTimePickers' value={form.date} onChange={handleChange('date')} />
            </div>
            <div className='form-group'>
                <Form.Label>Time per Location (minutes)</Form.Label>
                <Form.Control type='number' id='timerSelect' name='timerSelect' className='dateTimePickers' value={form.timer} min='5' max='100' onChange={handleChange('timer')} />
            </div>
            <Button className='newHoveringButtons confirm' id='addButton' component={ Link }
                to={handleRoute(form.activity)}
                state={{...loc.state, form: form}}
            >
                <AddIcon />
            </Button>
        </div>
    );
}