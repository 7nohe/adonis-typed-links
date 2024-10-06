<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Link, router } from '@7nohe/adonis-typed-links/vue'

const onAboutClick = () => {
  router.visit({
    name: 'about'
  })
}

const onUserShowClick = () => {
  router.visit({
    name: 'users.show',
    params: { id: 1 },
  })
}
</script>

<template>
  <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">

    <Head title="Homepage" />
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Links</h2>
      <ul className="m-4">
        <li className="mb-2">
          <Link :to="{
            name: 'about'
          }" className="text-blue-500 hover:underline">
          About
          </Link>
        </li>
        <li>
          <Link :to="{
            name: 'users.show',
            params: { id: 1 }
          }" className="text-blue-500 hover:underline">
          Users/Show
          </Link>
        </li>
      </ul>
    </div>
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Manual Visits</h2>
      <ul className="m-4">
        <li className="mb-2">
          <button @click="onAboutClick" className=" bg-blue-500 text-white px-2 py-1 rounded m-2">
            About
          </button>
        </li>
        <li className="mb-2">
          <button @click="onUserShowClick" className="bg-blue-500 text-white px-2 py-1 rounded m-2">
            Users/Show
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
