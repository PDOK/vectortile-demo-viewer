import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const getCompareSnapshotsPlugin = require("cypress-image-diff-js/plugin");
      getCompareSnapshotsPlugin(on, config);
    },
  },
});
