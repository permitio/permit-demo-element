import {defineConfig} from "cypress";

export default defineConfig({
    projectId: "wx71n2",
    chromeWebSecurity: false,
    component: {
        devServer: {
            framework: "create-react-app",
            bundler: "webpack",
        },
    },
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: 'http://localhost:3001',
    },
});
