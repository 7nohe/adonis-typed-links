/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
router.on('/').renderInertia('home').as('home')

router.on('/about').renderInertia('about').as('about')

router.on('/users/:id').renderInertia('users/show').as('users.show')
