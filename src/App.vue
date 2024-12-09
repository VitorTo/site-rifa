<template>
  <div id="app">
    <header>
      <h1 style="line-height: 76px;font-size: 4rem;">Rifa Solidária</h1>
      <p class="lobster-two-bold sub-color mb-5" style="font-size: 8rem;line-height: 105px;">Jeh</p>
    </header>
    <div class="card m-4 p-2">
      <img src="./assets/premio.png" alt="">
    </div>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  margin-top: 60px;
}

body {
  background-color: #AB0000;
  background-image: url('./assets/bg-url.png');
}

* {
  font-family: "Lobster Two", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.sub-color {
  color: #FFD077;
}

.lobster-two-bold {
  font-family: "Lobster Two", sans-serif;
  font-weight: 700;
  font-style: normal;
}

.lobster-two-regular-italic {
  font-family: "Lobster Two", sans-serif;
  font-weight: 400;
  font-style: italic;
}

.lobster-two-bold-italic {
  font-family: "Lobster Two", sans-serif;
  font-weight: 700;
  font-style: italic;
}
</style>