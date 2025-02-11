import { Head } from '@inertiajs/react'
import { Link, useForm } from '@7nohe/adonis-typed-links/react'

export default function Create() {
  const form = useForm({
    name: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post({
      name: 'users.store',
    })
  }

  return (
    <>
      <Head title="Create User" />
      <Link to={{ name: 'home' }} className="text-blue-500 hover:underline">
        Back to Home
      </Link>
      <form onSubmit={handleSubmit}>
        <h1>Create User</h1>
        <input
          type="text"
          name="name"
          value={form.data.name}
          onChange={(e) => form.setData('name', e.target.value)}
          className="border border-gray-400 rounded m-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded m-2">
          Submit
        </button>
      </form>
    </>
  )
}
