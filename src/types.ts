// @ts-ignore
import { routes } from '../generated/routes'

export type QueryInput = NodeJS.Dict<
  string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null
>

export type Route = typeof routes
export type RouteKey = keyof Route
export type ParamKey<T extends RouteKey> = NonNullable<Route[T]['params']>[number]
export type Params<T extends RouteKey> = Route[T]['params'] extends undefined
  ? undefined
  : { [key in ParamKey<T>]: string | number }

export type To<T extends RouteKey> =
  Params<T> extends undefined
    ? { name: T; query?: QueryInput }
    : { name: T; params: Params<T>; query?: QueryInput }
