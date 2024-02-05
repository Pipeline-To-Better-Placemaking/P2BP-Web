import * as React from 'react';
import Button from '@mui/material/Button';
import DisplayCards from '../components/DisplayCards';
import { Link, useLocation } from 'react-router-dom';

export default function Home() {
    const location = useLocation();
    const userTeams = location.state && location.state.userToken ? location.state.userToken.user.teams : null;

    return(
        <div id='userHome'>
            <div id='newTeamButtonBox'>
                <Button
                    id='newTeamButton'
                    variant='contained'
                    component={ Link }
                    state={ location.state }
                    to='new'
                >
                    New Team
                </Button>
            </div>
            {/* type = 1 implies the project style cards */}
            <DisplayCards type={2} teams={userTeams} user={location.state ? location.state.userToken : null }/>
        </div>
    );
}