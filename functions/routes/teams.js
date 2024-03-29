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
        SECTION_MAPS,
        STATIONARY_MAPS,
        TEAMS,
        USERS,
    } = require('../databaseFunctions/CollectionNames.js');

const { UnauthorizedError, NotFoundError, BadRequestError } = require('../utils/errors');
const teams = require('../models/teams.js');

//route creates a new team
router.post('', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    let description = "";
    if (req.body.description) {
        description = req.body.description;
    }
    let visiable = false;
    if (typeof req.body.public !== undefined) {
        visiable = req.body.public;
    }
    console.log(visiable);
    const newTeam = {
        _id: basicDBfoos.createId(),
        title: req.body.title,
        description: description,
        users: [{user:user._id, role:'owner'}],
        projects: [],
        public: false,
    };
    console.log("after define");
    await basicDBfoos.addObj(newTeam, TEAMS);
    console.log("After add");
    await arrayDBfoos.addArrayElement(user._id, "teams", USERS, newTeam._id);
    console.log("End");
    res.status(201).json(newTeam);
})

//route displays team information
router.get('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const teamId = await req.params.id;
    console.log(teamId);
    let team = await basicDBfoos.getObj(teamId, TEAMS);
    if (team.projects) {
        for(let i = 0; i < team.projects.length; i++) {
            const project = await basicDBfoos.getObj(team.projects[i], PROJECTS);
            team.projects[i] = {_id: project._id, title: project.title, description: project.description};
        }
    }
    for(let i = 0; i < team.users.length; i++) {
        console.log(team.users[i]);
        const user = await basicDBfoos.getObj(team.users[i].user, USERS);
        myRole = team.users[i].role;
        team.users[i] = {
                            user: user._id,
                            role: myRole,
                            firstname: user.firstname,
                            lastname: user.lastname,
                        };
    }
    console.log(team);
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
    }
    await basicDBfoos.updateObj(team, newTeam, TEAMS);
    res.status(201).json("done");
})

//deletes an entire team
router.delete('/:id', passport.authenticate('jwt',{session:false}),async (req, res, next) => {
    try {
        const teamId = req.params.id;
        const user = req.user;

        // Check if the user is authorized to delete the team
        const authorized = await userDBfoos.isAdmin(teamId, user._id);
        if (!authorized) {
            throw new UnauthorizedError('You do not have permission to perform this operation');
        }

        // Delete all map collections associated with projects belonging to the team
        const team = await basicDBfoos.getObj(teamId, TEAMS);

        //delete ALL of the map collections which contain a projectId which belongs to the team
        if(team.projects.length){
            for(const proj of team.projects) {
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
        }

        // Delete team id in all User docs
        await arrayDBfoos.removeTeamFromAllUsers(teamId);

        // Delete the team itself
        await basicDBfoos.deleteObj(teamId, TEAMS);

        res.json({ message: 'Team and associated data deleted successfully' });
        } catch (error) {
            next(error);
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
