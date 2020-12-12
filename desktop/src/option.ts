import * as path from "path";

export default {
  icon: {
    file: path.resolve(path.join(__dirname, "../../../../src/assets/icons/favicon.png")),
  },
  local: {
    host: "http://localhost:4200",
    file: path.join(__dirname, "../../../../dist/frontend/index.html"),
  },
  electron: {
    module: require(path.join(__dirname, "../../../../node_modules/electron")),
  },
};
