// Import the ESLint plugin
const eslintPluginBstrict = require("./lib/index.js");

module.exports = [
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            ecmaVersion: "latest",
        },
        // Using the eslint-plugin-bstrict plugin defined locally
        plugins: { "bstrict": eslintPluginBstrict },
        rules: {
            "bstrict/max-function-size": ["warn", 9]
        },
    }
]