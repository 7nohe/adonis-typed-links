import { Link as InertiaLink, router as InertiaRouter, InertiaLinkProps } from '@inertiajs/react'
import type { VisitOptions, RequestPayload } from '@inertiajs/core'
import { useForm as useInertiaForm } from '@inertiajs/react'
import { FormDataConvertible } from '@inertiajs/core'
// @ts-ignore
import React from 'react'
import { createHref, setValue } from './utils'
import {
  DeleteRouteKey,
  GetRouteKey,
  PatchRouteKey,
  PostRouteKey,
  PutRouteKey,
  RouteKey,
  To,
} from './types'

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
  post<T extends PostRouteKey, U extends RequestPayload>(
    to: To<T>,
    data?: U,
    options?: Omit<VisitOptions, 'method' | 'data'>
  ) {
    const href = createHref(to)
    InertiaRouter.post(href, data, options)
  },
  put<T extends PutRouteKey, U extends RequestPayload>(
    to: To<T>,
    data: U extends undefined ? never : U,
    options?: Omit<VisitOptions, 'method' | 'data'>
  ) {
    const href = createHref(to)
    InertiaRouter.put(href, data, options)
  },
  patch<T extends PatchRouteKey, U extends RequestPayload>(
    to: To<T>,
    data: U extends undefined ? never : U,
    options?: Omit<VisitOptions, 'method' | 'data'>
  ) {
    const href = createHref(to)
    InertiaRouter.patch(href, data, options)
  },
  delete<T extends DeleteRouteKey>(to: To<T>, options?: Omit<VisitOptions, 'method'>) {
    const href = createHref(to)
    InertiaRouter.delete(href, options)
  },
}

type FormDataType = Record<string, FormDataConvertible>

export function useForm<TForm extends FormDataType>(initialValues?: TForm) {
  const form = useInertiaForm<TForm>(initialValues)

  function setData<K extends keyof TForm | TForm>(keyOrData: K, maybeValue?: K extends keyof TForm ? TForm[K] : never) {
    if (typeof keyOrData === 'object') {
      form.setData(keyOrData as TForm)
      return
    } else {
      const obj = setValue({ ...form.data }, keyOrData, maybeValue)
      form.setData(obj)
    }
  }

  return {
    ...form,
    setData,
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
  }
}
