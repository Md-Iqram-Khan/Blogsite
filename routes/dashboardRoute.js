const router = require("express").Router();
const { isAuthenticated } = require("../middleware/authMiddleware");
const profileValidator = require("../validator/dashboard/profileValidator");

const {
  dashboardGetController,
  createProfileGetController,
  createProfilePostController,
  editProfileGetController,
  editProfilePostController,
  bookmarksGetController,
  commentsGetController,
} = require("../controllers/dashboardRouteController");

router.get("/bookmarks", isAuthenticated, bookmarksGetController);

router.get("/comments", commentsGetController);

router.get("/create-profile", isAuthenticated, createProfileGetController);
router.post(
  "/create-profile",
  isAuthenticated,
  profileValidator,
  createProfilePostController
);

router.get("/edit-profile", isAuthenticated, editProfileGetController);
router.post(
  "/edit-profile",
  isAuthenticated,
  profileValidator,
  editProfilePostController
);

router.get("/", isAuthenticated, dashboardGetController);

module.exports = router;
