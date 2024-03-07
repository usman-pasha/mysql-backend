require("./script/createdb");
const express = require("express");
const app = express();
const port = 8051;
const mysqlDb = require("./db");
const { executeQuery } = require("./db");

app.use(express.json());

(async () => {
  await mysqlDb.createDatabase();
})();

// create user
module.exports.createUser = async (req, res) => {
  console.log(`Creating user started`);
  try {
    const { username, email, birthdate } = req.body;
    const sql =
      "INSERT INTO users (username, email, birthdate) VALUES (?, ?, ?)";
    const result = await executeQuery(sql, [username, email, birthdate]);
    console.log(result);
    const sql1 = "SELECT * from users WHERE user_id=?";
    const [data] = await executeQuery(sql1, [result.insertId]);
    console.log(data);
    return res.status(200).send({
      message: "Successfully user created",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    return res.send({
      message: error.message,
      success: false,
    });
  }
};

// get all users
module.exports.getAllUsers = async (req, res) => {
  console.log(`get all users`);
  try {
    const sql = "SELECT * FROM users";
    const data = await executeQuery(sql);
    console.log(data);
    return res.status(200).send({
      message: "Successfully All Users Fetched",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    return res.send({
      message: error.message,
      success: false,
    });
  }
};

// get single user
module.exports.getSingleUser = async (req, res) => {
  console.log(`get single user started`);
  try {
    const params = req.params;
    console.log(`user id ${params.userId}`);
    const sql = `SELECT * FROM users WHERE user_id=${params.userId}`;
    const [data] = await executeQuery(sql);
    console.log(data);
    return res.status(200).send({
      message: "Successfully Single user fetched",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    return res.send({
      message: error.message,
      success: false,
    });
  }
};

// update user
module.exports.updateUser = async (req, res) => {
  console.log(`get single user started`);
  try {
    const params = req.params;
    const { username, email, birthdate } = req.body;
    const updates = [];
    const values = [];
    // Check if values are defined, add to the updates and values arrays
    if (username !== undefined) {
      updates.push("username=?");
      values.push(username);
    }

    if (email !== undefined) {
      updates.push("email=?");
      values.push(email);
    }

    if (birthdate !== undefined) {
      updates.push("birthdate=?");
      values.push(birthdate);
    }

    // Construct the SQL query based on the provided updates
    const sqlQuery = `UPDATE users SET ${updates.join(", ")} WHERE user_id=?`;
    values.push(params.userId);

    const data = await executeQuery(sqlQuery, values);
    const [userData] = await executeQuery(
      "SELECT * FROM users WHERE user_id=?",
      [params.userId]
    );
    console.log(data);
    return res.status(200).send({
      message: "Successfully user updated",
      success: true,
      data: userData,
    });
  } catch (error) {
    console.log(error.message);
    return res.send({
      message: error.message,
      success: false,
    });
  }
};

// delete user
module.exports.deleteUser = async (req, res) => {
  console.log(`get single user started`);
  try {
    const params = req.params;
    const data = await executeQuery(`DELETE FROM users WHERE user_id=?`, [
      params.userId,
    ]);
    console.log(data);
    return res.status(200).send({
      message: "Successfully User Deleted",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    return res.send({
      message: error.message,
      success: false,
    });
  }
};

app.route("/user").get(this.getAllUsers).post(this.createUser);
app
  .route("/user/:userId")
  .get(this.getSingleUser)
  .patch(this.updateUser)
  .delete(this.deleteUser);

app.listen(port, () => {
  console.log(`App Is Running On Port:${port} http://localhost:${port}`);
});
