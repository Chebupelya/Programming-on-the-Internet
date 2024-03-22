import jwt from "jsonwebtoken";
import { prismaClient } from "../../../prisma/Client.js";
import createError from "http-errors";

export const TokenVerifyingMiddleware = async (
    req,
    res,
    next
) => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    try {
        const {accessToken} = req.cookies;
        if (!accessToken)
            throw new createError(401,`Token not found`);

        const {id} = jwt.verify(accessToken, accessTokenSecret);

        req.user = await prismaClient.user.findUnique({where: {id}});
        if (!req.user)
            throw new createError(500,`User not found`);

        next();
    } catch (error) {
        next(error);
    }
};
