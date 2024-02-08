# Pipeline to Better Placemaking (Website) Fall '23 - Spring '24 CS@UCF Senior Design Team
# Team Members: Sophia Hunt, Jorge Nunez, Kieran Jimenez, Joseph Finrock, Jennifer Daks, Preston Kyle
## https://better-placemaking.web.app

## Running frontend files locally
Make sure you are running up-to-date versions of Node.js and npm: 
    https://nodejs.org/en/
    
1. Clone the repository locally/Download the files from the repository. 
2. Download the ```.env``` file from the OneDrive -> Design Documentation - Fall 2023 Files, Environment Files. This .env file should be placed within the 'functions' directory.
4. On the command line or terminal within the /frontend_web folder of your download run: ```npm install```
5. On the command line or terminal within the /functions folder of your download run: ```npm install```
6. On the command line or terminal within the /functions folder of your download run: ```npm start```  
   (This will build the /frontend_web project and store a cached version in the frontend_web/build folder. The command will then start the backend server which loads the cached build of the frontend on the same server:port)

## Frontend React.js Files
### Routes
The structure of the website including the Routes and pathnames are set in App.js and ProjectPage.js

### Map Component(s) - Google Maps JS
Map.jsx is the singular component called for every instance. Map.jsx handles data based on the drawer.Results object.

### Drawers/Drawer Structure  (Collapsable Menus overlaying Map) - MUI
The drawers are directly mapped from the drawer object from ProjectPage.js including the key values. The Graphs and Data objects (within drawers object) represent the Graphs and Data buttons/collapsable menus, their data is generated based on the Results object (also within the drawers object) but hold different components that are generated upon selection. 

The menu selections are mapped from the drawer.Results object including its keys for quick access with unique identifying information.

Any change to the drawers object structure (i.e. using a given Activity Name) means references accessing date and time (currently used as labels on the menu selections) will need to be updated within MapDrawers.js, ActivityPage.js, ActivityTable.js as well as Map.jsx

The location and position of each menu is set in MapDrawers.js

Example 'drawers' Object:
drawers = {<br/>
    &emsp;Results: {<br/>
        &emsp;&emsp;date1: {<br/>
            &emsp;&emsp;&emsp;time1: {<br/>
                &emsp;&emsp;&emsp;&emsp;(activity)_map data<br/>
            &emsp;&emsp;&emsp;},<br/>
            &emsp;&emsp;&emsp;time2: {<br/>
                &emsp;&emsp;&emsp;&emsp;data<br/>
            &emsp;&emsp;&emsp;}<br/>
        &emsp;&emsp;},<br/>
        &emsp;&emsp;date2: {<br/>
            &emsp;&emsp;&emsp;time1: {<br/>
                &emsp;&emsp;&emsp;&emsp;data<br/>
            &emsp;&emsp;&emsp;}<br/>
        &emsp;&emsp;}<br/>
    &emsp;},<br/>
    /* These will stay empty as objects and are later populated with chart and table components */<br/>
    &emsp;Graphs: {},<br/>
    &emsp;Data: {}<br/>
}

## Backend .js files
### Models
This subdirectory is where the all of the MongoDB schemas (document templates) are stored.  In addition to this, the files contain helper functions which assist the APIs as needed.
### Routes
This subdirectory contains all of the APIs for the project
### Utils/Middlewares
Helper files which assist the back-end with tasks from sending emails to error handling.
### app.js
This file is the "server" file for the backend.  This is essentially what "starts and calls" all of the other code. This "server" file is powered by Express. The Firebase cloud function "app" handles all HTTP requests/responses.


