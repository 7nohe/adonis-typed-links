import type { AssemblerHookHandler } from '@adonisjs/core/types/app'
import { generateTypedRoutes } from '../generate_typed_routes.js'

/**
 * The hook to generate typed routes
 */
const hookHandlder: AssemblerHookHandler = async ({ logger }) => {
  try {
    await generateTypedRoutes()
    logger.success('Typed routes generated successfully')
  } catch (error) {
    logger.error('Failed to generate typed routes')
    logger.fatal(error)
  }
}

export default hookHandlder
