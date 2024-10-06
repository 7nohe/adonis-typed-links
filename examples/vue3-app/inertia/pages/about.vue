<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Link } from '@7nohe/adonis-typed-links/vue'
</script>

<template>

  <Head title="About" />
  <Link :to="{ name: 'home' }" className=" text-blue-500 hover:underline">
  Back to Home
  </Link>
</template>
