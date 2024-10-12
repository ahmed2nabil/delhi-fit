// routes/recordRoutes.js
const express = require('express');
const { getAllPlan, getPlan, addMultiplePlan} = require('../controllers/planFileController');
const router = express.Router();

// Protect the route with auth middleware
router.route("/")
    .get(getAllPlan)
    .post(addMultiplePlan);


router.route("/:planId")
    .get(getPlan)


module.exports = router;
