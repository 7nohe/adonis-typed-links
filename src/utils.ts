// @ts-ignore
import { routes } from '../generated/routes'
import { To } from './types'

export function createHref<T>(to: To<T>) {
  const { name, query } = to
  let baseUrl: string = routes[name].pattern
  if ('params' in to && to.params !== undefined) {
    for (const [paramKey, paramValue] of Object.entries<string | number>(to.params)) {
      baseUrl = baseUrl.replace(`:${paramKey}`, paramValue.toString())
    }
  }

  const searchParams = Object.entries(query ?? {}).reduce(
    (acc: Record<string, string>, [key, value]: any) => {
      if (Array.isArray(value)) {
        acc[key] = value.join(',')
        return acc
      }
      acc[key] = value.toString()
      return acc
    },
    {} as Record<string, string>
  )
  const parsedParams = query ? `?${new URLSearchParams(searchParams).toString()}` : ''
  const hrefString = `${baseUrl}${parsedParams}`
  return hrefString
}
