<template>
  <div id="app" class="container">
    <div id="nav">
      <a
        href="https://max480-random-stuff.appspot.com/celeste/custom-entity-catalog"
        class="active"
        >Custom Entity Catalog</a
      >
      |
      <a
        href="https://max480-random-stuff.appspot.com/celeste/everest-yaml-validator"
        >everest.yaml validator</a
      >
      |
      <a
        href="https://max480-random-stuff.appspot.com/celeste/update-checker-status"
        >Update Checker status</a
      >
      |
      <router-link to="/banana-mirror-browser">
        Banana Mirror Browser
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import "../node_modules/bootstrap/scss/bootstrap.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
