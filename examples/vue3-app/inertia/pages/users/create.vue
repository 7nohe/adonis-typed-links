<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Link, useForm } from '@7nohe/adonis-typed-links/vue'

const form = useForm({
  name: '',
})

const handleSubmit = () => {
  console.log(form.name)
  form.post({
    name: 'users.store'
  })
}


</script>
<template>

  <Head title="Create User" />
  <Link :to="{ name: 'home' }" className="text-blue-500 hover:underline">
  Back to Home
  </Link>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" type="text" name="name" class="border border-gray-400 rounded m-2" />
    <button type="submit" class="bg-blue-500 text-white px-2 py-1 rounded m-2">Submit</button>
  </form>
</template>
