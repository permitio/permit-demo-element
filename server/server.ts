
const {Permit} = require("permitio");
const express = require("express");

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.example.env') });



const app = express();

const port = 8080;

const PERMIT_KEY_SECRET = process.env.PERMIT_KEY_SECRET;
const USER_KEY = process.env.USER_KEY;
const TENANT_ID = process.env.TENANT_KEY;


const permit = new Permit(
    {token: PERMIT_KEY_SECRET}
);

app.get("/login_cookie", async (req, res) => {
    console.log("login_cookie")
    const ticket = await permit.elements.loginAs({userId: USER_KEY, tenantId: TENANT_ID});
    res.status(302).redirect(ticket.redirect_url);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});