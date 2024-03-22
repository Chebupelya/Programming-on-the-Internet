import { authenticationRouter } from "./src/JWT/routes/AuthenticationRoute.js";
import cookieParse from "cookie-parser";
import express from "express";
import bodyParser from "body-parser";

const PORT = 3000;

const app = express();

app.use(cookieParse());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'hbs');

app.use(authenticationRouter);

app.use((err, req, res, next) => {

    res.status(err.status || 500);

    res.json({message: err?.message || "Something went wrong"});

});

app.listen(3000, () => console.log(`Server started on http://localhost:${PORT}`));
