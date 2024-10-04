import { Head } from '@inertiajs/react'
import { Link } from '@7nohe/adonis-typed-links/react'

export default function About() {
  return (
    <>
      <Head title="About" />
      <Link to={{ name: 'home' }} className="text-blue-500 hover:underline">
        Back to Home
      </Link>
    </>
  )
}
