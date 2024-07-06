<template>
  <div>{{ $t("Шаблон страницы") }}</div>
  <div>{{ check }}</div>
</template>

<script setup lang="ts">
const check = ref("");

useLocales().set("en");
</script>
