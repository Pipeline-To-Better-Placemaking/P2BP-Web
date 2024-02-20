import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import AppNavBar from './components/AppNavBar';
import Home from './routes/Home';
import NewTeamForm from './routes/NewTeamForm';
import Title from './routes/Title';
import Projects from './routes/Projects';
import NewProject from './routes/NewProject';
import NewUser from './routes/NewUser';
import AccountPage from './routes/AccountPage';
import EditProject from './routes/EditProject';
import ProjectPage from './routes/ProjectPage';
import NewProjectPoints from './routes/PointsNewProject';
import NewProjectArea from './routes/AreaNewProject';
import ProjectForm from './routes/NewProjectForm';
import ForgotPassword from './routes/ForgotPassword';
import ResetPassword from './routes/ResetPassword';
import EditTeam from './routes/EditTeam';
import EditAreas from './routes/EditAreas';
import EditPoints from './routes/EditPoints';
import EditAreaMap from './routes/EditAreaMap';
import EditPointMap from './routes/EditPointMap';
import FAQ from './routes/FAQ';


export default function App() {
    console.log('FE STARTING');
    // token is currently stored in app state
    const [token, setToken] = React.useState(sessionStorage.userToken ? JSON.parse(sessionStorage.userToken) : null);

    // true == active user (logged in)
    const [state, setState] = React.useState(token && token !== {} ? true : false);
    
    // Set user vars to access the user home page
    function handleOnLogin(active, token) {
        console.log('LOGIN ROUTE');
        // Will be used to block users from user pages unless logged in
        setState(active);
        setToken(token);
        sessionStorage.setItem('userToken', JSON.stringify(token));
    }

    function updateToken(token){
        setToken(token);
        sessionStorage.setItem('userToken', JSON.stringify(token));
    }

    // clear all fields on logout
    function handleOnLogout(active) {
        setState(active);
        setToken();
        sessionStorage.clear();
    }

    function TeamPages(){
        console.log('TEAM ROUTE');
        // User Pages
        // (heroku-url)/home/teams/:id/(any url below)
        return(
            <div id='teamPages'>
                <Routes>
                    {/* Find a more stable/consistent way to manage tokens instead of passing states, they can expire after a few mintues*/}
                    <Route index element={<Projects />}/>
                    <Route path='projects/:id/*' element={<ProjectPage />} />
                    <Route path='new' element={ <NewProject />} />
                    <Route path='new/area' element={ <NewProjectArea />} />
                    <Route path='new/area/points' element={ <NewProjectPoints />} />
                    <Route path='new/area/points/form' element={ <ProjectForm />} />
                    <Route path='edit/:id' element={ <EditProject />} />
                    <Route path='edit/:id/areas' element={<EditAreas />} />
                    <Route path='edit/:id/areas/area_map' element={<EditAreaMap />} />
                    <Route path='edit/:id/points' element={<EditPoints />} />
                    <Route path='edit/:id/points/point_map' element={<EditPointMap />} />
                </Routes>
            </div>
        );
    }

    // Pages to be accessed by a logged in user
    // can be reached at (heroku-url)/home/(any component path below), ex: (url)/home/settings
    function UserRoutes() {
        console.log('USER ROUTES');
        
        const passLogout = (active) => {
            handleOnLogout(active);
        }

        //Logout button in AppNavBar, so logout function is passed there
        return (
            <div id='userRoutes'>
                <AppNavBar passLogout={ passLogout } passToken={ token } />
                { state ? 
                    <Routes>
                        <Route index element={ <Home /> }/>
                        <Route path='teams/:id/*' element={ <TeamPages /> } />
                        <Route path='account' element={<AccountPage updateToken={updateToken} /> } />
                        <Route path='new' element={ <NewTeamForm /> } />
                        <Route path='edit/:id' element={<EditTeam updateToken={updateToken} /> } />
                    </Routes> 
                : 
                    <Navigate to='/' replace /> 
                }
            </div>
        );
    } 

    // (heroku-url)/(any path below)
    return(
        <Router>
            <Routes>
                {/* pass onLogin function to handle user state pass for new user as well (?)*/}
                <Route index element={ <Title onLogin={ handleOnLogin }/> }/>
                <Route path='home/*' element={<UserRoutes />} />
                <Route path='new' element={ <NewUser onLogin={ handleOnLogin }/> } />
                <Route path='forgot_password' element={ <ForgotPassword/> } />
                <Route path='password_reset/:id/:token' element={<ResetPassword/>} exact/>
                <Route path='faq' element={<FAQ />} />
                <Route path='*' element={<Navigate to='/' replace />}
                />
            </Routes>
        </Router>
    );
}