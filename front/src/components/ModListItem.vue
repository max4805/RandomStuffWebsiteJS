<template>
  <div class="mod-container">
    <div
      class="bg"
      v-if="mod.screenshots.length >= 2"
      :style="
        'background: url(\'https://max480-random-stuff.appspot.com/celeste/banana-mirror-image?src=' +
        mod.screenshots[1] +
        '\') center / cover;'
      "
    />
    <div class="darken" v-if="mod.screenshots.length >= 2" />

    <div
      class="contents"
      :style="mod.screenshots.length >= 2 ? 'margin-top: -290px' : ''"
    >
      <div>
        <a :href="mod.gbLink" rel="noopener" target="_blank" class="gb-link">{{
          mod.name
        }}</a>
      </div>
      <div class="secondary">{{ mod.author }}</div>
      <table>
        <tr style="mod-screenshot-and-meta">
          <td>
            <div class="screenshot">
              <img
                :src="
                  'https://max480-random-stuff.appspot.com/celeste/banana-mirror-image?src=' +
                  mod.screenshots[0]
                "
              />
            </div>
          </td>
          <td>
            <div class="secondary metadata">
              {{
                new Date(mod.createdDate * 1000).toLocaleDateString(undefined, {
                  hour12: false,
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              }}<br />
              {{ mod.views }} view{{ mod.views === 1 ? "" : "s" }} -
              {{ mod.likes }} like{{ mod.likes === 1 ? "" : "s" }}<br />
              {{ mod.downloads }} download{{ mod.downloads === 1 ? "" : "s" }}
            </div>
          </td>
        </tr>
      </table>
      <div>
        {{ mod.description }}
      </div>

      <div class="actions">
        <button class="btn btn-secondary" v-on:click="openDescription">
          Description
        </button>
        <button class="btn btn-success" v-on:click="openDownloads">
          Download
        </button>
      </div>
    </div>

    <div class="modal fade show" tabindex="-1" v-if="descriptionShown">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ mod.name }}</h5>
            <button
              type="button"
              class="btn btn-link close"
              aria-label="Close"
              v-on:click="closeDescription"
            >
              ×
            </button>
          </div>
          <div class="modal-body">
            <p v-html="mod.text"></p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade show" tabindex="-1" v-if="downloadsShown">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Download {{ mod.name }}</h5>
            <button
              type="button"
              class="btn btn-link close"
              aria-label="Close"
              v-on:click="closeDownloads"
            >
              ×
            </button>
          </div>
          <div class="modal-body">
            <table class="table table-striped">
              <tbody>
                <tr
                  v-bind:key="file[0]"
                  v-for="file in Object.entries(mod.files)"
                >
                  <td class="first">
                    {{ file[0] }}
                  </td>
                  <td class="second">
                    <a class="btn btn-primary" :href="'everest:' + file[1]">
                      1-click install
                    </a>
                    <a class="btn btn-secondary" :href="file[1]">Download</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal-backdrop fade show"
      v-if="descriptionShown || downloadsShown"
    />
  </div>
</template>

<script>
export default {
  props: ["mod"],
  data: () => ({
    descriptionShown: false,
    downloadsShown: false,
  }),
  methods: {
    openDescription() {
      this.descriptionShown = true;
    },
    closeDescription() {
      this.descriptionShown = false;
    },
    openDownloads() {
      this.downloadsShown = true;
    },
    closeDownloads() {
      this.downloadsShown = false;
    },
  },
};
</script>

<style lang="scss" scoped>
// frame that contains the mod info
.mod-container {
  text-align: left;
  border: solid #aaa 1px;
  border-radius: 5px;
  height: 300px;
  margin: 12px 0 12px 0;

  overflow: hidden;
  position: relative;

  @media (prefers-color-scheme: dark) {
    border: solid #777 1px;
  }
}

// title that links to the GameBanana page
.gb-link {
  color: rgb(33, 37, 41);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media (prefers-color-scheme: dark) {
    color: #dedad6;
  }
}

.show {
  display: block;
}

// blurry background
.bg {
  height: 300px;
  width: 100%;

  filter: blur(8px);
  -webkit-filter: blur(8px);

  position: relative;
  z-index: -2;
}

// extra layer to darken / brighten the blurry background
.darken {
  background-color: white;
  opacity: 85%;
  height: 300px;
  width: 100%;
  margin-top: -300px;

  position: relative;
  z-index: -1;

  @media (prefers-color-scheme: dark) {
    background-color: black;
    opacity: 70%;
  }
}

// actual contents of the frame
.contents {
  margin: 10px;
}

.screenshot {
  display: inline-block;

  img {
    max-width: 120px;
    max-height: 120px;
    width: auto;
    height: auto;
  }
}

// all "secondary" text that is greyed out a bit
.secondary {
  color: #666;

  @media (prefers-color-scheme: dark) {
    color: #888;
  }
}

// date, view count, like count, download count
.metadata {
  display: table-cell;
  height: 120px;
  margin-left: 15px;
  vertical-align: middle;
  padding-left: 10px;
}

// description and download buttons
.actions {
  position: absolute;
  bottom: 15px;
  right: 15px;

  button {
    margin-left: 10px;
  }
}

// dark theme for modal dialogs
@media (prefers-color-scheme: dark) {
  .modal-content {
    background-color: black;
    border-color: #777;
  }
}

// custom close button
.close {
  color: black;
  text-decoration: none;
  font-size: 20pt;
  padding: 0 10px;

  @media (prefers-color-scheme: dark) {
    color: white;
  }

  &:hover {
    color: #888;
  }
}

// style for the download dialog: label
.first {
  text-align: left;
  vertical-align: middle;
  font-size: 14pt;
  color: rgb(33, 37, 41);

  @media (max-width: 800px) {
    font-size: 12pt;
  }

  @media (prefers-color-scheme: dark) {
    color: #dedad6;
  }
}

// style for the download dialog: buttons column
.second {
  text-align: right;
  vertical-align: middle;

  .btn {
    margin: 2px;
  }
}
</style>
