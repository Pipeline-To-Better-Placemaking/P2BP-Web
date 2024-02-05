import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis, Tooltip, Legend, PieChart, Pie } from 'recharts';
import { Button } from '@mui/material'
import PetsIcon from '@mui/icons-material/Pets';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CommuteIcon from '@mui/icons-material/Commute';
import PeopleIcon from '@mui/icons-material/People';
import WavesIcon from '@mui/icons-material/Waves';
import AirIcon from '@mui/icons-material/Air';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Area, testNames } from '../functions/HelperFunctions';

export default function Charts(props) {
    const width = 280;
    const height = 250;
    const data = props.data;
    const selection = props.selection;
    const type = props.type;
    const projectArea = props.projArea ? Area(props.projArea) : null;

    const boundsColor = {
        Constructed: '#FF00E5',
        Shelter: '#FFA64D',
        Material: '#00FFC1',
        Unmarked: '#C4C4C4'
    };

    const natureColor = {
        Water: '#2578C5',
        Vegetation: '#BEFF05',
        Animals: '#9C4B00',
        None: '#C4C4C4'
    }

    const stationaryColor = {
        Sitting: '#ff0000',
        Standing: '#0000ff',
        Laying: '#ffff00',
        Squatting: '#008000'
    }

    const movingColor = {
        Walking: '#0000FF',
        Running: '#FF0000',
        Swimming: '#FFFF00',
        'Activity on Wheels': '#008000',
        'Handicap Assisted Wheels': '#FFA500'
    }

    const lightColor = {
        Rhythmic: '#FFE600',
        Building: '#FF9900',
        Task: '#FF00E5'
    }

    const orderColor = {
        Behavior: '#FF9900',
        Maintenance: '#FFD800'
    }

    const accessColor = ["#73cfff", "#256eff", "#004bad", "#0029aa", "#00cc00", "#2ebd33", "#00b300", "#009900"]

    const programColor = ["#1BC500", '#D60000', '#FFFF23', '#FF69C5', '#36EFFF', '#0059FA', '#FF8D00', '#AB00FF', '#954600', '#000000', '#FDAAE5', '#C8C8C8', '#274D34', '#F5F5F5'];

    const cat = selection.split('.');

    const soundIcons = {
        Animals: <PetsIcon />,
        Music: <MusicNoteIcon />,
        Traffic: <CommuteIcon />,
        'People Sounds': <PeopleIcon />,
        'Water Feature': <WavesIcon />,
        Wind: <AirIcon />,
        Other: null
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className="custom-tooltip" style={{
                backgroundColor: "#F1F1F1",
                borderRadius: "5px",
                alignContent: "center",
            }}>
              <p className="label" style={{padding:"1vw"}}>{`${payload[0].payload.key ? payload[0].payload.key : "Count"}: ${payload[0].payload.key === "Length" ? `${payload[0].value}ft` : payload[0].value}`}</p>
            </div>
          );
        }
        return null;
    };

    const multiSoundCharts = (data) => {
        var frequent = [0, 0, 0, 0, 0, 0, 0];
        var high = {};
        var low = {};
        var measurements = [];
        var indexes = [0];
        //var soundLoc = [];
        //var avgs = [];

        var indexing = [
            'Animals',
            'Music',
            'Traffic',
            'People Sounds',
            'Water Feature',
            'Wind',
            'Other'
        ];

        Object.entries(data).map(([dateTime, arr]) => (
            arr.forEach((arr1, index) => {
                arr1.forEach((obj, ind) => {
                    obj.instance = `Location ${ind + 1}`;
                    measurements.push(obj);
                    Object.entries(obj).forEach(([key, dataVal]) => {
                        if (key === 'decibel_1' || key === 'decibel_2' || key === 'decibel_3' || key === 'decibel_4' || key === 'decibel_5') {
                            if (key === 'decibel_1') {
                                high = dataVal
                                low = dataVal

                                frequent.push(dataVal);
                            } else {
                                if (dataVal.recording > high.recording) {
                                    high = dataVal;
                                } else if (dataVal.recording < high.recording) {
                                    low = dataVal;
                                }
                            }

                            if (dataVal.predominant_type === 'Animals') {
                                frequent[0] += 1;
                            } else if (dataVal.predominant_type === 'Music') {
                                frequent[1] += 1;
                            } else if (dataVal.predominant_type === 'Traffic') {
                                frequent[2] += 1;
                            } else if (dataVal.predominant_type === 'People Sounds') {
                                frequent[3] += 1;
                            } else if (dataVal.predominant_type === 'Water Feature') {
                                frequent[4] += 1;
                            } else if (dataVal.predominant_type === 'Wind') {
                                frequent[5] += 1;
                            } else {
                                frequent[6] += 1;
                            }
                        }
                    })
                })
            })
        ))

        frequent.forEach((value, index) => {
            if (value > frequent[indexes[0]]) {
                indexes = []
                indexes = [index];
            } else if (value === frequent[indexes[0]] && index !== indexes[0]) {
                indexes.push(index);
            }
        })

        return (
            <div className='Charts'>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'larger' }}>Volume Range and Sources</div>
                    <b>Highest Recorded Volume:</b> {high.recording} dB
                    <br />
                    <b>Predominant Source:</b>
                    <br />
                    {soundIcons[high.predominant_type] ? soundIcons[high.predominant_type] : soundIcons.Other}
                    <br />
                    {high.predominant_type}
                    <br />
                    <b>Lowest Recorded Volume:</b> {low.recording} dB
                    <br />
                    <b>Predominant Source:</b>
                    <br />
                    {soundIcons[low.predominant_type] ? soundIcons[low.predominant_type] : soundIcons.Other}
                    <br />
                    {low.predominant_type}
                    <br />
                    <b>Most Frequent Reported Source(s):</b>
                    <br />
                    {indexes.map((value) => (`${indexing[value]} `))}
                </div>&nbsp;
                <br />
                <b>Location Averages</b>
                <BarChart width={width} height={height} data={measurements}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='instance' />
                    <YAxis label={{ value: 'Decibels', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={'average'} fill='#B073FF' />
                </BarChart>
            </div>
        );
    }

    const soundBarChart = (data) => {
        var frequent = [0, 0, 0, 0, 0, 0, 0];
        var indexes = [0];
        var high = {};
        var low = {};
        var soundLoc = [];
        var avgs = [];

        var indexing = [
            'Animals',
            'Music',
            'Traffic',
            'People Sounds',
            'Water Feature',
            'Wind',
            'Other'
        ]

        data.forEach((obj, ind) => {
            obj.instance = `Location ${ind + 1}`;
            var locArr = [];
            Object.entries(obj).forEach(([key, dataVal], index) => {
                if (key === 'average') {
                    avgs.push(dataVal);
                }
                if (key === 'decibel_1' || key === 'decibel_2' || key === 'decibel_3' || key === 'decibel_4' || key === 'decibel_5') {
                    locArr.push({ instance: key, recording: dataVal.recording });

                    if (key === 'decibel_1') {
                        high = dataVal
                        low = dataVal
                        frequent.push(dataVal);
                    } else {
                        if (dataVal.recording > high.recording) {
                            high = dataVal;
                        } else if (dataVal.recording < high.recording) {
                            low = dataVal;
                        }
                    }

                    if (dataVal.predominant_type === 'Animals') {
                        frequent[0] += 1;
                    } else if (dataVal.predominant_type === 'Music') {
                        frequent[1] += 1;
                    } else if (dataVal.predominant_type === 'Traffic') {
                        frequent[2] += 1;
                    } else if (dataVal.predominant_type === 'People Sounds') {
                        frequent[3] += 1;
                    } else if (dataVal.predominant_type === 'Water Feature') {
                        frequent[4] += 1;
                    } else if (dataVal.predominant_type === 'Wind') {
                        frequent[5] += 1;
                    } else {
                        frequent[6] += 1;
                    }
                }
            })
            soundLoc.push(locArr);
        })

        frequent.forEach((value, index) => {
            if (value > frequent[indexes[0]]) {
                indexes = []
                indexes = [index];
            } else if (value === frequent[indexes[0]] && index !== indexes[0]) {
                indexes.push(index);
            }
        });

        return (
            <div className='Charts'>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'larger' }}>Volume Range and Sources</div>
                    <b>Highest Recorded Volume:</b> {high.recording} dB
                    <br />
                    <b>Predominant Source:</b>
                    <br />
                    {soundIcons[high.predominant_type] ? soundIcons[high.predominant_type] : soundIcons.Other}
                    <br />
                    {high.predominant_type}
                    <br />
                    <b>Lowest Recorded Volume:</b> {low.recording} dB
                    <br />
                    <b>Predominant Source:</b>
                    <br />
                    {soundIcons[low.predominant_type] ? soundIcons[low.predominant_type] : soundIcons.Other}
                    <br />
                    {low.predominant_type}
                    <br />
                    <b>Most Frequent Reported Source(s):</b>
                    <br />
                    {indexes.map((value) => (`${indexing[value]} `))}
                </div>&nbsp;
                <br />
                {soundLoc.map((position, index) => (
                    <div style={{ borderBottom: '1px solid black', textAlign: 'center' }}>
                        <div style={{ backgroundColor: '#B073FF' }}><b>Location {index + 1}</b></div>
                        <BarChart width={width} height={height} data={position}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='instance' />
                            <YAxis label={{ value: 'Decibels', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={'recording'} fill='#B073FF' />
                        </BarChart>
                        <br />
                        <b>Average (Location {index + 1}): {avgs[index]}</b>
                        <br />
                    </div>
                ))}&nbsp;
                <br />
                <b>Location Averages</b>
                <BarChart width={width} height={height} data={data}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='instance' />
                    <YAxis label={{ value: 'Decibels', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={'average'} fill='#B073FF' />
                </BarChart>
            </div>
        );
    };

    const multiStationary = (data) => {
        var standing = 0, laying = 0, squatting = 0, sitting = 0;
        var kid = 0, teen = 0, yAdult = 0, mAdult = 0, senior = 0;
        var male = 0, female = 0;
        var socializing = 0, waiting = 0, recreation = 0, eating = 0, solitary = 0;

        for (const [dateTime, resultArr] of Object.entries(data)) {
            for (const index1 of resultArr) {
                for (const obj of index1) {
                    if (obj.posture === 'Standing') {
                        standing++;
                    } else if (obj.posture === 'Laying') {
                        laying++;
                    } else if (obj.posture === 'Squatting') {
                        squatting++;
                    } else {
                        sitting++;
                    }

                    if (obj.age === '0-14') {
                        kid++;
                    } else if (obj.age === '15-21') {
                        teen++;
                    } else if (obj.age === '22-30') {
                        yAdult++;
                    } else if (obj.age === '30-50') {
                        mAdult++;
                    } else {
                        senior++;
                    }

                    if (obj.gender === 'Female') {
                        female++;
                    } else {
                        male++;
                    }

                    if (obj.activity.includes('Socializing')) {
                        socializing++;
                    }
                    if (obj.activity.includes('Waiting')) {
                        waiting++;
                    }
                    if (obj.activity.includes('Recreation')) {
                        recreation++;
                    }
                    if (obj.activity.includes('Eating')) {
                        eating++;
                    }
                    if (obj.activity.includes('Solitary')) {
                        solitary++;
                    }
                }
            }
        }

        var posture = [{ posture: 'Sitting', count: sitting }, { posture: 'Standing', count: standing }, { posture: 'Laying', count: laying }, { posture: 'Squatting', count: squatting }];
        var age = [{ age: '0-14', count: kid }, { age: '15-21', count: teen }, { age: '22-30', count: yAdult }, { age: '30-50', count: mAdult }, { age: '50+', count: senior }];
        var gender = [{ gender: 'Male', count: male }, { gender: 'Female', count: female }]
        var activity = [{ activity: 'Socializing', count: socializing }, { activity: 'Waiting', count: waiting }, { activity: 'Recreation', count: recreation }, { activity: 'Eating', count: eating }, { activity: 'Solitary', count: solitary }];

        return (
            <div className='Charts'>
                <div style={{ fontSize: 'larger' }}>Posture</div>
                <BarChart width={width} height={height} data={posture}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='posture' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} >
                        {posture.map((entry, index) => (
                            <Cell key={`cell-${index}`} stroke={'#000000'} fill={stationaryColor[entry.posture]} fillOpacity={0.7} />
                        ))}
                    </Bar>
                </BarChart>
                <div style={{ fontSize: 'larger' }}>Age</div>
                <BarChart width={width} height={height} data={age}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='age' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill='#636262' fillOpacity={0.75} />
                </BarChart>
                <div style={{ fontSize: 'larger' }}>Gender</div>
                <BarChart width={width} height={height} data={gender}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='gender' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill='#636262' fillOpacity={0.75} />
                </BarChart>
                <div style={{ fontSize: 'larger' }}>Activity</div>
                <BarChart width={width} height={height} data={activity}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='activity' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill='#636262' fillOpacity={0.75} />
                </BarChart>
                <br />
                <div >
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: stationaryColor['Sitting'] }}>&nbsp;&nbsp;</div>&nbsp;Sitting</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: stationaryColor['Standing'] }}>&nbsp;&nbsp;</div>&nbsp;Standing</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: stationaryColor['Laying'] }}>&nbsp;&nbsp;</div>&nbsp;Swimming</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: stationaryColor['Squatting'] }}>&nbsp;&nbsp;</div>&nbsp;Squatting</div>
                </div>
            </div>
        )
    }

    // posture, age, gender, activity
    const stationaryBarCharts = (data) => {
        var standing = 0, laying = 0, squatting = 0, sitting = 0;
        var kid = 0, teen = 0, yAdult = 0, mAdult = 0, senior = 0;
        var male = 0, female = 0;
        var socializing = 0, waiting = 0, recreation = 0, eating = 0, solitary = 0;

        for (const obj of Object.values(data)) {
            if (obj.posture === 'Standing') {
                standing++;
            } else if (obj.posture === 'Laying') {
                laying++;
            } else if (obj.posture === 'Squatting') {
                squatting++;
            } else {
                sitting++;
            }

            if (obj.age === '0-14') {
                kid++;
            } else if (obj.age === '15-21') {
                teen++;
            } else if (obj.age === '22-30') {
                yAdult++;
            } else if (obj.age === '30-50') {
                mAdult++;
            } else {
                senior++;
            }

            if (obj.gender === 'Female') {
                female++;
            } else {
                male++;
            }

            if (obj.activity.includes('Socializing')) {
                socializing++;
            }
            if (obj.activity.includes('Waiting')) {
                waiting++;
            }
            if (obj.activity.includes('Recreation')) {
                recreation++;
            }
            if (obj.activity.includes('Eating')) {
                eating++;
            }
            if (obj.activity.includes('Solitary')) {
                solitary++;
            }
        };

        var posture = [{ posture: 'Sitting', count: sitting }, { posture: 'Standing', count: standing }, { posture: 'Laying', count: laying }, { posture: 'Squatting', count: squatting }];
        var age = [{ age: '0-14', count: kid }, { age: '15-21', count: teen }, { age: '22-30', count: yAdult }, { age: '30-50', count: mAdult }, { age: '50+', count: senior }];
        var gender = [{ gender: 'Male', count: male }, { gender: 'Female', count: female }];
        var activity = [{ activity: 'Socializing', count: socializing }, { activity: 'Waiting', count: waiting }, { activity: 'Recreation', count: recreation }, { activity: 'Eating', count: eating }, { activity: 'Solitary', count: solitary }];

        return (
            <div className='Charts'>
                <div style={{ fontSize: 'larger' }}>Posture</div>
                <BarChart width={width} height={height} data={posture}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='posture' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} >
                        {posture.map((entry, index) => (
                            <Cell key={`cell-${index}`} stroke={'#000000'} fill={stationaryColor[entry.posture]} fillOpacity={0.7} />
                        ))}
                    </Bar>
                </BarChart>
                <div style={{ fontSize: 'larger' }}>Age</div>
                <BarChart width={width} height={height} data={age}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='age' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill='#636262' fillOpacity={0.75} />
                </BarChart>
                <div style={{ fontSize: 'larger' }}>Gender</div>
                <BarChart width={width} height={height} data={gender}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='gender' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill='#636262' fillOpacity={0.75} />
                </BarChart>
                <div style={{ fontSize: 'larger' }}>Activity</div>
                <BarChart width={width} height={height} data={activity}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='activity' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill='#636262' fillOpacity={0.75} />
                </BarChart>
                <br />
                <div >
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: stationaryColor['Sitting'] }}>&nbsp;&nbsp;</div>&nbsp;Sitting</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: stationaryColor['Standing'] }}>&nbsp;&nbsp;</div>&nbsp;Standing</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: stationaryColor['Laying'] }}>&nbsp;&nbsp;</div>&nbsp;Swimming</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: stationaryColor['Squatting'] }}>&nbsp;&nbsp;</div>&nbsp;Squatting</div>
                </div>
            </div>
        );
    };

    const multiMoving = (data) => {
        var running = 0, walking = 0, swimming = 0, onwheels = 0, handicap = 0;

        for (const [dateTime, resultArr] of Object.entries(data)) {
            for (const index1 of resultArr) {
                for (const obj of index1) {
                    if (obj.mode === 'Walking') {
                        walking++;
                    } else if (obj.mode === 'Running') {
                        running++;
                    } else if (obj.mode === 'Swimming') {
                        swimming++;
                    } else if (obj.mode === 'Activity on Wheels') {
                        onwheels++;
                    } else if (obj.mode === 'Handicap Assisted Wheels') {
                        handicap++;
                    }
                }
            }
        }

        var mode = [{ mode: 'Walking', count: walking }, { mode: 'Running', count: running }, { mode: 'Swimming', count: swimming }, { mode: 'Activity on Wheels', count: onwheels }, { mode: 'Handicap Assisted Wheels', count: handicap }];
        return (
            <div className='Charts'>
                <BarChart width={width} height={height} data={mode}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='mode' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill='#636262'>
                        {mode.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={movingColor[entry.mode]} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
                <br />
                <div >
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: movingColor['Walking'] }}>&nbsp;&nbsp;</div>&nbsp;Walking</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: movingColor['Running'] }}>&nbsp;&nbsp;</div>&nbsp;Running</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: movingColor['Swimming'] }}>&nbsp;&nbsp;</div>&nbsp;Swimming</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: movingColor['Activity on Wheels'] }}>&nbsp;&nbsp;</div>&nbsp;Activity on Wheels</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: movingColor['Handicap Assisted Wheels'] }}>&nbsp;&nbsp;</div>&nbsp;Handicap Assisted Wheels</div>
                </div>
            </div>
        );
    }

    const movingBarChart = (data) => {
        var running = 0, walking = 0, swimming = 0, onwheels = 0, handicap = 0;

        for (const obj of Object.values(data)) {
            if (obj.mode === 'Walking') {
                walking++;
            } else if (obj.mode === 'Running') {
                running++;
            } else if (obj.mode === 'Swimming') {
                swimming++;
            } else if (obj.mode === 'Activity on Wheels') {
                onwheels++;
            } else if (obj.mode === 'Handicap Assisted Wheels') {
                handicap++;
            }
        }

        var mode = [{ mode: 'Walking', count: walking }, { mode: 'Running', count: running }, { mode: 'Swimming', count: swimming }, { mode: 'Activity on Wheels', count: onwheels }, { mode: 'Handicap Assisted Wheels', count: handicap }];
        return (
            <div className='Charts'>
                <BarChart width={width} height={height} data={mode}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='mode' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill='#636262'>
                        {mode.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={movingColor[entry.mode]} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
                <br />
                <div >
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: movingColor['Walking'] }}>&nbsp;&nbsp;</div>&nbsp;Walking</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: movingColor['Running'] }}>&nbsp;&nbsp;</div>&nbsp;Running</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: movingColor['Swimming'] }}>&nbsp;&nbsp;</div>&nbsp;Swimming</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: movingColor['Activity on Wheels'] }}>&nbsp;&nbsp;</div>&nbsp;Activity on Wheels</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: movingColor['Handicap Assisted Wheels'] }}>&nbsp;&nbsp;</div>&nbsp;Handicap Assisted Wheels</div>
                </div>
            </div>
        );
    }

    const multiLight = (data) => {
        var rhythmic = 0, building = 0, task = 0;

        for (const arr of Object.values(data)) {
            for (const arr1 of arr) {
                for (const obj of arr1) {
                    for (const point of obj.points) {
                        if (point.light_description === 'Rhythmic') {
                            rhythmic++;
                        } else if (point.light_description === 'Building') {
                            building++;
                        } else {
                            task++;
                        }
                    }
                }
            }
        }

        var lights = [{ type: 'Building', count: building }, { type: 'Rhythmic', count: rhythmic }, { type: 'Task', count: task }];

        return (
            <div className='Charts'>
                <BarChart width={width} height={height} data={lights}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='type' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill='#636262'>
                        {lights.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={lightColor[entry.type]} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
                <br />
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: lightColor['Building'] }}>&nbsp;&nbsp;</div>&nbsp; Building</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: lightColor['Rhythmic'] }}>&nbsp;&nbsp;</div>&nbsp; Rhythmic</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: lightColor['Task'] }}>&nbsp;&nbsp;</div>&nbsp; Task</div>
                </div>
            </div>
        );
    }

    const lightingCharts = (data) => {
        var rhythmic = 0, building = 0, task = 0;

        for (const lObj of Object.values(data)) {
            for (const point of lObj.points) {
                if (point.light_description === 'Rhythmic') {
                    rhythmic++;
                } else if (point.light_description === 'Building') {
                    building++;
                } else {
                    task++;
                }
            }
        }

        var lights = [{ type: 'Building', count: building }, { type: 'Rhythmic', count: rhythmic }, { type: 'Task', count: task }];
        return (
            <div className='Charts'>
                <BarChart width={width} height={height} data={lights}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='type' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill='#636262'>
                        {lights.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={lightColor[entry.type]} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
                <br />
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: lightColor['Building'] }}>&nbsp;&nbsp;</div>&nbsp; Building</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: lightColor['Rhythmic'] }}>&nbsp;&nbsp;</div>&nbsp; Rhythmic</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: lightColor['Task'] }}>&nbsp;&nbsp;</div>&nbsp; Task</div>
                </div>
            </div>
        )
    }

    const multiOrderCharts = (data) => {
        var behavior = 0, maintenance = 0;
        for (const arr of Object.values(data)) {
            for (const subarr of arr) {
                for (const terArr of subarr) {
                    for (const point of terArr.points) {
                        if (point.kind === 'Maintenance') {
                            maintenance++;
                        } else {
                            behavior++;
                        }
                    }
                }
            }
        }

        var order = [{ type: 'Maintenance', total: maintenance }, { type: 'Behavior', total: behavior }];
        return (
            <div className='Charts'>
                <BarChart width={width} height={height} data={order}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='type' />
                    <YAxis label={{ value: 'Total', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'total'} fill='#636262'>
                        {order.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={orderColor[entry.type]} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
                <br />
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: orderColor['Behavior'] }}>&nbsp;&nbsp;</div>&nbsp; Behavior</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: orderColor['Maintenance'] }}>&nbsp;&nbsp;</div>&nbsp; Maintenance</div>
                </div>
            </div>
        )
    }

    const orderCharts = (data) => {
        var behavior = 0, maintenance = 0;

        for (const obj of data) {
            for (const point of obj.points) {
                if (point.kind === 'Maintenance') {
                    maintenance++;
                } else {
                    behavior++;
                }
            }
        }

        var order = [{ type: 'Maintenance', count: maintenance }, { type: 'Behavior', count: behavior }];
        return (
            <div className='Charts'>
                <BarChart width={width} height={height} data={order}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='type' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill='#636262'>
                        {order.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={orderColor[entry.type]} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
                <br />
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: orderColor['Behavior'] }}>&nbsp;&nbsp;</div>&nbsp; Behavior</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: orderColor['Maintenance'] }}>&nbsp;&nbsp;</div>&nbsp; Maintenance</div>
                </div>
            </div>
        )
    }

    const multiBoundaryCharts = (data) => {
        var constructed = [];
        var shelter = 0;
        var material = 0;
        var ind = 0;

        var curbs = 0;
        var wall = 0;
        var partial = 0;
        var fences = 0;
        var planter = 0;

        var bricks = 0;
        var tile = 0;
        var concrete = 0;
        var grass = 0;
        var wood = 0;

        var canopy = 0;
        var trees = 0;
        var umbrella = 0;
        var temporary = 0;
        var ceiling = 0;

        for (const arr of Object.values(data)) {
            for (const ind0 in arr) {
                for (const index in arr[ind0]) {
                    if (arr[0][index].kind === 'Shelter') {
                        shelter += arr[0][index].value;
                        switch (arr[0][index].description) {
                            case 'Canopy':
                                canopy += arr[0][index].value;
                                break;
                            case 'Constructed Ceiling':
                                ceiling += arr[0][index].value;
                                break;
                            case 'Temporary':
                                temporary += arr[0][index].value;
                                break;
                            case 'Trees':
                                trees += arr[0][index].value;
                                break;
                            case 'Umbrella Dining':
                                umbrella += arr[0][index].value;
                                break;
                            default:
                                console.log('Non-matching description');
                                console.log(arr[0][index].description)
                        }
                        ind++;
                    } else if (arr[0][index].kind === 'Material') {
                        material += arr[0][index].value;
                        switch (arr[0][index].description) {
                            case 'Bricks':
                                bricks += arr[0][index].value;
                                break;
                            case 'Concrete':
                                concrete += arr[0][index].value;
                                break;
                            case 'Natural':
                                grass += arr[0][index].value;
                                break;
                            case 'Tile':
                                tile += arr[0][index].value;
                                break;
                            case 'Wood':
                                wood += arr[0][index].value;
                                break;
                            default:
                                console.log('Non-matching description');
                                console.log(arr[0][index].description)
                        }
                        ind++;
                    } else {
                        arr[0][index].instance = `Location ${ind + 1}`;
                        constructed.push(arr[0][index]);
                        switch (arr[0][index].description) {
                            case 'Curbs':
                                curbs += arr[0][index].value;
                                break;
                            case 'Fences':
                                fences += arr[0][index].value;
                                break;
                            case 'Building Wall':
                                wall += arr[0][index].value;
                                break;
                            case 'Partial Wall':
                                partial += arr[0][index].value;
                                break;
                            case 'Planter':
                                planter += arr[0][index].value;
                                break;
                            default:
                                console.log('Non-matching description');
                                console.log(arr[0][index].description)
                        }
                        ind++;
                    }
                };
            };
        };

        var totalPerc = [];
        totalPerc[0] = (shelter / projectArea) * 100;
        totalPerc[1] = Math.round(totalPerc[0]);
        totalPerc[2] = (material / projectArea) * 100;
        totalPerc[3] = Math.round(totalPerc[2]);
        totalPerc[4] = ((projectArea - (material + shelter)) / projectArea) * 100;
        totalPerc[5] = Math.round(totalPerc[4]);

        var array = [{ kind: 'Shelter', value: totalPerc[0] }, { kind: 'Material', value: totalPerc[2] }, { kind: 'Unmarked', value: totalPerc[4] }];
        var marked = [{ kind: 'Shelter', value: shelter }, { kind: 'Material', value: material }];
        var mat = [{ type: 'Bricks', area: bricks }, { type: 'Concrete', area: concrete }, { type: 'Natural', area: grass }, { type: 'Tile', area: tile }, { type: 'Wood', area: wood }];
        var shelt = [{ type: 'Canopy', area: canopy }, { type: 'Contructed Ceiling', area: ceiling }, { type: 'Temporary', area: temporary }, { type: 'Trees', area: trees }, { type: 'Umbrella Dining', area: umbrella }];
        var constr = [{ type: 'Curbs', area: curbs }, { type: 'Fences', area: fences }, { type: 'Building Wall', area: wall }, { type: 'Partial Wall', area: partial }, { type: 'Planter', area: planter }];

        return (
            <div className='Charts'>
                <div style={{ fontSize: 'larger' }}> Boundary Areas (ft<sup>2</sup>)</div>
                <PieChart width={width} height={height}>
                    <Pie data={marked} dataKey='value' nameKey='kind' cx='50%' cy='50%' outerRadius={50} fill='#00B68A' >
                        {marked.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={boundsColor[entry.kind]} stroke={'#000000'} fillOpacity={0.85} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div style={{ fontSize: 'larger' }}> Occupied Area (%)</div>
                <PieChart width={width} height={height}>
                    <Pie data={array} dataKey='value' nameKey='kind' cx='50%' cy='50%' outerRadius={50} fill='#00B68A' >
                        {array.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={boundsColor[entry.kind]} stroke={'#000000'} fillOpacity={0.85} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <br />
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Material'] }}>&nbsp;&nbsp;</div>&nbsp; Material (Horizontal): {totalPerc[2] < totalPerc[3] ? `<${totalPerc[3]}%` : (totalPerc[2] > totalPerc[3] ? `>${totalPerc[3]}%` : `${totalPerc[3]}%`)} </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Shelter'] }}>&nbsp;&nbsp;</div>&nbsp; Shelter (Horizontal): {totalPerc[0] < totalPerc[1] ? `<${totalPerc[1]}%` : (totalPerc[0] > totalPerc[1] ? `>${totalPerc[1]}%` : `${totalPerc[1]}%`)} </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Unmarked'] }}>&nbsp;&nbsp;</div>&nbsp; Unmarked: {totalPerc[4] < totalPerc[5] ? `<${totalPerc[5]}%` : (totalPerc[4] > totalPerc[5] ? `>${totalPerc[5]}%` : `${totalPerc[5]}%`)} </div>
                </div>
                &nbsp;
                <br />
                <div style={{ fontSize: 'larger' }}>Material Areas (ft<sup>2</sup>)</div>
                <PieChart width={width} height={height}>
                    <Pie data={mat} dataKey='area' nameKey='type' cx='50%' cy='50%' outerRadius={50} fill={boundsColor['Material']}>
                        {mat.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={boundsColor['Material']} stroke={'#000000'} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <br />
                <div style={{ fontSize: 'larger' }}>Shelter Areas (ft<sup>2</sup>)</div>
                <PieChart width={width} height={height}>
                    <Pie data={shelt} dataKey='area' nameKey='type' cx='50%' cy='50%' outerRadius={50} fill={boundsColor['Shelter']}>
                        {shelt.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={boundsColor['Shelter']} stroke={'#000000'} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <br />
                <div style={{ fontSize: 'larger' }}>Constructed Boundary Distances</div>
                <BarChart width={width} height={height} data={constructed}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='instance' />
                    <YAxis label={{ value: 'Distance (ft)', angle: -90, position: 'insideBottomLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'value'} fill={boundsColor['Constructed']} stroke={boundsColor['Constructed']} fillOpacity={0.65} />
                </BarChart>
                <br />
                <div style={{ fontSize: 'larger' }}>Constructed Distances - Types</div>
                <BarChart width={width} height={height} data={constr}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='type' />
                    <YAxis label={{ value: 'Distance (ft)', angle: -90, position: 'insideBottomLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'area'} fill={boundsColor['Constructed']} stroke={boundsColor['Constructed']} fillOpacity={0.65} />
                </BarChart>
                <br />
                <div >
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Material'] }}>&nbsp;&nbsp;</div>&nbsp;Material (Horizontal) </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Shelter'] }}>&nbsp;&nbsp;</div>&nbsp;Shelter (Horizontal) </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Constructed'] }}>&nbsp;&nbsp;</div>&nbsp;Constructed (Vertical) </div>
                </div>
            </div>
        );
    };

    const BoundaryPieChart = (data) => {
        var constructed = [];
        var shelter = 0;
        var material = 0;
        var horizontal = [];
        var ind = 0;

        var curbs = 0;
        var wall = 0;
        var partial = 0;
        var fences = 0;
        var planter = 0;

        var bricks = 0;
        var tile = 0;
        var concrete = 0;
        var grass = 0;
        var wood = 0;

        var canopy = 0;
        var trees = 0;
        var umbrella = 0;
        var temporary = 0;
        var ceiling = 0;

        for (const obj of Object.values(data)) {
            if (obj.kind === 'Shelter' || obj.kind === 'Material') {
                obj.instance = `Location ${ind + 1}`;
                horizontal.push(obj);
                if (obj.kind === 'Shelter') {
                    shelter += obj.value;
                    switch (obj.description) {
                        case 'Canopy':
                            canopy += obj.value;
                            break;
                        case 'Constructed Ceiling':
                            ceiling += obj.value;
                            break;
                        case 'Temporary':
                            temporary += obj.value;
                            break;
                        case 'Trees':
                            trees += obj.value;
                            break;
                        case 'Umbrella Dining':
                            umbrella += obj.value;
                            break;
                        default:
                            console.log('Non-matching description');
                            console.log(obj.description)
                    }
                } else {
                    material += obj.value;
                    switch (obj.description) {
                        case 'Bricks':
                            bricks += obj.value;
                            break;
                        case 'Concrete':
                            concrete += obj.value;
                            break;
                        case 'Natural':
                            grass += obj.value;
                            break;
                        case 'Tile':
                            tile += obj.value;
                            break;
                        case 'Wood':
                            wood += obj.value;
                            break;
                        default:
                            console.log('Non-matching description');
                            console.log(obj.description)
                    }
                }
                ind++;
            } else {
                obj.instance = `Location ${ind + 1}`;
                constructed.push(obj);
                switch (obj.description) {
                    case 'Curbs':
                        curbs += obj.value;
                        break;
                    case 'Fences':
                        fences += obj.value;
                        break;
                    case 'Building Wall':
                        wall += obj.value;
                        break;
                    case 'Partial Wall':
                        partial += obj.value;
                        break;
                    case 'Planter':
                        planter += obj.value;
                        break;
                    default:
                        console.log('Non-matching description');
                        console.log(obj.description)
                }
                ind++;
            }
        };

        var totalPerc = [];
        totalPerc[0] = (shelter / projectArea) * 100;
        totalPerc[1] = Math.round(totalPerc[0]);
        totalPerc[2] = (material / projectArea) * 100;
        totalPerc[3] = Math.round(totalPerc[2]);
        totalPerc[4] = ((projectArea - (material + shelter)) / projectArea) * 100;
        totalPerc[5] = Math.round(totalPerc[4]);

        var array = [{ kind: 'Shelter', value: totalPerc[0] }, { kind: 'Material', value: totalPerc[2] }, { kind: 'Unmarked', value: totalPerc[4] }];
        var mat = [{ type: 'Bricks', area: bricks }, { type: 'Concrete', area: concrete }, { type: 'Natural', area: grass }, { type: 'Tile', area: tile }, { type: 'Wood', area: wood }];
        var shelt = [{ type: 'Canopy', area: canopy }, { type: 'Contructed Ceiling', area: ceiling }, { type: 'Temporary', area: temporary }, { type: 'Trees', area: trees }, { type: 'Umbrella Dining', area: umbrella }];
        var constr = [{ type: 'Curbs', area: curbs }, { type: 'Fences', area: fences }, { type: 'Building Wall', area: wall }, { type: 'Partial Wall', area: partial }, { type: 'Planter', area: planter }];

        return (
            <div id='boundCharts' className='Charts'>
                <div style={{ fontSize: 'larger' }}>Boundary Areas (ft<sup>2</sup>)</div>
                <PieChart width={width} height={height}>
                    <Pie data={horizontal} dataKey='value' nameKey='kind' cx='50%' cy='50%' outerRadius={50} fill='#00B68A' >
                        {horizontal.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={boundsColor[entry.kind]} stroke={'#000000'} fillOpacity={0.85} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div style={{ fontSize: 'larger' }}> Occupied Area (%)</div>
                <PieChart width={width} height={height}>
                    <Pie data={array} dataKey='value' nameKey='kind' cx='50%' cy='50%' outerRadius={50} fill='#00B68A' >
                        {array.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={boundsColor[entry.kind]} stroke={'#000000'} fillOpacity={0.85} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <br />
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Material'] }}>&nbsp;&nbsp;</div>&nbsp; Material (Horizontal): {totalPerc[2] < totalPerc[3] ? `<${totalPerc[3]}%` : (totalPerc[2] > totalPerc[3] ? `>${totalPerc[3]}%` : `${totalPerc[3]}%`)} </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Shelter'] }}>&nbsp;&nbsp;</div>&nbsp; Shelter (Horizontal): {totalPerc[0] < totalPerc[1] ? `<${totalPerc[1]}%` : (totalPerc[0] > totalPerc[1] ? `>${totalPerc[1]}%` : `${totalPerc[1]}%`)} </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Unmarked'] }}>&nbsp;&nbsp;</div>&nbsp; Unmarked: {totalPerc[4] < totalPerc[5] ? `<${totalPerc[5]}%` : (totalPerc[4] > totalPerc[5] ? `>${totalPerc[5]}%` : `${totalPerc[5]}%`)} </div>
                </div>
                &nbsp;
                <br />
                <div style={{ fontSize: 'larger' }}>Material Areas (ft<sup>2</sup>)</div>
                <PieChart width={width} height={height}>
                    <Pie data={mat} dataKey='area' nameKey='type' cx='50%' cy='50%' outerRadius={50} fill={boundsColor['Material']} >
                        {mat.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={boundsColor['Material']} stroke={'#000000'} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <br />
                <div style={{ fontSize: 'larger' }}>Shelter Areas (ft<sup>2</sup>)</div>
                <PieChart width={width} height={height}>
                    <Pie data={shelt} dataKey='area' nameKey='type' cx='50%' cy='50%' outerRadius={50} fill={boundsColor['Shelter']}>
                        {shelt.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={boundsColor['Shelter']} stroke={'#000000'} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <br />
                <div style={{ fontSize: 'larger' }}>Constructed Boundary Distances</div>
                <BarChart width={width} height={height} data={constructed}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='instance' />
                    <YAxis label={{ value: 'Distance (ft)', angle: -90, position: 'insideBottomLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'value'} fill={boundsColor['Constructed']} stroke={boundsColor['Constructed']} fillOpacity={0.65} />
                </BarChart>
                <br />
                <div style={{ fontSize: 'larger' }}>Constructed Distances - Types</div>
                <BarChart width={width} height={height} data={constr}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='type' />
                    <YAxis label={{ value: 'Distance (ft)', angle: -90, position: 'insideBottomLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'area'} fill={boundsColor['Constructed']} stroke={boundsColor['Constructed']} fillOpacity={0.65} />
                </BarChart>
                <br />
                <div >
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Material'] }}>&nbsp;&nbsp;</div>&nbsp;Material (Horizontal) </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Shelter'] }}>&nbsp;&nbsp;</div>&nbsp;Shelter (Horizontal) </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Constructed'] }}>&nbsp;&nbsp;</div>&nbsp;Constructed (Vertical) </div>
                </div>
            </div>
        );
    };

    const multiNatureChart = (data) => {
        var waterAndVeg = [{ nature: 'Water', area: 0 }, { nature: 'Vegetation', area: 0 }];
        var domestic = 0;
        var wild = 0;
        var dogs = 0, cats = 0, otherD = 0;
        var otherW = 0;
        var ducks = 0;
        var turtles = 0;
        var rabbits = 0;
        var birds = 0;
        var squirrels = 0;
        var water = 0;
        var veg = 0;
        var lake = 0;
        var ocean = 0;
        var river = 0;
        var swamp = 0;
        var native = 0;
        var design = 0;
        var field = 0;

        for (const [dateTime, resultArr] of Object.entries(data)) {
            for (const index1 of resultArr) {
                for (const obj of index1) {
                    for (const [natureType, typeArr] of Object.entries(obj)) {
                        for (const typePoint in typeArr) {
                            if (natureType === 'water') {
                                waterAndVeg[0].area += typeArr[typePoint].area;
                                water += typeArr[typePoint].area;
                                switch (typeArr[typePoint].description) {
                                    case 'Lake':
                                        lake += typeArr[typePoint].area;
                                        break;
                                    case 'Ocean':
                                        ocean += typeArr[typePoint].area;
                                        break;
                                    case 'River':
                                        river += typeArr[typePoint].area;
                                        break;
                                    case 'Swamp':
                                        swamp += typeArr[typePoint].area;
                                        break;
                                    default:
                                        console.log('Non-matching description');
                                        console.log(typeArr[typePoint].description)
                                }
                            } else if (natureType === 'vegetation') {
                                waterAndVeg[1].area += typeArr[typePoint].area;
                                veg += typeArr[typePoint].area;
                                switch (typeArr[typePoint].description) {
                                    case 'Native':
                                        native += typeArr[typePoint].area;
                                        break;
                                    case 'Design':
                                        design += typeArr[typePoint].area;
                                        break;
                                    case 'Open Field':
                                        field += typeArr[typePoint].area;
                                        break;
                                    default:
                                        console.log('Non-matching description');
                                        console.log(typeArr[typePoint].description)
                                }
                            } else {
                                if (typeArr[typePoint].description === 'Dog') {
                                    dogs++;
                                } else if (typeArr[typePoint].description === 'Cat') {
                                    cats++;
                                } else if (typeArr[typePoint].description === 'Duck') {
                                    ducks++;
                                } else if (typeArr[typePoint].description === 'Turtle') {
                                    turtles++;
                                } else if (typeArr[typePoint].description === 'Rabbit') {
                                    rabbits++;
                                } else if (typeArr[typePoint].description === 'Bird') {
                                    birds++;
                                } else if (typeArr[typePoint].description === 'Squirrel') {
                                    squirrels++;
                                }

                                if (typeArr[typePoint].kind === 'Domesticated') {
                                    domestic++;
                                    if (typeArr[typePoint].description === 'Other') {
                                        otherD++;
                                    }
                                } else if (typeArr[typePoint].kind === 'Wild') {
                                    wild++;
                                    if (typeArr[typePoint].description === 'Other') {
                                        otherW++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        var totalPerc = [];
        totalPerc[0] = (water / projectArea) * 100;
        totalPerc[1] = Math.round(totalPerc[0]);
        totalPerc[2] = (veg / projectArea) * 100;
        totalPerc[3] = Math.round(totalPerc[2]);
        totalPerc[4] = ((projectArea - (water + veg)) / projectArea) * 100;
        totalPerc[5] = Math.round(totalPerc[4]);

        var totalArea = [{ nature: 'Water', area: totalPerc[0] }, { nature: 'Vegetation', area: totalPerc[2] }, { nature: 'None', area: totalPerc[4] }];
        var species = [{ species: 'Domestic Dogs', total: dogs }, { species: 'Domestic Cats', total: cats }, { species: 'Wild Birds', total: birds }, { species: 'Wild Ducks', total: ducks }, { species: 'Wild Rabbits', total: rabbits }, { species: 'Wild Squirrels', total: squirrels }, { species: 'Wild Turtles', total: turtles }, { species: 'Domestic (Other)', total: otherD }, { species: 'Wild (Other)', total: otherW }];
        var variant = [{ variant: 'Wild', total: (wild + otherW) }, { variant: 'Domesticated', total: (domestic + otherD) }]
        var h2o = [{ type: 'Lake', area: lake }, { type: 'Ocean', area: ocean }, { type: 'River', area: river }, { type: 'Swamp', area: swamp }];
        var vege = [{ type: 'Native', area: native }, { type: 'Design', area: design }, { type: 'Field', area: field }];

        return (
            <div id='natureCharts' className='Charts'>
                <div style={{ fontSize: 'larger' }}> Vegetation and Water Areas(ft<sup>2</sup>)</div>
                <PieChart width={width} height={height}>
                    <Pie data={waterAndVeg} dataKey='area' nameKey='nature' cx='50%' cy='50%' outerRadius={50} fill='#00B68A' >
                        {waterAndVeg.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={natureColor[entry.nature]} stroke={'#000000'} fillOpacity={0.65} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div >
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: natureColor['Vegetation'] }}>&nbsp;&nbsp;</div>&nbsp; Vegetation </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: natureColor['Water'] }}>&nbsp;&nbsp;</div>&nbsp; Water</div>
                </div>
                <br />
                <div style={{ fontSize: 'larger' }}>Occupied Area (%)</div>
                <PieChart width={width} height={height}>
                    <Pie data={totalArea} dataKey='area' nameKey='nature' cx='50%' cy='50%' outerRadius={50} fill='#00B68A' >
                        {totalArea.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={natureColor[entry.nature]} stroke={'#000000'} fillOpacity={0.65} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div >
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: natureColor['Vegetation'] }}>&nbsp;&nbsp;</div>&nbsp; Vegetation: {totalPerc[2] < totalPerc[3] ? `<${totalPerc[3]}%` : `${totalPerc[3]}%`}</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: natureColor['Water'] }}>&nbsp;&nbsp;</div>&nbsp; Water: {totalPerc[0] < totalPerc[1] ? `<${totalPerc[1]}%` : `${totalPerc[1]}%`}</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Unmarked'] }}>&nbsp;&nbsp;</div>&nbsp; None: {totalPerc[4] < totalPerc[5] ? `<${totalPerc[5]}%` : (totalPerc[4] > totalPerc[5] ? `>${totalPerc[5]}%` : `${totalPerc[5]}%`)} </div>
                </div>
                &nbsp;
                <br />
                <div style={{ fontSize: 'larger' }}> Vegetation Areas (ft<sup>2</sup>)</div>
                <PieChart width={width} height={height}>
                    <Pie data={vege} dataKey='area' nameKey='type' cx='50%' cy='50%' outerRadius={50} fill='#00B68A' >
                        {vege.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={natureColor['Vegetation']} stroke={'#000000'} fillOpacity={0.65} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <br />
                <div style={{ fontSize: 'larger' }}> Water Areas (ft<sup>2</sup>)</div>
                <PieChart width={width} height={height}>
                    <Pie data={h2o} dataKey='area' nameKey='type' cx='50%' cy='50%' outerRadius={50} fill='#00B68A' >
                        {h2o.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={natureColor['Water']} stroke={'#000000'} fillOpacity={0.65} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <br />
                <div style={{ fontSize: 'larger' }}>Species</div>
                <BarChart width={width} height={height} data={species}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='species' />
                    <YAxis label={{ value: 'Total', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'total'} fill={natureColor['Animals']} stroke={natureColor['Animals']} fillOpacity={0.65} />
                </BarChart>
                <div style={{ fontSize: 'larger' }}>Wild vs Domesticated</div>
                <BarChart width={width} height={height} data={variant}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='variant' />
                    <YAxis label={{ value: 'Total', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'total'} fill={natureColor['Animals']} stroke={natureColor['Animals']} fillOpacity={0.65} />
                </BarChart>
                <br />
                <div >
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: natureColor['Animals'] }}>&nbsp;&nbsp;</div>&nbsp; Animals </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: natureColor['Vegetation'] }}>&nbsp;&nbsp;</div>&nbsp; Vegetation </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: natureColor['Water'] }}>&nbsp;&nbsp;</div>&nbsp; Water </div>
                </div>
            </div>
        );
    }

    const NaturePieChart = (data) => {
        var waterAndVeg = [];
        var domestic = 0;
        var wild = 0;
        var dogs = 0;
        var cats = 0;
        var otherD = 0;
        var otherW = 0;
        var ducks = 0;
        var turtles = 0;
        var rabbits = 0;
        var birds = 0;
        var squirrels = 0;
        var water = 0;
        var veg = 0;
        var lake = 0;
        var ocean = 0;
        var river = 0;
        var swamp = 0;
        var native = 0;
        var design = 0;
        var field = 0;

        for (const ind in data) {
            for (const [natureType, typeArr] of Object.entries(data[ind])) {
                var adjusted;
                for (const typePoint in typeArr) {
                    if (natureType === 'water') {
                        adjusted = typeArr[typePoint];
                        adjusted.nature = 'Water';
                        waterAndVeg.push(adjusted);
                        water += typeArr[typePoint].area;
                        switch (typeArr[typePoint].description) {
                            case 'Lake':
                                lake += typeArr[typePoint].area;
                                break;
                            case 'Ocean':
                                ocean += typeArr[typePoint].area;
                                break;
                            case 'River':
                                river += typeArr[typePoint].area;
                                break;
                            case 'Swamp':
                                swamp += typeArr[typePoint].area;
                                break;
                            default:
                                console.log('Non-matching description');
                                console.log(typeArr[typePoint].description)
                        }
                    } else if (natureType === 'vegetation') {
                        adjusted = typeArr[typePoint];
                        adjusted.nature = 'Vegetation';
                        waterAndVeg.push(adjusted);
                        veg += typeArr[typePoint].area;
                        switch (typeArr[typePoint].description) {
                            case 'Native':
                                native += typeArr[typePoint].area;
                                break;
                            case 'Design':
                                design += typeArr[typePoint].area;
                                break;
                            case 'Open Field':
                                field += typeArr[typePoint].area;
                                break;
                            default:
                                console.log('Non-matching description');
                                console.log(typeArr[typePoint].description)
                        }
                    } else {
                        if (typeArr[typePoint].description === 'Dog') {
                            dogs++;
                        } else if (typeArr[typePoint].description === 'Cat') {
                            cats++;
                        } else if (typeArr[typePoint].description === 'Duck') {
                            ducks++;
                        } else if (typeArr[typePoint].description === 'Turtle') {
                            turtles++;
                        } else if (typeArr[typePoint].description === 'Rabbit') {
                            rabbits++;
                        } else if (typeArr[typePoint].description === 'Bird') {
                            birds++;
                        } else if (typeArr[typePoint].description === 'Squirrel') {
                            squirrels++;
                        }

                        if (typeArr[typePoint].kind === 'Domesticated') {
                            domestic++;
                            if (typeArr[typePoint].description === 'Other') {
                                otherD++;
                            }
                        } else if (typeArr[typePoint].kind === 'Wild') {
                            wild++;
                            if (typeArr[typePoint].description === 'Other') {
                                otherW++;
                            }
                        }
                    }
                }
            }
        }
        var totalPerc = [];
        totalPerc[0] = (water / projectArea) * 100;
        totalPerc[1] = Math.round(totalPerc[0]);
        totalPerc[2] = (veg / projectArea) * 100;
        totalPerc[3] = Math.round(totalPerc[2]);
        totalPerc[4] = ((projectArea - (water + veg)) / projectArea) * 100;
        totalPerc[5] = Math.round(totalPerc[4]);

        var totalArea = [{ nature: 'Water', area: totalPerc[0] }, { nature: 'Vegetation', area: totalPerc[2] }, { nature: 'None', area: totalPerc[4] }];
        var species = [{ species: 'Domestic Dogs', count: dogs }, { species: 'Domestic Cats', count: cats }, { species: 'Wild Birds', count: birds }, { species: 'Wild Ducks', count: ducks }, { species: 'Wild Rabbits', count: rabbits }, { species: 'Wild Squirrels', count: squirrels }, { species: 'Wild Turtles', count: turtles }, { species: 'Domestic (Other)', count: otherD }, { species: 'Wild (Other)', count: otherW }];
        var variant = [{ variant: 'Wild', count: (wild + otherW) }, { variant: 'Domesticated', count: (domestic + otherD) }];
        var h2o = [{ type: 'Lake', area: lake }, { type: 'Ocean', area: ocean }, { type: 'River', area: river }, { type: 'Swamp', area: swamp }];
        var vege = [{ type: 'Native', area: native }, { type: 'Design', area: design }, { type: 'Field', area: field }];

        return (
            <div id='natureCharts' className='Charts'>
                <div style={{ fontSize: 'larger' }}>Vegetation and Water (ft<sup>2</sup>)</div>
                <PieChart width={width} height={height}>
                    <Pie data={waterAndVeg} dataKey='area' nameKey='description' cx='50%' cy='50%' outerRadius={50} fill='#00B68A' >
                        {waterAndVeg.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={natureColor[entry.nature]} stroke={'#000000'} fillOpacity={0.65} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div style={{ fontSize: 'larger' }}>Occupied Area (%)</div>
                <PieChart width={width} height={height}>
                    <Pie data={totalArea} dataKey='area' nameKey='nature' cx='50%' cy='50%' outerRadius={50} fill='#00B68A' >
                        {totalArea.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={natureColor[entry.nature]} stroke={'#000000'} fillOpacity={0.65} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div >
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: natureColor['Vegetation'] }}>&nbsp;&nbsp;</div>&nbsp; Vegetation: {totalPerc[2] < totalPerc[3] ? `<${totalPerc[3]}%` : `${totalPerc[3]}%`}</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: natureColor['Water'] }}>&nbsp;&nbsp;</div>&nbsp; Water: {totalPerc[0] < totalPerc[1] ? `<${totalPerc[1]}%` : `${totalPerc[1]}%`}</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: boundsColor['Unmarked'] }}>&nbsp;&nbsp;</div>&nbsp; None: {totalPerc[4] < totalPerc[5] ? `<${totalPerc[5]}%` : (totalPerc[4] > totalPerc[5] ? `>${totalPerc[5]}%` : `${totalPerc[5]}%`)} </div>
                </div>
                &nbsp;
                <br />
                <div style={{ fontSize: 'larger' }}> Vegetation Areas (ft<sup>2</sup>)</div>
                <PieChart width={width} height={height}>
                    <Pie data={vege} dataKey='area' nameKey='type' cx='50%' cy='50%' outerRadius={50} fill='#00B68A' >
                        {vege.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={natureColor['Vegetation']} stroke={'#000000'} fillOpacity={0.65} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <br />
                <div style={{ fontSize: 'larger' }}> Water Areas (ft<sup>2</sup>)</div>
                <PieChart width={width} height={height}>
                    <Pie data={h2o} dataKey='area' nameKey='type' cx='50%' cy='50%' outerRadius={50} fill='#00B68A' >
                        {h2o.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={natureColor['Water']} stroke={'#000000'} fillOpacity={0.65} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <br />
                <div style={{ fontSize: 'larger' }}>Species</div>
                <BarChart width={width} height={height} data={species}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='species' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill={natureColor['Animals']} stroke={natureColor['Animals']} fillOpacity={0.65} />
                </BarChart>
                <div style={{ fontSize: 'larger' }}>Wild vs Domesticated</div>
                <BarChart width={width} height={height} data={variant}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='variant' />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'count'} fill={natureColor['Animals']} stroke={natureColor['Animals']} fillOpacity={0.65} />
                </BarChart>
                <br />
                <div >
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: natureColor['Animals'] }}>&nbsp;&nbsp;</div>&nbsp; Animals </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: natureColor['Vegetation'] }}>&nbsp;&nbsp;</div>&nbsp; Vegetation </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ backgroundColor: natureColor['Water'] }}>&nbsp;&nbsp;</div>&nbsp; Water </div>
                </div>
            </div>
        );
    };

    const multiAccessCharts = (data) => {

        if(data.length === 0) 
            return(
                <Typography style={{textAlign: "center", justifyContent: "center"}} >No Test Data</Typography>
            )

        data = Object.values(data);
        // Access Type
        var accessPoint = 0;
        var accessPath = 0;
        var accessArea = 0;
        var accessSum = 0;

        // Access Point Description
        var rideShare = 0;
        var bikeRack = 0;
        var publicStop = 0;
        var valet = 0;
        var scooter = 0;

        // Access Path Description
        var sidewalk = 0;
        var sideStreet = 0;
        var mainRoad = 0;

        // Access Area Description
        var lot = 0;
        var garage = 0;

        // Access Distance
        //How can we chart distance?

        // Access Area Percentage
        var lotArea = 0;
        var garageArea = 0;

        // Access Difficulties
        var difficulties = [0, 0, 0, 0, 0];

        // Access Type Average Difficulty
        var accessPointDiff = 0;
        var accessPathDiff = 0;
        var accessAreaDiff = 0;
        var accessSumDiff = 0;

        // Access Point Average Difficulty
        var rideShareDiff = 0;
        var bikeRackDiff = 0;
        var publicStopDiff = 0;
        var valetDiff = 0;
        var scooterDiff = 0;

        // Access Path Average Difficulty
        var sidewalkDiff = 0;
        var sideStreetDiff = 0;
        var mainRoadDiff = 0;

        // Access Area Average Difficulty
        var lotDiff = 0;
        var garageDiff = 0;

        // Internal Access Path Length
        var sidewalkLen = 0;
        var sideStreetLen = 0;
        var mainRoadLen = 0;

        data.map((inst) => {

            inst = inst[0]

            console.log("🚀 ~ file: Charts.js:1555 ~ data.map ~ inst:", inst);

            //Package results
            return inst.map((obj) => {
                //Calculate Overall Difficulty Rating
                accessSumDiff += parseInt(obj.details.diffRating);
                difficulties[obj.details.diffRating]++;
                // console.log("🚀 ~ file: Charts.js:1555 ~ data.map ~ obj:", obj);
    
                if (obj.accessType === 'Access Point') {
                    accessPoint++;
                    accessSum++;
                    switch (obj.description) {
                        case 'Ride Share Drop Off':
                            rideShare++;
                            rideShareDiff += parseInt(obj.details.diffRating);
                            accessPointDiff += parseInt(obj.details.diffRating);
                            break;
                        case 'Bike Rack':
                            bikeRack++;
                            bikeRackDiff += parseInt(obj.details.diffRating);
                            accessPointDiff += parseInt(obj.details.diffRating);
                            break;
                        case 'Public Transport Stop':
                            publicStop++;
                            publicStopDiff += parseInt(obj.details.diffRating);
                            accessPointDiff += parseInt(obj.details.diffRating);
                            break;
                        case 'Valet Counter':
                            valet++;
                            valetDiff += parseInt(obj.details.diffRating);
                            accessPointDiff += parseInt(obj.details.diffRating);
                            break;
                        case 'E-scooter Parking':
                            scooter++;
                            scooterDiff += parseInt(obj.details.diffRating);
                            accessPointDiff += parseInt(obj.details.diffRating);
                            break;
                        default:
                            console.log('Non-matching description');
                            console.log(obj.description)
                    }
                } else if (obj.accessType === 'Access Path') {
                    accessPath++;
                    accessSum++;
                    switch (obj.description) {
                        case 'Sidewalk':
                            sidewalk++;
                            sidewalkDiff += parseInt(obj.details.diffRating);
                            accessPathDiff += parseInt(obj.details.diffRating);
                            if(obj.details)
                            sidewalkLen += parseFloat(obj.area);
                            break;
                        case 'Side Street':
                            sideStreet++;
                            sideStreetDiff += parseInt(obj.details.diffRating);
                            accessPathDiff += parseInt(obj.details.diffRating);
                            sideStreetLen += parseFloat(obj.area);
                            break;
                        case 'Main Road':
                            mainRoad++;
                            mainRoadDiff += parseInt(obj.details.diffRating);
                            accessPathDiff += parseInt(obj.details.diffRating);
                            mainRoadLen += parseFloat(obj.area);
                            break;
                        default:
                            console.log('Non-matching description');
                            console.log(obj.description)
                    }
                } else {
                    accessArea++;
                    accessSum++;
                    // obj.instance = `Location ${ind+1}`;
                    // constructed.push(obj);
                    switch (obj.description) {
                        case 'Parking Lot':
                            lot++;
                            lotArea += obj.area;
                            lotDiff += parseInt(obj.details.diffRating);
                            accessAreaDiff += parseInt(obj.details.diffRating);
                            break;
                        case 'Parking Garage':
                            garage++;
                            garageArea += obj.area;
                            garageDiff += parseInt(obj.details.diffRating);
                            accessAreaDiff += parseInt(obj.details.diffRating);
                            break;
                        default:
                            console.log('Non-matching description');
                            console.log(obj.description)
                    }
                }
            });
        });

        // 0 - access types count 
        var accessTypeArr = [
            { accessType: 'Access Point', value: accessPoint },
            { accessType: 'Access Path', value: accessPath },
            { accessType: 'Access Area', value: accessArea }
        ];

        // 1 - access point count descriptions
        var accessPointDescArr = [
            { description: 'Ride Share Drop Off', value: rideShare },
            { description: 'Bike Rack', value: bikeRack },
            { description: 'Public Transport Stop', value: publicStop },
            { description: 'Valet Counter', value: valet },
            { description: 'E-scooter Parking', value: scooter }
        ];

        // 2 - access path count descriptions
        var accessPathDescArr = [
            { description: 'Sidewalk', value: sidewalk },
            { description: 'Side Street', value: sideStreet },
            { description: 'Main Road', value: mainRoad }
        ];

        // 3 - access area count descriptions
        var accessAreaDescArr = [
            { description: 'Parking Lot', value: lot },
            { description: 'Parking Garage', value: garage }
        ];

        // 4 - access difficulty
        var accessDiff = [
            { description: 'Difficulty 1', value: difficulties[0] },
            { description: 'Difficulty 2', value: difficulties[1] },
            { description: 'Difficulty 3', value: difficulties[2] },
            { description: 'Difficulty 4', value: difficulties[3] },
            { description: 'Difficulty 5', value: difficulties[4] },
        ];

        // 5 - access path length
        var accessPathDescLenArr = [
            { description: 'Sidewalk', value: parseFloat(sidewalkLen.toFixed(1)), key: "Length" },
            { description: 'Side Street', value: parseFloat(sideStreetLen.toFixed(1)), key: "Length" },
            { description: 'Main Road', value: parseFloat(mainRoadLen.toFixed(1)), key: "Length" }
        ];

        //add new results here
        const packagedData = [
            accessPointDescArr, accessPathDescArr, accessAreaDescArr, 
            accessDiff, accessPathDescLenArr]

        console.log("🚀 ~ file: Charts.js:2000 ~ accessCharts ~ packagedData:", packagedData);

        // [ labelHeight + 200, labelHeight]
        const chartHeight = [
            [345, 145], [280, 80], [310, 110], [290, 90], 
            [275, 75],
        ]

        const sums = [
            accessPoint, accessPath, accessArea, 
            accessDiff, null]

        //console.log("🚀 ~ file: Charts.js:2008 ~ accessCharts ~ sums:", sums);

        const titles = [
            "Access Point Types", "Access Path Types", "Access Area Types",
            "Access Difficulty", "Access Path Length"
        ]

        return (
            <div className='Charts' style={{ paddingBottom: 50 }}>
                <div style={{ fontSize: 'larger' }}> Access Types </div>
                <PieChart width={width} height={height}>
                    <Pie data={accessTypeArr.filter(obj => obj.value !== 0)} dataKey='value' nameKey='accessType' cx='50%' cy='50%' outerRadius={100} fill="#256eff" >
                        {accessTypeArr.filter(obj => obj.value !== 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={accessColor[index]} stroke={'#000000'} fillOpacity={0.85} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>} />
                </PieChart>
                <div>
                    {accessTypeArr.map((entry, index) => {
                        if(entry.value > 0)
                        return (
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ backgroundColor: accessColor[index] }}>&nbsp;&nbsp;</div>
                                &nbsp;{entry.accessType}: {(entry.value / accessSum * 100).toFixed(1)}%
                            </div>
                        );
                    })}
                </div>
                <br />
                <BarChart style={{ paddingBottom: 'auto' }} width={width} height={chartHeight[2][0]} data={accessTypeArr.filter(obj => obj.value !== 0)}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis height={chartHeight[2][1]} interval={0} angle={-60} textAnchor="end" dataKey='accessType' />
                    <YAxis dy={1} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip/>} />
                    <Bar dataKey={'value'} fill='#636262'>
                        {accessTypeArr.filter(obj => obj.value !== 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={accessColor[index]} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>

                {packagedData.map((results, index) => {
                    let yLabel = index === 3 ? "Rating" : (index === 4 ? "Length" : "Count");

                    console.log("🚀 ~ file: Charts.js:1935 ~ {packagedData.map ~ results:", results);
                    return (
                        <div className='Charts'>
                            <div style={{ fontSize: 'larger', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {titles[index]} </div>
                            {index > 2 ? <br/> : null}
                            {/* Hide Pie chart for difficulties and length */}
                            {index < 3 ?
                                <PieChart width={width} height={height}>
                                    <Pie data={results.filter(obj => obj.value !== 0)} dataKey='value' nameKey='description' cx='50%' cy='50%' outerRadius={100} fill="#256eff" >
                                        {results.filter(obj => obj.value !== 0).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={accessColor[index]} stroke={'#000000'} fillOpacity={0.85} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip/>} />
                                </PieChart> : null}
                            <div>
                                {/* Show Default Legend for 3 access types */}
                                {index < 3 ?
                                    results.filter(obj => obj.value !== 0).map((entry, i) => {
                                        if(entry.value > 0)
                                        return (
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <div style={{ backgroundColor: accessColor[i] }}>&nbsp;&nbsp;</div>
                                                &nbsp;{entry.description}: {(entry.value / sums[index] * 100).toFixed(1)}%
                                            </div>
                                        );
                                    })
                                    :
                                    (index === 3 ?
                                        // on index 3 show access difficulties
                                        results.filter(obj => obj.value !== 0).map((entry, i) => {
                                            if(entry.value > 0)
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                    <div style={{ backgroundColor: accessColor[i] }}>&nbsp;&nbsp;</div>
                                                    &nbsp;{entry.description}: {entry.value}
                                                </div>
                                            );
                                        })
                                        :
                                        // on index 4 show length for access path descriptions
                                        results.filter(obj => obj.value !== 0).map((entry, i) => {
                                            if(entry.value > 0)
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                    <div style={{ backgroundColor: accessColor[i] }}>&nbsp;&nbsp;</div>
                                                    &nbsp;{entry.description}: {entry.value}ft
                                                </div>
                                            );
                                        })
                                    )                                    
                                }
                            </div>
                            <br />
                            {/* Set Bar chart parameters */}
                            {true ?
                                // Default Bar Chart
                                <BarChart style={{ paddingBottom: 'auto' }} width={width} height={chartHeight[index][0]} data={results.filter(obj => obj.value !== 0)}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis height={chartHeight[index][1]} interval={0} angle={-60} textAnchor="end" dataKey='description' />
                                    <YAxis dy={1} label={{ textAnchor: "center", value: `${yLabel}`, angle: -90, position: 'insideLeft' }} />
                                    <Tooltip content={<CustomTooltip/>} />
                                    <Bar dataKey={'value'} fill='#636262'>
                                        {results.filter(obj => obj.value !== 0).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={accessColor[index]} fillOpacity={0.8} />
                                        ))}
                                    </Bar>
                                </BarChart>
                                :
                                null}
                            <br/>
                        </div>
                    )
                })}
            </div>
        );
    };

    const accessCharts = (data) => {

        if(data.length === 0) 
            return(
                <Typography style={{textAlign: "center", justifyContent: "center"}} >No Test Data</Typography>
            )

        // Access Type
        var accessPoint = 0;
        var accessPath = 0;
        var accessArea = 0;
        var accessSum = 0;

        // Access Point Description
        var rideShare = 0;
        var bikeRack = 0;
        var publicStop = 0;
        var valet = 0;
        var scooter = 0;

        // Access Path Description
        var sidewalk = 0;
        var sideStreet = 0;
        var mainRoad = 0;

        // Access Area Description
        var lot = 0;
        var garage = 0;

        // Access Distance
        //How can we chart distance?

        // Access Area Percentage
        var lotArea = 0;
        var garageArea = 0;

        // Access Difficulties
        var difficulties = [0, 0, 0, 0, 0];

        // Access Type Average Difficulty
        var accessPointDiff = 0;
        var accessPathDiff = 0;
        var accessAreaDiff = 0;
        var accessSumDiff = 0;

        // Access Point Average Difficulty
        var rideShareDiff = 0;
        var bikeRackDiff = 0;
        var publicStopDiff = 0;
        var valetDiff = 0;
        var scooterDiff = 0;

        // Access Path Average Difficulty
        var sidewalkDiff = 0;
        var sideStreetDiff = 0;
        var mainRoadDiff = 0;

        // Access Area Average Difficulty
        var lotDiff = 0;
        var garageDiff = 0;

        // Internal Access Path Length
        var sidewalkLen = 0;
        var sideStreetLen = 0;
        var mainRoadLen = 0;



        //Package results
        data.map((obj) => {
            //Calculate Overall Difficulty Rating
            accessSumDiff += parseInt(obj.details.diffRating);
            difficulties[obj.details.diffRating]++;
            // console.log("🚀 ~ file: Charts.js:1555 ~ data.map ~ obj:", obj);

            if (obj.accessType === 'Access Point') {
                accessPoint++;
                accessSum++;
                switch (obj.description) {
                    case 'Ride Share Drop Off':
                        rideShare++;
                        rideShareDiff += parseInt(obj.details.diffRating);
                        accessPointDiff += parseInt(obj.details.diffRating);
                        break;
                    case 'Bike Rack':
                        bikeRack++;
                        bikeRackDiff += parseInt(obj.details.diffRating);
                        accessPointDiff += parseInt(obj.details.diffRating);
                        break;
                    case 'Public Transport Stop':
                        publicStop++;
                        publicStopDiff += parseInt(obj.details.diffRating);
                        accessPointDiff += parseInt(obj.details.diffRating);
                        break;
                    case 'Valet Counter':
                        valet++;
                        valetDiff += parseInt(obj.details.diffRating);
                        accessPointDiff += parseInt(obj.details.diffRating);
                        break;
                    case 'E-scooter Parking':
                        scooter++;
                        scooterDiff += parseInt(obj.details.diffRating);
                        accessPointDiff += parseInt(obj.details.diffRating);
                        break;
                    default:
                        console.log('Non-matching description');
                        console.log(obj.description)
                }
            } else if (obj.accessType === 'Access Path') {
                accessPath++;
                accessSum++;
                switch (obj.description) {
                    case 'Sidewalk':
                        sidewalk++;
                        sidewalkDiff += parseInt(obj.details.diffRating);
                        accessPathDiff += parseInt(obj.details.diffRating);
                        if(obj.details)
                        sidewalkLen += parseFloat(obj.area);
                        break;
                    case 'Side Street':
                        sideStreet++;
                        sideStreetDiff += parseInt(obj.details.diffRating);
                        accessPathDiff += parseInt(obj.details.diffRating);
                        sideStreetLen += parseFloat(obj.area);
                        break;
                    case 'Main Road':
                        mainRoad++;
                        mainRoadDiff += parseInt(obj.details.diffRating);
                        accessPathDiff += parseInt(obj.details.diffRating);
                        mainRoadLen += parseFloat(obj.area);
                        break;
                    default:
                        console.log('Non-matching description');
                        console.log(obj.description)
                }
            } else {
                accessArea++;
                accessSum++;
                // obj.instance = `Location ${ind+1}`;
                // constructed.push(obj);
                switch (obj.description) {
                    case 'Parking Lot':
                        lot++;
                        lotArea += obj.area;
                        lotDiff += parseInt(obj.details.diffRating);
                        accessAreaDiff += parseInt(obj.details.diffRating);
                        break;
                    case 'Parking Garage':
                        garage++;
                        garageArea += obj.area;
                        garageDiff += parseInt(obj.details.diffRating);
                        accessAreaDiff += parseInt(obj.details.diffRating);
                        break;
                    default:
                        console.log('Non-matching description');
                        console.log(obj.description)
                }
            }
        });

        // 0 - access types count 
        var accessTypeArr = [
            { accessType: 'Access Point', value: accessPoint },
            { accessType: 'Access Path', value: accessPath },
            { accessType: 'Access Area', value: accessArea }
        ];

        // 1 - access point count descriptions
        var accessPointDescArr = [
            { description: 'Ride Share Drop Off', value: rideShare },
            { description: 'Bike Rack', value: bikeRack },
            { description: 'Public Transport Stop', value: publicStop },
            { description: 'Valet Counter', value: valet },
            { description: 'E-scooter Parking', value: scooter }
        ];

        // 2 - access path count descriptions
        var accessPathDescArr = [
            { description: 'Sidewalk', value: sidewalk },
            { description: 'Side Street', value: sideStreet },
            { description: 'Main Road', value: mainRoad }
        ];

        // 3 - access area count descriptions
        var accessAreaDescArr = [
            { description: 'Parking Lot', value: lot },
            { description: 'Parking Garage', value: garage }
        ];

        // 4 - access difficulty
        var accessDiff = [
            { description: 'Difficulty 1', value: difficulties[0] },
            { description: 'Difficulty 2', value: difficulties[1] },
            { description: 'Difficulty 3', value: difficulties[2] },
            { description: 'Difficulty 4', value: difficulties[3] },
            { description: 'Difficulty 5', value: difficulties[4] },
        ];

        // 5 - access path length
        var accessPathDescLenArr = [
            { description: 'Sidewalk', value: parseFloat(sidewalkLen.toFixed(1)), key: "Length" },
            { description: 'Side Street', value: parseFloat(sideStreetLen.toFixed(1)), key: "Length" },
            { description: 'Main Road', value: parseFloat(mainRoadLen.toFixed(1)), key: "Length" }
        ];

        //add new results here
        const packagedData = [
            accessPointDescArr, accessPathDescArr, accessAreaDescArr, 
            accessDiff, accessPathDescLenArr]

        console.log("🚀 ~ file: Charts.js:2000 ~ accessCharts ~ packagedData:", packagedData);

        // [ labelHeight + 200, labelHeight]
        const chartHeight = [
            [345, 145], [280, 80], [310, 110], [290, 90], 
            [275, 75],
        ]

        const sums = [
            accessPoint, accessPath, accessArea, 
            accessDiff, null]

        //console.log("🚀 ~ file: Charts.js:2008 ~ accessCharts ~ sums:", sums);

        const titles = [
            "Access Point Types", "Access Path Types", "Access Area Types",
            "Access Difficulty", "Access Path Length"
        ]

        return (
            <div className='Charts' style={{ paddingBottom: 50 }}>
                <div style={{ fontSize: 'larger' }}> Access Types </div>
                <PieChart width={width} height={height}>
                    <Pie data={accessTypeArr.filter(obj => obj.value !== 0)} dataKey='value' nameKey='accessType' cx='50%' cy='50%' outerRadius={100} fill="#256eff" >
                        {accessTypeArr.filter(obj => obj.value !== 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={accessColor[index]} stroke={'#000000'} fillOpacity={0.85} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>} />
                </PieChart>
                <div>
                    {accessTypeArr.map((entry, index) => {
                        if(entry.value > 0)
                        return (
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ backgroundColor: accessColor[index] }}>&nbsp;&nbsp;</div>
                                &nbsp;{entry.accessType}: {(entry.value / accessSum * 100).toFixed(1)}%
                            </div>
                        );
                    })}
                </div>
                <br />
                <BarChart style={{ paddingBottom: 'auto' }} width={width} height={chartHeight[2][0]} data={accessTypeArr.filter(obj => obj.value !== 0)}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis height={chartHeight[2][1]} interval={0} angle={-60} textAnchor="end" dataKey='accessType' />
                    <YAxis dy={1} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip/>} />
                    <Bar dataKey={'value'} fill='#636262'>
                        {accessTypeArr.filter(obj => obj.value !== 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={accessColor[index]} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>

                {packagedData.map((results, index) => {
                    let yLabel = index === 3 ? "Rating" : (index === 4 ? "Length" : "Count");

                    console.log("🚀 ~ file: Charts.js:1935 ~ {packagedData.map ~ results:", results);
                    return (
                        <div className='Charts'>
                            <div style={{ fontSize: 'larger', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {titles[index]} </div>
                            {index > 2 ? <br/> : null}
                            {/* Hide Pie chart for difficulties and length */}
                            {index < 3 ?
                                <PieChart width={width} height={height}>
                                    <Pie data={results.filter(obj => obj.value !== 0)} dataKey='value' nameKey='description' cx='50%' cy='50%' outerRadius={100} fill="#256eff" >
                                        {results.filter(obj => obj.value !== 0).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={accessColor[index]} stroke={'#000000'} fillOpacity={0.85} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip/>} />
                                </PieChart> : null}
                            <div>
                                {/* Show Default Legend for 3 access types */}
                                {index < 3 ?
                                    results.filter(obj => obj.value !== 0).map((entry, i) => {
                                        if(entry.value > 0)
                                        return (
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <div style={{ backgroundColor: accessColor[i] }}>&nbsp;&nbsp;</div>
                                                &nbsp;{entry.description}: {(entry.value / sums[index] * 100).toFixed(1)}%
                                            </div>
                                        );
                                    })
                                    :
                                    (index === 3 ?
                                        // on index 3 show access difficulties
                                        results.filter(obj => obj.value !== 0).map((entry, i) => {
                                            if(entry.value > 0)
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                    <div style={{ backgroundColor: accessColor[i] }}>&nbsp;&nbsp;</div>
                                                    &nbsp;{entry.description}: {entry.value}
                                                </div>
                                            );
                                        })
                                        :
                                        // on index 4 show length for access path descriptions
                                        results.filter(obj => obj.value !== 0).map((entry, i) => {
                                            if(entry.value > 0)
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                    <div style={{ backgroundColor: accessColor[i] }}>&nbsp;&nbsp;</div>
                                                    &nbsp;{entry.description}: {entry.value}ft
                                                </div>
                                            );
                                        })
                                    )                                    
                                }
                            </div>
                            <br />
                            {/* Set Bar chart parameters */}
                            {true ?
                                // Default Bar Chart
                                <BarChart style={{ paddingBottom: 'auto' }} width={width} height={chartHeight[index][0]} data={results.filter(obj => obj.value !== 0)}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis height={chartHeight[index][1]} interval={0} angle={-60} textAnchor="end" dataKey='description' />
                                    <YAxis dy={1} label={{ textAnchor: "center", value: `${yLabel}`, angle: -90, position: 'insideLeft' }} />
                                    <Tooltip content={<CustomTooltip/>} />
                                    <Bar dataKey={'value'} fill='#636262'>
                                        {results.filter(obj => obj.value !== 0).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={accessColor[index]} fillOpacity={0.8} />
                                        ))}
                                    </Bar>
                                </BarChart>
                                :
                                null}
                            <br/>
                        </div>
                    )
                })}
            </div>
        );
    };

    const multiProgramCharts = (data) => {
        //console.log(data);
        data = Object.values(data);

        let foodAndBev = 0;
        let entertain = 0;
        let hospitality = 0;
        let healthcare = 0;
        let retail = 0;
        let commercial = 0;
        let resident = 0;
        let lab = 0;
        let storage = 0;
        let empty = 0;
        let civil = 0;
        let monument = 0;
        let publicSpace = 0;
        let programSum = 0;

        let foodAndBevArea = 0;
        let entertainArea = 0;
        let hospitalityArea = 0;
        let healthcareArea = 0;
        let retailArea = 0;
        let commercialArea = 0;
        let residentArea = 0;
        let labArea = 0;
        let storageArea = 0;
        let emptyArea = 0;
        let civilArea = 0;
        let monumentArea = 0;
        let publicSpaceArea = 0;
        let totalArea = 0;
        let remainingArea = 0;

        // {"Food and beverage", food},
        // {"Entertainment / leisure", entertain},
        // {"Hospitality", hospitality},
        // {"Healthcare", health},
        // {"Retail", retail},
        // {"Commercial", commercial},
        // {"Residential", residential},
        // {"Laboratory", lab},
        // {"Storage / warehouse", storage},
        // {"Empty / abandoned / unused", empty},
        // {"Civil", civil},
        // {"Monument", monument},
        // {"Public Space", publicSpace}
        data.map((inst) => {
            inst = inst[0][0];
            totalArea += inst.sqFootage;
            remainingArea += inst.sqFootage;

            inst.floorData.map((obj) => {
                obj.programs.map((program) => {
                    programSum++;
                    switch (program.programType) {
                        case 'Food and beverage':
                            foodAndBev++;
                            foodAndBevArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Entertainment / leisure':
                            entertain++;
                            entertainArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Hospitality':
                            hospitality++;
                            hospitalityArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Healthcare':
                            healthcare++;
                            healthcareArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Retail':
                            retail++;
                            retailArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Commercial':
                            commercial++;
                            commercialArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Residential':
                            resident++;
                            residentArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Laboratory':
                            lab++;
                            labArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Storage / warehouse':
                            storage++;
                            storageArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Empty / abandoned / unused':
                            empty++;
                            emptyArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Civil':
                            civil++;
                            civilArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Monument':
                            monument++;
                            monumentArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Public Space':
                            publicSpace++;
                            publicSpaceArea += program.sqFootage;
                            remainingArea -= program.sqFootage;
                            break;
                        case 'Void Space':
                            programSum--;
                            remainingArea -= program.sqFootage;
                            totalArea -= program.sqFootage;
                            break;
                        default:
                            console.log('Non-matching program type');
                            console.log(program.programType);
                            break;
                    }
                })
            })
        })



        const programTypeArr = [
            { programType: 'Food and beverage', value: foodAndBev },
            { programType: 'Entertainment / leisure', value: entertain },
            { programType: 'Hospitality', value: hospitality },
            { programType: 'Healthcare', value: healthcare },
            { programType: 'Retail', value: retail },
            { programType: 'Commercial', value: commercial },
            { programType: 'Residential', value: resident },
            { programType: 'Laboratory', value: lab },
            { programType: 'Storage / warehouse', value: storage },
            { programType: 'Empty / abandoned / unused', value: empty },
            { programType: 'Civil', value: civil },
            { programType: 'Monument', value: monument },
            { programType: 'Public Space', value: publicSpace },
        ];

        const programTypeAreaArr = [
            { programType: 'Food and beverage Area', value: parseFloat(foodAndBevArea.toFixed(1)) },
            { programType: 'Entertainment / leisure Area', value: parseFloat(entertainArea.toFixed(1)) },
            { programType: 'Hospitality Area', value: parseFloat(hospitalityArea.toFixed(1)) },
            { programType: 'Healthcare Area', value: parseFloat(healthcareArea.toFixed(1)) },
            { programType: 'Retail Area', value: parseFloat(retailArea.toFixed(1)) },
            { programType: 'Commercial Area', value: parseFloat(commercialArea.toFixed(1)) },
            { programType: 'Residential Area', value: parseFloat(residentArea.toFixed(1)) },
            { programType: 'Laboratory Area', value: parseFloat(labArea.toFixed(1)) },
            { programType: 'Storage / warehouse Area', value: parseFloat(storageArea.toFixed(1)) },
            { programType: 'Empty / abandoned / unused Area', value: parseFloat(emptyArea.toFixed(1)) },
            { programType: 'Civil Area', value: parseFloat(civilArea.toFixed(1)) },
            { programType: 'Monument Area', value: parseFloat(monumentArea.toFixed(1)) },
            { programType: 'Public Space Area', value: parseFloat(publicSpaceArea.toFixed(1)) },
            { programType: 'Total Building Area', value: parseFloat(totalArea.toFixed(1)) }
        ];

        const programTypeAreaArrForPieChart = [
            { programType: 'Food and beverage Area', value: parseFloat(foodAndBevArea.toFixed(1)) },
            { programType: 'Entertainment / leisure Area', value: parseFloat(entertainArea.toFixed(1)) },
            { programType: 'Hospitality Area', value: parseFloat(hospitalityArea.toFixed(1)) },
            { programType: 'Healthcare Area', value: parseFloat(healthcareArea.toFixed(1)) },
            { programType: 'Retail Area', value: parseFloat(retailArea.toFixed(1)) },
            { programType: 'Commercial Area', value: parseFloat(commercialArea.toFixed(1)) },
            { programType: 'Residential Area', value: parseFloat(residentArea.toFixed(1)) },
            { programType: 'Laboratory Area', value: parseFloat(labArea.toFixed(1)) },
            { programType: 'Storage / warehouse Area', value: parseFloat(storageArea.toFixed(1)) },
            { programType: 'Empty / abandoned / unused Area', value: parseFloat(emptyArea.toFixed(1)) },
            { programType: 'Civil Area', value: parseFloat(civilArea.toFixed(1)) },
            { programType: 'Monument Area', value: parseFloat(monumentArea.toFixed(1)) },
            { programType: 'Public Space Area', value: parseFloat(publicSpaceArea.toFixed(1)) },
            { programType: 'Unknown Area', value: parseFloat(remainingArea.toFixed(1)) }
        ];

        const packagedData = [programTypeArr, programTypeAreaArr];

        const chartHeight = [[350, 150], [280, 80]]
        const sums = [programSum, totalArea]

        const titles = ["Program Types", "Program Areas"];

        return (
            <div className='Charts' style={{ paddingBottom: 50 }}>
                <div style={{ fontSize: 'larger' }}> Program Types </div>
                <PieChart width={width} height={height}>
                    <Pie data={programTypeArr} dataKey='value' nameKey='programType' cx='50%' cy='50%' outerRadius={100} fill="#256eff" >
                        {programTypeArr.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={programColor[index]} stroke={'#000000'} fillOpacity={0.85} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div>
                    {programTypeArr.map((entry, index) => {
                        if (entry.value > 0)
                            return (
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ backgroundColor: programColor[index] }}>&nbsp;&nbsp;</div>
                                    &nbsp;{entry.programType}: {(entry.value / programSum * 100).toFixed(1)}%
                                </div>
                            );
                    })}
                </div>
                <br />
                <BarChart style={{ paddingBottom: 'auto' }} width={width} height={chartHeight[1][0]} data={programTypeArr}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis height={chartHeight[0][1]} interval={0} angle={-60} textAnchor="end" dataKey='programType' />
                    <YAxis dy={1} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'value'} fill='#636262'>
                        {programTypeArr.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={programColor[index]} fillOpacity={0.8} />

                        ))}
                    </Bar>
                </BarChart>

                <div style={{ fontSize: 'larger' }}> Program Type Areas </div>
                <PieChart width={width} height={height}>
                    <Pie data={programTypeAreaArrForPieChart} dataKey='value' nameKey='programType' cx='50%' cy='50%' outerRadius={100} fill="#256eff" >
                        {programTypeAreaArrForPieChart.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={programColor[index]} stroke={'#000000'} fillOpacity={0.85} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div>
                    {programTypeAreaArrForPieChart.map((entry, index) => {
                        // && index !== 13
                        if (entry.value > 0)
                            return (
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ backgroundColor: programColor[index] }}>&nbsp;&nbsp;</div>
                                    &nbsp;{entry.programType}: {(entry.value / totalArea * 100).toFixed(1)}%
                                </div>
                            );
                    })}
                </div>
                <br />
                <div>
                    {programTypeAreaArr.map((entry, index) => {
                        if (entry.value > 0)
                            return (
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ backgroundColor: programColor[index] }}>&nbsp;&nbsp;</div>
                                    &nbsp;{entry.programType}: {(entry.value).toFixed(1)} ft²
                                </div>
                            );
                    })}
                </div>
                <br />
            </div>
        )


    };

    const programCharts = (data) => {
        //console.log(data);
        data = data[0];

        let foodAndBev = 0;
        let entertain = 0;
        let hospitality = 0;
        let healthcare = 0;
        let retail = 0;
        let commercial = 0;
        let resident = 0;
        let lab = 0;
        let storage = 0;
        let empty = 0;
        let civil = 0;
        let monument = 0;
        let publicSpace = 0;
        let programSum = 0;

        let foodAndBevArea = 0;
        let entertainArea = 0;
        let hospitalityArea = 0;
        let healthcareArea = 0;
        let retailArea = 0;
        let commercialArea = 0;
        let residentArea = 0;
        let labArea = 0;
        let storageArea = 0;
        let emptyArea = 0;
        let civilArea = 0;
        let monumentArea = 0;
        let publicSpaceArea = 0;
        let totalArea = data.sqFootage;
        let remainingArea = totalArea;

        // {"Food and beverage", food},
        // {"Entertainment / leisure", entertain},
        // {"Hospitality", hospitality},
        // {"Healthcare", health},
        // {"Retail", retail},
        // {"Commercial", commercial},
        // {"Residential", residential},
        // {"Laboratory", lab},
        // {"Storage / warehouse", storage},
        // {"Empty / abandoned / unused", empty},
        // {"Civil", civil},
        // {"Monument", monument},
        // {"Public Space", publicSpace}

        if(data.floorData.length === 0) 
            return(
                <Typography style={{textAlign: "center", justifyContent: "center"}} >No Test Data</Typography>
            )

        data.floorData.map((obj) => {
            obj.programs.map((program) => {
                programSum++;
                switch (program.programType) {
                    case 'Food and beverage':
                        foodAndBev++;
                        foodAndBevArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Entertainment / leisure':
                        entertain++;
                        entertainArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Hospitality':
                        hospitality++;
                        hospitalityArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Healthcare':
                        healthcare++;
                        healthcareArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Retail':
                        retail++;
                        retailArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Commercial':
                        commercial++;
                        commercialArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Residential':
                        resident++;
                        residentArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Laboratory':
                        lab++;
                        labArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Storage / warehouse':
                        storage++;
                        storageArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Empty / abandoned / unused':
                        empty++;
                        emptyArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Civil':
                        civil++;
                        civilArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Monument':
                        monument++;
                        monumentArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Public Space':
                        publicSpace++;
                        publicSpaceArea += program.sqFootage;
                        remainingArea -= program.sqFootage;
                        break;
                    case 'Void Space':
                        programSum--;
                        remainingArea -= program.sqFootage;
                        totalArea -= program.sqFootage;
                        break;
                    default:
                        console.log('Non-matching program type');
                        console.log(program.programType);
                        break;
                }
            })
        })

        const programTypeArr = [
            { programType: 'Food and beverage', value: foodAndBev },
            { programType: 'Entertainment / leisure', value: entertain },
            { programType: 'Hospitality', value: hospitality },
            { programType: 'Healthcare', value: healthcare },
            { programType: 'Retail', value: retail },
            { programType: 'Commercial', value: commercial },
            { programType: 'Residential', value: resident },
            { programType: 'Laboratory', value: lab },
            { programType: 'Storage / warehouse', value: storage },
            { programType: 'Empty / abandoned / unused', value: empty },
            { programType: 'Civil', value: civil },
            { programType: 'Monument', value: monument },
            { programType: 'Public Space', value: publicSpace },
        ];

        const programTypeAreaArr = [
            { programType: 'Food and beverage Area', value: parseFloat(foodAndBevArea.toFixed(1)) },
            { programType: 'Entertainment / leisure Area', value: parseFloat(entertainArea.toFixed(1)) },
            { programType: 'Hospitality Area', value: parseFloat(hospitalityArea.toFixed(1)) },
            { programType: 'Healthcare Area', value: parseFloat(healthcareArea.toFixed(1)) },
            { programType: 'Retail Area', value: parseFloat(retailArea.toFixed(1)) },
            { programType: 'Commercial Area', value: parseFloat(commercialArea.toFixed(1)) },
            { programType: 'Residential Area', value: parseFloat(residentArea.toFixed(1)) },
            { programType: 'Laboratory Area', value: parseFloat(labArea.toFixed(1)) },
            { programType: 'Storage / warehouse Area', value: parseFloat(storageArea.toFixed(1)) },
            { programType: 'Empty / abandoned / unused Area', value: parseFloat(emptyArea.toFixed(1)) },
            { programType: 'Civil Area', value: parseFloat(civilArea.toFixed(1)) },
            { programType: 'Monument Area', value: parseFloat(monumentArea.toFixed(1)) },
            { programType: 'Public Space Area', value: parseFloat(publicSpaceArea.toFixed(1)) },
            { programType: 'Total Building Area', value: parseFloat(totalArea.toFixed(1)) }
        ];

        const programTypeAreaArrForPieChart = [
            { programType: 'Food and beverage Area', value: parseFloat(foodAndBevArea.toFixed(1)) },
            { programType: 'Entertainment / leisure Area', value: parseFloat(entertainArea.toFixed(1)) },
            { programType: 'Hospitality Area', value: parseFloat(hospitalityArea.toFixed(1)) },
            { programType: 'Healthcare Area', value: parseFloat(healthcareArea.toFixed(1)) },
            { programType: 'Retail Area', value: parseFloat(retailArea.toFixed(1)) },
            { programType: 'Commercial Area', value: parseFloat(commercialArea.toFixed(1)) },
            { programType: 'Residential Area', value: parseFloat(residentArea.toFixed(1)) },
            { programType: 'Laboratory Area', value: parseFloat(labArea.toFixed(1)) },
            { programType: 'Storage / warehouse Area', value: parseFloat(storageArea.toFixed(1)) },
            { programType: 'Empty / abandoned / unused Area', value: parseFloat(emptyArea.toFixed(1)) },
            { programType: 'Civil Area', value: parseFloat(civilArea.toFixed(1)) },
            { programType: 'Monument Area', value: parseFloat(monumentArea.toFixed(1)) },
            { programType: 'Public Space Area', value: parseFloat(publicSpaceArea.toFixed(1)) },
            { programType: 'Unknown Area', value: parseFloat(remainingArea.toFixed(1)) }
        ];

        const filteredProgramTypeArr = []
        const filteredProgramTypeArrColors = []
        const filteredProgramTypeAreaArr = [];
        const filteredProgramTypeAreaArrColors = [];
        const filteredProgramTypeAreaArrForPieChart = [];
        const filteredProgramTypeAreaArrForPieChartColors = [];

        programTypeArr.forEach((obj, index) => {
            if (obj.value !== 0) {
                filteredProgramTypeArr.push(obj);
                filteredProgramTypeArrColors.push(programColor[index]);
            }
        })

        programTypeAreaArr.forEach((obj, index) => {
            if (obj.value !== 0) {
                filteredProgramTypeAreaArr.push(obj);
                filteredProgramTypeAreaArrColors.push(programColor[index]);
            }
        })

        programTypeAreaArrForPieChart.forEach((obj, index) => {
            if (obj.value !== 0) {
                filteredProgramTypeAreaArrForPieChart.push(obj);
                filteredProgramTypeAreaArrForPieChartColors.push(programColor[index]);
            }
        })

        const packagedData = [filteredProgramTypeArr, filteredProgramTypeAreaArr];

        const chartHeight = [[350, 150], [280, 80]]
        const sums = [programSum, totalArea]

        const titles = ["Program Types", "Program Areas"];

        return (
            <div className='Charts' style={{ paddingBottom: 50 }}>
                <div style={{ fontSize: 'larger' }}> Program Types </div>
                <PieChart width={width} height={height}>
                    <Pie data={filteredProgramTypeArr} dataKey='value' nameKey='programType' cx='50%' cy='50%' outerRadius={100} fill="#256eff" >
                        {filteredProgramTypeArr.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={filteredProgramTypeArrColors[index]} stroke={'#000000'} fillOpacity={0.85} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div>
                    {filteredProgramTypeArr.map((entry, index) => {
                        if (entry.value > 0)
                            return (
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ backgroundColor: filteredProgramTypeArrColors[index] }}>&nbsp;&nbsp;</div>
                                    &nbsp;{entry.programType}: {(entry.value / programSum * 100).toFixed(1)}%
                                </div>
                            );
                    })}
                </div>
                <br />
                <BarChart style={{ paddingBottom: 'auto' }} width={width} height={chartHeight[1][0]} data={filteredProgramTypeArr}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis height={chartHeight[0][1]} interval={0} angle={-60} textAnchor="end" dataKey='programType' />
                    <YAxis dy={1} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey={'value'} fill='#636262'>
                        {filteredProgramTypeArr.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={filteredProgramTypeArrColors[index]} fillOpacity={0.8} />

                        ))}
                    </Bar>
                </BarChart>

                <div style={{ fontSize: 'larger' }}> Program Type Areas </div>
                <PieChart width={width} height={height}>
                    <Pie data={filteredProgramTypeAreaArrForPieChart} dataKey='value' nameKey='programType' cx='50%' cy='50%' outerRadius={100} fill="#256eff" >
                        {filteredProgramTypeAreaArrForPieChart.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={filteredProgramTypeAreaArrForPieChartColors[index]} stroke={'#000000'} fillOpacity={0.85} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div>
                    {filteredProgramTypeAreaArrForPieChart.map((entry, index) => {
                        // && index !== 13
                        if (entry.value > 0)
                            return (
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ backgroundColor: filteredProgramTypeAreaArrForPieChartColors[index] }}>&nbsp;&nbsp;</div>
                                    &nbsp;{entry.programType}: {(entry.value / totalArea * 100).toFixed(1)}%
                                </div>
                            );
                    })}
                </div>
                <br />
                <div>
                    {filteredProgramTypeAreaArrForPieChart.map((entry, index) => {
                        if (entry.value > 0)
                            return (
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ backgroundColor: filteredProgramTypeAreaArrForPieChartColors[index] }}>&nbsp;&nbsp;</div>
                                    &nbsp;{entry.programType}: {(entry.value).toFixed(1)} ft²
                                </div>
                            );
                    })}
                </div>
                <br />
            </div>
        )


    };

    // Kinda pointless would just show the same images

    // const multiSectionCharts = (data) => {

    //     data = Object.values(data);
        
    //     return (
    //         <div className='Charts' style={{ paddingBottom: 50 }}>
    //             <div style={{ fontSize: 'larger' }}> Section Media </div>
    //                 {data.map((inst) => {
    //                     inst.map((obj, index) => {
    //                         if(index > 0)
    //                             return(
    //                                 <div style={{ alignItems: 'center', display: 'flex', flexDirection:'column', width: 'auto', maxWidth: '100%'}}>
    //                                     <br/>
    //                                     <h5>{obj.title}</h5>
    //                                     <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', width: 'auto'}} key={index}>
    //                                         <a href={obj.url_link}>
    //                                             <img style={{maxWidth: '70%'}} src={obj.url_link} />
    //                                         </a>
    //                                     </div>
    //                                     <Box
    //                                         border={1}
    //                                         borderRadius={4}
    //                                         borderColor="grey.400"
    //                                         p={2}
    //                                         m={1}
    //                                         width='auto'
    //                                         alignItems= 'center'>
    
    //                                         {obj.tags.length > 0 ? obj.tags.sort((a, b) => a.localeCompare(b)).map((tag, index) => {
    //                                             //console.log("🚀 ~ file: Charts.js:2819 ~ {obj.tags.map ~ obj:", obj);
    //                                             //console.log("🚀 ~ file: Charts.js:2819 ~ {obj.tags.map ~ tag:", tag);
    //                                             return(
    //                                                 <Typography style={{ alignItems: 'center'}} key={index}>{tag}</Typography> 
    //                                             )
    //                                         }) : null}
    
    
    //                                     </Box>
    //                                 </div>
    //                             )
    //                     })}
    //                 )})
    //         </div>
    //     )
    // };

    const sectionCharts = (data) => {

        console.log(data)
        return(
            <div className='Charts' style={{ paddingBottom: 50, textAlign: 'center' }}>
                <div style={{ fontSize: 'larger' }}> Section Media </div>
                    {data.map((obj, index) => {
                        const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv'];
                        if(index > 0) {
                            console.log("🚀 ~ file: Charts.js:2831 ~ {data.map ~ obj.url_link.split(`?`)[0]:", obj.url_link.split("?")[0]);

                            return(
                                <div style={{ alignItems: 'center', display: 'flex', flexDirection:'column', width: 'auto', maxWidth: '100%'}}>
                                    <br/>
                                    <h5>{obj.title}</h5>
                                    <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', width: 'auto'}} key={index}>
                                        <a href={obj.url_link}>
                                        {
                                        videoExtensions.some(ext => obj.url_link.split("?")[0].endsWith(ext)) ?
                                            <Button style={{width: "70%"}} href={obj.url_link} target="_blank" >
                                                Open Video in New Tab
                                            </Button>
                                        :
                                            <a href={obj.url_link} target="_blank">
                                                <img style={{maxWidth: '70%'}} src={obj.url_link} />
                                            </a>
                                        }

                                        </a>
                                    </div>
                                    <Box
                                        border={1}
                                        borderRadius={4}
                                        borderColor="grey.400"
                                        p={2}
                                        m={1}
                                        width='auto'
                                        alignItems= 'center'>

                                        {obj.tags.length > 0 ? obj.tags.sort((a, b) => a.localeCompare(b)).map((tag, index) => {
                                            //console.log("🚀 ~ file: Charts.js:2819 ~ {obj.tags.map ~ obj:", obj);
                                            //console.log("🚀 ~ file: Charts.js:2819 ~ {obj.tags.map ~ tag:", tag);
                                            return(
                                                <Typography style={{ alignItems: 'center'}} key={index}>{tag}</Typography> 
                                            )
                                        }) : null}


                                    </Box>
                                </div>
                            )
                        }
                    })}
            </div>
        )
    };


    return (
        data !== [] ?
            (type === 0 ?
                <div key={selection} style={{ borderBottom: '2px solid #e8e8e8', paddingBottom: '5px' }}>
                    <div className='sectionName'>
                        <div style={{ fontSize: 'large' }}>{testNames(cat[0])}</div>
                        {cat[1]}  {cat[2]}
                    </div>
                    {cat[0] === 'sound_maps' ? soundBarChart(data) : (cat[0] === 'boundaries_maps' ? BoundaryPieChart(data) : (cat[0] === 'moving_maps' ? movingBarChart(data) : (cat[0] === 'stationary_maps' ? stationaryBarCharts(data) : (cat[0] === 'nature_maps' ? NaturePieChart(data) : (cat[0] === 'light_maps' ? lightingCharts(data) : (cat[0] === 'order_maps' ? orderCharts(data) : (cat[0] === 'access_maps' ? accessCharts(data) : (cat[0] === 'program_maps' ? programCharts(data) : (cat[0] === 'section_maps' ? sectionCharts(data) : null)))))))))}
                </div>
                :
                <div key={selection} style={{ borderBottom: '2px solid #e8e8e8', paddingBottom: '5px' }}>
                    <div className='sectionName' style={{ fontSize: 'large', marginBottom: '5px' }}>
                        {testNames(cat[0])}: Summary
                    </div>
                    {cat[0] === 'sound_maps' ? multiSoundCharts(data) : (cat[0] === 'boundaries_maps' ? multiBoundaryCharts(data) : (cat[0] === 'stationary_maps' ? multiStationary(data) : (cat[0] === 'nature_maps' ? multiNatureChart(data) : (cat[0] === 'moving_maps' ? multiMoving(data) : (cat[0] === 'light_maps' ? multiLight(data) : (cat[0] === 'order_maps' ? multiOrderCharts(data) : (cat[0] === 'access_maps' ? multiAccessCharts(data) : (cat[0] === 'program_maps' ? multiProgramCharts(data) : null))))))))}
                </div>)
            : null
    );
};