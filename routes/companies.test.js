process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");


let testCompany;

beforeEach(async ()=>{
    const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ('amz', 'AMAZON', 'Amazon Prime') RETURNING *`)
    testCompany = result.rows[0];
})

afterEach(async() =>{
    await db.query(`DELETE FROM companies`);
})

afterAll(async() =>{
    await db.end();
})

describe("Get /companies", ()=>{
    test("Get a list with one company", async ()=>{
        const res = await request(app).get("/companies");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({companies: [testCompany]})
    })
})

describe("Get /companies/:code", ()=>{
    test("Get a single company", async()=>{
        const res = await request(app).get(`/companies/${testCompany.code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({company: testCompany});

    })
    test("Response 404 for invalid code", async ()=>{
        const res = await request(app).get("/companies/sldkj");
        expect(res.statusCode).toBe(404);
    })
})

describe("Post /companies", ()=>{
    test("Creates a single company", async()=>{
        const res = await request(app).post('/companies').send({code: 'ssg', name:'SamSung', description:'Galaxy 24'});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            company:{
                code:'ssg',
                name: 'SamSung',
                description: 'Galaxy 24'
            }
        })
    })
})

describe("Patch /companies/:code", ()=>{
    test("Updates a single company", async() =>{
      const res = await request(app).patch(`/companies/${testCompany.code}`)
      .send({name: 'SAMSUNG', description: 'GALAXY S24 AI'});
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        company: {
          code: testCompany.code,
          name:'SAMSUNG',
          description:'GALAXY S24 AI'
        }
      })
    })
    test("Updates for 404 for invalid id", async ()=>{
      const res = await request(app).patch(`/companies/sdfs`).send({name:'SAMSUNG',
      description:'GALAXY S24 AI'});
      expect(res.statusCode).toBe(404);
    })
  })
  
  
  describe("DELETE /companies/:code", ()=>{
    test("Deletes a single company", async() =>{
      const res = await request(app).delete(`/companies/${testCompany.code}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({status:'deleted'});
    })
  })