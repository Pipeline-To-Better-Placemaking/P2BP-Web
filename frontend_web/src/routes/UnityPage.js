import { useCallback, useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ForwardIcon from '@mui/icons-material/Forward';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Area } from '../functions/HelperFunctions.js';

export default function UnityPage() {
  const loc = useLocation();
  const nav = useNavigate();
  const [sqFootage, setSqFootage] = useState();

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
    loaderUrl: "../../../../../../../../../Build/IdentifyingProgram.loader.js",
    dataUrl: "../../../../../../../../../Build/IdentifyingProgram.data",
    frameworkUrl: "../../../../../../../../../Build/IdentifyingProgram.framework.js",
    codeUrl: "../../../../../../../../../Build/IdentifyingProgram.wasm",
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
    handleExtrude();
  }, [isLoaded])

  const handleButtons = useCallback((isContinue) => {
    // console.log(isContinue);
    if (isContinue === 1) {
      const contBtn = document.getElementById('cntBtn');
      contBtn.style.display = 'flex';
    }
    else {
      const invalid = document.getElementById('invalidText');
      invalid.style.display = 'flex';
    }
  }, []);

  useEffect(() => {
    addEventListener("AdminButtons", handleButtons);
    return () => {
      removeEventListener("AdminButtons", handleButtons);
    };
  }, [addEventListener, removeEventListener, handleButtons]);

  function handleSetSqFootage(sqFootage) {
    setSqFootage(sqFootage);
  }

  function handleExtrude() {
    // points.Add(new Vector3(-10,5,0));
    //     points.Add(new Vector3(-20,10,0));
    //     points.Add(new Vector3(-30,5,0));
    //     points.Add(new Vector3(-20,5,0));

    const obj = {
      numFloors: loc.state.numFloors,
      points: loc.state.buildingArea,
    }

    let buildingPoints = [];

    loc.state.buildingArea.map(vertex => {
      // console.log(vertex)
      let newObj = {
        latitude: vertex.lat,
        longitude: vertex.lng,
      };
      buildingPoints.push(newObj);
    }
    )
    // console.log("Number of floors is: " + loc.state.numFloors);
    // console.log("Sq. ft area is: " + (Area(buildingPoints) * loc.state.numFloors));
    handleSetSqFootage(Area(buildingPoints) * loc.state.numFloors);

    const myJSON = JSON.stringify(obj)
    // console.log(myJSON);
    sendMessage("Building", "GetPoints", myJSON);

  }

  return (
    // <div>
    //     <h1>Identifying Program</h1>
    //     {/* state={{userToken:loc.state.userToken, team: loc.state.team}} <-- this is a parameter for the button component if you need it later*/}
    //     <Button className='resetButton' component={Link} size='lg' variant='filledTonal' color='error' to='../activities/identifying_program' 
    //         state={{...loc.state}} >
    //         Reset Model
    //     </Button>
    //     <Button className='continueButton' component={Link} size='lg' variant='filledTonal' color='success' to='../activities/times' 
    //         state={{...loc.state}}>
    //         Accept and Continue
    //     </Button>
    //     <div>
    //         {!isLoaded && (
    //           <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
    //         )}
    //         <Unity
    //           unityProvider={unityProvider}
    //           style={{ width: `100vw`, height: `77.5vh`, visibility: isLoaded ? "visible" : "hidden" }}
    //         />
    <div >
      {/* <h1>Identifying Program</h1> */}
      {/* state={{userToken:loc.state.userToken, team: loc.state.team}} <-- this is a parameter for the button component if you need it later*/}
      <div style={{ justifyContent: 'center', flexDirection: 'row', textAlign: 'center', backgroundColor: 'white', marginBottom: '5px', padding: '10px', borderRadius: '5px', width: '40%', border: '2px solid transparent', alignContent: 'center', position: 'absolute', top: '120px', left: '550px', zindex: '999' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '80%' }}>

          <Button className='resetButton' style={{ marginRight: '10px' }} component={Link} size='lg' variant="contained" color='error' startIcon={<DeleteIcon />} to='../activities/identifying_program'
            state={{ ...loc.state }} >
            Reset Model
          </Button>

          <Button className='continueButton' id='cntBtn' component={Link} size='lg' variant="contained" endIcon={<ForwardIcon />} to='../activities/times' style={{ display: 'none' }}
            state={{ ...loc.state, sqFootage: sqFootage }}>
            Accept and Continue
          </Button>
          <span id='invalidText' style={{ display: 'none', color: 'red', fontSize: 'large', fontWeight: '600', marginLeft: '10px' }}>Invalid shape. Please reset the model.</span>
        </div>
      </div>


      <br />
      <div style={{ justifyContent: 'center' }}>
        {!isLoaded && (
          <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
        )}
        {console.log("148 ", isLoaded)}
        <Unity
          unityProvider={unityProvider}
          style={{ width: "100vw", height: "77.5vh", visibility: isLoaded ? "visible" : "hidden" }}
        />
        {console.log("153 ", isLoaded)}
      </div>
    </div>
  );
};
