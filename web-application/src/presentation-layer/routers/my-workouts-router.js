const express = require('express')

module.exports = function(container){
    const router = express.Router()


    router.get('/', function(request, response){
        const model = {
            workouts: null,
            activeUser: request.session.activeUser.username
        }
        response.render('my-workouts.hbs', model)
    })

    return router
}