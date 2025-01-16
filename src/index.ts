import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Sequelize, DataTypes} from "sequelize";
import { checkToken } from "./middlewares/checkToken";


import { UserModel} from "./model/User";
import { MielModel} from "./model/Miel";
import { TokenBlackListModel } from "./model/TokenBlackList";


import { authRouter } from "./router/auth";
import { userRouter } from "./router/users";

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite'
});

export const User = UserModel(sequelize);
export const TokenBlackList = TokenBlackListModel(sequelize);
export const Miel = MielModel(sequelize);


//sequelize.sync({ force: true });
sequelize.sync();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);


app.use("/api", apiRouter);


app.post("/me-connecter", async (req, res) => {
  const { nom_utilisateur, mdp } = req.body;
  const userWithUser = await User.findOne({ where: { username: nom_utilisateur } });
  if (!userWithUser) {
      res.status(400).json("Email or Password is incorrect");
  }
  else {
      const isPasswordCorrect = await bcrypt.compare(mdp, userWithUser.dataValues.password);
      if (isPasswordCorrect) {
          delete userWithUser.dataValues.password;
          const token = jwt.sign(userWithUser.dataValues, process.env.JWT_SECRET!);
          res.json({
            "letoken":token
          });
      }
      else {
          res.status(400).json("Email or Password is incorrect");
      }
  }
});


app.get("/miels/", checkToken, async (req, res) => {
  const miel = await Miel.findAll();
    res.json(miel);
});

app.get("/miels/:id", checkToken, async (req, res) => {
  const officialGame = await Miel.findOne({ where: { id: req.params.id } });
  if (officialGame) {
      res.json(officialGame);
  }
  else {
      res.status(404).send("Miel not found");
  }
});

app.post("/miels/", checkToken, async (req, res) => {
  console.log(req)

      const newOfficialGame = await Miel.create({ "nom": "test", "description": "test", "prix":100 });
      res.json(newOfficialGame);

});

//app.post("/miels/", checkToken, async (req, res) => {
 // console.log(req)
//  const { nom, description, prix} = req.body.data;
//  if(!nom || !description || !prix){
  //    res.status(400).send("Missing required information");
 // }
//  else {
   //   const newOfficialGame = await Miel.create({ nom, description, prix });
 //     res.json(newOfficialGame);
//  }
//});

app.put("/miels/:id", checkToken, async (req, res) => {
  const { nom, description, prix } = req.body.data;
  const actual = await Miel.findOne({ where: { id: req.params.id } });
  if (actual) {
      const newOfficialGame = await actual.update({ nom, description, prix });
      res.json(actual);
  }
  else {
      res.status(404).send("Miel not found");
  }
});

app.delete("/miels/:id", checkToken, async (req, res) => {
  const actual = await Miel.findOne({ where: { id: req.params.id } });
  if (actual) {
      await actual.destroy();
      res.send("deleted");
  }
  else {
      res.status(404).send("Miel not found");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
