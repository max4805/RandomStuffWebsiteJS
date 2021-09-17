<template>
  <div id="app" class="container">
    <div id="nav">
      <a
        href="https://max480-random-stuff.appspot.com/celeste/custom-entity-catalog"
        >Custom&nbsp;Entity&nbsp;Catalog</a
      >
      <span class="sep"> | </span>
      <a
        href="https://max480-random-stuff.appspot.com/celeste/everest-yaml-validator"
        >everest.yaml&nbsp;validator</a
      >
      <span class="sep"> | </span>
      <a
        href="https://max480-random-stuff.appspot.com/celeste/update-checker-status"
        >Update&nbsp;Checker&nbsp;status</a
      >
      <span class="sep"> | </span>
      <router-link to="/banana-mirror-browser"
        >Banana&nbsp;Mirror&nbsp;Browser</router-link
      >
      <span class="sep break"> | </span>
      <a href="https://max480-random-stuff.appspot.com/celeste/font-generator"
        >Font&nbsp;Generator</a
      >
      <span class="sep"> | </span>
      <router-link to="/wipe-converter">Wipe&nbsp;Converter</router-link>
      <span class="sep"> | </span>
      <a href="https://max480-random-stuff.appspot.com/discord-bots/"
        >Discord&nbsp;Bots</a
      >
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

// list-style navbar when the resolution is too small
@media (max-width: 450px) {
  .sep {
    display: none;
  }

  #nav a {
    display: block;
  }
}
// line break when the screen is wide enough
@media (min-width: 1200px) {
  .break {
    display: block;
    height: 0px;
    overflow: hidden;
  }
}

// dark theme colors
@media (prefers-color-scheme: dark) {
  // global app colors
  body {
    background-color: black;
  }
  #app {
    color: #dedad6;
  }

  // navbar colors
  #nav a {
    color: #a5a5a5;
  }
  #nav a.router-link-active {
    color: #4ed898;
  }

  // button colors
  .btn-primary {
    background-color: #004dbf;
    border-color: #125cc8;
  }
  .btn-secondary {
    background-color: #484e53;
    border-color: #555d64;
  }
  .btn-outline-secondary {
    color: #909ca6;
    border-color: #909ca6;
  }

  // table colors
  .table {
    border-color: #75787b;
  }
  .table-striped > tbody > tr:nth-of-type(2n + 1) {
    background-color: #222;
  }

  // form control colors
  .form-control {
    background-color: rgba(0, 0, 0, 0);
    border-color: #83888c;
    color: #dedad6;

    &::placeholder {
      color: #8e8e8e;
    }
  }
  .form-control:focus {
    background-color: rgba(0, 0, 0, 0);
    color: #dedad6;
    border-color: #125cc8;
  }
}
</style>
