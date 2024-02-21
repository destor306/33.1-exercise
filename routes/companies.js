
const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res, next)=>{
    try{
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({companies: results.rows})
    }
    catch(e){
        return next(e);
    }
})


router.get("/:code", async (req, res, next)=>{
    try{
        const {code} = req.params;
        console.log(code);
        const results = await db.query(`SELECT * FROM companies WHERE code=$1`, [code]);
        if (results.rows.length ===0){
            throw new ExpressError(`Can't find company with id of ${id}`, 404);
        }
        return res.json({company: results.rows[0]})
    }
    catch(e){
        return next(e);
    }
})



module.exports = router;