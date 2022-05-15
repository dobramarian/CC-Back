const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const connection = require("../db.js");
const { CURRENCY_ISO_CODE, LANGUAGE_ISO_CODE } = require('../utils/dictionaries.js');
const {
  detectLanguage,
  translateText,
} = require("../utils/translateFunctions");
const { sendMail } = require("../utils/mailFunctions");

//GET ALL
router.get("/", (req, res) => {
    connection.query("SELECT * FROM donations", (err, results) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
  
      return res.json({
        data: results,
      });
    });
  });

  //INSERT
  router.post("/", (req, res) => {
    const { senderName, senderMail, receiverMail, messageContent, amount, currency, language } = req.body;
    
    if (!senderName || !senderMail || !receiverMail || !messageContent || !amount || !currency || !language) {
      // send bad request error
      return res.status(400).send("Bad request. Missing parametres.");
    }
  
    const queryString = `INSERT INTO donations (senderName, senderMail, receiverMail, messageContent, amount, currency, language) VALUES (${mysql.escape(
      senderName
    )}, ${mysql.escape(senderMail)}, ${mysql.escape(
      receiverMail
    )}, ${mysql.escape(messageContent)}
    , ${mysql.escape(amount)}
    , ${mysql.escape(currency)}
    , ${mysql.escape(language)}
    )`;
  
    connection.query(queryString, (err, results) => {
      if (err) {
        return res.send(err);
      }
  
      return res.json({
        data: results,  
      });
    });
  });
  
  // Add get by id route
  router.get("/:id", (req, res) => {
      const { id } = req.params;
      if (!id) {
          // send bad request error
          return res.status(400).send("Bad request. Missing parametres.");
      }
      const queryString = `SELECT * FROM donations WHERE entryID = ${mysql.escape(id)}`;
      connection.query(queryString, (err, results) => {
          if (err) {
              return res.send(err);
          }
          if (results.length === 0) {
              return res.status(404).send("Message not found.");
          }
          return res.json({
              messages: results,
          });
      }
      );
  }
  );
  
  // Add delete by id route
  router.delete("/:id", (req, res) => {
      const { id } = req.params;
      if (!id) {
          // send bad request error
          return res.status(400).send("Bad request. Missing parametres.");
      }
      const queryString = `DELETE FROM donations WHERE entryID = ${mysql.escape(id)}`;
      connection.query(queryString, (err, results) => {
          if (err) {
              return res.send(err);
          }
          if (results.length === 0) {
              return res.status(404).send("Message not found.");
          }
          return res.json({
              results,
          });
      }
      );
  }
  );
  
  // Add update by id route
  router.put("/:id", (req, res) => {
      const { id } = req.params;
      if (!id) {
          // send bad request error
          return res.status(400).send("Bad request. Missing parametres.");
      }
      const { senderName, senderMail, receiverMail, messageContent } = req.body;
      if (!senderName || !senderMail || !receiverMail || !messageContent) {
          // send bad request error
          return res.status(400).send("Bad request. Missing parametres.");
      }
      const queryString = `UPDATE donations SET senderName = ${mysql.escape(senderName)}, senderMail = ${mysql.escape(senderMail)}, receiverMail = ${mysql.escape(receiverMail)}, messageContent = ${mysql.escape(messageContent)} WHERE entryID = ${mysql.escape(id)}`;
      connection.query(queryString, (err, results) => {
          if (err) {
              return res.send(err);
          }
          if (results.length === 0) {
              return res.status(404).send("Message not found.");
          }
          return res.json({
              results,
          });
      }
      );
  }
  );

  router.post("/foreign", async (req, res) => {
    const { senderName,amount,currency,messageContent} =
        req.body;

    if (
        !senderName ||
        !amount ||
        !currency ||
        !messageContent
    ) {
        return res.status(400).json({
            error: "All fields are required",
        });
    }

    if(!CURRENCY_ISO_CODE[currency]){
      return res.status(400).send("Invalid Currency");
  }

    let translationData = {};

    try {
      let textToTranslate = senderName + 'have donated ' + amount + ' ' + currency + ' with the message: ' + messageContent
            const translatedText = await translateText(
              textToTranslate,
                "uk"
            );
            translationData.textUKR = translatedText[0];

        sendMail(
            'donateukraine@yopmail.com',
            'dobramarian18@stud.ase.ro',
            `${senderName} have donated`,
            translationData.textUKR + 'ENGLISH: ' + textToTranslate,
        );

        sendMail(
          'dobramarian18@stud.ase.ro',
          'donateukraine@yopmail.com',
          'THANK YOU FOR DONATING!',
          `THANK YOU FOR DONATING TO SAVEUKRAINE`
      );

        connection.query(
            `INSERT INTO donations (senderName, messageContent, amount, currency, messageContentUKR) values (${mysql.escape(
                senderName
            )}, ${mysql.escape(messageContent)}
            , ${mysql.escape(amount)}
            , ${mysql.escape(currency)}
            , ${mysql.escape(translationData.textUKR)}
            )`,
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }

                return res.json({
                    translationData,
                });
            }
        );
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
});

module.exports = router;