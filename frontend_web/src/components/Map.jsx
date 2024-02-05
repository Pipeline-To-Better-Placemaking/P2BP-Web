import * as React from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { createCustomEqual } from 'fast-equals';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import UndoIcon from '@mui/icons-material/Undo';
import { IPDialog, SCDialog } from '../FAQDialog';
import Clear from '@mui/icons-material/Clear';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import MapDrawers from './MapDrawers';
import { testNames } from '../functions/HelperFunctions';
import './controls.css';
import { Form } from 'react-bootstrap';
import { ClickAwayListener } from '@mui/material';
import axios from '../api/axios';

const render = (status) => {
    console.log(status);
    return <h1>{status}</h1>;
};
// props.type :
// 0 - new project
// 1 - Map Page
// 2 - edit project
// 3 - new project points
// 4 - new project area
// 5 - new project map
// 6 - edit existing area/add area
// 7 -  edit existing point/add point
// 8 - new program
// 10 - new section cutter

export default function FullMap(props) {
    const [map, setMap] = React.useState(null);
    const [mapPlaces, setMapPlaces] = React.useState(null);
    const [placeOn, setPlaceOn] = React.useState(false);
    const [title, setTitle] = React.useState(props.type > 0 ? props.title : null);
    const [zoom, setZoom] = React.useState(props.zoom ? props.zoom : 16); // initial zoom
    const [center, setCenter] = React.useState(props.center ? props.center : { lat: 28.54023216523664, lng: -81.38181298263407 });
    const [bounds, setBounds] = React.useState();
    const [click, setClick] = React.useState(props.type === 0 || props.type === 2 || props.type === 7 ? props.center : null);
    const [data, setData] = React.useState(props.type === 1 ? props.drawers : {});
    const [areaData, setAreaData] = React.useState(props.type === 1 || props.type === 3 || props.type === 5 || props.type === 2 || props.type === 8 || props.type === 10 ? props.area : null);
    const [clicks, setClicks] = React.useState(props.type === 5 ? props.points : (props.type === 3 ? [] : (props.type === 6 ? props.area : [])));
    const standingPoints = props.standingPoints ? props.standingPoints : null;
    const subAreas = props.subAreas ? props.subAreaas : [];
    const [numFloors, setNumFloors] = React.useState(1);
    let buildingData, sectionData;

   
    // Access Universal Data passed around including the key for maps
    const loc = useLocation();
    const nav = useNavigate();

    // Hold the selections from the switch toggles (from Map Drawers)
    const [stationaryCollections, setStationaryCollections] = React.useState({});
    const [movingCollections, setMovingCollections] = React.useState({});
    const [orderCollections, setOrderCollections] = React.useState({});
    const [boundariesCollections, setBoundariesCollections] = React.useState({});
    const [lightingCollections, setLightingCollections] = React.useState({});
    const [natureCollections, setNatureCollections] = React.useState({});
    const [soundCollections, setSoundCollections] = React.useState({});
    const [accessCollections, setAccessCollections] = React.useState({});
    const [programCollections, setProgramCollections] = React.useState({});
    const [sectionCollections, setSectionCollections] = React.useState({});

    //holds ALL Collections for rendering
    const [collections, setCollections] = React.useState({
        stationary_maps: stationaryCollections,
        moving_maps: movingCollections,
        order_maps: orderCollections,
        boundaries_maps: boundariesCollections,
        light_maps: lightingCollections,
        nature_maps: natureCollections,
        sound_maps: soundCollections,
        access_maps: accessCollections,
        program_maps: programCollections,
        section_maps: sectionCollections,
    });


//    React.useEffect(() => {
//         let newInfo = refresh
//         console.log(newInfo)
//         //setData(refresh)
//     }, []);
    /**
        Function: onSelection
        Description: This function handles the boolean toggling from Map Drawer selections/switches.
        It receives the category, date, time, and check parameters, updates the specific state object,
        and then registers the updates to the collections objects.
        @param {string} category - The category of the selection (e.g. stationary_maps, moving_maps, order_maps, etc.)
        @param {string} date - The date of the selection
        @param {string} time - The time of the selection
        @param {boolean} check - The boolean value of the selection (true if selected, false if unselected)
        @return {void}
    */
    function onSelection(category, date, time, check) {
        var newSelection;
        switch (category) {
            case 'stationary_maps':
                newSelection = stationaryCollections;
                if (check === true) {
                    if (!newSelection[`${date}`]) newSelection[`${date}`] = [];
                    newSelection[`${date}`].push(time);
                } else {
                    var st = newSelection[date].indexOf(time);
                    newSelection[date].splice(st, 1);
                }
                setStationaryCollections(newSelection);
                setCollections({ ...collections, [category]: newSelection });
                break;
            case 'moving_maps':
                newSelection = movingCollections;
                if (check === true) {
                    if (!newSelection[`${date}`]) newSelection[`${date}`] = [];
                    newSelection[`${date}`].push(time);
                } else {
                    var m = newSelection[date].indexOf(time);
                    newSelection[date].splice(m, 1);
                }
                setMovingCollections(newSelection);
                setCollections({ ...collections, [category]: newSelection });
                break;
            case 'order_maps':
                newSelection = orderCollections;
                if (check === true) {
                    if (!newSelection[`${date}`]) newSelection[`${date}`] = [];
                    newSelection[`${date}`].push(time);
                } else {
                    var o = newSelection[date].indexOf(time);
                    newSelection[date].splice(o, 1);
                }
                setOrderCollections(newSelection);
                setCollections({ ...collections, [category]: newSelection });
                break;
            case 'boundaries_maps':
                newSelection = boundariesCollections;
                if (check === true) {
                    if (!newSelection[`${date}`]) newSelection[`${date}`] = [];
                    newSelection[`${date}`].push(time);
                } else {
                    var b = newSelection[date].indexOf(time);
                    newSelection[date].splice(b, 1);
                }
                setBoundariesCollections(newSelection);
                setCollections({ ...collections, [category]: newSelection });
                break;

            case 'section_maps':
                newSelection = sectionCollections;
                if (check === true) {
                    if (!newSelection[`${date}`]) newSelection[`${date}`] = [];
                    newSelection[`${date}`].push(time);
                } else {
                    var se = newSelection[date].indexOf(time);
                    newSelection[date].splice(se, 1);
                }
                setSectionCollections(newSelection);
                setCollections({ ...collections, [category]: newSelection });
                break;

            case 'light_maps':
                newSelection = lightingCollections;
                if (check === true) {
                    if (!newSelection[`${date}`]) newSelection[`${date}`] = [];
                    newSelection[`${date}`].push(time);
                } else {
                    var l = newSelection[date].indexOf(time);
                    newSelection[date].splice(l, 1);
                }
                setLightingCollections(newSelection);
                setCollections({ ...collections, [category]: newSelection });
                break;
            case 'nature_maps':
                newSelection = natureCollections;
                if (check === true) {
                    if (!newSelection[`${date}`]) newSelection[`${date}`] = [];
                    newSelection[`${date}`].push(time);
                } else {
                    var n = newSelection[date].indexOf(time);
                    newSelection[date].splice(n, 1);
                }
                setNatureCollections(newSelection);
                setCollections({ ...collections, [category]: newSelection });
                break;
            case 'sound_maps':
                newSelection = soundCollections;
                if (check === true) {
                    if (!newSelection[`${date}`]) newSelection[`${date}`] = [];
                    newSelection[`${date}`].push(time);
                } else {
                    var s = newSelection[date].indexOf(time);
                    newSelection[date].splice(s, 1);
                }
                setSoundCollections(newSelection);
                setCollections({ ...collections, [category]: newSelection });
                break;
            case 'access_maps':
                newSelection = accessCollections;
                if (check === true) {
                    if (!newSelection[`${date}`]) newSelection[`${date}`] = [];
                    newSelection[`${date}`].push(time);
                } else {
                    var a = newSelection[date].indexOf(time);
                    newSelection[date].splice(a, 1);
                }
                setAccessCollections(newSelection);
                setCollections({ ...collections, [category]: newSelection });
                break;
            case 'program_maps':
                newSelection = programCollections;
                if (check === true) {
                    if (!newSelection[`${date}`]) newSelection[`${date}`] = [];
                    newSelection[`${date}`].push(time);
                } else {
                    var p = newSelection[date].indexOf(time);
                    newSelection[date].splice(p, 1);
                }
                setProgramCollections(newSelection);
                setCollections({ ...collections, [category]: newSelection });
                break;
            default:
                console.log(`Error handling selection change.`);
        }
    };

    /**
        Function: saveAs
        Description: This function generates a simulated link and link click to download an image with the given URL and filename. If the browser supports the "download" attribute, the image will be downloaded directly. Otherwise, a new window will be opened with the image URL.
        @param {string} url - The URL of the image to download
        @param {string} filename - The filename to save the image as
        @return {void}
    */
    function saveAs(url, filename) {
        var link = document.createElement('a');
        //simulated link and link click with removal
        if (typeof link.download === 'string') {
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            //remove the link when done
            document.body.removeChild(link);
        } else {
            window.open(url);
        }
    }

    /**
        Function: convertToImage
        Description: This function converts the mapFrame HTML element to an image using html2canvas library
        and downloads the image with the given title as a PNG file using the saveAs function.
        @param {Event} e - The event object.
        @return {void}
    */
    const convertToImage = (e) => {
        html2canvas(document.getElementById('mapFrame'), {
            useCORS: true
        }).then(
            function (canvas) { saveAs(canvas.toDataURL(), `${title}.png`) }
        );
    }

    // Event handling functions ------
    const onMClick = (e) => {
        if (props.type === 2 || props.type === 0 || props.type === 7) {
            setClick(e.latLng);
            setCenter(e.latLng);
        } else if (props.type === 3 || props.type === 4 || props.type === 6 || props.type === 8 || props.type === 10) {
            if(clicks.length >= 2 && props.type ===10){
                //too many points for section
                return;
            }
           
            var clickObj = {
                lat: 0,
                lng: 0
            }
            clickObj.lat = e.latLng.lat();
            clickObj.lng = e.latLng.lng();
            
            setClicks([...clicks, clickObj]);
        
        } else {
            setCenter(e.latLng);
        }
    };

    const onPClick = (e) => {
        if (props.type === 0) {
            setClick(e.latLng);
            setCenter(e.latLng);
        } else {
            setClick(e.latLng);
        }
    };

    const onIdle = (m) => {
        setZoom(m.getZoom() ? m.getZoom() : 10);
        setCenter(m.getCenter().toJSON());
    };

    const onBounds = (m, p) => (event) => {
        setBounds(p.setBounds(m.getBounds()));
        setZoom(m.getZoom())
    };

    const onChange = (p) => (event) => {
        const place = p.getPlace();
        setCenter(place.geometry.location);
        setClick(place.geometry.location);
    }

    const removePoint = (e) => {
        e.preventDefault();
        var temp = [];
        clicks.forEach((click, index) => (
            index !== clicks.length - 1 ?
                temp.push(click) : null
        ))
        setClicks(temp);
    };

    const togglePlaces = (e) => {
        setPlaceOn(!placeOn);
    }

    const handleSignUpSC = async () => {
        console.log('section sign up')
        try {
            await axios.put(`section_maps/${sectionData._id}/claim`, JSON.stringify({
                user: loc.state.userToken.user._id
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

        } catch (error) {
            console.log('ERROR: ', error);
            return;
        }
        console.log('section sign up success')

       let userObj = {firstname: loc.state.userToken.user.firstname, lastname: loc.state.userToken.user.lastname , _id: loc.state.userToken.user._id}
        sectionData.researchers.push(userObj)
        
        let SCsignUpBtn = document.getElementById('signUpSCBtn')
        let SCwithdrawBtn = document.getElementById('withdrawSCBtn')
        let SCsurveyorbutton = document.getElementById('SCSurveyorsBtn');
        let viewMediaButton = document.getElementById('viewMediaBtn');

        SCwithdrawBtn.style.display = 'flex'
        SCsurveyorbutton.style.display = 'flex'
        SCsignUpBtn.style.display = 'none'
        viewMediaButton.style.display = 'flex'
    }

    const handleSignUpIP = async () => {
        console.log("program signup")
        try {
            await axios.put(`program_maps/${buildingData._id}/claim`, JSON.stringify({
                user: loc.state.userToken.user._id
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

        } catch (error) {
            console.log('ERROR: ', error);
            return;
        }
        console.log("signup successful")

        let userObj = {firstname: loc.state.userToken.user.firstname, lastname: loc.state.userToken.user.lastname , _id: loc.state.userToken.user._id}
        buildingData.researchers.push(userObj)

        let IPsignUpBtn = document.getElementById('signUpIPBtn')
        let IPwithdrawBtn = document.getElementById('withdrawIPBtn')
        let IPsurveyorbutton = document.getElementById('IPSurveyorsBtn');
        let viewModelButton = document.getElementById('viewModelBtn');

        IPwithdrawBtn.style.display = 'flex'
        IPsurveyorbutton.style.display = 'flex'
        viewModelButton.style.display = 'flex'
        IPsignUpBtn.style.display = 'none'
       
    }

    const handleWithdrawSC = async  () => {
        console.log('section withdraw')
        try {
            await axios.delete(`section_maps/${sectionData._id}/claim`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });
        } catch (error) {
            console.log('ERROR: ', error);
            return;
        }
        console.log('section withdraw success')
        sectionData.researchers = sectionData.researchers.filter(item => item._id !== loc.state.userToken.user._id);

        let SCsignUpBtn = document.getElementById('signUpSCBtn')
        let SCwithdrawBtn = document.getElementById('withdrawSCBtn')
        let SCsurveyorbutton = document.getElementById('SCSurveyorsBtn');
        let viewMediaButton = document.getElementById('viewMediaBtn');
        
        const userId = loc.state.userToken.user._id
        const owner = loc.state.owner
        if( owner.user !== userId )
            viewMediaButton.style.display = 'none'
        SCwithdrawBtn.style.display = 'none'
        SCsurveyorbutton.style.display = 'none'
        SCsignUpBtn.style.display = 'flex'
    }

    const handleWithdrawIP = async () => {
        console.log('program withdraw')
        try {
            await axios.delete(`program_maps/${buildingData._id}/claim`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });
        } catch (error) {
            console.log('ERROR: ', error);
            return;
        }
        console.log('program withdraw success')
        buildingData.researchers = buildingData.researchers.filter(item => item._id !== loc.state.userToken.user._id);

        let IPsignUpBtn = document.getElementById('signUpIPBtn')
        let IPwithdrawBtn = document.getElementById('withdrawIPBtn')
        let IPsurveyorbutton = document.getElementById('IPSurveyorsBtn');
        let viewModelButton = document.getElementById('viewModelBtn');
        
        const userId = loc.state.userToken.user._id
        const owner = loc.state.owner
        if( owner.user !== userId )
            viewModelButton.style.display = 'none'
        IPwithdrawBtn.style.display = 'none'
        IPsurveyorbutton.style.display = 'none'
        IPsignUpBtn.style.display = 'flex'
        

    }

    const handleIPSurveyorRoute = () => {
        console.log(buildingData)
        nav('../activities/program_surveyors', { replace: true, state: { team: loc.state.team, owner: loc.state.owner, project: loc.state.project, userToken: loc.state.userToken, data: buildingData, type: 0 } });
    }

    const handleViewModelRoute = () => {
        console.log(buildingData)
        nav('../activities/program_surveyors', { replace: true, state: { team: loc.state.team, owner: loc.state.owner, project: loc.state.project, userToken: loc.state.userToken, data: buildingData, type: 1 } });

    }

    const handleViewMediaRoute = () => {
        nav('../activities/view_media', { replace: true, state: { team: loc.state.team, owner: loc.state.owner, project: loc.state.project, userToken: loc.state.userToken, section: sectionData } });
    }

    const handleSCSurveyorRoute = () => {
        console.log(sectionData)
        nav('../activities/upload_section_media', { replace: true, state: { team: loc.state.team, owner: loc.state.owner, project: loc.state.project, userToken: loc.state.userToken, section: sectionData } });
    }

    const handleSendBuildingData = (e, title, sdate, time ) => {
        buildingData = e[title][sdate][time];
    }

    const handleSendSectionData = (e, title, sdate, time) => {
        sectionData = e[title][sdate][time];
    }

    const handleBaseplateRender = (e) => {
        let obj = [];

        e.perimeterPoints.map(vertex => {
            // console.log(vertex)
            let newObj = {
                latitude: vertex.lat,
                longitude: vertex.lng,
            };
            obj.push(newObj);
        }

        )
        return obj;
    }

    /**
        Function: boundsPathWindow
        Description: Displays an info window/modal for boundaries and paths that do not have Google Maps Info Windows.
        It receives the title, date, time, index, and ver parameters, checks the values to determine which kind of collection to display,
        and then populates the modal with the relevant data. The function also shows/hides the IPSurveyorsBtn as needed.
        @param {string} title - The title of the collection
        @param {string} date - The date of the collection
        @param {string} time - The time of the collection
        @param {number | Array} index - The index or array of indices of the selected data point(s)
        @param {number} ver - The version of the collection (0-7)
        @return {void}
    */
    const boundsPathWindow = (title, date, time, index, ver) => (e) => {
        const popup = document.getElementById('pathBoundWindow');
        const inner = document.getElementById('popUpText');

        // this ensures? that the IPSurveyorBtn doesn't get displayed for the other test models
        const IPsurveyorbutton = document.getElementById('IPSurveyorsBtn');
        const viewModelButton = document.getElementById('viewModelBtn');
        const viewMediaButton = document.getElementById("viewMediaBtn");
        const IPsignUpBtn = document.getElementById('signUpIPBtn');
        const IPwithdrawBtn = document.getElementById('withdrawIPBtn');
        const SCsignUpBtn = document.getElementById('signUpSCBtn');
        const SCwithdrawBtn = document.getElementById('withdrawSCBtn');

        IPsurveyorbutton.style.display = 'none';
        viewModelButton.style.display = 'none';
        viewMediaButton.style.display = 'none';
        IPsignUpBtn.style.display = 'none';
        IPwithdrawBtn.style.display = 'none';
        SCsignUpBtn.style.display = 'none';
        SCwithdrawBtn.style.display = 'none';

        const SCsurveyorbutton = document.getElementById('SCSurveyorsBtn');
        SCsurveyorbutton.style.display = 'none';

        //const IPsurveyorbutton = document.getElementById('');
        //IPsurveyorbutton.style.display = 'none';
        if (ver === 0 || ver === 2) {
            // version 0 & 2 === spatial boundaries (constructed = polyline, shelter and material boundary)
            inner.innerHTML = '';
            inner.innerHTML = `<h5>${testNames(title)}</h5><br/>Location ${index + 1}<br/>kind: ${data.Results[title][date][time].data[index].kind}<br/>description: ${data.Results[title][date][time].data[index].description}<br/>${data.Results[title][date][time].data[index].kind === 'Constructed' || data.Results[title][date][time].data[index].kind === 'Construction' ? 'Length' : 'Area'}: ${data.Results[title][date][time].data[index].value} ${data.Results[title][date][time].data[index].kind === 'Constructed' || data.Results[title][date][time].data[index].kind === 'Construction' ? 'ft' : 'ft<sup>2</sup>'}`
            popup.style.display = 'flex';
        } else if (ver === 1) {
            // version 1 == water nature collection
            const popup = document.getElementById('pathBoundWindow');
            inner.innerHTML = '';
            inner.innerHTML = `<h5>${testNames(title)}</h5><br/>Water<br/>Location ${index[1] + 1}<br/>Description: ${data.Results[title][date][time].data[index[0]].water[index[1]].description}<br/>Area: ${data.Results[title][date][time].data[index[0]].water[index[1]].area} ft<sup>2</sup>`
            popup.style.display = 'flex';
        } else if (ver === 3) {
            // version 3 == vegetation nature collection
            const popup = document.getElementById('pathBoundWindow');
            inner.innerHTML = '';
            inner.innerHTML = `<h5>${testNames(title)}</h5><br/>Vegetation<br/>Location ${index[1] + 1}<br/>Description: ${data.Results[title][date][time].data[index[0]].vegetation[index[1]].description}<br/>Area: ${data.Results[title][date][time].data[index[0]].vegetation[index[1]].area} ft<sup>2</sup>`
            popup.style.display = 'flex';
        } else if (ver === 5) {
            // version 5 == identifying program collection
            const popup = document.getElementById('pathBoundWindow');
            inner.innerHTML = '';
            inner.innerHTML = `<h5>${testNames(title)}</h5><br/>`;
            popup.style.display = 'flex';
            
            let max = buildingData.maxResearchers;
            let len = buildingData.researchers.length;

            //check here if user is a researcher or not
            const userId = loc.state.userToken.user._id
            let researchers = buildingData.researchers
            const owner = loc.state.owner

            let findUser = researchers.findIndex(element => element._id === userId)
            if(findUser >= 0){
                max = -1; //do not add the user

                //show the withdraw, begin test, and view model buttons
                IPwithdrawBtn.style.display = 'flex';
                IPsurveyorbutton.style.display = 'flex';
                viewModelButton.style.display = 'flex';
            } else if(owner.user === userId) {
                viewModelButton.style.display = 'flex';                
            }

            if(max > 0 && (max-len) > 0){
                //show sign up button
                IPsignUpBtn.style.display = 'flex';
            }

            
            
        } else if (ver === 6) {
            // version 6 == identifying access collection
            inner.innerHTML = '';
            inner.innerHTML = `
                <h5>${testNames(title)}</h5>
                <br/>
                Description: ${data.Results[title][date][time].data[index].description}<br/>
                <text>${!data.Results[title][date][time].data[index].inPerimeter ? `${data.Results[title][date][time].data[index].distanceFromArea.toFixed(2).toLocaleString('en-US')} ft from project perimeter` : "Inside perimeter"}</text><br/>
                <text>Difficulty Rating: ${data.Results[title][date][time].data[index].details.diffRating}</text><br/>
                ${data.Results[title][date][time].data[index].accessType === "Access Path" ?
                        `${data.Results[title][date][time].data[index].inPerimeter ? `<text>Length: ${data.Results[title][date][time].data[index].area.toLocaleString('en-US')} ft</text><br/>` : ""}
                         ${data.Results[title][date][time].data[index].details.laneCount === undefined ? "" : `<text>Number Lanes: ${data.Results[title][date][time].data[index].details.laneCount} </text><br/>`}
                         ${data.Results[title][date][time].data[index].details.twoWay === undefined ? "" : data.Results[title][date][time].data[index].details.twoWay ? `<text>This road is two-way<text/><br/>` : `<text>This road is one-way<text/><br/>`}
                         ${data.Results[title][date][time].data[index].details.median ? `<text>This path has a median<text/><br/>` : ""}
                         ${data.Results[title][date][time].data[index].details.paved ? `<text>This path is paved<text/><br/>` : ""}
                         ${data.Results[title][date][time].data[index].details.tollLane ? `<text>This path has a toll<text/><br/>` : ""}
                         ${data.Results[title][date][time].data[index].details.turnLane.length > 1 ? `<text>The path has both left and right turn lanes<text/>` : (data.Results[title][date][time].data[index].details.turnLane.length === 1 ? (data.Results[title][date][time].data[index].details.turnLane[0] === 1 ? "The path has no turn lanes" : (data.Results[title][date][time].data[index].details.turnLane[0] === 2 ?"The path has a left turn lane" : "The path has a right turn lane")) : "The path has no turn lanes")}<br/>`
                    :
                    `<text>Area: ${data.Results[title][date][time].data[index].area.toLocaleString('en-US')} ft²</text><br/>
                         <text>Number spots: ${data.Results[title][date][time].data[index].details.spots}</text><br/>

                         
                         <text>Cost: ${
                            data.Results[title][date][time].data[index].details.cost ?
                            (data.Results[title][date][time].data[index].details.cost > 0 ? 
                                Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.Results[title][date][time].data[index].details.cost).toLocaleString('en-US') 
                                : 
                                "FREE!")
                            :
                            "N/A"
                        }</text>`}`
            popup.style.display = 'flex';
        } else if (ver === 7) {
            // version 7 == section cutter collection
            const popup = document.getElementById('pathBoundWindow');
            inner.innerHTML = '';
            inner.innerHTML = `<h5>Section Cutter</h5><br/>`;
            popup.style.display = 'flex';

            const userId = loc.state.userToken.user._id
            const owner = loc.state.owner
            let max = sectionData.maxResearchers;
            let len = sectionData.researchers.length;
           
            let findUser = sectionData.researchers.findIndex(element => element._id === userId)
            
            if(findUser >= 0){
                max = -1; //user was found in researchers

                //show the withdraw and begin test buttons show
                SCwithdrawBtn.style.display = 'flex';
                SCsurveyorbutton.style.display = 'flex';
                viewMediaButton.style.display = 'flex';

            } else if(owner.user === userId) {
                //user was not found but is an owner
                viewMediaButton.style.display = 'flex';             
            }

            if(max > 0 && (max-len) > 0){
                //user was not found and there is still spots
                SCsignUpBtn.style.display = 'flex';
            }
            
        } else {
            // version 4 moving collections
            const popup = document.getElementById('pathBoundWindow');
            inner.innerHTML = '';
            inner.innerHTML = `<h5>${testNames(title)}</h5><br/>Location ${index + 1}<br/>Mode: ${data.Results[title][date][time].data[index].mode}`
            popup.style.display = 'flex';
        }
    }

    const closeWindow = (e) => {
        const popup = document.getElementById('pathBoundWindow');
        const inner = document.getElementById('popUpText');
        popup.style.display = 'none';
        inner.innerHTML = '';
    }

    // Renders all selected activity options to the corresponding markers, polylines and boundaries
    const actCoords = (collections) => (
        // Loop through the activity collections
        Object.entries(collections).map(([title, object], index) => (
            // Loop through the activity collection's objects
            Object.entries(object).map(([sdate, stimes]) => (
                // Loop through the object's times
                stimes.map(time => (
                    // Check if the activity is a nature map
                    title === 'nature_maps' ?
                        // If it is a nature map, loop through the data and render markers and boundaries
                        !data.Results[title][sdate][time].data ? null :
                            ((data.Results[title][sdate][time].data).map((inst, ind0) => (
                                // Loop through the instances and render markers and boundaries
                                Object.entries(inst).map(([natureType, pointArr], ind1) => (

                                    Array.isArray(pointArr) && pointArr.map((natureObj, ind2) => (
                                        // If the object is an animal, render a marker
                                        natureType === 'animal' ?
                                            <Marker
                                                key={`${sdate}.${time}.${ind2}`}
                                                shape='circle'
                                                info={
                                                    `<div><b>${testNames(title)}</b><br/>Location ${ind2 + 1}<br/>Animal: ${natureObj.description}<br/>[${natureObj.kind}]</div>`
                                                }
                                                position={natureObj.marker}
                                                markerType={natureType}
                                            />
                                            // If it is not an animal, render a boundary
                                            : <Bounds
                                                key={`${sdate}.${time}.${ind2}`}
                                                title={title}
                                                date={sdate}
                                                time={time}
                                                index={[ind0, ind2]}
                                                area={natureObj.location}
                                                type={natureType}
                                                boundsPathWindow={boundsPathWindow}
                                            />
                                    ))
                                ))
                            )))
                        // If the activity is a program map, render a boundary
                        : (title === 'program_maps' ?
                            !data.Results[title][sdate][time].data ? null : (data.Results[title][sdate][time].data).map((inst) => (
                                <Bounds
                                    key={`${sdate}.${time}.${0}`}
                                    title={title}
                                    date={sdate}
                                    time={time}
                                    index={0}
                                    // [[28.376002646895927, -81.5514212934046], [28.37641799472018, -81.54852450766852], [28.374907631199783, -81.5476018277674]
                                    // , [28.37398252292356, -81.55285895743658],  [28.375115307459065, -81.55341685691168]]
                                    // [{latitude: 38.897361411665344, longitude:-77.03679200665762},
                                    //     {latitude: 38.89794173105639, longitude: -77.03680809991171},
                                    //     {latitude: 38.89764113455378, longitude:-77.03616973416617},
                                    //     ]

                                    area={handleBaseplateRender(inst)}
                                    doThis={handleSendBuildingData(data.Results, title, sdate, time)}
                                    type={"Baseplate"}
                                    boundsPathWindow={boundsPathWindow}
                                />
                            ))
                            // If the activity is an access map, render markers and boundaries
                            : (title === 'access_maps' ?
                                // Check if there is data for the current time, and map over it to render each instance                    
                                !data.Results[title][sdate][time].data ? null : (data.Results[title][sdate][time].data).map((inst, index) => (
                                    // For each instance, map over its data to display
                                    (inst.accessType === "Access Point" ?
                                        <Marker
                                            key={`${sdate}.${time}.${index}`}
                                            shape={'lightcircle'}
                                            info={`<div>
                                                <h5>${testNames(title)}</h5>
                                                <b>${inst.accessType}</b><br/>
                                                <text>${inst.description}</text><br/>
                                                <text>${!inst.inPerimeter ? `${inst.distanceFromArea.toFixed(2).toLocaleString('en-US')} ft from project perimeter` : "Inside perimeter"}</text><br/>
                                                <text>Difficulty Rating: ${inst.details.diffRating}</text><br/>
                                                ${inst.details.spots ? `<text>Number spots: ${inst.details.spots}</text><br/>` : ""}
                                                <text>Cost: ${
                                                    inst.details.cost ?
                                                        (inst.details.cost > 0 ? 
                                                        Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(inst.details.cost).toLocaleString('en-US') 
                                                        : 
                                                        "FREE!")
                                                    :
                                                    "N/A"
                                                }</text>`}
                                            position={inst.path[0]}
                                            markerType={'access_maps'}
                                        />
                                        // If the data (point) is an access path, render a polyline
                                        : inst.accessType === "Access Path" ?
                                            <Path
                                                key={`${sdate}.${time}.${index}`}
                                                path={inst.path}
                                                mode={inst.inPerimeter ? 'intAccess' : 'extAccess'}
                                                title={title} date={sdate} time={time} index={index}
                                                boundsPathWindow={boundsPathWindow}
                                                

                                            />
                                            : inst.accessType === "Access Area" ? // If the data (point) is an access area, render a polygon
                                                <Bounds
                                                    key={`${sdate}.${time}.${index}`}
                                                    title={title} date={sdate} time={time} index={index}
                                                    area={inst.path}
                                                    type={'access'}
                                                    boundsPathWindow={boundsPathWindow}
                                                /> : null
                                    )
                                ))
                                // If the activity is not an access map, render markers, boundaries or polylines based on the point's kind
                                : (title === 'section_maps' ?
                                    !data.Results[title][sdate][time].data ? null : (data.Results[title][sdate][time].data).map((inst, index) => (

                                        <Path
                                            key={`${sdate}.${time}.${index}`}
                                            path={inst.path}
                                            title={'section'}
                                            doThis={handleSendSectionData(data.Results, title, sdate, time)}
                                            boundsPathWindow={boundsPathWindow}
                                            mode={'section'}
                                        />
                                    )

                                    )
                                    : (title === 'light_maps' || title === 'order_maps' ?
                                        // For light and order maps, map over each instance's points to render them as markers
                                        !data.Results[title][sdate][time].data ? null : (data.Results[title][sdate][time].data).map((inst) => (
                                            Object.entries(inst.points).map(([ind, point], i2) => (
                                                <Marker
                                                    key={`${sdate}.${time}.${i2}`}
                                                    shape={title === 'order_maps' ? 'triangle' : 'lightcircle'}
                                                    info={point.light_description ?
                                                        (`<div><b>${testNames(title)}</b><br/>Location ${i2}<br/>${point.light_description}</div>`)
                                                        : (point.description ? (`<div><b>${testNames(title)}</b><br/>Location ${i2 + 1}<br/>${point.kind}<br/>${point.description}</div>`) : null)}
                                                    position={point.location}
                                                    markerType={point.light_description ? point.light_description : point.kind}
                                                />
                                            ))
                                        ))
                                        :
                                        !data.Results[title][sdate][time].data ? null : (data.Results[title][sdate][time].data).map((point, i2) => (
                                            point ? (point.mode || point.kind === 'Constructed' || point.kind === 'Construction' ?
                                                <Path
                                                    key={`${sdate}.${time}.${i2}`}
                                                    path={point.path}
                                                    mode={point.mode ? point.mode : point.kind}
                                                    title={title} date={sdate} time={time} index={i2}
                                                    boundsPathWindow={boundsPathWindow}
                                                />
                                                :
                                                (point.kind === 'Shelter' || point.kind === 'Material' ?
                                                    <Bounds
                                                        key={`${sdate}.${time}.${i2}`}
                                                        title={title}
                                                        date={sdate}
                                                        time={time}
                                                        index={i2}
                                                        area={point.path}
                                                        type={point.kind ? point.kind : point.result}
                                                        boundsPathWindow={boundsPathWindow}
                                                    />
                                                    :
                                                    <Marker
                                                        key={`${sdate}.${time}.${i2}`}
                                                        shape={'circle'}
                                                        info={point.average ?
                                                            (`<div><b>${testNames(title)}</b><br/>Location ${i2 + 1}<br/>${point.average} dB</div>`)
                                                            : (point.result ?
                                                                (`<div><b>${testNames(title)}</b><br/>Location ${i2 + 1}<br/>${point.result}</div>`)
                                                                : (point.posture ?
                                                                    // This is where the data from people in places are coming from
                                                                    (`<div><b>${testNames(title)}</b><br/>Location ${i2 + 1}<br/>${point.posture}</div>`)
                                                                    : null))}
                                                        position={point.location ? point.location : standingPoints[point.standingPoint]}
                                                        markerType={point.average ? 'sound_maps'
                                                            : (point.result ? point.result : (point.posture ? point.posture : null))}
                                                        markerSize={title === 'sound_maps' ? point.average : null}
                                                    />
                                                )
                                            ) : null
                                        ))
                                    )
                                )
                            )
                        )
                )
                ))
            ))
        ));

    // Components returned on render -----
    return (
        <div id='mapDoc'>
            {/* Map Drawers overlay in map.jsx to better communicate*/}
            {props.type === 1 ? <MapDrawers drawers={data} selection={onSelection} area={areaData} /> : null}
            {props.type === 1 ? <Button id='printButton' onClick={convertToImage}>Print Map</Button> : null}
            {/* Wrapper imports Google Maps API */}
            <Wrapper apiKey={loc.state.userToken.map_key} render={render} id='mapContainer' libraries={['drawing', 'places']}>
                <Map
                    center={center}
                    onClick={onMClick}
                    onIdle={onIdle}
                    onBounds={onBounds}
                    mapObj={setMap}
                    places={mapPlaces}
                    zoom={zoom}
                    mapTypeId='satellite'
                >
                    {areaData && (props.type >= 3 && props.type <= 5) ? <Bounds area={areaData} type={'area'} ver={true} /> : (areaData ? <Bounds area={areaData} type={'area'} /> : null)}
                    {subAreas ? (subAreas.length > 1 ? subAreas.map((area, index) => (index === 0 ? null : <Bounds area={area.points} type={'area'} />)) : null) : null}
                    {props.type === 1 ?
                        actCoords(collections) :
                        (props.type === 2 || props.type === 4 ?
                            <Marker position={props.center} /> :
                            (props.type === 0 || props.type === 7 ?
                                <Marker position={click} /> : null))}
                    {props.type === 0 ? <Places map={map} onChange={placeOn ? onChange : null} on={placeOn} togglePlaces={togglePlaces} onClick={onPClick} center={center} zoom={zoom} state={loc.state} /> : null}
                    {/* Change marker types for non center markers to show difference */}
                    {props.type === 3 || props.type === 5 ? clicks.map((latLng, i) => (<Marker key={i} position={latLng} info={`<div>Position ${i}</div>`} />)) : null}
                    {props.type === 4 || props.type === 6 || props.type === 8 || props.type === 10 ? NewArea(clicks) : null} {/*<DrawBounds onComplete={ onComplete } center={ props.center } zoom={ zoom } title={ title } points={ clicks }/>: null */}
                </Map>
            </Wrapper>
            {props.type === 4 || props.type === 6 ?
                (props.type === 4 ?
                    <div id='newAreaBlock'>
                        <div style={{ textAlign: 'center', backgroundColor: 'white', marginBottom: '5px', padding: '10px', borderRadius: '5px', width: '30vw', border: '2px solid transparent' }}> Click on the map to set points for the project perimeter<br /> When the perimeter is done click 'Set Perimeter' <div style={{ fontSize: 'small' }}> *3 points minimum</div></div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {clicks.length < 3 ? null : <Button
                                id='newAreaButton'
                                className='newHoveringButtons confirm'
                                component={Link}
                                to='points'
                                state={{ ...loc.state, center: center, title: title, area: clicks, zoom: zoom }}
                            >
                                Set Perimeter
                            </Button>}
                            <Button className='newHoveringButtons' onClick={removePoint}>Undo <UndoIcon /></Button>
                        </div>
                    </div>
                    :
                    <div id='editAreaBlock'>
                        <Button
                            id='newAreaButton'
                            className='newHoveringButtons confirm'
                            onClick={props.update(clicks)}
                        >
                            {loc.state.area ? 'Update Area' : 'Add Area'}
                        </Button>
                        <Button
                            className='newHoveringButtons confirm'
                            component={Link}
                            state={loc.state}
                            to={`../edit/${loc.pathname.split('/')[5]}/areas`}>
                            Cancel
                        </Button>
                        <Button className='newHoveringButtons' onClick={removePoint}>Undo <UndoIcon /></Button>
                    </div>
                )
                : null
            }
            {props.type === 7 ?
                <div className='newPointBlock'>
                    <Button
                        id='newPointButton'
                        className='newHoveringButtons confirm'
                        onClick={props.update(center)}
                    >
                        {loc.state.point ? 'Update Point' : 'Add Point'}
                    </Button>
                    <Button
                        className='newHoveringButtons confirm'
                        component={Link}
                        state={loc.state}
                        to={`../edit/${loc.pathname.split('/')[5]}/points`}>Cancel</Button>
                </div>
                : null
            }
            {props.type === 3 ?
                <div className='newPointBlock' style={{ top: '75px' }} >
                    <div style={{ textAlign: 'center', backgroundColor: 'white', marginBottom: '5px', padding: '10px', borderRadius: '5px', width: '30vw', border: '2px solid transparent' }}> Click on the map to set any specific locations as standing points for recording activity results <div style={{ fontSize: 'small' }}> *The location specified earlier is the center and a default standing point</div></div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Button
                            id='newPointsButton'
                            className='newHoveringButtons confirm'
                            component={Link}
                            to={`/home/teams/${loc.pathname.split('/')[3]}/new/area/points/form`}
                            state={{
                                ...loc.state,
                                center: center,
                                title: title,
                                area: areaData,
                                points: clicks,
                                zoom: zoom
                            }}
                        >
                            Set Points
                        </Button>
                        <Button className='newHoveringButtons' onClick={removePoint}>Undo <UndoIcon /></Button>
                    </div>
                </div>
                : null
            }
            {props.type === 8 ?
                <div id='newProgramButtons' style={{ justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'center', backgroundColor: 'white', marginBottom: '5px', padding: '10px', borderRadius: '5px', width: '40vw', border: '2px solid transparent' }}>
                        <Button className='resetButton' component={Link} size='lg' variant='filledTonal' color='error' to='../activities'
                            state={{
                                team: loc.state.team,
                                project: loc.state.project,
                                userToken: loc.state.userToken,
                                owner: loc.state.owner
                            }}>
                            Cancel <Clear />

                        </Button>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '80%' }}>


                            <Button style={{ marginRight: '20px' }} className='newHoveringButtons' onClick={removePoint}>Undo <UndoIcon /></Button>
                            <div style={{ marginRight: '20px', marginTop: '5px' }}>

                                <TextField
                                    id="outlined-number"
                                    label="Number of Floors"
                                    type="number"
                                    placeholder='1'
                                    inputProps={{ min: "1" }}
                                    onChange={e => setNumFloors(e.target.value)}
                                    size="small"
                                />

                            </div>

                            {clicks.length < 3 || numFloors < 1 ? null :
                                <Button style={{ marginRight: '10px' }} className='continueButton' component={Link} size='lg' variant='filledTonal' color='error' to='extrude'
                                    state={{ ...loc.state, buildingArea: clicks, numFloors: numFloors }} >
                                    Continue
                                </Button>
                            }
                            <IPDialog />

                        </div>
                    </div>
                </div>
                : null
            }

            {
                //Section Cutter test function

                props.type === 10 ?
                    <div id='newSectionButtons'>
                        <div style={{ textAlign: 'center', backgroundColor: 'white', marginButton: '5px', padding: '10px', borderRadius: '5px', width: '30vw', border: '2px solid transparent' }} >
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', }}>
                                <Button className='resetButton' component={Link} size='lg' variant='filledTonal' color='error' to='../activities'
                                    state={{
                                        team: loc.state.team,
                                        project: loc.state.project,
                                        userToken: loc.state.userToken,
                                        owner: loc.state.owner
                                    }}>

                                    Cancel
                                </Button>
                                <Button className='newHoveringButtons' onClick={removePoint}> Undo <UndoIcon /></Button>
                                {clicks.length === 2 ? 
                                    <Button className='continueButton' component={Link} size='lg' variant='filledTonal' color='error' to='../activities/times' state={{ ...loc.state, path: clicks }}>
                                        Continue Section
                                    </Button>
                                :  null    
                                }
                                <SCDialog />
                            </div>
                        </div>
                    </div>
                   

                    : null
            }

            <div id='pathBoundWindow' style={{ display: 'none', position: 'fixed', flexDirection: 'row', justifyContent: 'center' }}>
                <div id='popUpBlock'>
                    <div id='popUpText'>

                    </div>
                    <Button id='withdrawSCBtn' style={{ display: 'none' }} onClick={handleWithdrawSC}>Withdraw</Button>
                    <Button id='withdrawIPBtn' style={{ display: 'none' }} onClick={handleWithdrawIP}>Withdraw</Button>
                    <Button id='SCSurveyorsBtn' style={{ display: 'none' }} onClick={handleSCSurveyorRoute}>Add Media</Button>
                    <Button id='IPSurveyorsBtn' style={{ display: 'none' }} onClick={handleIPSurveyorRoute}>Commence</Button>
                    <Button id='signUpSCBtn' style={{ display: 'none' }} onClick={handleSignUpSC}>Sign Up</Button>
                    <Button id='signUpIPBtn' style={{ display: 'none' }} onClick={handleSignUpIP}>Sign Up</Button> 
                    <Button id='viewModelBtn' style={{ display: 'none' }} onClick={handleViewModelRoute}>View Model</Button>
                    <Button id='viewMediaBtn' style={{ display: 'none' }} onClick={handleViewMediaRoute}>View Media</Button>
                    <Button id='closeButton' onClick={closeWindow}>Close</Button>
                </div >
            </div >
        </div >
    );
};

interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
    onBounds?: (map: google.maps.Map, place: google.maps.places.Autocomplete) => void;
}

const Map: React.FC<MapProps> = ({ onClick, onIdle, onBounds, mapObj, places, children, style, ...options }) => {
    const ref = React.useRef(null);
    const [map, setMap] = React.useState();

    React.useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
            mapObj(map);
        }
    }, [ref, map, mapObj]);

    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options);
        }
    }, [map, options]);

    React.useEffect(() => {
        if (map) {
            ['click', 'idle', 'bounds_changed'].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            );
            if (onClick) {
                map.addListener('click', onClick);
            }

            if (onIdle) {
                map.addListener('idle', () => onIdle(map));
            }

            if (onBounds) {
                map.addListener('bounds_changed', () => onBounds(map, places))
            }
        }
    }, [map, onClick, onIdle, onBounds, places]);

    return (
        <>
            <div ref={ref} style={style} id='mapFrame' />
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // sets the map prop on the child component (markers)
                    return React.cloneElement(child, { map });
                }
            })}
        </>
    );
};

const Marker = (options) => {
    const markerType = options.markerType;
    const info = options.info;
    const markerSize = Number(options.markerSize);
    const shape = options.shape;
    const [infoWindow, setInfoWindow] = React.useState();
    console.log("options position: ", options.position);

    const colors = {
        sound_maps: ['#B073FF', '#B073FF'],
        access_maps: ['blue', 'black'],
        section_maps: ['red', 'red'],
        animal: ['#9C4B00', 'red'],
        Squatting: ['green', 'black'],
        Sitting: ['red', 'black'],
        Standing: ['blue', 'black'],
        Laying: ['yellow', 'black'],
        Behavior: ['#FF9900', '#FF9900'],
        Maintenance: ['#FFE600', '#FFD800'],
        none: ['white', 'white'],
        Rhythmic: ['#FFE600', '#FFD800'],
        Building: ['#FF9900', '#FF9900'],
        Task: ['#FF00E5', '#FF00E5'],
        New: ['rgba(255, 0, 0, 0.5)', 'rgba(255,0,0,0.5)']
    };

    //SVG shape icons
    let style = {
        path: shape === 'triangle' ? 'M 0 2 L 2 2 L 1 0.25 z' : (shape === 'lightcircle' ? 'M 10, 20 a 10, 10 0 1, 1 20, 0 a 10, 10 0 1, 1 -20, 0 M 19.5, 20 a 0.5, 0.5 0 1, 1 1, 0 a 0.5, 0.5 0 1, 1 -1, 0' : google.maps.SymbolPath.CIRCLE),
        fillColor: markerType ? colors[markerType][0] : colors.none[0],
        fillOpacity: (markerSize ? 0.4 : (markerType === 'Behavior' || markerType === 'Maintenance' || markerType === 'animal' ? 1 : 0.5)),
        scale: (markerSize ? (markerSize / 2) : (shape === 'lightcircle' ? 1 : 10)),
        strokeWeight: 1,
        strokeColor: markerType ? colors[markerType][1] : colors['none'][0],
        anchor: shape === 'lightcircle' ? new google.maps.Point(19.5, 20) : (shape === 'triangle' ? new google.maps.Point(1, 1) : new google.maps.Point(0, 0))
    };

    const icon = markerType && colors[markerType][0] ? style : null;
    const [marker, setMarker] = React.useState();

    React.useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker({
                icon: icon,
                zIndex: (markerType === 'sound_maps' ? 10 : 99999999)
            }));
            if (!infoWindow) {
                setInfoWindow(new google.maps.InfoWindow({
                    content: info,
                }));
            }
        }

        return () => {
            if (marker) {
                marker.setMap(null);
            }
        };
    }, [marker, icon, info, infoWindow, markerType]);

    //console.log("🚀 ~ file: Map.jsx:889 ~ React.useEffect ~ latitude:", options.position.latitude);
    //console.log("🚀 ~ file: Map.jsx:889 ~ React.useEffect ~ options:", options);

    // handles any coordinates from DB with latitude and longitude
    React.useEffect(() => {
        if (marker) {
            marker.setOptions({ clickable: true, map: options.map, position: options.position && options.position.latitude ? (new google.maps.LatLng(options.position.latitude, options.position.longitude)) : (options.position ? options.position : null) });



            marker.addListener('click', () => {
                infoWindow.open({
                    anchor: marker,
                    map: options.map,
                    shouldFocus: false,
                });
            });
        }
    }, [marker, options, infoWindow]);

    return null;
};

const Bounds = ({ boundsPathWindow, ...options }) => {
    const [paths, setPaths] = React.useState();
    const type = options.type;
    var tempArea = [];

    // Handles any DB coordinates with latitude and longitude, which Google Maps does not accept
    if (!options.ver) {
        (options.area).map((point) => (
            tempArea.push(new google.maps.LatLng(point.latitude, point.longitude))
        ))
    }

    const [area, setArea] = React.useState(options.ver ? options.area : tempArea);
    if (area.length !== options.area.length) {
        setArea(options.area);
    }

    const bounds = {
        area: {
            paths: area,
            strokeColor: 'rgba(255,0,0,0.7)',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: 'rgba(0,0,0,0.4)',
            clickable: false
        },
        types: {
            paths: area,
            strokeColor: type === 'water' ? '#96dcff' : (type === 'vegetation' ? '#ff0000' : (type === 'Material' ? '#00FFC1' : (type === 'Shelter' ? '#FFA64D' : (type === 'Baseplate' ? '#831DC7' : (type === 'New' ? 'rgba(255,0,0,0.5)' : '#FFFFFF'))))),
            strokeWeight: 2,
            fillColor: type === 'water' ? '#96dcff' : (type === 'vegetation' ? '#BEFF05' : (type === 'Material' ? '#00FFC1' : (type === 'Shelter' ? '#FFA64D' : (type === 'Baseplate' ? '#D79CFF' : (type === 'New' ? 'rgba(255,0,0,0.5)' : '#C4C4C4'))))),
            fillOpacity: 0.50,
            clickable: type === 'New' ? false : true
        },
    }

    React.useEffect(() => {
        if (!paths) {
            setPaths(new google.maps.Polygon(type === 'area' ? bounds.area : bounds.types));
        }

        return () => {
            if (paths) {
                paths.setMap(null);
            }
        };
    }, [paths, type, bounds.area, bounds.types, bounds.new]);

    React.useEffect(() => {
        if (paths) {
            paths.setOptions({ map: options.map, paths: area });

            ['click'].forEach((eventName) =>
                google.maps.event.clearListeners(paths, eventName)
            );

            if (boundsPathWindow) {
                paths.addListener('click', boundsPathWindow(options.title, options.date, options.time, options.index, (type === 'water' ? 1 : (type === 'vegetation' ? 3 : (type === 'Baseplate' ? 5 : (type === 'access' ? 6 : (type === 'section' ? 7 : 0)))))));
            }
        }
    }, [paths, options, type, area, boundsPathWindow]);

    return null;
};

const Path = ({ boundsPathWindow, ...options }) => {
    const type = options.title;
    var tempPath = [];

    // Handling any arrays from DB that have latitude, longitude
    (options.path).map((point) => (
        tempPath.push(new google.maps.LatLng(point.latitude, point.longitude))
    ))

    const [path, setPath] = React.useState();
    const colors = {
        Walking: '#0000FF',
        Running: '#FF0000',
        Swimming: '#FFFF00',
        'Activity on Wheels': '#008000',
        'Handicap Assisted Wheels': '#FFA500',
        Constructed: '#FF00E5',
        New: 'rgba(255, 0, 0, 0.5)',
        section: '#FFC300',
        intAccess: '#FFFF00',
        extAccess: '#FF0000'
    }
    const lines = {
        style: {
            path: !options.ver ? tempPath : options.path,
            strokeColor: colors[options.mode] ? colors[options.mode] : '#000000',
            strokeOpacity: 0.9,
            strokeWeight: 4,
            clickable: true,
            //padding: 2,
            //add this padding to make clicking the line easier
        }
    }

    React.useEffect(() => {
        if (!path) {
            setPath(new google.maps.Polyline(lines.style));
        }

        return () => {
            if (path) {
                path.setMap(null);
            }
        };
    }, [path, lines.style]);

    // Updates changes in path (drawing a new project area)
    React.useEffect(() => {
        if (path) {
            path.setOptions({ map: options.map });

            ['click'].forEach((eventName) =>
                google.maps.event.clearListeners(path, eventName)
            );

            if (boundsPathWindow) {
                path.addListener('click', boundsPathWindow(options.title, options.date, options.time, options.index, (type === 'moving_maps' ? 4 : (type === 'section' ? 7 : (type === 'access_maps' ? 6 : 2)))));
            }
        }
    }, [path, options, type, boundsPathWindow]);

    return null;
}

// Function for drawing a new project Area
const NewArea = (points) => (
    !points ? null :
        (points.length <= 1 ?
            points.map((coord, index) => (
                <Marker
                    key={index}
                    position={coord}
                />
            )) :
            (points.length === 2 ?
                <Path
                    path={points}
                    mode='New'
                    ver={true}
                />
                :
                <Bounds
                    area={points}
                    type='New'
                    ver={true}
                />
            )
        )
);

// Toggleable Places Widget for a New Project
interface PlaceProps extends google.maps.places.AutocompleteOptions {
    onChange?: (place: google.maps.places.Autocomplete) => void;
}

const Places: React.FC<PlaceProps> = ({ onChange, ...options }) => {
    const [placesWidget, setPlacesWidget] = React.useState();
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (ref.current && !placesWidget && options.on) {
            setPlacesWidget(
                new google.maps.places.Autocomplete(ref.current, {
                    types: ['establishment'],
                    componentRestrictions: { country: ['US'] },
                    fields: ['name', 'address_components', 'geometry'],
                })
            );
        }
    }, [ref, placesWidget, options.on]);

    useDeepCompareEffectForMaps(() => {
        if (placesWidget) {
            placesWidget.setOptions({
                types: ['establishment'],
                componentRestrictions: { country: ['US'] },
                fields: ['name', 'address_components', 'geometry'],
            });
        }
    }, [placesWidget]);

    React.useEffect(() => {
        if (placesWidget) {
            ['place_changed'].forEach((eventName) =>
                google.maps.event.clearListeners(placesWidget, eventName)
            );

            if (onChange) {
                placesWidget.addListener('place_changed', onChange(placesWidget));
            }
        }
    }, [placesWidget, onChange]);

    return (
        <div id='newProjectInput'>
            <Button
                id='placesButton'
                className='newHoveringButtons'
                onClick={options.togglePlaces}
            >
                {options.on ? 'Disable Autocomplete' : 'Enable Autocomplete'}
            </Button>
            <input ref={ref} name='search' id='locationSearch' label='Project Location' type='text' />
            <Button
                className='newHoveringButtons'
                id='newLocationButton'
                component={Link} to='area'
                state={{
                    ...options.state,
                    center: options.center,
                    title: (options.on && placesWidget && placesWidget.getPlace() ? placesWidget.getPlace().name : ref?.current?.value),
                    zoom: options.zoom
                }}
            >
                Set Project Location
            </Button>
        </div>
    );
}

// Helper functions for React use of Google Maps, required for React to recognize changes at deeper elements --
const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a, b) => {
    if (isLatLngLiteral(a) || a instanceof google.maps.LatLng || isLatLngLiteral(b) || b instanceof google.maps.LatLng) {
        return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }
    return deepEqual(a, b);
});

function useDeepCompareMemoize(value) {
    const ref = React.useRef();

    if (!deepCompareEqualsForMaps(value, ref.current)) {
        ref.current = value;
    }
    return ref.current;
}

function useDeepCompareEffectForMaps(callback, dependencies) {
    React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}