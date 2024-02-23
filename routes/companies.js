
const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");
const slugify = require("slugify");

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
        const results = await db.query(`
        SELECT c.code, c.name, c.description,  i.industry 
        FROM companies AS c 
        LEFT JOIN industry_companies AS ic
        ON c.code=ic.company_code
        LEFT JOIN industries AS i
        ON ic.industry_id = i.id
        WHERE c.code=$1`, [code]);
        if (results.rows.length ===0){
            throw new ExpressError(`Can't find company with id of ${code}`, 404);
        }

        const iResult = await db.query(`SELECT * FROM invoices WHERE comp_code=$1`, [code]);
        if(iResult.rows.length ===0){
            throw new ExpressError(`Can't find company invoices code of ${code}`, 404);
        }
        const company = results.rows[0];
        company.invoices = iResult.rows;
        return res.json({company: company})
    }
    catch(e){
        return next(e);
    }
})

router.post("/", async (req, res, next)=>{
    try{
        const { name, description} = req.body;
        const code = slugify(name, {lower: true});
        console.log(code);
        const result = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *', [code, name, description]);
        return res.status(201).json({company: result.rows[0]})
    }catch(e){
        return next(e);
    }
})

router.patch('/:code', async (req, res, next)=>{
    try{
        const {code} = req.params;
        const {name, description} = req.body;
        const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *', [name,description,code]);
        if (results.rows.length ===0){
            throw new ExpressError(`Can't update company with code of ${code}`, 404);
        }
        return res.send({company: results.rows[0]})
    }
    catch(e){
        return next(e);
    }
})

router.delete('/:code', async (req, res, next)=>{
    try{
        const results = await db.query('DELETE FROM companies WHERE code=$1', [req.params.code]);
        return res.send({status: "deleted"})
    }
    catch(e){
        return next(e);
    }
})


module.exports = router;