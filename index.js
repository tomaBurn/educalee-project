const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const db = require("./db");
const path = require("path");
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
const iv = "c73931d0dbbdf483be676638c1694b3b";

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
  });
}

const verifyJWT = (req, res, next) => {
  const sqlSelect = "SELECT token FROM users WHERE token = $1";

  const token = req.body.headers["x-access-token"];

  if (!token) {
    res.status(401).json("You're not authenticated");
  } else {
    jwt.verify(token, "jwtSecret", (err, user) => {
      if (err) {
        res.status(403).json("Token expired");
      } else {
        db.query(sqlSelect, [token], (err2, result) => {
          if (err2 || result.rowCount == 0) {
            res
              .status(403)
              .json({ auth: false, message: "Nepavyko prisijungti" });
          } else {
            res.user = user;
            next();
          }
        });
      }
    });
  }
};

app.post("/api/topics", verifyJWT, (req, res) => {
  const teacherId = req.body.teacherId;

  const sqlSelect = `SELECT topic.id AS topic_id,
  topic.title,
  topic.level,
  topic.teacher_id,
  quizes.id AS quiz_id,
  quizes.quiz_title,
  quizes.dueDate,
  quizes.dueTime,
  quizes.reps
FROM topics AS topic
LEFT JOIN quiz AS quizes ON quizes.topic_id = topic.id
WHERE teacher_id = $1 ;`;

  db.query(sqlSelect, [teacherId], (err, result) => {
    if (err) res.status(400).send(err);
    else res.send(result.rows);
  });
});

app.post("/api/topics/insert", verifyJWT, (req, res) => {
  const title = req.body.title;
  const level = req.body.level;
  const teacherId = req.body.teacherId;

  const sqlInsert =
    "INSERT INTO topics (title, level, teacher_id) VALUES ($1, $2, $3)";

  db.query(sqlInsert, [title, level, teacherId], (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

app.post("/api/delete-topic/", verifyJWT, (req, res) => {
  const topicId = req.body.topicId;

  const sqlDelete = "DELETE FROM topics WHERE id = $1";

  db.query(sqlDelete, [topicId], (err, result) => {
    if (err) res.status(400).send(err);
    else res.status(200).send("Deleted");
  });
});

app.post("/api/get-quiz", verifyJWT, (req, res) => {
  const quizId = req.body.quizId;

  const sqlSelect = "SELECT * FROM quiz WHERE id = $1";

  db.query(sqlSelect, [quizId], (err, result) => {
    res.send(result.rows);
  });
});

app.post("/api/quizzes", verifyJWT, (req, res) => {
  const topicId = req.body.topicId;
  const quizTitle = req.body.quizTitle;
  const dueDate = req.body.dueDate;
  const dueTime = req.body.dueTime;
  const questions = req.body.questions;
  const reps = req.body.reps;

  const sqlInsert = `INSERT INTO quiz (topic_id, quiz_title, dueDate, dueTime, questions, reps) 
    VALUES ($1, $2, $3, $4, $5, $6)`;

  db.query(
    sqlInsert,
    [topicId, quizTitle, dueDate, dueTime, questions, reps],
    (err, result) => {
      if (err) res.statsu(400).send(err);
      res.send(result.rows);
    }
  );
});

app.post("/api/delete-quiz/", verifyJWT, (req, res) => {
  const quizId = req.body.quizId;

  const sqlDelete = "DELETE FROM quiz WHERE id = $1";
  const sqlDeleteResults = "DELETE FROM result WHERE quiz_id = $1";

  db.query(sqlDelete, [quizId], (err, result) => {
    if (err) res.status(400).send(err);
    if (!err)
      db.query(sqlDeleteResults, [quizId], (err2, result2) => {
        if (!err2) res.status(200).send("Deleted");
        else res.status(400).send(err2);
      });
  });
});

app.get("/isUserAuth", verifyJWT, (req, res) => {
  res.send("Prisijunges");
});

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {});
};

app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sqlSelect = "SELECT * FROM users WHERE username = $1";
  const sqlInsert = "UPDATE users SET token = $1 WHERE id = $2";

  db.query(sqlSelect, [username], (err, result) => {
    if (err) res.sendStatus(400);
    if (result.rowCount > 0) {
      let iv2 = Buffer.from(iv.toString("hex"), "hex");
      let encryptedText = Buffer.from(result.rows[0].password, "hex");
      let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv2);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      if (decrypted.toString() === password) {
        const id = result.rows[0].id;
        const token = generateAccessToken(id);
        db.query(sqlInsert, [token, id], (insErr, insRes) => {
          res.json({
            auth: true,
            token: token,
            result: result.rows[0],
          });
        });
      } else {
        res.json({
          auth: false,
          message: "Neteisingas prisijungimo vardas ir/arba slaptažodis.",
        });
      }
    } else {
      res.json({
        auth: false,
        message: "Neteisingas prisijungimo vardas ir/arba slaptažodis.",
      });
    }
  });
});

app.post("/api/logout", (req, res) => {
  const sqlUpdate = "UPDATE users SET token = NULL";
  db.query(sqlUpdate, (err, result) => {
    res.status(200).json("Logged out");
  });
});

app.post("/api/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const sqlInsert =
    "INSERT INTO users (username, password, email, is_teacher, teacher_id) VALUES ($1, $2, $3, $4, $5)";

  let cipher = crypto.createCipheriv(algorithm, key, Buffer.from(iv, "hex"));
  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]).toString("hex");
  db.query(
    sqlInsert,
    [username, encrypted, email, "Y", null],
    (err, result) => {
      if (err) {
        if (err.code === "23505") {
          res.status(409).send(`Naudotojas tokiu vardu jau egzistuoja`);
        } else res.status(400).send(`Problem registering`);
      } else res.status(200).send("Registered");
    }
  );
});

app.post("/api/get-students/", verifyJWT, (req, res) => {
  const teacherId = req.body.teacherId;
  const sqlSelect = "SELECT * FROM users WHERE teacher_id = $1 ORDER BY username ASC";

  db.query(sqlSelect, [teacherId], (err, result) => {
    if (err) res.sendStatus(400);
    else {
      let iv2 = Buffer.from(iv.toString("hex"), "hex");

      result.rows.forEach((row) => {
        let encryptedText = Buffer.from(row.password, "hex");
        let decipher = crypto.createDecipheriv(
          algorithm,
          Buffer.from(key),
          iv2
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        row.password = decrypted.toString();
      });

      res.send(result.rows);
    }
  });
});

app.post("/api/students/", verifyJWT, (req, res) => {
  const id = req.body.id;
  const sqlDelete = "DELETE FROM users WHERE id = $1";

  db.query(sqlDelete, [id], (err, result) => {
    if (!err) res.status(200).send("Deleted");
    else res.sendStatus(400);
  });
});

app.post("/api/save_results", verifyJWT, (req, res) => {
  const userId = req.body.userId;
  const quizId = req.body.quizId;
  const topicId = req.body.topicId;
  const score = req.body.score;
  const totalScore = req.body.totalScore;

  const sqlInsert = `INSERT INTO result (user_id, quiz_id, score, total_score, topic_id) VALUES ($1, $2, $3, $4, $5) 
  ON CONFLICT (user_id, quiz_id) DO UPDATE SET reps = result.reps + 1, score = $3;`;
  const sqlUpdate = `UPDATE users SET score = $1 WHERE id = $2`;
  const sqlSelect = `SELECT * FROM result WHERE user_id = $1`;

  db.query(
    sqlInsert,
    [userId, quizId, score, totalScore, topicId],
    (err, result) => {
      if (!err) {
        db.query(sqlSelect, [userId], (err1, res1) => {
          if (err1) res.status(400).send(err1);
          const userScore = res1.rows.reduce(
            (previousValue, currentValue) => previousValue + currentValue.score,
            0
          );
          if (!err1) {
            db.query(sqlUpdate, [userScore, userId], (err2, res2) => {
              if (!err) res.status(200).json(userScore);
              else res.status(400).send(err2);
            });
          }
        });
      } else res.status(400).send(err);
    }
  );
});

app.post("/api/results", verifyJWT, (req, res) => {
  const id = req.body.id;
  const sqlSelect = "SELECT * FROM result WHERE user_id = $1";

  db.query(sqlSelect, [id], (err, result) => {
    if (err) res.status(400).send(err);
    res.send(result.rows);
  });
});

app.post("/api/leaderboard", verifyJWT, (req, res) => {
  const teacherId = req.body.teacherId;
  const sqlSelect = `SELECT id, username, score FROM users WHERE teacher_id = $1 ORDER BY score DESC`;

  db.query(sqlSelect, [teacherId], (err, result) => {
    if (!err) res.send(result.rows);
  });
});

app.post("/api/quiz-results", verifyJWT, (req, res) => {
  const quizId = req.body.quizId;
  const sqlSelect = `SELECT user_id, username, score, total_score FROM result WHERE quiz_id = $1;`;

  db.query(sqlSelect, [quizId], (err, result) => {
    if (!err) res.send(result.rows);
    else res.status(400).send(err);
  });
});

app.post("/api/user-score", verifyJWT, (req, res) => {
  const userId = req.body.userId;
  const sqlSelect = `SELECT score FROM users WHERE id = $1`;

  db.query(sqlSelect, [userId], (err, result) => {
    if (!err) res.send(result.rows[0]);
  });
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASS,
  },
});

app.post("/api/register-student", verifyJWT, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const teacherId = req.body.teacherId;
  const email = req.body.email;
  const sqlInsert =
    "INSERT INTO users (username, password, email, is_teacher, teacher_id) VALUES ($1, $2, $3, $4, $5)";

  var mailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: "Pakvietimas",
    text: `Labas!\nBuvai pakvietas(-a) prisijungti prie Educalee. 
    Spausk šią nuorodą: ${process.env.URL} ir prisijunk su žemiau nurodytais duomenimis. \n
    Vartotojo vardas: ${username} \n
    Slaptažodis: ${password} `,
  };

  let cipher = crypto.createCipheriv(algorithm, key, Buffer.from(iv, "hex"));
  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]).toString("hex");

  db.query(
    sqlInsert,
    [username, encrypted, email, "N", teacherId],
    (err, result) => {
      if (err) {
        if (err.code === "23505") {
          res.status(409).send(`Naudotojas tokiu vardu jau egzistuoja`);
        } else res.sendStatus(400);
      } else {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) res.sendStatus(400);
          else res.sendStatus(200);
        });
      }
    }
  );
});

app.post("/api/update-student", verifyJWT, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const id = req.body.id;
  const sqlUpdate =
    "UPDATE users SET username = $1, password = $2 WHERE id = $3";

  let cipher = crypto.createCipheriv(algorithm, key, Buffer.from(iv, "hex"));
  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]).toString("hex");

  db.query(sqlUpdate, [username, encrypted, id], (err, result) => {
    if (err) res.sendStatus(400);
    else {
      var mailOptions = {
        from: process.env.MAIL,
        to: email,
        subject: "Pakeisti prisijungimo duomenys",
        text: `Buvo pakesiti tavo Educalee prisijungimo duomenys.
        Dabar prisijungti gali su žemiau nurodytais duomenimis.\n
        Vartotojo vardas: ${username} \n
        Slaptažodis: ${password}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

app.post("/api/remind-password", (req, res) => {
  const username = req.body.username;
  const sqlSelect = "SELECT password, email FROM users WHERE username = $1";

  db.query(sqlSelect, [username], (err, result) => {
    if (result.rowCount === 0) {
      res.status(400).send("Naudotojas šiuo vardu neegzistuoja");
    } else {
      var mailOptions = {
        from: process.env.MAIL,
        to: result.rows[0].email,
        subject: "Slaptažodžio priminimas",
        text: `Slaptažodis: ${result.rows[0].password}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`running on port ${PORT}`);
});
