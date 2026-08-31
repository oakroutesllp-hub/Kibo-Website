import { defineCliConfig } from "sanity/cli";

// Lets `npx sanity <command>` (e.g. `sanity documents create`, `sanity cors
// list`) auto-detect the project/dataset when run from `web/`, without
// needing --project-id/--dataset flags every time.
export default defineCliConfig({
  api: {
    projectId: "b4smbv76",
    dataset: "production",
  },
});
