"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
exports.default = {
    icon: {
        file: path.resolve(path.join(__dirname, "../src/assets/icons/favicon.png")),
    },
    local: {
        host: "http://localhost:4200",
        file: path.join(__dirname, "../dist/index.html"),
    },
    electron: {
        module: require(path.join(__dirname, "../node_modules/electron")),
    },
};
//# sourceMappingURL=option.js.map