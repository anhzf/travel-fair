<template>
  <main class="container m-auto flex flex-col items-center gap-6">
    <div class="text-center">
      <h1>{{ $route.query.msg || 'Error' }}</h1>
    </div>
  </main>
</template>
