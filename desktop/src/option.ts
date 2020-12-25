import * as path from "path";

export default {
  icon: {
    file: path.resolve(path.join(__dirname, "../../frontend/assets/icons/favicon.png")),
    exit: path.resolve(path.join(__dirname, "../../frontend/assets/icons/exit.png")),
  },
  local: {
    host: "http://localhost:4200",
    file: path.join(__dirname, "../../frontend/index.html"),
  },
  electron: {
    module: require(path.join(__dirname, "../../../node_modules/electron")),
  },
};
