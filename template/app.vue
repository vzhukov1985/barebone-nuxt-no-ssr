<template>
  <Html lang="ru">
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
    <Body class="antialiased">
      <NuxtPage />
    </Body>
  </Html>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) =>
    titleChunk ? `${titleChunk} - Barebone template` : `Barebone template`,
});
</script>

<style>
@font-face {
  font-family: "Nata Sans";
  src:
    url("/NataSans-Black.woff2") format("woff2"),
    url("/NataSans-Black.woff") format("woff");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Nata Sans";
  src:
    url("/NataSans-Light.woff2") format("woff2"),
    url("/NataSans-Light.woff") format("woff");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Nata Sans";
  src:
    url("/NataSans-Regular.woff2") format("woff2"),
    url("/NataSans-Regular.woff") format("woff");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Nata Sans";
  src:
    url("/NataSans-Bold.woff2") format("woff2"),
    url("/NataSans-Bold.woff") format("woff");
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Nata Sans";
  src:
    url("/NataSans-Semibold.woff2") format("woff2"),
    url("/NataSans-Semibold.woff") format("woff");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Nata Sans";
  src:
    url("/NataSans-Thin.woff2") format("woff2"),
    url("/NataSans-Thin.woff") format("woff");
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}
</style>
