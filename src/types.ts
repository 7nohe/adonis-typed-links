import {
  routes,
  getRoutes,
  postRoutes,
  patchRoutes,
  putRoutes,
  deleteRoutes,
  // @ts-ignore
} from '../generated/routes'

export type QueryInput = NodeJS.Dict<
  string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null
>

export type Route = typeof routes
export type RouteKey = keyof Route

export type GetRoute = typeof getRoutes
export type GetRouteKey = keyof GetRoute

export type PostRoute = typeof postRoutes
export type PostRouteKey = keyof PostRoute

export type PatchRoute = typeof patchRoutes
export type PatchRouteKey = keyof PatchRoute

export type PutRoute = typeof putRoutes
export type PutRouteKey = keyof PutRoute

export type DeleteRoute = typeof deleteRoutes
export type DeleteRouteKey = keyof DeleteRoute

export type ParamKey<T extends RouteKey> = NonNullable<Route[T]['params']>[number]
export type Params<T extends RouteKey> = Route[T]['params'] extends undefined
  ? undefined
  : { [key in ParamKey<T>]: string | number }

export type To<T extends RouteKey> =
  Params<T> extends undefined
    ? { name: T; query?: QueryInput }
    : { name: T; params: Params<T>; query?: QueryInput }
