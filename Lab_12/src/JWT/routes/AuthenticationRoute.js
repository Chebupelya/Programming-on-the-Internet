import jwt from "jsonwebtoken";
import { prismaClient } from "../../../prisma/Client.js";
import { Router } from "express";
import { TokenVerifyingMiddleware } from "../midlewares/index.js";
import { redis } from "../redis/Client.js"
import createError from "http-errors";

export const authenticationRouter = Router();

authenticationRouter.get(
    "/resource",
    TokenVerifyingMiddleware,
    async (req, res) => {
        res.render("resource", {user: req.user});
    }
);

authenticationRouter.get(
    "/login",
    async (req, res) => {
        res.render("login");
    }
);

authenticationRouter.get(
    "/register",
    async (req, res) => {
        res.render("register");
    }
);

authenticationRouter.post(
    "/register",
    async (req, res, next) => {
        try {
            const {username, password} = req.body;
            console.log(req);

            const isFullDataProvided = password && username;
            if (!isFullDataProvided) {
                throw new createError(400,"Full data is not provided");
            }

            const user = await prismaClient.user.findUnique({where: {username}});
            if (user) {
                throw new createError(400,"Username is already taken");
            }

            await prismaClient.user.create({
                data: {
                    username,
                    password
                },
            });

            res.end();

        } catch (error) {
            next(error);
        }
    }
);

authenticationRouter.post(
    "/login",
    async (req, res, next) => {

        try {

            const {username, password} = req.body;

            if (!username || !password)
                throw new createError(400,"username or password is not provided");

            const user = await prismaClient.user.findUnique({
                where: {
                    username,
                },
            });
            if (!user)
                throw new createError(400,`User with username ${username} does not exist`);

            if (password !== user.password)
                throw new createError(400,"Password is not correct");

            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
            const accessToken = jwt.sign({id: user.id}, accessTokenSecret, {
                expiresIn: "10m",
            });
            const refreshTokenSerret = process.env.REFRESH_TOKEN_SECRET;
            const refreshToken = jwt.sign({id: user.id}, refreshTokenSerret, {
                expiresIn: "24h",
            });

            const DAY_IN_SECONDS = 24 * 3600 * 1000;
            await redis.set(refreshToken, 1, {PX: DAY_IN_SECONDS});

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                sameSite: "strict",
            });

            res.cookie("refreshToken", refreshToken);

            res.end();

        } catch (error) {
            next(error);
        }
    }
);

authenticationRouter.get(
    "/refresh",
    async (req, res, next) => {
        try {

            const {refreshToken} = req.cookies;
            if (!refreshToken)
                throw new createError(401,"Refresh token is not provided");

            const token = await redis.get(refreshToken);
            if (!token)
                throw new createError(401,"Refresh token is not valid");

            const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

            const {id} = jwt.verify(
                refreshToken,
                refreshTokenSecret
            );

            const newAccessToken = jwt.sign({id}, accessTokenSecret, {
                expiresIn: "10m",
            });

            const newRefreshToken = jwt.sign({id}, refreshTokenSecret, {
                expiresIn: "24h",
            });

            const DAY_IN_SECONDS = 24 * 3600 * 1000;
            await redis
                .multi()
                .del(refreshToken)
                .set(newRefreshToken, 1, {PX: DAY_IN_SECONDS})
                .exec();

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "strict",
            });

            res.cookie("refreshToken", newRefreshToken);

            res.end();

        } catch (error) {
            next(error);
        }
    }
);

authenticationRouter.get(
    "/logout",
    async (req, res, next) => {

        const {refreshToken} = req.cookies;

        await redis.del(refreshToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.end();
    }
);
