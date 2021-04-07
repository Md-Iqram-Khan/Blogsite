const Post = require("../models/Post");
const Profile = require("../models/Profile");
const moment = require("moment");

function generateDate(days) {
  let date = moment().subtract(days, "days");
  return date.toDate();
}

function generateFilterObject(filter) {
  let filterObject = {};
  let order = 1;

  switch (filter) {
    case "week": {
      filterObj = {
        createdAt: {
          $gt: generateDate(7),
        },
      };
      order = -1;
      break;
    }
    case "month": {
      filterObj = {
        createdAt: {
          $gt: generateDate(30),
        },
      };
      order = -1;
      break;
    }
    case "all": {
      order = -1;
      break;
    }
  }

  return {
    filterObject,
    order,
  };
}

exports.explorerGetController = async (req, res, next) => {
  let filter = req.query.filter || "latest";
  let currentPage = parseInt(req.query.page) || 1;
  let itemPerPage = 10;

  let { order, filterObject } = generateFilterObject(filter.toLowerCase());

  try {
    let posts = await Post.find(filterObject)
      .populate("author", "username")
      .sort(order === 1 ? "-createdAt" : "createdAt")
      .skip(itemPerPage * currentPage - itemPerPage)
      .limit(itemPerPage);

    let totalPost = await Post.countDocuments();
    let totalPage = Math.ceil(totalPost / itemPerPage);

    let bookmarks = [];
    if (req.user) {
      let profile = await Profile.findOne({ user: req.user._id });
      if (profile) {
        bookmarks = profile.bookmarks;
      }
    }

    res.render("pages/explorer/explorer", {
      title: "Explore all posts",
      filter,
      posts,
      itemPerPage,
      currentPage,
      totalPage,
      bookmarks,
    });
  } catch (e) {
    next(e);
  }
};

exports.singlePostGetController = async (req, res, next) => {
  let { postId } = req.params;

  try {
    let post = await Post.findById(postId)
      .populate("author", "username profilePics")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profilePics",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies.user",
          select: "username profilePics",
        },
      });
    if (!post) {
      let error = new Error("404 not found");
      error.status = 404;
      throw error;
    }
    let bookmarks = [];
    if (req.user) {
      let profile = await Profile.findOne({ user: req.user._id });
      if (profile) {
        bookmarks = profile.bookmarks;
      }
    }

    res.render("pages/explorer/singlePage", {
      title: post.title,
      post,
      bookmarks,
    });
  } catch (e) {
    next(e);
  }
};
