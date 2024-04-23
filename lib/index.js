/** 
 * @fileoverview ESLint plugin with bstrict rules.
 * @author b.ignited
*/
"use strict";

const maxFunctionSizeRule = require("./rules/max-function-size");
const plugin = {
    rules: {
        "max-function-size": maxFunctionSizeRule,
    }
};
module.exports = plugin;