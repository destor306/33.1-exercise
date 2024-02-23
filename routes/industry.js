
const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res, next)=>{
    try{
        const results = await db.query(`
        SELECT i.code, i.industry, c.name AS company FROM industries AS i
        LEFT JOIN industry_companies AS ic
        ON i.id = ic.industry_id
        LEFT JOIN companies AS c
        ON ic.company_code = c.code
        `);
        return res.json({industries: results.rows})
    }
    catch(e){
        return next(e);
    }
})



router.post("/", async (req, res, next)=>{
    try{
        const {comp_code, amt} = req.body;
        const result = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *', [comp_code, amt]);
        return res.status(201).json({invoice: result.rows[0]})
    }catch(e){
        return next(e);
    }
})



module.exports = router;