/*
|--------------------------------------------------------------------------
| Configure hook
|--------------------------------------------------------------------------
|
| The configure hook is called when someone runs "node ace configure <package>"
| command. You are free to perform any operations inside this function to
| configure the package.
|
| To make things easier, you have access to the underlying "ConfigureCommand"
| instance and you can use codemods to modify the source files.
|
*/

import ConfigureCommand from '@adonisjs/core/commands/configure'
import pkg from './package.json' assert { type: 'json' }

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.updateRcFile((transformer) => {
    transformer.addAssemblerHook('onSourceFileChanged', `${pkg.name}/hooks/generator_hook`)
    transformer.addAssemblerHook('onBuildStarting', `${pkg.name}/hooks/generator_hook`)
    transformer.addAssemblerHook('onDevServerStarted', `${pkg.name}/hooks/generator_hook`)
  })
}
