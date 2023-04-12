const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const db = require("../connection");
const { response } = require("express");
const saltRounds = 10;
const axios = require("axios");

const getHome = (req, res) => {
  res.send(database.users);
};

const getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.select("*").from("users").where({ id });
    if (result.length) {
      res.json(result);
    } else {
      res.status(400).json("user not found");
    }
  } catch (e) {
    console.log(e);
  }
};

const postRegister = async (req, res) => {
  let { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, saltRounds);
  name = name.toLowerCase();
  email = email.toLowerCase();
  try {
    const userEmail = await db.transaction(async (trx) => {
      // here first entry will be in login table
      const loginEmail = await trx("login")
        .insert({
          email,
          hash,
        })
        .returning("email");

      // then go to users table
      const user = await trx("users")
        .insert({
          name,
          email: loginEmail[0].email,
          joined: new Date(),
        })
        .returning("*");
      res.json(user);
    });
  } catch (e) {
    res.status(400).json("unable to register");
  }
};

const postSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const findUser = await db("login")
      .select("email", "hash")
      .where("email", "=", email);

    const comapre_pass = await bcrypt.compare(password, findUser[0].hash);

    if (comapre_pass) {
      const logged_user = await db
        .select("*")
        .from("users")
        .where("email", "=", email);

      res.json(logged_user[0]);
    } else {
      res.status(400).json("wrong credentials");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

const postImages = async (req, res) => {
  const { id } = req.body;

  try {
    const result = await db("users")
      .where("id", "=", id)
      .increment("entries", 1)
      .returning("entries");

    res.json(result);
  } catch (e) {
    res.status(400).json("unable to get entries");
  }
};

const postImgurl = async (req, res) => {
  const { imageUrl } = req.body;

  const USER_ID = "dh45vwq6u4j7";
  const PAT = "20dde3f0f1ef4995bf62a4146c1fd824";
  const APP_ID = "my-first-application";
  const MODEL_ID = "face-detection";
  const MODEL_VERSION_ID = "45fb9a671625463fa646c3523a3087d5";
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  const result = await axios.post(
    "  https://api.clarifai.com/v2/models/" +
      MODEL_ID +
      "/versions/" +
      MODEL_VERSION_ID +
      "/outputs",
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    },
    {
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
    }
  );
  res.send(result.data);
};

module.exports = {
  getHome,
  getProfile,
  postRegister,
  postSignin,
  postImages,
  postImgurl,
};
