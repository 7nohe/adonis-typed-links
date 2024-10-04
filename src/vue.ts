import { defineComponent, h, SetupContext } from 'vue'
import { RouteKey, To } from './types'
import { Link as InertiaLink, InertiaLinkProps, router as InertiaRouter } from '@inertiajs/vue3'
import type { VisitOptions, RequestPayload } from '@inertiajs/core'
import { createHref } from './utils'

export const Link = defineComponent(
  <T extends RouteKey>(
    props: Omit<InertiaLinkProps, 'href'> & { to: To<T> },
    context: SetupContext
  ) => {
    const href = createHref(props.to)
    const { to, ...inertiaLinkProps } = props
    const { slots } = context

    return () => {
      return h(InertiaLink, { href, ...inertiaLinkProps }, slots)
    }
  },
  {
    // workaround: https://github.com/vuejs/core/issues/10167#issuecomment-1902767162
    props: ['to'] as any,
  }
)

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
