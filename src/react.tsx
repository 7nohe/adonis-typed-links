import { Link as InertiaLink, router as InertiaRouter, InertiaLinkProps } from '@inertiajs/react'
import type { VisitOptions, RequestPayload } from '@inertiajs/core'
// @ts-ignore
import React from 'react'
import { createHref } from './utils'
import { RouteKey, To } from './types'

export function Link<T extends RouteKey>(
  props: Omit<InertiaLinkProps, 'href' | 'to'> & {
    to: To<T>
  }
) {
  const { to, children, ...rest } = props

  const href = createHref(to)

  return (
    <InertiaLink {...rest} href={href}>
      {children}
    </InertiaLink>
  )
}

export const router = {
  ...InertiaRouter,
  visit<T extends RouteKey>(to: To<T>, options?: VisitOptions) {
    const href = createHref(to)
    InertiaRouter.visit(href, options)
  },
  post<T extends RouteKey, U extends RequestPayload>(
    to: To<T>,
    data?: U,
    options?: Omit<VisitOptions, 'method' | 'data'>
  ) {
    const href = createHref(to)
    InertiaRouter.post(href, data, options)
  },
  put<T extends RouteKey, U extends RequestPayload>(
    to: To<T>,
    data: U extends undefined ? never : U,
    options?: Omit<VisitOptions, 'method' | 'data'>
  ) {
    const href = createHref(to)
    InertiaRouter.put(href, data, options)
  },
  patch<T extends RouteKey, U extends RequestPayload>(
    to: To<T>,
    data: U extends undefined ? never : U,
    options?: Omit<VisitOptions, 'method' | 'data'>
  ) {
    const href = createHref(to)
    InertiaRouter.patch(href, data, options)
  },
  delete<T extends RouteKey>(to: To<T>, options?: Omit<VisitOptions, 'method'>) {
    const href = createHref(to)
    InertiaRouter.delete(href, options)
  },
}
