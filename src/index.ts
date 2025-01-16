import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Sequelize, DataTypes} from "sequelize";

import { UserModel} from "./model/User";
import { TokenBlackListModel } from "./model/TokenBlackList";


import { authRouter } from "./router/auth";
import { userRouter } from "./router/users";
import { meConnecterRouter } from "./router/meconnecter";

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite'
});

export const User = UserModel(sequelize);
export const TokenBlackList = TokenBlackListModel(sequelize);


//sequelize.sync({ force: true });
sequelize.sync();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/me-connecter', meConnecterRouter);
apiRouter.use('/users', userRouter);


app.use("/api", apiRouter);

app.get("/hello-world", (req, res) => {
  res.json({message : "Hello, World!"});
});


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
