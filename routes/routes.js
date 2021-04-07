const authRoute = require("./authRoute");
const dashboardRoute = require("./dashboardRoute");
const uploadRoute = require("./uploadRoute");
const postRoute = require("./postRoute");
const explorerRoute = require("./explorerRoute");
const searchRoute = require("./searchRoute");
const authorRoute = require("./authorRoute");

const apiRoutes = require("../api/routes/apiRoutes");

const routes = [
  {
    path: "/auth",
    handler: authRoute,
  },
  {
    path: "/dashboard",
    handler: dashboardRoute,
  },
  {
    path: "/upload",
    handler: uploadRoute,
  },
  {
    path: "/posts",
    handler: postRoute,
  },
  {
    path: "/explorer",
    handler: explorerRoute,
  },
  {
    path: "/search",
    handler: searchRoute,
  },
  {
    path: "/author",
    handler: authorRoute,
  },
  {
    path: "/api",
    handler: apiRoutes,
  },
  {
    path: "/",
    handler: (req, res) => {
      res.redirect("/explorer");
    },
  },
];

module.exports = (app) => {
  routes.forEach((r) => {
    if (r.path === "/") {
      app.get(r.path, r.handler);
    } else {
      app.use(r.path, r.handler);
    }
  });
};
