const express = require('express')
const router = express.Router()
const Team = require('../models/teams.js')
const User = require('../models/users.js')
const Project = require('../models/projects.js')
const Stationary_Map = require('../models/stationary_maps.js')
const Moving_Map = require('../models/moving_maps.js')
const Sound_Map = require('../models/sound_maps.js')
const Nature_Map = require('../models/nature_maps.js')
const Light_Map = require('../models/light_maps.js')
const Order_Map = require('../models/order_maps.js')
const Boundaries_Map = require('../models/boundaries_maps.js')
const Section_Map = require('../models/section_maps.js')
const Access_Map = require('../models/access_maps.js')
const Program_Map = require('../models/program_maps.js')


const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { json } = require('express')

const { UnauthorizedError, NotFoundError, BadRequestError } = require('../utils/errors')
const teams = require('../models/teams.js')

//route creates a new team
router.post('', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    let newTeam = new Team({
        title: req.body.title,
        description: req.body.description,
        users: [{user:user._id, role:'owner'}],
        public: req.body.public
    })

    const team = await Team.addTeam(newTeam)

    // Add the new team to the user's teams
    user.teams.push(team._id)
    user.save()

    res.status(201).json(team)
})

//route displays team information
router.get('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    var team = await Team.findById(req.params.id).populate('projects', 'title description')
    for(var i = 0; i < team.users.length; i++){
        const user = await User.findById(team.users[i].user)
        myRole = team.users[i].role
        team.users[i] = {
                            user: user._id,
                            role: myRole,
                            firstname: user.firstname,
                            lastname: user.lastname
                        }
    }
    res.status(200).json(team)
})

//route updates team information
router.put('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    team = await Team.findById(req.params.id)

    if (await Team.isAdmin(req.params.id,user._id)){
        
        let newTeam = new Team({
            title: (req.body.title ? req.body.title : team.title),
            description: (req.body.description ? req.body.description : team.description),
            public: (req.body.public ? req.body.public : team.public)
        })
        
        res.status(201).json(await Team.updateTeam(req.params.id,newTeam))
    }

    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

//deletes an entire team
router.delete('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    team = await Team.findById(req.params.id)
    if(await Team.isOwner(team._id,user._id)){
    
        //delete ALL of the map collections which contain a projectId which belongs to the team
        if(team.projects.length){
            for(var i = 0; i < team.projects.length; i++ ){
                proj = team.projects[i]
                await Stationary_Map.projectCleanup(proj)
                await Moving_Map.projectCleanup(proj)
                await Sound_Map.projectCleanup(proj)
                await Nature_Map.projectCleanup(proj)
                await Light_Map.projectCleanup(proj)
                await Order_Map.projectCleanup(proj)
                await Boundaries_Map.projectCleanup(proj)
                await Section_Map.projectCleanup(proj)
                await Access_Map.projectCleanup(proj)
                await Program_Map.projectCleanup(proj)
            }
    
            await Project.teamCleanup(team._id)
        }
        res.json(await Team.deleteTeam(team._id))

    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }

})

//route sends invitation to other users signed up to the application
router.post('/:id/invites', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    team = await Team.findById(req.params.id)

    if(await Team.isAdmin(team._id,user._id)){
        
        newMember = await User.findUserByEmail(req.body.userEmail)

        if(newMember == null)
            throw new NotFoundError('No user with provided email exists')

        if(newMember.teams.includes(team._id))
            throw new BadRequestError('User is already a member of team')

        if(newMember.invites.includes(team._id))
            throw new BadRequestError('User already has invite to team')
        
        else{
            await User.addInvite(newMember._id, team._id)
            res.status(200).json("Sent invite to new User")
        }
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }

})

module.exports = router