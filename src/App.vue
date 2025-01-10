<template>
<div id="app">
    <header>
      <!-- <img 
        src="/src/assets/message.png"
      > -->
      <h1 class="sub-title">Rifa</h1>
      <span class="title lobster-two-bold sub-color">Adeus às contas</span>
    </header>

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
  background: linear-gradient(rgba(213, 185, 135, 0.6), rgba(213, 185, 135, 0.4)),
    url('./assets/bg-url.png') center/cover no-repeat;
}

* {
  font-family: "Lobster Two", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.cursor-pointer {
  cursor: pointer!important;
}

.sub-color {
  color: #FFD077;
}

.bg-sub-color {
  background-color: #FFD077;
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

/* .blob-polygon {
  width: 300px;
  height: 300px;
  background-color: #3ca9e2;
  clip-path: polygon(
    25% 2%,
    80% 4%,
    100% 50%,
    90% 85%,
    50% 100%,
    10% 100%,
    0% 61%
  );
} */

/* MOBILE */
.sub-title {
  font-size: 2rem;
  line-height: 0px;
}
.title {
  font-size: 3.5rem;
  line-height: 50px;
}

.info-left {
  width: 8rem;
  height: 3.5rem;
  font-size: 1.25rem;
  line-height: 1.5rem;
  border-top-right-radius: 2rem;
  border-bottom-right-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
}

.info-center .item-pointer {
  width: 16px;
  height: 16px;
}

.info-center span.lobster-two-bold{
  font-size: 1.2rem;
}

.info-right {
  width: 8rem;
  height: 3.5rem;
  font-size: 1.25rem;
  line-height: 1.5rem;
  border-top-left-radius: 2rem;
  border-bottom-left-radius: 2rem;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: nowrap;
}

/* Tablet */
@media screen and (min-width: 768px) {
  .sub-title {
    font-size: 4rem;
    line-height: 15px;
  }
  .title {
    font-size: 8rem;
    line-height: 105px;
  }
  .info-center {
    display: flex;
    gap: 1rem;
  }
  .info-center span.lobster-two-bold{
    font-size:1.5rem;
  }
}
</style>