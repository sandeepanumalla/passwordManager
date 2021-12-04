const express = require("express");
const db = require("../connections/connection");
const {
  createCardSchema,
  readCardSchema,
  updateCardSchema,
  deleteCardSchema,
} = require("../validations/websites");

exports.createAccount = async (req, res) => {
  try {
    const { user_id } = req.user;
    console.log("res", req.user);
    const { url, website_name } = req.body;
    const requirements = { url, website_name, user_id };
    const validate = await createCardSchema.validateAsync(requirements);
    db.query(
      "INSERT INTO websites VALUES(?,default,?,?) ",
      [user_id, url, website_name],
      (err, success) => {
        if (err) {
          console.log("error in inserting records", err);
          res.status(500).json("please fill out all fields");
        } else {
          console.log(success);
          res.json("created new card");
        }
      },
    );
  } catch (error) {
    if (error.isJoi == true) {
      console.log("joi error", error.details);
      res.json(error.details[0].message);
    } else if (error) {
      res.json("unexpected error occured");
    }
  }
};

exports.readCard = async (req, res) => {
  try {
    const { user_id } = req.user;
    await readCardSchema.validateAsync(user_id);
    db.query(
      "SELECT * from websites where user_id = ?",
      [user_id],
      (err, result) => {
        if (err) {
          res.json("sql error");
        } else {
          res.json(result);
        }
      },
    );
  } catch (error) {
    if (error.isJoi == true) {
      console.log("joi error", error.details);
      res.json(error.details[0].message);
    } else if (error) {
      res.status(500).json("internal server error");
    }
  }
};

exports.updateCard = async (req, res) => {
  try {
    const { column, value, website_id } = req.body;
    const { user_id } = req.user;
    const requirements = { column, value, website_id, user_id };
    await updateCardSchema.validateAsync(requirements);
    db.query(
      column == "url"
        ? `update websites set url = ? where user_id = ? and website_id = ?`
        : `update websites set website_name = ? where user_id = ? and website_id = ?`,
      [value, user_id, website_id],
      (err, result) => {
        if (err) {
          console.log("sql error", err);
          res.json("sql error");
        } else {
          res.json(result);
        }
      },
    );
  } catch (error) {
    if (error.isJoi == true) {
      res.status(422).json(error.details[0].message);
    } else if (error) {
      res.json("internal server error");
    }
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { website_id } = req.params;
    await deleteCardSchema.validateAsync({ user_id, website_id });
    db.query(
      "Delete from websites where user_id = ? and website_id = ?",
      [user_id, website_id],
      (err, result) => {
        if (err) {
          console.log("sql error", err);
          res.json("internal server error");
        } else {
          res.json(result);
        }
      },
    );
  } catch (error) {
    if (error.isJoi === true) {
      console.log("joi error", error.details);
      res.json(error.details[0].message);
    } else if (error) {
      res.json("internal server error");
    }
  }
};
