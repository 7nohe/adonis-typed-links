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

router.on('/users/create').renderInertia('users/create').as('users.create')

router.on('/users/:id').renderInertia('users/show').as('users.show')

router
  .post('/users', (context) => {
    console.log(context.request.all())
    return context.response.redirect().back()
  })
  .as('users.store')
