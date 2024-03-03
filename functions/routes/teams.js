const express = require('express')
const router = express.Router()
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const arrayDBfoos = require('../databaseFunctions/ArrayFunctions.js');
const userDBfoos = require('../databaseFunctions/UserFunctions.js');
const refDBfoos = require('../databaseFunctions/ReferenceFunctions.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const { json } = require('express');
const {
        ACCSESS_MAPS,
        BOUNDARIES_MAPS,
        LIGHT_MAPS,
        MOVING_MAPS,
        NATURE_MAPS,
        ORDER_MAPS,
        PROGRAM_MAPS,
        PROJECTS,
        SOUND_MAPS,
        STATIONARY_MAPS,
        TEAMS,
        USERS,
    } = require('../databaseFunctions/CollectionNames.js');

const { UnauthorizedError, NotFoundError, BadRequestError } = require('../utils/errors');
const teams = require('../models/teams.js');

//route creates a new team
router.post('', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    let user = await req.user;
    let newTeam = {
        _id: {$oid: basicDBfoos.createId()},
        title: req.body.title,
        description: req.body.description,
        users: [{user:user._id, role:'owner'}],
        public: req.body.public
    };
    await basicDBfoos.addObj(newTeam, TEAMS);
    await arrayDBfoos.addArrayElement(user._id, "teams", "users", newTeam._id);
    res.status(201).json(newTeam);
})

//route displays team information
router.get('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const teamId = await req.params.id;
    let team = await basicDBfoos.getObj(teamId, TEAMS);
    for(let i = 0; i < team.projects.length; i++) {
        const project = await basicDBfoos.getObj(team.projects[i], PROJECTS);
        team.projects[i] = {title: project.title, description: project.description};

    }
    for(let i = 0; i < team.users.length; i++) {
        const user = await basicDBfoos.getObj(team.users[i], USERS);
        myRole = team.users[i].role;
        team.users[i] = {
                            user: user._id,
                            role: myRole,
                            firstname: user.firstname,
                            lastname: user.lastname,
                        };
    }
    res.status(200).json(team);
})

//route updates team information
router.put('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    const team = await req.params.id;

    if (await userDBfoos.isAdmin(team, user._id) === false)
    {
        res.status(201).json("not admin");
        return;
    }

    const newTeam = {
        title: (req.body.title ? req.body.title : team.title),
        description: (req.body.description ? req.body.description : team.description),
        public: (typeof req.body.public !== "undefined" ? req.body.public : team.public)
    }
    await basicDBfoos.updateObj(team, newTeam, TEAMS);
    res.status(201).json("done");
})

//deletes an entire team
router.delete('/:id', passport.authenticate('jwt',{session:false}),async (req, res, next) => {
    const teamId = await req.params.id;
    user = await req.user;
    // user = await req.user;
    team = await basicDBfoos.getObj(teamId, TEAMS);
    const authorized = await userDBfoos.isAdmin(team._id, user);
    console.log(authorized);
    if(authorized) {
    
        //delete ALL of the map collections which contain a projectId which belongs to the team
        if(team.projects.length){
            for(let i = 0; i < team.projects.length; i++ ) {
                proj = team.projects[i];
                await refDBfoos.projectCleanup(proj, ACCSESS_MAPS);
                await refDBfoos.projectCleanup(proj, BOUNDARIES_MAPS);
                await refDBfoos.projectCleanup(proj, LIGHT_MAPS);
                await refDBfoos.projectCleanup(proj, MOVING_MAPS);
                await refDBfoos.projectCleanup(proj, NATURE_MAPS);
                await refDBfoos.projectCleanup(proj, ORDER_MAPS);
                await refDBfoos.projectCleanup(proj, PROGRAM_MAPS);
                await refDBfoos.projectCleanup(proj, SECTION_MAPS);
                await refDBfoos.projectCleanup(proj, SOUND_MAPS);
                await refDBfoos.projectCleanup(proj, STATIONARY_MAPS);
            }
    
            await basicDBfoos.teamCleanup(teamId);
        }
        res.json(await basicDBfoos.deleteObj(teamId, TEAMS));

    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }

})

router.post('/:id/invites', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const teamId = req.params.id;
    const user = await req.user;
    const team = await basicDBfoos.getObj(teamId, TEAMS);
    if (!team)
    {
        res.status(400).json(team);
    }
    const authorized = await userDBfoos.isAdmin(team._id,user._id);
    if(authorized) {
        
        const newMember = await userDBfoos.findUserByEmail(req.body.userEmail);
        if(newMember == null)
            throw new NotFoundError('No user with provided email exists');

        if(newMember.teams.some(element => element.$oid === team._id.$oid))
            throw new BadRequestError('User is already a member of team');

        if(newMember.invites.some(element => element.$oid === team._id.$oid))
            throw new BadRequestError('User already has invite to team');
        
        else{
            await arrayDBfoos.addArrayElement(newMember._id, "invites", USERS, team._id);
            res.status(200).json("Sent invite to new User");
        }
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }
})

module.exports = router
