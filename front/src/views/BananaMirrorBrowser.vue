<template>
  <div>
    <h1>Banana Mirror Browser</h1>

    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-else-if="error">
      <div class="warning">An error occurred.</div>
      <button class="btn btn-warning" v-on:click="reloadPage">Retry</button>
    </div>
    <div v-else>
      <form v-on:submit="searchStuff">
        <input
          v-model="query"
          class="search form-control"
          placeholder="Search a mod..."
        />
      </form>
      <table class="table table-striped">
        <tbody>
          <tr v-bind:key="mod.id" v-for="mod in mods">
            <td class="first">
              <a
                :href="mod.gbLink"
                class="gb-link"
                target="_blank"
                rel="noopener"
                >{{ mod.name }}</a
              >
              <span class="mod-id">[{{ mod.id }}]</span>
            </td>
            <td class="second">
              <a class="btn btn-primary" :href="'everest:' + mod.url">
                1-click install
              </a>
              <a class="btn btn-secondary" :href="mod.url">Download</a>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="paginator">
        <button
          class="btn btn-outline-secondary"
          :disabled="page <= 1"
          v-on:click="firstPage"
        >
          &lt;&lt;
        </button>
        <button
          class="btn btn-outline-secondary"
          :disabled="page <= 1"
          v-on:click="previousPage"
        >
          &lt;
        </button>
        {{ page }} / {{ pageCount }}
        <button
          class="btn btn-outline-secondary"
          :disabled="page >= pageCount"
          v-on:click="nextPage"
        >
          &gt;
        </button>
        <button
          class="btn btn-outline-secondary"
          :disabled="page >= pageCount"
          v-on:click="lastPage"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../config";

const vue = {
  name: "banana-mirror-browser",
  data: () => ({
    page: 1,
    totalCount: 0,
    query: "",
    mods: [],
    loading: true,
    error: false,
  }),
  methods: {
    firstPage: function () {
      this.page = 1;
      this.reloadPage();
    },
    previousPage: function () {
      this.page--;
      this.reloadPage();
    },
    nextPage: function () {
      this.page++;
      this.reloadPage();
    },
    lastPage: function () {
      this.page = this.pageCount;
      this.reloadPage();
    },
    searchStuff: function () {
      this.page = 1;
      this.reloadPage();
    },
    reloadPage: async function () {
      try {
        this.loading = true;
        this.error = false;
        const result = await axios.get(
          `${config.backendUrl}/api/mods?page=${this.page}` +
            (this.query === "" ? "" : `&q=${encodeURIComponent(this.query)}`)
        );
        this.loading = false;
        this.totalCount = result.headers["x-total-count"];
        this.mods = result.data;
      } catch (e) {
        console.error(e);
        this.error = true;
        this.loading = false;
      }
    },
  },
  computed: {
    pageCount: function () {
      return Math.max(1, Math.floor((this.totalCount - 1) / 20 + 1));
    },
  },
  mounted: function () {
    this.reloadPage();
  },
};

export default vue;
</script>

<style scoped lang="scss">
.first {
  text-align: left;
  vertical-align: middle;
  font-size: 14pt;

  @media (max-width: 800px) {
    font-size: 12pt;
  }
}
.second {
  text-align: right;
  vertical-align: middle;
}
.mod-id {
  color: #666;
  font-style: italic;
  font-size: 12pt;
  padding-left: 5px;

  @media (max-width: 800px) {
    font-size: 10pt;
  }
}
.btn {
  margin: 2px;
}

@media (max-width: 500px) {
  .only-if-wide-enough {
    display: none;
  }
}

.loading,
.error {
  margin-top: 30px;
  font-size: 16pt;
}
.error {
  color: #ff8000;
}

.paginator {
  font-size: 14pt;

  .btn {
    margin: 5px 2px;
  }

  margin-bottom: 30px;
}

.search {
  margin-top: 20px;
  margin-bottom: 20px;
}

.gb-link {
  color: rgb(33, 37, 41);
}
</style>
