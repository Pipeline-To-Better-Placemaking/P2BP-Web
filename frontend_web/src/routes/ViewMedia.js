import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom'; 
import './routes.css';
import { storage } from "./firebase_config";
import { ref, getDownloadURL, listAll, list } from "firebase/storage";
import axios from '../api/axios';
import { Button, TextField, Box, InputLabel, MenuItem, FormControl, RadioGroup, Radio, FormControlLabel, FormLabel, DialogTitle, Dialog, Typography } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';


function ViewMedia() {
    const [ mediaUrls, setMediaUrls ] = useState([]);
    const [ edit, setEdit ] = useState(false);
    const [ selectedIndex, setSelectedIndex ] = useState(0);
    const [ newTitle, setNewTitle ] = useState("");
    const [ selectedSlide, setSelectedSlide ] = useState("");
    const [ tags, setTags ] = useState([]);
    const [ object, setObject ] = useState(null);
    const [ newSelectedTags, setNewSelectedTags ] = useState([]);
    const [ filter, setFilter ] = useState([]);
    const [ filteredImages, setFilteredImages ] = useState([]);
    const [ isFilter, setIsFilter ] = useState(false);
    const [ filterSelect, setFilterSelect ] = useState([]);
    const [ showTitle, setShowTitle ] = useState("");
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv'];

    const loc = useLocation();
    const options = ["Sidewalk", "Transit Shelter", "Bus Lane", "Turn Lane", "Planter", "Drive Lane", "Bike Lane", "Parking Lane", "Street Lighting", "Stairs/Ramps", "Outdoor Seating Area", "Outdoor Restaurant Seating Area", "Canopy", "Building Structure", "Loggia", "Breezeway", "Drainage Field/Ditch", "Tree Canopy", "Lake/River Water", "Monument/Fountain", "Leisure Area"];
    const storageRefList = ref(storage, `media_uploads/${loc.state.section._id}`);

    // Opens link on new tab to allow media to be downloaded
    const handleOpen = () => {
      console.log(selectedSlide);
      window.open(selectedSlide, '_blank');
    }

    // Lets front end know which slide it is on for future api calls
    const handleSlide = (index) => {

      // console.log("🚀 ~ file: ViewMedia.js:41 ~ handleSlide ~ filteredImages:", filteredImages);
      // console.log("🚀 ~ file: ViewMedia.js:41 ~ handleSlide ~ filter:", filter);
      // console.log("🚀 ~ file: ViewMedia.js:51 ~ handleSlide ~ filter[index].title:", filter[index].title);

      setShowTitle(filter[index].title);
      setSelectedSlide(filteredImages[index]);
      setSelectedIndex(index);
      setTags(filter[index].tags);
    }



    const findCommon = (array1, array2) => {
      for(let i = 0; i < array1.length; i++) {
             
        // Loop for array2
        for(let j = 0; j < array2.length; j++) {
             
            // Compare the element of each and
            // every element from both of the
            // arrays
            if(array1[i] === array2[j]) {
             
                // Return if common element found
                return true;
            }
        }
    }
     
    // Return if no common element exist
    return false;
    }

    const handleFilter = (event) => {

      console.log("🚀 ~ file: ViewMedia.js:73 ~ handleFilter ~ event:", event);

      setFilterSelect(event.target.value)
      console.log("🚀 ~ file: ViewMedia.js:73 ~ handleFilter ~ filterSelect:", filterSelect);
      
      let filteredURL = object.filter(item => {
        return item.tags.some(tag => event.target.value.includes(tag));
      }).map(item => item.url_link)
      let filteredObj = object.filter(item => {
        return item.tags.some(tag => event.target.value.includes(tag));
      })
      if(filteredURL.length === 0) {
        filteredURL = mediaUrls
        filteredObj = object.slice(1);
      }
      setFilter(filteredObj);
      setFilteredImages(filteredURL);
      console.log(filteredImages);
    }

    // Updates the tags that the user is currently selecting
    const handleNewTags = (event) => {
        setNewSelectedTags(event.target.value);
    }

    // Pulls info from database to display
    const handleSlideShow = () => {
      const storeTags = async () => {
        try {
          const response = await axios.get(`/section_maps/${loc.state.section._id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Authorization': `Bearer ${loc.state?.userToken?.token}`
            },
            withCredentials: true
          });
          for(let i = 1; i < (response.data.data).length; i++)
          {
            setMediaUrls((prev) => [...prev, response.data.data[i].url_link]);
            setFilteredImages((prev) => [...prev, response.data.data[i].url_link])
          }
          if(selectedSlide == "")
          {
            setSelectedSlide(response.data.data[1].url_link);
          }
          setObject(response.data.data);
          setFilter(response.data.data.slice(1));

          if(tags.length == 0)
          {
            setTags(response.data.data[1].tags);
          }

          console.log(filteredImages);
          console.log(mediaUrls);
        }
        catch (error) {
          console.log(error);
          console.log("Was not able to retrieve tags");
          return;
        }
      }

      storeTags();
    }

    // Opens edit dialog box
    const handleEdit =  () => {
        setNewSelectedTags(filter[selectedIndex].tags);
        setNewTitle(filter[selectedIndex].title);
        setEdit(true);
      //set to async if uncomment
      /*try {
        const map = await axios.get(`/section_maps/${loc.state.section._id}/data/${loc.state.section.data[selectedIndex + 1]._id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${loc.state.userToken.token}`
          },
          withCredentials: true
        });
        
        //console.log("Map: ", map)
        
        // setNewSelectedTags(map.data.tags)
        // setNewTitle(map.data.title)
        setEdit(true);
      }
      catch (error) {
        console.log("Could not get image from mongo");
        return;
      }*/
    }

    // Saves dialog box changes and closes it
    const handleSave = () => {
        setEdit(false);
        console.log(selectedIndex);
        const update = async () => {
          try {
              await axios.put(`/section_maps/${loc.state.section._id}/data/${loc.state.section.data[selectedIndex + 1]._id}`, JSON.stringify({
                  title: newTitle,
                  tags: newSelectedTags,
                }), {
                  headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                  },
                  withCredentials: true
                });
          }
          catch (error) {
            console.log("Data was not able to be updated on Mongo");
            return;
          }
        }
        update();
      }

    const handleCancel = () => {
      setEdit(false);
    }

    const handleDownload = () => {
      const link = document.createElement('a');
      link.href = selectedSlide;
      link.download = 'SectionImage.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    // Updates list of images for specific project
    useEffect(() => {
      handleSlideShow();
      }, [])


    // console.log(loc)

    return (
    <div className="ViewMedia">
          <Button className='backBtn' style={{ margin: '10px' }} component={Link} size='lg' variant="contained" startIcon={<KeyboardReturnIcon />} to='../map'
            state={{ team: loc.state.team, owner: loc.state.owner, project: loc.state.project, userToken: loc.state.userToken }} >
            Return to map view
          </Button>
        <div style={{flex: 1, flexDirection: 'row', margin: "1vh"}}>
          <h1>View Media</h1>
          <Box sx={{ minWidth: 120}}>
                    <FormControl fullWidth sx={{ flexDirection: 'row' }}>
                    <InputLabel id="demo-simple-select-label"> Filter By Tags </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={filterSelect}
                        label="Filter by Tags"
                        onChange={handleFilter}
                        multiple
                        style={{minWidth: "20vw", maxWidth: "40vw"}}
                    >
                    {options.map((option, index) => (
                        <MenuItem value={option}>{option}</MenuItem>
                    ))}
                    </Select>
                    </FormControl>
            </Box>
        </div>
        
        <br></br>
        <div className="slide-container">
          <Carousel emulateTouch={false} swipeable={false} transitionTime={500} swipeScrollTolerance={5} style={{color: 'black' }} infiniteLoop={false} showArrows={true} showThumbs={false} useKeyboardArrows={true} onChange={handleSlide}
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                  <button type="button" onClick={onClickHandler} title={label} className="arrowStyles" style={{ left: 0 }}>
                      {`<`}
                  </button>
              )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                  <button type="button" onClick={onClickHandler} title={label} className="arrowStyles" style={{ right: 0 }}>
                      {`>`}
                  </button>
              )
          }
          >
            {filteredImages.map((slideFilter, i) => (
              <div key={i} style={{ height: 400, display:'flex', alignItems:'center', placeContent:'center' }}>
                {slideFilter != undefined ? 
                  videoExtensions.some(ext => slideFilter.split("?")[0].endsWith(ext)) ?
                    <video style={{width : "90%"}} controls>
                      <source src={slideFilter} type="video/mp4"></source>
                      <source src={slideFilter} type="video/ogg"></source>
                    </video>
                  :
                    <img style={{maxWidth: '90%'}} src={slideFilter} />
                :
                  null
                }
              </div>
            ))}
          </Carousel>
        </div>
        <Typography>{showTitle !== "" ? showTitle : "No Title Available"}</Typography>
        <div className="tag-container">
            {tags.sort((a, b) => a.localeCompare(b)).map((tag, index) => {
                return (
                  <div key={index} className="tag">
                      {tag}
                  </div>
                );
            })}
        </div>
        <div style={{flex: 1, flexDirection: 'row', margin: "1vh"}}>
          <Button download={"SectionImage.png"} onClick={handleOpen}>Download Image</Button>
          <Button onClick={handleEdit}>Open Edit Info</Button>
        </div>
            <Dialog open={edit} fullWidth maxWidth="md" PaperProps={{ style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}} >  
                <DialogTitle>Edit Info</DialogTitle>
                <TextField label="New Title"style={{width: "10vw", margin: "1vw"}} value={newTitle} onChange={text => {setNewTitle(text.target.value)}}></TextField>
                <Box sx={{ minWidth: 120}}>
                    <FormControl fullWidth sx={{ flexDirection: 'row' }}>
                    <InputLabel id="demo-simple-select-label"> Tags </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={newSelectedTags}
                        label="Tags"
                        onChange={handleNewTags}
                        multiple
                        style={{minWidth: 120}}
                    >
                    {options.sort((a, b) => a.localeCompare(b)).map((option, index) => (
                        <MenuItem value={option}>{option}</MenuItem>
                    ))}
                    </Select>
                    </FormControl>
                </Box>
                <br/>
                <div style={{flex: 1, flexDirection: 'row', margin: "1vh"}}>
                  <Button onClick={handleSave}>Save</Button>
                  <Button onClick={handleCancel}>Cancel</Button>
                </div>
            </Dialog>
    </div>
    );
}

export default ViewMedia;