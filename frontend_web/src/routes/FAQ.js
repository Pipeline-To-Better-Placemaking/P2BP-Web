import * as React from "react";
import './routes.css';

export default function FAQ(){
  //Put All html Code within the <div id='faqPage> in func. return
  return(
    <div id='faqPage'>
      <div className='pageTemplate'>
        <br />
        <br />

        <h1 style={{marginBottom: '15px', textAlign: 'center'}}>Pipline to Better Placemaking Activity FAQ</h1>

        <br />

        <div id='tOC'>
          <h2>Table of Contents</h2>
          <br />
          <h3>How to Create a Project</h3>
            <ul style={{listStyle: 'none', textAlign: 'center', paddingLeft:'0px'}}>
              <li><a href="#createProjectLink"> How to Create a Project </a></li>
            </ul>
          <h3>How to Create a Test</h3>
            <ul style={{listStyle: 'none', textAlign: 'center', paddingLeft:'0px'}}>
              <li><a href="#createTestLink"> How to Create a Test </a></li>
            </ul>
          <h3>Test Tutorials</h3>
            <ul style={{listStyle: 'none', textAlign: 'center', paddingLeft:'0px'}}>
              <li><a href="#aptlink"> Acoustical Profile Tutorial </a></li>
              <li><a href="#sbtlink"> Spatial Boundaries Tutorial </a></li>
              <li><a href="#nptlink"> Nature Prevalence Tutorial </a></li>
              <li><a href="#lptlink"> Lighting Profile Tutorial </a></li>
              <li><a href="#aooltlink"> Absence of Order Locator Tutorial </a></li>
              <li><a href="#piptlink"> People in Place Tutorial </a></li>
              <li><a href="#pimtlink"> People in Motion Tutorial </a></li>
              <li><a href="#cstlink"> Community Survey Tutorial </a></li>
              <li><a href="#iatlink"> Identifying Access Tutorial </a></li>
              <li><a href="#iptlink"> Identifying Program Tutorial </a></li>
              <li><a href="#sctlink"> Section Cutter Tutorial </a></li>
            </ul>
        </div>

        <br />
        <br />

        <h2 style={{textAlign: 'center'}}><a id="createProjectLink"> How to Create a Project </a></h2>

        <h3><u> Web: </u></h3>
          <p>
            Step 1: From the Home page, select “NEW TEAM” and add a title and description to create 
            a new team, or select “VIEW TEAM” for an existing team.
            <br />
            <br />
            Step 2: From the projects page, select “NEW PROJECT” to create a new project.
            <br />
            <br />
            Step 3: Select a location on the map.
            <br />
            <br />
            Step 4: Set a project perimeter by selecting points on the map.
            <br />
            <br />
            Step 5: Select points on the map to use for tests.
            <br />
            <br />
            Step 6: After steps 1-5 have been completed, you will see a “Create Project” page 
            that allows you to rename the project, add a description, and name the points you 
            previously set. When you are done here, select the “CREATE” button at the bottom of the page.
          </p>
        <h3><u> Mobile: </u></h3>
          <p>
            Step 1: From the Collaborate page, select “Create New”, then enter a team name and select 
            “Create New Team!”. If you already have a team, select it from the “Teams” list on this page instead.
            <br />
            <br />
            Step 2: Select the team and then tap the “Create New” button next to “Projects”. Add a project name 
            and enter a location. Tap at least 3 points on the map in the location you selected. These points 
            will be the vertices between the edges of the perimeter you set as the area for the project. 
            Tap the “Create” button.
          </p>

        <br />
        <br />

        <h2 style={{textAlign: 'center'}}><a id="createTestLink"> How to Create a Test </a></h2>

        <h3><u> Web: </u></h3>
          <p>
            Step 1: If you have not already done so, create a team and add a project.
            <br />
            <br />
            Step 2: From the Home page, select “VIEW TEAM” for any team.
            <br />
            <br />
            Step 3: From the projects page select “VIEW” for any project.
            <br />
            <br />
            Step 4: Select the “ACTIVITIES” tab. On this page, you can name the test, select an 
            activity type, and set a date and time for the activity.
          </p>
        <h3><u> Mobile: </u></h3>
          <p>
            Step 1: If you have not already done so, create a team and add a project.
            <br />
            <br />
            Step 2: From the Collaborate page, select a team.
            <br />
            <br />
            Step 3: From the projects list for that team, select a project.
            <br />
            <br />
            Step 4: Select “Create Research Activity”.
            <br />
            <br />
            Step 5: Enter a name, select a test from the “Select a Research Activity:” 
            dropdown menu, and set a date and time for the activity. Tap the “Next” button.
          </p>

        <br />
        <br />

        <h2 style={{textAlign: 'center'}}><a id="aptlink"> Test Tutorials </a></h2>

        <br />
        <br />
        
        <h2 style={{textAlign: 'center'}}><a id="aptlink"> Acoustical Profile Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: From your project’s “ACTIVITIES” page, select “Acoustical Profile” 
            from the “Activity Type” dropdown menu. Add a name for the test to make it 
            easier to find later. Select a date and an amount of time to spend on the 
            test per location. Then select the green button with the “+” symbol to add the test.
            <br />
            <br />
            Step 2: Select “NEW TIME SLOT”, then set the start time and the number of researchers 
            for the test. Select the points you want to use for this test.
            <br />
            <br />
            Step 3: Select the “SCHEDULE ACTIVITY” button. The test should now be available 
            on the “ACTIVITIES” page below “Activity Results”.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Select your project, then tap “Create Research Activity”.
            <br />
            <br />
            Step 2: Add a name for the test to make it easier to find later. 
            Select “Acoustical Profile” from the “Select a Research Activity” 
            dropdown menu. Select a date and an amount of time to spend on the 
            test per location. Tap the “Next” button.
            <br />
            <br />
            Step 3: Select “Create Time Slot”, then set the start time 
            and number of researchers for the test. Select the points you 
            want to use for this test.
            <br />
            <br />
            Step 4: Tap the “Complete” button. The test should now be available 
            on the list of tests for the project.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            This test can only be completed from the mobile app.
            <br />
            <br />
            Step 1: Select your team, and then your project.
            <br />
            <br />
            Step 2: Select the test from the list. Tap the “Sign Up” button.
            <br />
            <br />
            Step 3: When you are ready to start the test, tap the “Begin” button.
            <br />
            <br />
            Step 4: Tap the “Start” button.
            <br />
            <br />
            Step 5: Record the Decibel level at that location and enter the value. 
            Tap the “Submit” button.
            <br />
            <br />
            Step 6: Select the types of sound you heard. You can select more than one. 
            You can also enter a sound not listed as a default category.
            <br />
            <br />
            Step 7: Select the type of sound that you heard the most. You can also enter 
            a sound not listed as a default category.
            <br />
            <br />
            Step 8: A menu will pop up reminding you to move to the next location. 
            Tap “Confirm” when you are there.
            <br />
            <br />
            Step 9: Repeat steps 5-8. The test will end when all locations have been tested.
          </p>

        <h3><u> Viewing the Results </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: On your project’s “ACTIVITIES” page, select the “Acoustical Profile” category. 
            The results of the test will be displayed here. You will also see the option to export your data.
            <br />
            <br />
            Step 2: On your project’s “MAP” page, select the “RESULTS” button. You can also select the 
            “Acoustical Profile” category here to view the results of this test.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Go to the Home Page and select your project from the “Results” list.
            <br />
            <br />
            Step 2: Select the test you want to view from the “Research Results” list. 
            The results of the test will be displayed here.
          </p>

        <h2 style={{textAlign: 'center'}}><a id="sbtlink"> Spatial Boundaries Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: From your project’s “ACTIVITIES” page, select “Spatial Boundaries” from 
            the “Activity Type” dropdown menu. Add a name for the test to make it easier to 
            find later. Select a date and an amount of time to spend on the test per location. 
            Then select the green button with the “+” symbol to add the test.
            <br />
            <br />
            Step 2: Select “NEW TIME SLOT”, then set the start time and the number of 
            researchers for the test.
            <br />
            <br />
            Step 3: Select the “SCHEDULE ACTIVITY” button. The test should now be available 
            on the “ACTIVITIES” page below “Activity Results”.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Select your project, then tap “Create Research Activity”.
            <br />
            <br />
            Step 2: Add a name for the test to make it easier to find later. 
            Select “Spatial Boundaries” from the “Select a Research Activity” 
            dropdown menu. Select a date and an amount of time to spend on the 
            test per location. Tap the “Next” button.
            <br />
            <br />
            Step 3: Select “Create Time Slot”, then set the start time and number 
            of researchers for the test.
            <br />
            <br />
            Step 4: Tap the “Complete” button. The test should now be available 
            on the list of tests for the project.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            This test can only be completed from the mobile app.
            <br />
            <br />
            Step 1: Select your team, and then your project.
            <br />
            <br />
            Step 2: Select the test from the list. Tap the “Sign Up” button.
            <br />
            <br />
            Step 3: When you are ready to start the test, tap the “Begin” button.
            <br />
            <br />
            Step 4: Tap the “Start” button.
            <br />
            <br />
            Step 5: Plot the boundaries. There are 3 types of boundaries: Constructed, Material, 
            and Shelter. Choose “Constructed” for boundaries that take up space vertically such as 
            fences, buildings, monuments, etc. Choose “Material” for boundaries that take up space 
            horizontally on the ground such as sidewalks, grass areas, boardwalks, etc. Choose “Shelter” 
            for boundaries that take up space horizontally overhead such as canopy, tree cover, awnings, 
            etc. To plot a boundary, select a type of boundary and then plot points to outline the boundary. 
            You can tap the delete button to remove the last point placed.
            <br />
            <br />
            Step 6: When you are done plotting the boundary, confirm and answer the questions.
            <br />
            <br />
            Step 7: Repeat steps 5-6 for the rest of the boundaries you want to plot.
            <br />
            <br />
            Step 8: Select the “End” button.
          </p>

        <h3><u> Viewing the Results </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: On your project’s “ACTIVITIES” page, select the “Spatial Boundaries” category. 
            The results of the test will be displayed here. You will also see the option to export your data.
            <br />
            <br />
            Step 2: On your project’s “MAP” page, select the “RESULTS” button. You can also select 
            the “Spatial Boundaries” category here to view the results of this test.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Go to the Home Page and select your project from the “Results” list.
            <br />
            <br />
            Step 2: Select the test you want to view from the “Research Results” list. 
            The results of the test will be displayed here.
          </p>

        <h2 style={{textAlign: 'center'}}><a id="nptlink">  Nature Prevalance Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: From your project’s “ACTIVITIES” page, select “Nature Prevalence” from the 
            “Activity Type” dropdown menu. Add a name for the test to make it easier to find later. 
            Select a date and an amount of time to spend on the test per location. Then select the 
            green button with the “+” symbol to add the test.
            <br />
            <br />
            Step 2: Select “NEW TIME SLOT”, then set the start time and the number of researchers 
            for the test.
            <br />
            <br />
            Step 3: Select the “SCHEDULE ACTIVITY” button. The test should now be available on the 
            “ACTIVITIES” page below “Activity Results”.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Select your project, then tap “Create Research Activity”.
            <br />
            <br />
            Step 2: Add a name for the test to make it easier to find later. 
            Select “Nature Prevalence” from the “Select a Research Activity” 
            dropdown menu. Select a date and an amount of time to spend on the 
            test per location. Tap the “Next” button.
            <br />
            <br />
            Step 3: Select “Create Time Slot”, then set the start time and number of 
            researchers for the test.
            <br />
            <br />
            Step 4: Tap the “Complete” button. The test should now be available on the 
            list of tests for the project.
          </p> 

        <h3><u> Completing the Test </u></h3>
          <p> 
            This test can only be completed from the mobile app.
            <br />
            <br />
            Step 1: Select your team, and then your project.
            <br />
            <br />
            Step 2: Select the test from the list. Tap the “Sign Up” button.
            <br />
            <br />
            Step 3: When you are ready to start the test, tap the “Begin” button.
            <br />
            <br />
            Step 4: Answer the question about the current weather conditions.
            <br />
            <br />
            Step 5: Tap the “Start” button.
            <br />
            <br />
            Step 6: Plot points on the map to mark the locations of animals, bodies of water, 
            and vegetation. To plot an animal, tap a point on the screen and answer the question 
            about the type of animal. To plot a body of water, select the “Body of Water” category 
            at the bottom of the screen and tap points on the map around the body of water. At least 
            3 points must be placed to confirm a body of water. Answer the question about the type 
            of body of water. To plot vegetation, select the “Vegetation” category at the bottom of 
            the screen and tap points on the map around the area of vegetation. At least 3 points must 
            be placed to confirm an area of vegetation. Answer the question about the type of area of vegetation.
            <br />
            <br />
            Step 7: Repeat step 6 until either the timer runs out or you are done and tap the “End” button.
          </p>

        <h3><u> Viewing the Results </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: On your project’s “ACTIVITIES” page, select the “Nature Prevalence” category. 
            The results of the test will be displayed here. You will also see the option to export your data.
            <br />
            <br />
            Step 2: On your project’s “MAP” page, select the “RESULTS” button. 
            You can also select the “Nature Prevalence” category here to view the results of this test.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Go to the Home Page and select your project from the “Results” list.
            <br />
            <br />
            Step 2: Select the test you want to view from the “Research Results” list. 
            The results of the test will be displayed here.
          </p> 

        <h2 style={{textAlign: 'center'}}><a id="lptlink">  Lighting Profile Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: From your project’s “ACTIVITIES” page, select “Lighting Profile” from the 
            “Activity Type” dropdown menu. Add a name for the test to make it easier to find later. 
            Select a date and an amount of time to spend on the test per location. Then select the 
            green button with the “+” symbol to add the test.
            <br />
            <br />
            Step 2: Select “NEW TIME SLOT”, then set the start time and the number of researchers 
            for the test.
            <br />
            <br />
            Step 3: Select the “SCHEDULE ACTIVITY” button. The test should now be available on the 
            “ACTIVITIES” page below “Activity Results”.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Select your project, then tap “Create Research Activity”.
            <br />
            <br />
            Step 2: Add a name for the test to make it easier to find later. 
            Select “Lighting Profile” from the “Select a Research Activity” 
            dropdown menu. Select a date and an amount of time to spend on the 
            test per location. Tap the “Next” button.
            <br />
            <br />
            Step 3: Select “Create Time Slot”, then set the start time and number 
            of researchers for the test.
            <br />
            <br />
            Step 4: Tap the “Complete” button. The test should now be available 
            on the list of tests for the project.
          </p> 

        <h3><u> Completing the Test </u></h3>
          <p> 
            This test can only be completed from the mobile app.
            <br />
            <br />
            Step 1: Select your team, and then your project.
            <br />
            <br />
            Step 2: Select the test from the list. Tap the “Sign Up” button.
            <br />
            <br />
            Step 3: When you are ready to start the test, tap the “Begin” button.
            <br />
            <br />
            Step 4: Tap the “Start” button.
            <br />
            <br />
            Step 5: Plot points on the map to mark the locations of lights. After plotting 
            a point, select the type of light that it is. There are 3 types of lights: Rhythmic, 
            Building, and Task. “Rhythmic” lights are lights in a series such as streetlights, 
            pathway lighting, etc. “Building” lights are lights for a building such as lights that 
            highlight the building’s architecture, advertisement lights, etc. “Task” lights are lights 
            that are focused for a specific area such as park/court lighting, courtyard lights, etc.
            <br />
            <br />
            Step 6: Repeat step 5 until you are done, or the timer runs out. Then tap the “End” button.
          </p>

        <h3><u> Viewing the Results </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: On your project’s “ACTIVITIES” page, select the “Lighting Profile” category. 
            The results of the test will be displayed here. You will also see the option to export your data.
            <br />
            <br />
            Step 2: On your project’s “MAP” page, select the “RESULTS” button. You can also select 
            the “Lighting Profile” category here to view the results of this test.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Go to the Home Page and select your project from the “Results” list.
            <br />
            <br />
            Step 2: Select the test you want to view from the “Research Results” list. 
            The results of the test will be displayed here.
          </p> 

        <h2 style={{textAlign: 'center'}}><a id="aooltlink">  Absence of Order Locator Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: From your project’s “ACTIVITIES” page, select “Absence of Order Locator” 
            from the “Activity Type” dropdown menu. Add a name for the test to make it easier to 
            find later. Select a date and an amount of time to spend on the test per location. 
            Then select the green button with the “+” symbol to add the test.
            <br />
            <br />
            Step 2: Select “NEW TIME SLOT”, then set the start time and the number of researchers 
            for the test.
            <br />
            <br />
            Step 3: Select the “SCHEDULE ACTIVITY” button. The test should now be available on the 
            “ACTIVITIES” page below “Activity Results”.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Select your project, then tap “Create Research Activity”.
            <br />
            <br />
            Step 2: Add a name for the test to make it easier to find later. Select 
            “Absence of Order Locator” from the “Select a Research Activity” dropdown 
            menu. Select a date and an amount of time to spend on the test per location. 
            Tap the “Next” button.
            <br />
            <br />
            Step 3: Select “Create Time Slot”, then set the start time and number of 
            researchers for the test.
            <br />
            <br />
            Step 4: Tap the “Complete” button. The test should now be available on the 
            list of tests for the project.
          </p> 

        <h3><u> Completing the Test </u></h3>
          <p> 
            This test can only be completed from the mobile app.
            <br />
            <br />
            Step 1: Select your team, and then your project.
            <br />
            <br />
            Step 2: Select the test from the list. Tap the “Sign Up” button.
            <br />
            <br />
            Step 3: When you are ready to start the test, tap the “Begin” button.
            <br />
            <br />
            Step 4: Tap the “Start” button.
            <br />
            <br />
            Step 5: Plot points on the map to mark the locations of disorder. There are 2 types 
            of disorder: Behavior and Maintenance. After plotting a point, choose a category. 
            “Behavior” is for locations where human behavior is out of order, such as rowdiness. 
            “Maintenance” is for locations where the buildings or environment are out of order, 
            such as broken windows, potholes, missing bricks, etc.
            <br />
            <br />
            Step 6: After plotting a point and selecting the category, answer the questions.
            <br />
            <br />
            Step 7: Repeat steps 5-6 until you are done, or the timer runs out. Tap the “End” button.
          </p>

        <h3><u> Viewing the Results </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: On your project’s “ACTIVITIES” page, select the “Absence of Order Locator” 
            category. The results of the test will be displayed here. You will also see the option 
            to export your data.
            <br />
            <br />
            Step 2: On your project’s “MAP” page, select the “RESULTS” button. You can also select 
            the “Absence of Order Locator” category here to view the results of this test.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Go to the Home Page and select your project from the “Results” list.
            <br />
            <br />
            Step 2: Select the test you want to view from the “Research Results” list. 
            The results of the test will be displayed here.
          </p> 

        <h2 style={{textAlign: 'center'}}><a id="piptlink">  People in Place Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: From your project’s “ACTIVITIES” page, select “People in Place” from 
            the “Activity Type” dropdown menu. Add a name for the test to make it easier to 
            find later. Select a date and an amount of time to spend on the test per location. 
            Then select the green button with the “+” symbol to add the test.
            <br />
            <br />
            Step 2: Select “NEW TIME SLOT”, then set the start time and the number of researchers 
            for the test. Select the points you want to use for this test.
            <br />
            <br />
            Step 3: Select the “SCHEDULE ACTIVITY” button. The test should now be available on the 
            “ACTIVITIES” page below “Activity Results”.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Select your project, then tap “Create Research Activity”.
            <br />
            <br />
            Step 2: Add a name for the test to make it easier to find later. 
            Select “People in Place” from the “Select a Research Activity” 
            dropdown menu. Select a date and an amount of time to spend on 
            the test per location. Tap the “Next” button.
            <br />
            <br />
            Step 3: Select “Create Time Slot”, then set the start time and number 
            of researchers for the test. Select the points you want to use for this test.
            <br />
            <br />
            Step 4: Tap the “Complete” button. The test should now be available on 
            the list of tests for the project.
          </p> 


        <h3><u> Completing the Test </u></h3>
          <p> 
            This test can only be completed from the mobile app.
            <br />
            <br />
            Step 1: Select your team, and then your project.
            <br />
            <br />
            Step 2: Select the test from the list. Tap the “Sign Up” button.
            <br />
            <br />
            Step 3: When you are ready to start the test, tap the “Begin” button.
            <br />
            <br />
            Step 4: Tap the “Start” button.
            <br />
            <br />
            Step 5: Plot points on the map to mark the locations of people you see. 
            Answer the questions about the person (age range, gender, what they are doing).
            <br />
            <br />
            Step 6: Repeat step 5 until the timer runs out at that location.
            <br />
            <br />
            Step 7: A menu will pop up reminding you to move to the next location. 
            Tap “Confirm” when you are there.
            <br />
            <br />
            Step 8: Repeat steps 5-7. The test will end when all locations have been tested.
          </p>

        <h3><u> Viewing the Results </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: On your project’s “ACTIVITIES” page, select the “People in Place” category. 
            The results of the test will be displayed here. You will also see the option to export your data.
            <br />
            <br />
            Step 2: On your project’s “MAP” page, select the “RESULTS” button. You can also select 
            the “People in Place” category here to view the results of this test.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Go to the Home Page and select your project from the “Results” list.
            <br />
            <br />
            Step 2: Select the test you want to view from the “Research Results” list. 
            The results of the test will be displayed here.
          </p>   

        <h2 style={{textAlign: 'center'}}><a id="pimtlink">  People in Motion Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: From your project’s “ACTIVITIES” page, select “People in Motion” from the 
            “Activity Type” dropdown menu. Add a name for the test to make it easier to find 
            later. Select a date and an amount of time to spend on the test per location. 
            Then select the green button with the “+” symbol to add the test.
            <br />
            <br />
            Step 2: Select “NEW TIME SLOT”, then set the start time and the number of researchers 
            for the test. Select the points you want to use for this test.
            <br />
            <br />
            Step 3: Select the “SCHEDULE ACTIVITY” button. The test should now be available on 
            the “ACTIVITIES” page below “Activity Results”.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Select your project, then tap “Create Research Activity”.
            <br />
            <br />
            Step 2: Add a name for the test to make it easier to find later. 
            Select “People in Motion” from the “Select a Research Activity” 
            dropdown menu. Select a date and an amount of time to spend on the 
            test per location. Tap the “Next” button.
            <br />
            <br />
            Step 3: Select “Create Time Slot”, then set the start time and number 
            of researchers for the test. Select the points you want to use for this test.
            <br />
            <br />
            Step 4: Tap the “Complete” button. The test should now be available on the 
            list of tests for the project.
          </p> 

        <h3><u> Completing the Test </u></h3>
          <p> 
            This test can only be completed from the mobile app.
            <br />
            <br />
            Step 1: Select your team, and then your project.
            <br />
            <br />
            Step 2: Select the test from the list. Tap the “Sign Up” button.
            <br />
            <br />
            Step 3: When you are ready to start the test, tap the “Begin” button.
            <br />
            <br />
            Step 4: Tap the “Start” button.
            <br />
            <br />
            Step 5: Plot points on the map to mark the locations of people you see. 
            Answer the question about what they are doing.
            <br />
            <br />
            Step 6: Repeat step 5 until the timer runs out at that location.
            <br />
            <br />
            Step 7: A menu will pop up reminding you to move to the next location. 
            Tap “Confirm” when you are there.
            <br />
            <br />
            Step 8: Repeat steps 5-7. The test will end when all locations have been tested.
          </p>

        <h3><u> Viewing the Results </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: On your project’s “ACTIVITIES” page, select the “People in Motion” category. 
            The results of the test will be displayed here. You will also see the option to 
            export your data.
            <br />
            <br />
            Step 2: On your project’s “MAP” page, select the “RESULTS” button. You can also select 
            the “People in Motion” category here to view the results of this test.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Go to the Home Page and select your project from the “Results” list.
            <br />
            <br />
            Step 2: Select the test you want to view from the “Research Results” list. The 
            results of the test will be displayed here.
          </p>  

        <h2 style={{textAlign: 'center'}}><a id="cstlink">  Community Survey Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
          <p>
            This test can only be created from the mobile app.
            <br />
            <br />
            Step 1: Select your project, then tap “Create Research Activity”.
            <br />
            <br />
            Step 2: Add a name for the test to make it easier to find later. Select 
            “Community Survey” from the “Select a Research Activity” dropdown menu. 
            Select a date and an amount of time to spend on the test per location. 
            Tap the “Next” button.
            <br />
            <br />
            Step 3: Select “Create Time Slot”, then set the start time and number of 
            researchers for the test.
            <br />
            <br />
            Step 4: Tap the “Complete” button. The test should now be available on the 
            list of tests for the project.
          </p> 

        <h3><u> Completing the Test </u></h3>
          <p> 
            This test can only be completed from the mobile app.
            <br />
            <br />
            Step 1: Select your team, and then your project.
            <br />
            <br />
            Step 2: Select the test from the list. Tap the “Sign Up” button.
            <br />
            <br />
            Step 3: When you are ready to start the test, tap the “Begin” button.
            <br />
            <br />
            Step 4: Tap the “Start” button.
            <br />
            <br />
            Step 5: Open the survey link and answer the questions.
            <br />
            <br />
            Step 6: Tap the “End” button.
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p>
            This test can only be viewed from the mobile app.
            <br />
            <br />
            Step 1: Go to the Home Page and select your project from the “Results” list.
            <br />
            <br />
            Step 2: Select the test you want to view from the “Research Results” list. The 
            results of the test will be displayed here. For this test, a survey code will 
            be displayed.
          </p> 

        <h2 style={{textAlign: 'center'}}><a id="iatlink">  Identifying Access Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: From your project’s “ACTIVITIES” page, select “Identifying Access” from the “Activity Type” 
            dropdown menu. Add a name for the test to make it easier to find later. Select a date and an amount 
            of time to spend on the test per location. Then select the green button with the “+” symbol to add 
            the test.
            <br />
            <br />
            Step 2: Select “NEW TIME SLOT”, then set the start time and the number of researchers for the 
            test. Select the points you want to use for this test.
            <br />
            <br />
            Step 3: Select the “SCHEDULE ACTIVITY” button. The test should now be available on the “ACTIVITIES” 
            page below “Activity Results”.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Select your project, then tap “Create Research Activity”.
            <br />
            <br />
            Step 2: Add a name for the test to make it easier to find later. Select “Identifying Access” from 
            the “Select a Research Activity” dropdown menu. Select a date and an amount of time to spend on 
            the test per location. Tap the “Next” button.
            <br />
            <br />
            Step 3: Select “Create Time Slot”, then set the start time and number of researchers for the test.
            <br />
            <br />
            Step 4: Tap the “Complete” button. The test should now be available on the list of tests 
            for the project.
          </p> 

        <h3><u> Completing the Test </u></h3>
          <p> 
            This test can only be completed from the mobile app.
            <br />
            <br />
            Step 1: Select your team, and then your project.
            <br />
            <br />
            Step 2: Select the test from the list. Tap the “Sign Up” button.
            <br />
            <br />
            Step 3: When you are ready to start the test, tap the “Begin” button.
            <br />
            <br />
            Step 4: Tap the “Start” button.
            <br />
            <br />
            Step 5: Plot points on the map to mark the locations of points, paths, and areas. Select 
            the category at the bottom of the screen. For a point, select the category, tap a point on 
            the map, tap the “Confirm” button, and answer the questions about what is at the point and 
            how accessible it is. “Point” should be selected for endpoints of transportation, such as ride 
            share drop-offs, bus stops, bike racks, etc. For a path, select the category, tap points along 
            the path on the map, tap the “Confirm” button, and answer the questions about the type of path 
            and how accessible it is. “Path” should be selected for sidewalks, streets, roads, etc. For an 
            area, select the category, tap points around the area on the map, tap the “Confirm” button, and 
            answer the questions about the type of area and how accessible it is. “Area” should be selected 
            for parking lots and parking garages.
            <br />
            <br />
            Step 6: Repeat step 5 until you are done, or the timer runs out. Tap the “End” button.
          </p>

        <h3><u> Viewing the Results </u></h3>
        <h3> Web: </h3>
          <p>
            Step 1: On your project’s “ACTIVITIES” page, select the “Identifying Access” category. The 
            results of the test will be displayed here. You will also see the option to export your data.
            <br />
            <br />
            Step 2: On your project’s “MAP” page, select the “RESULTS” button. You can also select the 
            “Identifying Access” category here to view the results of this test.
          </p>
        <h3> Mobile: </h3>
          <p>
            Step 1: Go to the Home Page and select your project from the “Results” list.
            <br />
            <br />
            Step 2: Select the test you want to view from the “Research Results” list. The 
            results of the test will be displayed here.
          </p> 

        <h2 style={{textAlign: 'center'}}><a id="iptlink">  Identifying Program Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
          <p> 
            This test can only be created from the website.
            <br />
            <br />
            Step 1: From your project’s “ACTIVITIES” page, select “Identifying Program” from the 
            “Activity Type” dropdown menu. Add a name for the test to make it easier to find later. 
            Select a date and an amount of time to spend on the test per location. Then select the 
            green button with the “+” symbol to add the test.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            This test can only be completed from the website.
            <br />
            <br />
            Step 1: Select your team, and then your project.
            <br />
            <br />
            Step 2: Create the test. It will start immediately.
            <br />
            <br />
            Step 3: Select points on the map to outline a building. There must be at least 3 points.
            <br />
            <br />
            Step 4: Enter an amount of floors for the building.
            <br />
            <br />
            Step 5: Select “CONTINUE”.
            <br />
            <br />
            Step 6: Coming soon.
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p> 
            Step 1: Coming soon.
          </p>
        
        <h2 style={{textAlign: 'center'}}><a id="sctlink">  Section Cutter Tutorial </a></h2>
        
        <h3><u> Creating the Test </u></h3>
          <p> 
            This test can only be created from the website.
            <br />
            <br />
            Step 1: From your project’s “ACTIVITIES” page, select “Section Cutter” 
            from the “Activity Type” dropdown menu. Add a name for the test to make 
            it easier to find later. Select a date and an amount of time to spend on 
            the test per location. Then select the green button with the “+” symbol 
            to add the test.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            This test can only be completed from the website.
            <br />
            <br />
            Step 1: Select your team, and then your project.
            <br />
            <br />
            Step 2: Create the test. It will start immediately.
            <br />
            <br />
            Step 3: Plot 2 points to make a line that separates sections.
            <br />
            <br />
            Step 4: Select “CONTINUE SELECTION”.
            <br />
            <br />
            Step 5: Select “NEW TIME SLOT”. Add a start time and number of researchers, then 
            select “SCHEDULE ACTIVITY”.
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p> 
            This test can only be viewed from the website.
            <br />
            <br />
            Step 1: On your project’s “MAP” page, select the “RESULTS” button. You can 
            select the “Section Cutter” category here to view the results of this test.
          </p>
      </div>
    </div>
  );
}
