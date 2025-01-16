import { Router } from "express";
import { User } from "..";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const meConnecterRouter = Router();


meConnecterRouter.post("/", async (req, res) => {
    const { username, password } = req.body;
    const userWithUser = await User.findOne({ where: { username: username } });
    if (!userWithUser) {
        res.status(400).json("Email or Password is incorrect");
    }
    else {
        const isPasswordCorrect = await bcrypt.compare(password, userWithUser.dataValues.password);
        if (isPasswordCorrect) {
            delete userWithUser.dataValues.password;
            const token = jwt.sign(userWithUser.dataValues, process.env.JWT_SECRET!);
            res.json({
                token,
                ...userWithUser.dataValues
            });
        }
        else {
            res.status(400).json("Email or Password is incorrect");
        }
    }
})