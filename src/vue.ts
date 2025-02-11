import { defineComponent, h, reactive, SetupContext } from 'vue'
import {
  DeleteRouteKey,
  GetRouteKey,
  PatchRouteKey,
  PostRouteKey,
  PutRouteKey,
  RouteKey,
  To,
} from './types'
import { Link as InertiaLink, InertiaLinkProps, router as InertiaRouter } from '@inertiajs/vue3'
import type { VisitOptions, RequestPayload } from '@inertiajs/core'
import { createHref } from './utils'
import { useForm as useInertiaForm } from '@inertiajs/vue3'
import { FormDataConvertible } from '@inertiajs/core'

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

type FormDataType = Record<string, FormDataConvertible>

export function useForm<TForm extends FormDataType>(initialValues: TForm) {
  const innerForm = useInertiaForm<TForm>(initialValues)

  const form = reactive({
    ...innerForm,
    get<T extends keyof GetRouteKey>(to: To<T>, options?: Omit<VisitOptions, 'method'>) {
      const href = createHref(to)
      form.get(href, options)
    },
    post<T extends PostRouteKey>(to: To<T>, options?: Omit<VisitOptions, 'method'>) {
      const href = createHref(to)
      form.post(href, options)
    },
    put<T extends PutRouteKey>(to: To<T>, options?: Omit<VisitOptions, 'method'>) {
      const href = createHref(to)
      form.put(href, options)
    },
    patch<T extends PatchRouteKey>(to: To<T>, options?: Omit<VisitOptions, 'method'>) {
      const href = createHref(to)
      form.patch(href, options)
    },
    delete<T extends DeleteRouteKey>(to: To<T>, options?: Omit<VisitOptions, 'method'>) {
      const href = createHref(to)
      form.delete(href, options)
    },
  })

  return form
}
