import * as React from 'react';
import Form from 'react-bootstrap/Form';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

function TimeForm(props) {
    const index = props.index;
    const standingPoints = props.standingPoints;
    const [timeForm, setTimeForm] = React.useState(props.points ? {
        type: props.type,
        instance: props.instance,
        index: props.index,
        time: props.time,
        maxResearchers: props.maxResearchers,
        points: props.points
    } : {
        type: props.type,
        instance: props.instance,
        index: props.index,
        time: props.time,
        maxResearchers: props.maxResearchers
    });

    const handleChange = (key) => (e) => {
        setTimeForm({ ...timeForm, [key]: e.target.value });
    };

    const handleChecked = (event) => {
        // updating an object instead of a Map
        setTimeForm({ ...timeForm, points: { ...timeForm.points, [event.target.name]: event.target.checked } });
    }

    const handleDelete = (index) => (e) => {
        props.deleteTime(index);
    }

    React.useEffect(() => {
        props.updateTime(index, timeForm)
    }, [timeForm]);

    React.useEffect(() => {
        setTimeForm({
            ...timeForm, index: props.index})
    }, [props.index]);

    return(
        <div className='timeForm'>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <h5>Time Slot</h5> 
                <Button id='deleteButton' onClick={ handleDelete(timeForm.index) }><DeleteIcon /></Button> 
            </div>
            <div className='form-group'>
                <Form.Label>Start Time:</Form.Label>
                <Form.Control id='timeSelect' type='time' placeholder='Select a starting time' value={ timeForm.time } aria-label='timeSelect' onChange={ handleChange('time') }/>
            </div>
            <br/>
            <div className='form-group'>
                <Form.Label>Maximum Number of Researchers:</Form.Label>
                <Form.Control id='surveyorSelect' type='number' value={ timeForm.maxResearchers } aria-label='surveyorsSelect' onChange={ handleChange('maxResearchers') }/>
            </div>
            <br />
            {
                props.points ?
                <div className='form-group'>
                    <Form.Label>Points:</Form.Label>
                    <div className='mb-3'>
                        { standingPoints.map((point, index) => (
                            <Form.Check
                                inline
                                key={point._id}
                                label={point.title}
                                name={index}
                                type='checkbox'
                                id={`inline-checkbox-${index}`}
                                onChange={handleChecked}
                            />
                        )) }
                    </div>
                </div>
                : null
            }
        </div>
    );
}
export default TimeForm;