const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const c = require("config");

const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile
// @desc    get current users profile
// @access  private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile)
      return res.status(400).json({ msg: "There is no profile for this user" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile
// @desc    Create or Update user profile
// @access  private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      user,
      //   handle,
      status,
      company,
      location,
      website,
      skills,
      bio,
      githubusername,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    // if (handle) profileFields.handle = handle;
    if (user) profileFields.user = user;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build social object

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // Create

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/profile/iser/:user_id
// @desc    get all profiles by user ID
// @access  public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profiles = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profiles) return res.status(400).json({ msg: "Profile not found" });

    res.json(profiles);
  } catch (err) {
    console.error(err.message);

    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});
// @route   DELETE api/profile
// @desc    DELETE all profile, user & posts
// @access  private

router.delete("/", auth, async (req, res) => {
  try {
    // Remove user posts

    // Remove profile
    await Profile.findOneAndDelete({ user: req.user.id });

    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
});

// @route   Put api/profile/exprience
// @desc    Add profile exprience
// @access  private

router.put(
  "/experience",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExprience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExprience);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   delete api/profile/exprience/:exp_id
// @desc   delete  Add profile exprience from profile
// @access  private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index

    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   put api/profile/education
// @desc     Add profile education
// @access  Public

router.put(
    "/education",
    [
      auth,
      check("school", "school is required").not().isEmpty(),
      check("degree", "degree is required").not().isEmpty(),
      check("fieldofstudy", "filedstudy date is required").not().isEmpty(),
    ],
  
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }
  
      const { title, school, location, from, to, degree, fieldofstudy } =
        req.body;
  
      const newEducation = {
        title,
        school,
        location,
        from,
        to,
        degree,
        fieldofstudy,
      };
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(newEducation);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    }
  );



// @route   delete api/profile/education/:exp_id
// @desc   delete  Add profile education from profile
// @access  private

router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
  
      //get remove index
  
      const removeIndex = profile.education
        .map((item) => item.id)
        .indexOf(req.params.edu_id);
  
      profile.education.splice(removeIndex, 1);
  
      await profile.save();
  
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

module.exports = router;
