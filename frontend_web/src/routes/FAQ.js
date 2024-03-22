import * as React from "react";
import './routes.css';

export default function FAQ(){
  //Put All html Code within the <div id='faqPage> in func. return
  return(
    <div id='faqPage'>
      <div className='pageTemplate'>
        <h1 style={{marginBottom: '15px', textAlign: 'center'}}>Pipline to Better Placemaking Activity FAQ</h1>

        <div id='tOC'>
          <h2>Table of Contents </h2>
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

        <h2 style={{textAlign: 'center'}}><a id="aptlink"> Acoustical Profile Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
          <p> 
            Step 1: Go to the create/signup for a test page that can be accessed by going to the
            collaboration page, then selecting Team -{">"} Project 
            <br />
            <br />
            Step 2: Press ‘Create Research Activity’
            <br />
            <br />
            Step 3: Enter the information required for the test. You can select which test you want to create
            using the dropdown menu. Depending on which test you have selected, the name of the test will
            automatically default to that test’s name. We recommend inputting your own name as leaving the
            default name can be confusing when you have multiple tests of the same name. Then you will
            select the date in which you want the test to be completed.
            <br />
            <br />
            Step 4: For the Acoustical Profile Test, you will have to set the time that you would like the
            researcher to spend at each standing point. The default is 30 seconds but it may be better to
            choose a shorter interval as the test can be quite lengthy. Once you have filled out all the above
            information, press next.
            <br />
            <br />
            Step 5: Once you press next, it will take you to the time slot page in which you will create a time
            slot for the test to be completed. Press ‘Create Time Slot’.
            <br />
            <br />
            Step 6: Once you press create time slot, it will allow you to input a start time, input the number of
            researchers (users that can signup for the test), and specify which standing points you would like
            the test to be conducted at. Due to the way the data is collected for the Acoustical Profile Test,
            only one researcher is allowed per test. Once finished, press ‘Complete’ and the test will be
            created.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            Step 1: Sign up for the test as you would any other test and press Begin
            <br />
            <br />
            Step 2: The test will open with a map of the project location and a point in which the researcher
            will stand to conduct the test. Once you click start, the timer will begin to count down and
            prompt the user for input in intervals of 5 seconds, and when the timer reaches zero.
            <br />
            <br />
            Step 3: Once the timer reaches a 5 second interval or is up it will prompt the user to enter the
            sound decibel level that it says on their reader. After inputting the sound decibel level, it will
            prompt the user to input ALL the types of sounds they heard during that time interval. After
            inputting that, it will prompt the user to identify the MAIN type of sound heard they heard during
            that time interval.
            <br />
            <br />
            Step 4: Once those questions have been answered it will prompt the user to move to the next
            standing point, in which the user will either move to the next standing point or remain in place if
            there is only one standing point.
            <br />
            <br />
            Step 5: Steps 3 and 4 will be repeated for however many times as set by the project admin. A
            user’s progress for completing the tests is displayed in the top left as it will show which number
            input they are on out of the total number of inputs. This test is quite lengthy and was designed
            with the intention that once started it will be completed. Please make sure to account for this
            when completing a test.
            <br />
            <br />
            Step 6: Once the test is completed, the results will automatically be saved and can be viewed on
            the home page along with all other projects and their results. It can also be viewed on the
            website.
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p> 
            Step 1: Go to the home page of the mobile app. On the home page you will see a list titled
            ‘Results’ that will contain each project you are a part of.
            <br />
            <br />
            Step 2: Select the project you would like to view the results for. It will then take you to the main
            results page where you can see a map of the project site, administrative information about that
            project, a button to receive the results in a CSV file via email, and pages of lists that contain tests
            that were completed for the project.
            <br />
            <br />
            Step 3: To view a specific test, click on the test you would like to see. Once you select a specific
            test, you will be taken to the results page for that specific test. At the top you will be able to see
            all the administrative information for that test. Below that you will have the option to view the test
            results on a map by clicking on the ‘View Map’ button. Below the view map button you will also
            see data on the results that were collected for that test.
          </p>

        <h2 style={{textAlign: 'center'}}><a id="sbtlink"> Spatial Boundaries Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
          <p> 
            Step 1: Go to the create/signup for a test page that can be accessed by going to the
            collaboration page, then selecting Team -{">"} Project
            <br />
            <br />
            Step 2: Press ‘Create Research Activity’
            <br />
            <br />
            Step 3: Enter the information required for the test. You can select which test you want to create
            using the dropdown menu. Depending on which test you have selected, the name of the test will
            automatically default to that test’s name. We recommend inputting your own name as leaving the
            default name can be confusing when you have multiple tests of the same name. Then you will
            select the date in which you want the test to be completed.
            <br />
            <br />
            Step 4: For the Spatial Boundaries Test, you will have to set the time that you would like the
            researcher to spend at the test site. The default is 20 minutes. Once you have filled out all the
            above information, press next.
            <br />
            <br />
            Step 5: Once you press next, it will take you to the time slot page in which you will create a time
            slot for the test to be completed. Press ‘Create Time Slot’.
            <br />
            <br />
            Step 6: Once you press create time slot, it will allow you to input a start time and input the
            number of researchers (users that can signup for the test). Once finished, press ‘Complete’ and
            the test will be created.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            Step 1: Sign Up for the test as you would any other test and press begin
            <br />
            <br />
            Step 2: Once you press begin, the test will open to the project site along with a glimpse of the
            test. In order to start the test, press start in the top left corner and the timer will begin counting
            down.
            <br />
            <br />
            Step 3: You can now plot boundaries as needed. At the bottom there are three boundary types
            to choose from. ‘Constructed’ which is for boundaries that take up space vertically such as
            fences, buildings, monuments, etc. ‘Material’ boundaries are things that take up space
            horizontally on the ground and consist of things like sidewalks, grass areas, boardwalks, etc.
            ‘Shelter’ boundaries are things that take up space horizontally overhead such as canopy, tree
            cover, awnings, etc. To plot a boundary, simply press on the type of boundary you would like
            and begin plotting points, outlining that boundary. If you place a point but don’t like where it was
            plotted you can press delete and it will only delete the last point you plotted and will allow you to
            keep plotting. If you decide the boundary you are drawing isn’t necessary or correct you can
            press cancel to return to boundary types.
            <br />
            <br />
            Step 4: Once you are sure the boundary you have drawn is correct, press confirm. It will then
            prompt you to answer questions about the boundary you just drew.
            <br />
            <br />
            Step 5: After completing the prompts, it will allow you to plot more points as necessary in which
            you will simply repeat steps 3 and 4. You are also able to view and filter through the boundaries
            you have already drawn using the dropdown menu at the top. Simply press end in the top left
            whenever you have completed the test. If the timer runs out, don’t worry, your input will still be
            saved.
            <br />
            <br />
            Step 6: Once the test is completed, the results will automatically be saved and can be viewed on
            the home page along with all other projects and their results. It can also be viewed on the
            website.
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p> 
            Step 1: Go to the home page of the mobile app. On the home page you will see a list titled
            ‘Results’ that will contain each project you are a part of.
            <br />
            <br />
            Step 2: Select the project you would like to view the results for. It will then take you to the main
            results page where you can see a map of the project site, administrative information about that
            project, a button to receive the results in a CSV file via email, and pages of lists that contain tests
            that were completed for the project.
            <br />
            <br />
            Step 3: To view a specific test, click on the test you would like to see. Once you select a specific
            test, you will be taken to the results page for that specific test. At the top you will be able to see
            all the administrative information for that test. Below that you will have the option to view the test
            results on a map by clicking on the ‘View Map’ button. Below the view map button you will also
            see data on the results that were collected for that test.
          </p>

        <h2 style={{textAlign: 'center'}}><a id="nptlink">  Nature Prevalance Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
          <p> 
            Step 1: Go to the create/signup for a test page that can be accessed by going to the
            collaboration page, then selecting Team -{">"} Project
            <br />
            <br />
            Step 2: Press ‘Create Research Activity’
            <br />
            <br />
            Step 3: Enter the information required for the test. You can select which test you want to create
            using the dropdown menu. Depending on which test you have selected, the name of the test will
            automatically default to that test’s name. We recommend inputting your own name as leaving the
            default name can be confusing when you have multiple tests of the same name. Then you will
            select the date in which you want the test to be completed.
            <br />
            <br />
            Step 4: For the Nature Prevalence Test, you will have to set the time that you would like the
            researcher to spend at the test site. The default is 20 minutes. Once you have filled out all the
            above information, press next.
            <br />
            <br />
            Step 5: Once you press next, it will take you to the time slot page in which you will create a time
            slot for the test to be completed. Press ‘Create Time Slot’.
            <br />
            <br />
            Step 6: Once you press create time slot, it will allow you to input a start time and input the
            number of researchers (users that can signup for the test). Once finished, press ‘Complete’ and
            the test will be created.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            Step 1: Sign up for the test as you would any other test and press begin.
            <br />
            <br />
            Step 2: Once you press begin it will open the test and show you the project site. You can press
            start in the top left to start the test.
            <br />
            <br />
            Step 3: As soon as you press start, it will prompt you to type in weather information about the
            place. Complete the prompt.
            <br />
            <br />
            Step 4: You are now able to being recording information for this test. You have three options for
            this test, ‘Animals’, ‘Body of Water’, and ‘Vegetation’. To plot an Animal, simply press anywhere
            on the project site and fill out the necessary prompts. To plot a body of water, press on the body
            of water button and it will allow you to draw the shape of a body of water by plotting points. If
            you place a point but don’t like where it was plotted you can press delete and it will only delete
            the last point you plotted and will allow you to keep plotting. If you decide the body of water you
            are drawing isn’t necessary or correct you can press cancel. To plot the vegetation in a project
            site, press on the vegetation button and it will allow you to draw the vegetation by plotting points,
            it works similar to body of water.
            <br />
            <br />
            Step 5: You can continue to input information and will repeat step 4 as needed. Simply press end
            in the top left whenever you have completed the test. If the timer runs out, don’t worry, your input
            will still be saved.
            <br />
            <br />
            Step 6: Once the test is completed, the results will automatically be saved and can be viewed on
            the home page along with all other projects and their results. It can also be viewed on the
            website.
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p> 
            Step 1: Go to the home page of the mobile app. On the home page you will see a list titled
            ‘Results’ that will contain each project you are a part of.
            <br />
            <br />
            Step 2: Select the project you would like to view the results for. It will then take you to the main
            results page where you can see a map of the project site, administrative information about that
            project, a button to receive the results in a CSV file via email, and pages of lists that contain tests
            that were completed for the project.
            <br />
            <br />
            Step 3: To view a specific test, click on the test you would like to see. Once you select a specific
            test, you will be taken to the results page for that specific test. At the top you will be able to see
            all the administrative information for that test. Below that you will have the option to view the test
            results on a map by clicking on the ‘View Map’ button. Below the view map button you will also
            see data on the results that were collected for that test.
          </p>

        <h2 style={{textAlign: 'center'}}><a id="lptlink">  Lighting Profile Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
          <p> 
            Step 1: Go to the create/signup for a test page that can be accessed by going to the
            collaboration page, then selecting Team -{">"} Project
            <br />
            <br />
            Step 2: Press ‘Create Research Activity’
            <br />
            <br />
            Step 3: Enter the information required for the test. You can select which test you want to create
            using the dropdown menu. Depending on which test you have selected, the name of the test will
            automatically default to that test’s name. We recommend inputting your own name as leaving the
            default name can be confusing when you have multiple tests of the same name. Then you will
            select the date in which you want the test to be completed.
            <br />
            <br />
            Step 4: For the Lighting Profile Test, you will have to set the time that you would like the
            researcher to spend at the test site. The default is 20 minutes. Once you have filled out all the
            above information, press next.
            <br />
            <br />
            Step 5: Once you press next, it will take you to the time slot page in which you will create a time
            slot for the test to be completed. Press ‘Create Time Slot’.
            <br />
            <br />
            Step 6: Once you press create time slot, it will allow you to input a start time and input the
            number of researchers (users that can signup for the test). Once finished, press ‘Complete’ and
            the test will be created.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            Step 1: Sign up for the test as you would any other test and press begin.
            <br />
            <br />
            Step 2: Once you press begin it will open the test and show you the project site. You can press
            start in the top left to start the test.
            <br />
            <br />
            Step 3: Once you click start, you can then press anywhere on the map to plot a point where
            there is light. Once you plot the point it will then ask you for information about the light. There are
            three types of light, ‘Rhythmic’, ‘Building’, and ‘Task’. ‘Rhythmic’ are lights that are in series,
            such as streetlights, pathway lighting, etc. ‘Building’ are lights for buildings, such as lights that
            highlight a building’s architecture, advertisement lights, etc. ‘Task’ are lights that are focused for
            specific areas, such as park/court lighting, courtyard lights, etc.
            <br />
            <br />
            Step 4: You can continue to input information and will repeat step 3 as needed. Simply press end
            in the top left whenever you have completed the test. If the timer runs out, don’t worry, your input
            will still be saved.
            <br />
            <br />
            Step 5: Once the test is completed, the results will automatically be saved and can be viewed on
            the home page along with all other projects and their results. It can also be viewed on the
            website.
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p> 
            Step 1: Go to the home page of the mobile app. On the home page you will see a list titled
            ‘Results’ that will contain each project you are a part of.
            <br />
            <br />
            Step 2: Select the project you would like to view the results for. It will then take you to the main
            results page where you can see a map of the project site, administrative information about that
            project, a button to receive the results in a CSV file via email, and pages of lists that contain tests
            that were completed for the project.
            <br />
            <br />
            Step 3: To view a specific test, click on the test you would like to see. Once you select a specific
            test, you will be taken to the results page for that specific test. At the top you will be able to see
            all the administrative information for that test. Below that you will have the option to view the test
            results on a map by clicking on the ‘View Map’ button. Below the view map button you will also
            see data on the results that were collected for that test.
          </p>

        <h2 style={{textAlign: 'center'}}><a id="aooltlink">  Absence of Order Locator Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
          <p> 
            Step 1: Go to the create/signup for a test page that can be accessed by going to the
            collaboration page, then selecting Team -{">"} Project
            <br />
            <br />
            Step 2: Press ‘Create Research Activity’ 
            <br />
            <br />
            Step 3: Enter the information required for the test. You can select which test you want to create
            using the dropdown menu. Depending on which test you have selected, the name of the test will
            automatically default to that test’s name. We recommend inputting your own name as leaving the
            default name can be confusing when you have multiple tests of the same name. Then you will
            select the date in which you want the test to be completed.
            <br />
            <br />
            Step 4: For the Absence of Order Locator Test, you will have to set the time that you would like
            the researcher to spend at the test site. The default is 20 minutes. Once you have filled out all the
            above information, press next.
            <br />
            <br />
            Step 5: Once you press next, it will take you to the time slot page in which you will create a time
            slot for the test to be completed. Press ‘Create Time Slot’.
            <br />
            <br />
            Step 6: Once you press create time slot, it will allow you to input a start time and input the
            number of researchers (users that can signup for the test). Once finished, press ‘Complete’ and
            the test will be created.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            Step 1: Sign up for the test as you would any other test and press begin.
            <br />
            <br />
            Step 2: Once you press begin it will open the test and show you the project site. You can press
            start in the top left to start the test. 
            <br />
            <br />
            Step 3: Once you click start, you can press anywhere on the map to plot a point where there is
            any disorder. Once you plot the point it will then ask you to select which type of disorder, either
            ‘Misconduct’ or ‘Maintenance’. Misconduct is when human behavior is out of order, such as
            rowdiness, panhandling, homeless presence, etc. Maintenance is when the buildings or
            environment is out of order, such as broken windows, potholes, missing bricks, etc. After
            selecting the type, it will prompt you with a few questions. Complete the prompts to plot the
            point.
            <br />
            <br />
            Step 4: You can continue to input information and will repeat step 3 as needed. Simply press end
            in the top left whenever you have completed the test. If the timer runs out, don’t worry, your input
            will still be saved.
            <br />
            <br />
            Step 5: Once the test is completed, the results will automatically be saved and can be viewed on
            the home page along with all other projects and their results. It can also be viewed on the
            website.
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p> 
            Step 1: Go to the home page of the mobile app. On the home page you will see a list titled
            ‘Results’ that will contain each project you are a part of.
            <br />
            <br />
            Step 2: Select the project you would like to view the results for. It will then take you to the main
            results page where you can see a map of the project site, administrative information about that
            project, a button to receive the results in a CSV file via email, and pages of lists that contain tests
            that were completed for the project.
            <br />
            <br />
            Step 3: To view a specific test, click on the test you would like to see. Once you select a specific
            test, you will be taken to the results page for that specific test. At the top you will be able to see
            all the administrative information for that test. Below that you will have the option to view the test
            results on a map by clicking on the ‘View Map’ button. Below the view map button you will also
            see data on the results that were collected for that test.
          </p>

        <h2 style={{textAlign: 'center'}}><a id="piptlink">  People in Place Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
          <p> 
            Step 1: Go to the create/signup for a test page that can be accessed by going to the
            collaboration page, then selecting Team -{">"} Project
            <br />
            <br />
            Step 2: Press ‘Create Research Activity’
            <br />
            <br />
            Step 3: Enter the information required for the test. You can select which test you want to create
            using the dropdown menu. Depending on which test you have selected, the name of the test will
            automatically default to that test’s name. We recommend inputting your own name as leaving the
            default name can be confusing when you have multiple tests of the same name. Then you will
            select the date in which you want the test to be completed.
            <br />
            <br />
            Step 4: For the People in Place Test, you will have to set the time that you would like the
            researcher to spend at each standing point. The default is 15 minutes. Once you have filled out all the
            above information, press next.
            <br />
            <br />
            Step 5: Once you press next, it will take you to the time slot page in which you will create a time
            slot for the test to be completed. Press ‘Create Time Slot’.
            <br />
            <br />
            Step 6: Once you press create time slot, it will allow you to input a start time and input the
            number of researchers (users that can signup for the test). Once finished, press ‘Complete’ and
            the test will be created.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            Step 1: Sign up for the test as you would any other test and press begin.
            <br />
            <br />
            Step 2: Once you press begin it will open the test and show you the project site. You can press
            start in the top left to start the test.
            <br />
            <br />
            Step 3: Now the test has started, you can place dots on the map to mark what users are doing following the prompts on screen.
            <br />
            <br />
            Step 4: Once the test is completed, the results will automatically be saved and can be viewed on
            the home page along with all other projects and their results. It can also be viewed on the
            website.
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p> 
            Step 1: Go to the home page of the mobile app. On the home page you will see a list titled
            ‘Results’ that will contain each project you are a part of.
            <br />
            <br />
            Step 2: Select the project you would like to view the results for. It will then take you to the main
            results page where you can see a map of the project site, administrative information about that
            project, a button to receive the results in a CSV file via email, and pages of lists that contain tests
            that were completed for the project.
            <br />
            <br />
            Step 3: To view a specific test, click on the test you would like to see. Once you select a specific
            test, you will be taken to the results page for that specific test. At the top you will be able to see
            all the administrative information for that test. Below that you will have the option to view the test
            results on a map by clicking on the ‘View Map’ button. Below the view map button you will also
            see data on the results that were collected for that test.
          </p>

        <h2 style={{textAlign: 'center'}}><a id="pimtlink">  People in Motion Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
          <p> 
            Step 1: Go to the create/signup for a test page that can be accessed by going to the
            collaboration page, then selecting Team -{">"} Project
            <br />
            <br />
            Step 2: Press ‘Create Research Activity’
            <br />
            <br />
            Step 3: Enter the information required for the test. You can select which test you want to create
            using the dropdown menu. Depending on which test you have selected, the name of the test will
            automatically default to that test’s name. We recommend inputting your own name as leaving the
            default name can be confusing when you have multiple tests of the same name. Then you will
            select the date in which you want the test to be completed.
            <br />
            <br />
            Step 4: For the People in Motion Test, you will have to set the time that you would like the
            researcher to spend at each standing point. The default is 15 minutes. Once you have filled out all the
            above information, press next.
            <br />
            <br />
            Step 5: Once you press next, it will take you to the time slot page in which you will create a time
            slot for the test to be completed. Press ‘Create Time Slot’.
            <br />
            <br />
            Step 6: Once you press create time slot, it will allow you to input a start time and input the
            number of researchers (users that can signup for the test). Once finished, press ‘Complete’ and
            the test will be created.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            Step 1: Sign up for the test as you would any other test and press begin.
            <br />
            <br />
            Step 2: Once you press begin it will open the test and show you the project site. You can press
            start in the top left to start the test.
            <br />
            <br />
            Step 3: Once the test has started you can click on the map to mark where people are.
            <br />
            <br />
            Step 4: Then you can denote what kind of movement people are participating in. Repeat step 3 and 4 to gather data.
            <br />
            <br />
            Step 5: Once the test is completed, the results will automatically be saved and can be viewed on
            the home page along with all other projects and their results. It can also be viewed on the
            website.
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p> 
            Step 1: Go to the home page of the mobile app. On the home page you will see a list titled
            ‘Results’ that will contain each project you are a part of.
            <br />
            <br />
            Step 2: Select the project you would like to view the results for. It will then take you to the main
            results page where you can see a map of the project site, administrative information about that
            project, a button to receive the results in a CSV file via email, and pages of lists that contain tests
            that were completed for the project.
            <br />
            <br />
            Step 3: To view a specific test, click on the test you would like to see. Once you select a specific
            test, you will be taken to the results page for that specific test. At the top you will be able to see
            all the administrative information for that test. Below that you will have the option to view the test
            results on a map by clicking on the ‘View Map’ button. Below the view map button you will also
            see data on the results that were collected for that test.
          </p>

        <h2 style={{textAlign: 'center'}}><a id="cstlink">  Community Survey Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
          <p> 
            Step 1: Go to the create/signup for a test page that can be accessed by going to the
            collaboration page, then selecting Team -{">"} Project
            <br />
            <br />
            Step 2: Press ‘Create Research Activity’
            <br />
            <br />
            Step 3: Enter the information required for the test. You can select which test you want to create
            using the dropdown menu. Depending on which test you have selected, the name of the test will
            automatically default to that test’s name. We recommend inputting your own name as leaving the
            default name can be confusing when you have multiple tests of the same name. Then you will
            select the date in which you want the test to be completed.
            <br />
            <br />
            Step 4: Coming soon.
            <br />
            <br />
            Step 5: Once you press next, it will take you to the time slot page in which you will create a time
            slot for the test to be completed. Press ‘Create Time Slot’.
            <br />
            <br />
            Step 6: Once you press create time slot, it will allow you to input a start time and input the
            number of researchers (users that can signup for the test). Once finished, press ‘Complete’ and
            the test will be created.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            Step 1: Sign up for the test as you would any other test and press begin.
            <br />
            <br />
            Step 2: A QR code will generate that will take users to a qualtrics survey.
            <br />
            <br />
            Step 3:  Instruct participants to complete survey.
            <br />
            <br />
            Step 4: End test when time slot is up.
          </p>

        <h2 style={{textAlign: 'center'}}><a id="iatlink">  Identifying Access Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
          <p> 
            Step 1: Go to the create/signup for a test page that can be accessed by going to the
            collaboration page, then selecting Team -{">"} Project
            <br />
            <br />
            Step 2: Press ‘Create Research Activity’
            <br />
            <br />
            Step 3: Enter the information required for the test. You can select which test you want to create
            using the dropdown menu. Depending on which test you have selected, the name of the test will
            automatically default to that test’s name. We recommend inputting your own name as leaving the
            default name can be confusing when you have multiple tests of the same name. Then you will
            select the date in which you want the test to be completed.
            <br />
            <br />
            Step 4: Coming soon.
            <br />
            <br />
            Step 5: Once you press next, it will take you to the time slot page in which you will create a time
            slot for the test to be completed. Press ‘Create Time Slot’.
            <br />
            <br />
            Step 6: Once you press create time slot, it will allow you to input a start time and input the
            number of researchers (users that can signup for the test). Once finished, press ‘Complete’ and
            the test will be created.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            Step 1: Sign up for the test as you would any other test and press begin.
            <br />
            <br />
            Step 2: Once you being the test you will be given 3 options to plot - a point, path, and area. Follow the prompts for each option. 
            A point requires one point, a path can be any number of lines, and a area must be at least 3 points.
            <br />
            <br />
            Step 3: After plotting, you will be asked to describe the access point from a list, then asked the access difficulty. 
            If an access area was selected you will also be asked the cost and number of spots.
            <br />
            <br />
            Step 4: After identifying all the access modes, you can end or pause the test. 
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p> 
            Step 1: Go to the home page of the mobile app. On the home page you will see a list titled
            ‘Results’ that will contain each project you are a part of.
            <br />
            <br />
            Step 2:  Select the project you would like to view the results for. It will then take you to the main
            results page where you can see a map of the project site, administrative information about that
            project, a button to receive the results in a CSV file via email, and pages of lists that contain tests
            that were completed for the project.
            <br />
            <br />
            Step 3: To view a specific test, click on the test you would like to see. Once you select a specific
            test, you will be taken to the results page for that specific test. At the top you will be able to see
            all the administrative information for that test. Below that you will have the option to view the test
            results on a map by clicking on the ‘View Map’ button. Below the view map button you will also
            see data on the results that were collected for that test.
          </p>

        <h2 style={{textAlign: 'center'}}><a id="iptlink">  Identifying Program Tutorial </a></h2>

        <h3><u> Creating the Test </u></h3>
          <p> 
            Step 1: Go to the create/signup for a test page that can be accessed by going to the
            collaboration page, then selecting Team -{">"} Project
            <br />
            <br />
            Step 2: Press ‘Create Research Activity’
            <br />
            <br />
            Step 3: Enter the information required for the test. You can select which test you want to create
            using the dropdown menu. Depending on which test you have selected, the name of the test will
            automatically default to that test’s name. We recommend inputting your own name as leaving the
            default name can be confusing when you have multiple tests of the same name. Then you will
            select the date in which you want the test to be completed.
            <br />
            <br />
            Step 4: Coming soon.
            <br />
            <br />
            Step 5: Once you press next, it will take you to the time slot page in which you will create a time
            slot for the test to be completed. Press ‘Create Time Slot’.
            <br />
            <br />
            Step 6: Once you press create time slot, it will allow you to input a start time and input the
            number of researchers (users that can signup for the test). Once finished, press ‘Complete’ and
            the test will be created.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            Step 1: Sign up for the test by navigating to the results tab, and turning on the timeslot.
            <br />
            <br />
            Step 2: The outline of the model to carry out the test will pop up, clicking on this will allow users to sign up, view the model, and complete the test.
            <br />
            <br />
            Step 3: A new page will load where users add points to the select floor to create the outline for building. 
            <br />
            <br />
            Step 4: After creating the outline and denoting the program type, a shape will be extrude.
            <br />
            <br />
            Step 5: Coming soon. 
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p> 
            Step 1: Go to the home page of the mobile app. On the home page you will see a list titled
            ‘Results’ that will contain each project you are a part of.
            <br />
            <br />
            Step 2:  Select the project you would like to view the results for. It will then take you to the main
            results page where you can see a map of the project site, administrative information about that
            project, a button to receive the results in a CSV file via email, and pages of lists that contain tests
            that were completed for the project.
            <br />
            <br />
            Step 3: To view a specific test, click on the test you would like to see. Once you select a specific
            test, you will be taken to the results page for that specific test. At the top you will be able to see
            all the administrative information for that test. Below that you will have the option to view the test
            results on a map by clicking on the ‘View Map’ button. Below the view map button you will also
            see data on the results that were collected for that test.
            <br />
            <br />
            Step 4: For viewing the model created in Identifying Program you can navigate to the results tab, select on for the results you want to see.
            Now clicking on the model displayed on the Map will direct you to a pop up where you can view the programs.
          </p>
        
        <h2 style={{textAlign: 'center'}}><a id="sctlink">  Section Cutter Tutorial </a></h2>
        
        <h3><u> Creating the Test </u></h3>
          <p> 
            Step 1: Go to the create/signup for a test page that can be accessed by going to the
            collaboration page, then selecting Team -{">"} Project
            <br />
            <br />
            Step 2: Press ‘Create Research Activity’
            <br />
            <br />
            Step 3: Enter the information required for the test. You can select which test you want to create
            using the dropdown menu. Depending on which test you have selected, the name of the test will
            automatically default to that test’s name. We recommend inputting your own name as leaving the
            default name can be confusing when you have multiple tests of the same name. Then you will
            select the date in which you want the test to be completed.
            <br />
            <br />
            Step 4: Coming soon.
            <br />
            <br />
            Step 5: Once you press next, it will take you to the time slot page in which you will create a time
            slot for the test to be completed. Press ‘Create Time Slot’.
            <br />
            <br />
            Step 6: Once you press create time slot, it will allow you to input a start time and input the
            number of researchers (users that can signup for the test). Once finished, press ‘Complete’ and
            the test will be created.
          </p>

        <h3><u> Completing the Test </u></h3>
          <p> 
            Step 1: Sign up for the test as you would any other test and press begin.
            <br />
            <br />
            Step 2: Coming. soon.
            <br />
            <br />
            Step 3: Coming soon.
            <br />
            <br />
            Step 4: Coming soon.
            <br />
            <br />
            Step 5: Coming soon. 
          </p>

        <h3><u> Viewing the Results </u></h3>
          <p> 
            Step 1: Coming soon.
            <br />
            <br />
            Step 2: Coming soon. 
            <br />
            <br />
            Step 3: Coming soon.
            <br />
            <br />
            Step 4: For viewing the model created in Section Cutter you can navigate to the results tab, select on for the results you want to see.
            Now clicking on the model displayed on the Map will direct you to a pop up where you can view the data for the section cut.
          </p>
      </div>
    </div>
  );
}
