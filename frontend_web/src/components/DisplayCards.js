import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { testNames } from '../functions/HelperFunctions';
import '../routes/routes.css';
import { Table, TableCell, TableRow } from '@mui/material';

export default function DisplayCards(props) {
    //Surveyor Cards have surveyor name in header
    const surveyorCards = (surveyors) => (
        Object.values(surveyors).map((surveyor, index) => (
            <Card key={ 's' + index } className='displayCard' style={{display: 'block'}}>
                <CardHeader title={ surveyor.name } />
                { surveyorActivities(surveyor.activities) }
            </Card>
        ))
    );

    //Activity renders in the body
    const surveyorActivities = (activities) => (
        <CardContent style={{display: 'flex', flexDirection: 'column', justifyContent:'space-evenly', width: '100%'}}>
            <Table>
            { activities.map((activity, index) => (
                
                    <TableRow>
                    <TableCell colSpan={2} align='left'>
                        <Typography variant='text' component='div'>
                            { testNames(activity.activity) }
                        </Typography>
                    </TableCell>
                    <TableCell colSpan={1} align='left'>
                        <Typography variant='text' component='div'>
                            { activity.date }
                        </Typography>
                    </TableCell>
                    <TableCell colSpan={1} align='left'>
                        <Typography variant='text' component='div'>
                            { activity.time }
                        </Typography>
                    </TableCell>
                </TableRow>
            )) }
            </Table>
        </CardContent>
        
    );

    //For Better Placemaking projects listed on home page (url)/home
    const projectCards = (project) => (
        <Card className='displayCard'>
            <CardContent>
                <Typography variant='h5' component='div'>
                    { project.title }
                </Typography>
                { project.description }
            </CardContent>
            <CardActions>
            <Button component={Link} to={`projects/${project._id}/map`} state={{ project: project.title, owner: props.owner, team: props.team, userToken: props.user }}>View</Button>
            <Button component={Link} to={`edit/${project._id}`} state={{ project: project.title, team: props.team, userToken: props.user }}>Edit</Button>
            <Button onClick={props.open(project.title, project._id)}><DeleteIcon /></Button>
            </CardActions>
        </Card>
    );

    const teamCards = (teams) => (
        teams.map((team, index)=>(
            <Card key={ 'p' + index } className='displayCard'>
                <CardContent>
                    <Typography variant='h5' component='div'>
                        { team.title }
                    </Typography>
                </CardContent>
                <CardActions >
                    <Button component={Link} to={`teams/${team._id}`} state={{ team: team.title, userToken: props.user }}>View Team</Button>
                </CardActions>
            </Card>
        ))
    );

    return(
            props.type === 0 ? 
                <div id='cardFlexBox'>
                    {surveyorCards(props.surveyors)}
                </div> 
            : 
            (props.type === 1 ? 
                projectCards(props.project) 
            : 
                <div id='cardFlexBox'>
                    {teamCards(props.teams)}
                </div>
            )
    );
}