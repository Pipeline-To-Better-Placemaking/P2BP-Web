import * as React from 'react';
import { useCallback, useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import Button from '@mui/material/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import axios from '../api/axios';
import html2canvas from 'html2canvas';
import Drawer from '@mui/material/Drawer';
import Charts from '../components/Charts.js';

export default function UnityPage() {
  const loc = useLocation();
  const nav = useNavigate();
  const [message, setMessage] = React.useState('');
  const [programJSON, setProgramJSON] = React.useState();
  const [state, setState] = React.useState({ right: false });
  const [chartData, setChartData] = React.useState(loc.state.data.data);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.title === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const handleSetChartData = async () => {
    try {
      const response = await axios.get(`/program_maps/${loc.state.data._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${loc.state.userToken.token}`
        },
        withCredentials: true
      });
      console.log("THIS IS RESPONSE.DATA ==: ", response.data.data);
      setChartData(response.data.data);

    } catch (error) {
      console.log('ERROR: ', error);
      // setMessage(error.response.data?.message);
      // response.current.style.display = 'inline-block';
      return;
    }
  }

  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    sendMessage,
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
    addEventListener,
    removeEventListener
  } = useUnityContext({
    // This is just to make sure the file path is correct when loading Unity inside the website
    // Build loads in the activity path without ../ needs to load inside website root
    loaderUrl: "../../../../../../../../Build/IPSurveyors.loader.js",
    dataUrl: "../../../../../../../../Build/IPSurveyors.data",
    frameworkUrl: "../../../../../../../../Build/IPSurveyors.framework.js",
    codeUrl: "../../../../../../../../Build/IPSurveyors.wasm",
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });

  // This useEffect makes sure Unity doesn't explode when 
  // you want to switch to a different screen in the website
  useEffect(() => {
    return () => {
      detachAndUnloadImmediate().catch((reason) => {
        console.log(reason);
      });
    };
  }, [detachAndUnloadImmediate]);

  useEffect(() => {
    handleSurveyors();
  }, [isLoaded])

  const handleSetProgramJSON = useCallback((programJSON) => {
    // handle the JSON sent from Unity here
    console.log(programJSON);
    const obj = JSON.parse(programJSON);

    let newFloors = [];

    // create empty arrays for each floor
    for (let i = 0; i < loc.state.data.data[0].numFloors; i++) {
      newFloors.push([]);
    }

    // looping through the programs
    for (let i = 0; i < obj.length; i++) {

      console.log(obj[i]);

      const newProgram = {
        points: obj[i].points,
        programType: obj[i].programType,
        sqFootage: obj[i].sqFootage
      };

      console.log(newProgram);

      // push newProgram into the appropriate floor array
      newFloors[obj[i].floorNum].push(newProgram);

    }

    console.log(newFloors);

    for (let i = 0; i < newFloors.length; i++) {
      try {
        const response = axios.put(`/program_floors/${loc.state.data.data[0].floors[i]}`, JSON.stringify({
          programs: newFloors[i]

        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${loc.state.userToken.token}`
          },
          withCredentials: true
        });

        // activityDetails = response.data;

      } catch (error) {
        console.log('ERROR: ', error);
        // setMessage(error.response.data?.message);
        // response.current.style.display = 'inline-block';
        return;
      }
    }
    const printBtn = document.getElementById('printButton');
    printBtn.style.display = 'flex';

    handleSetChartData();




    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! MIGHT WANT TO CHANGE THIS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Where should we go after the surveyor submits a program? right now it goes back to the main
    // project map page... which is probably where we should go back anyways.....



    // Maybe instead of doing this, call a handleNavigation function 
    // detachAndUnloadImmediate().catch((reason) => {
    //   console.log(reason);
    // });

    // !!!!!!!!!!!!!!!!!!!!!!! safely handle the unmounting of the Unity component before you navigate to a different screen

    // nav('../', { replace: true, state: { team: loc.state.team, project: loc.state.project, userToken: loc.state.userToken } });

  }, []);

  useEffect(() => {
    addEventListener("ReceiveProgramData", handleSetProgramJSON);
    return () => {
      removeEventListener("ReceiveProgramData", handleSetProgramJSON);
    };
  }, [addEventListener, removeEventListener, handleSetProgramJSON]);

  const handleSurveyors = async () => {
    try {
      console.log(loc.state.type);
      const response = await axios.get(`/program_maps/${loc.state.data._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${loc.state.userToken.token}`
        },
        withCredentials: true
      });

      // console.log(response.data.programs.length);
      let programObjects = [];
      for (let i = 0; i < response.data.data[0].floors.length; i++) {
        const curFloor = response.data.data[0].floors[i];


        try {
          const resp = await axios.get(`/program_floors/${curFloor}`, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Authorization': `Bearer ${loc.state.userToken.token}`
            },
            withCredentials: true
          });

          // iterate through each program on that floor
          for (let j = 0; j < resp.data.programs.length; j++) {
            let programPoints = [];
            for (let k = 0; k < resp.data.programs[j].points.length; k++) {
              const coordinate = {
                xCoord: resp.data.programs[j].points[k].xCoord,
                yCoord: resp.data.programs[j].points[k].yCoord,
                zCoord: resp.data.programs[j].points[k].zCoord,
              }
              programPoints.push(coordinate);
            }

            let programObj = {
              programPointsList: programPoints,
              programType: resp.data.programs[j].programType
            }

            programObjects.push(programObj);
          }


        } catch (error) {
          console.log('ERROR: ', error);
          // setMessage(error.response.data?.message);
          // response.current.style.display = 'inline-block';
          return;
        }
      }




      const obj = {
        numFloors: response.data.data[0].numFloors,
        points: response.data.data[0].perimeterPoints,
        programs: programObjects,
        type: loc.state.type
      }
      const myJSON = JSON.stringify(obj);

      console.log(myJSON);

      // We send the JSON to the Unity player with this function
      sendMessage("Building", "SurveyorProgram", myJSON);

    } catch (error) {
      console.log('ERROR: ', error);
      setMessage(error.response.data?.message);
      // response.current.style.display = 'inline-block';
      return;
    }

    // const obj = {
    //   numFloors: loc.state.numFloors,
    //   points: loc.state.buildingArea,
    // }

    // const myJSON = JSON.stringify(obj)
    // // console.log(myJSON);
    // sendMessage("Building", "GetPoints", myJSON);

  }

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
    html2canvas(document.getElementById('UnityHolder'), {
      useCORS: true
    }).then(
      function (canvas) { saveAs(canvas.toDataURL(), `${loc.state.data.title}.png`) }
    );
  }

  // const handleDataForCharts = async () => {
  //   let response;
  //   // try {
  //   //   response = await axios.get(`/program_maps/${loc.state.data._id}`, {
  //   //     headers: {
  //   //       'Content-Type': 'application/json',
  //   //       'Access-Control-Allow-Origin': '*',
  //   //       'Authorization': `Bearer ${loc.state.userToken.token}`
  //   //     },
  //   //     withCredentials: true
  //   //   });

  //   // } catch (error) {
  //   //   console.log('ERROR: ', error);
  //   //   setMessage(error.response.data?.message);
  //   //   // response.current.style.display = 'inline-block';
  //   //   return;
  //   // }

  //   return response.data;
  // }

  return (
    <div>
      {/* <h1>Identifying Program</h1> */}
      <Button className='backBtn' style={{ margin: '10px' }} component={Link} size='lg' variant="contained" startIcon={<KeyboardReturnIcon />} to='../map'
        state={{ team: loc.state.team, owner: loc.state.owner, project: loc.state.project, userToken: loc.state.userToken }} >
        Return to map view
      </Button>
      <br />
      {loc.state.type === 1 ? <Button id='printButton' variant="contained" style={{ top: '125px', display: 'none' }} onClick={convertToImage}>Print Page</Button> : null}
      {loc.state.type === 1 ? <Button id={'rightButton'} variant="contained" style={{ top: '-50px' }} onClick={toggleDrawer('right', !state['right'])}>Graph</Button> : null}

      {/* state={{userToken:loc.state.userToken, team: loc.state.team}} <-- this is a parameter for the button component if you need it later*/}

      <div id='UnityHolder'>
        {!isLoaded && (
          <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
        )}
        <Unity
          unityProvider={unityProvider}
          style={{ width: "99vw", height: "77.5vh", visibility: isLoaded ? "visible" : "hidden" }}
        />


        <Drawer
          id={'rightDrawer'}
          anchor={'right'}
          open={state['right']}
          onClose={toggleDrawer('right', false)}
          hideBackdrop={true}
        >
          <Charts selection='program_maps' data={chartData} type={0} />
        </Drawer>


      </div>



    </div>
  );
};
