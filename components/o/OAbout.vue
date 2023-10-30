<template>
  <section class="flex flex-col items-center p-8">
    <h2 class="text-3xl font-bold mb-4">About Me</h2>
    <p class="text-lg mb-4 text-center">
      Hello! I'm Takuma from Japan, a frontend engineer. Currently, I live in
      Spain. I like sports and traveling.
    </p>
    <img
      src="/profile.jpeg"
      alt="profile"
      class="rounded-full h-64 w-64 object-cover mb-4"
    />
    <div class="flex space-x-4 text-4xl">
      <NuxtLink
        :to="LINK.LINKEDIN"
        target="_blank"
        class="hover:text-gray-400 transition duration-300"
      >
        <UIcon name="i-bxl-linkedin" />
      </NuxtLink>
      <NuxtLink
        :to="LINK.TWITTER"
        target="_blank"
        class="hover:text-gray-400 transition duration-300"
      >
        <UIcon name="i-bxl-twitter" />
      </NuxtLink>
      <NuxtLink
        :to="LINK.GITHUB"
        target="_blank"
        class="hover:text-gray-400 transition duration-300"
      >
        <UIcon name="i-bxl-github" />
      </NuxtLink>
    </div>
    <p class="text-lg mb-8 text-center">I hope you enjoy my blogs.</p>
  </section>
</template>
