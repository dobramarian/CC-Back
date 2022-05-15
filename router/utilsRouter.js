const express = require('express');
const router = express.Router();
const { detectLanguage, translateText } = require("../utils/translateFunctions")
const { latestConvertTo} = require("../utils/exchangeFunctions")
const { sendMail } = require("../utils/mailFunctions")
const {LANGUAGE_ISO_CODE, CURRENCY_ISO_CODE} = require("../utils/dictionaries")

router.get("/detect", async (req, res) => {
    const {text} = req.body;

    if (!text) {
        return res.status(400).send("Missing Parametres");
    }

    const languageDetection = await detectLanguage(text);
    return res.json({
        language: languageDetection[0]?.language
    })
});

router.get("/translate", async (req, res) => {
    const {text, language} = req.body;

    if (!text || !language) {
        return res.status(400).send("Missing Parametres");
    }

    if(!LANGUAGE_ISO_CODE[language]){
        return res.status(400).send("Invalid Language");
    }

    const translatedText = await translateText(text, LANGUAGE_ISO_CODE[language]);
    return res.json({
        translatedText: translatedText[0]
    })
});

router.get("/convertFromBase", async (req, res) => {
    const {base, to} = req.body;
    
    if (!base || !to) {
        return res.status(400).send("Missing Parametres");
    }

    if(!CURRENCY_ISO_CODE[base] || !CURRENCY_ISO_CODE[to]){
        return res.status(400).send("Invalid Currency");
    }

    latestConvertTo(base,to).then(resul => {
        return res.json({
            rate : resul.rates[to]
        })
    })
});

router.post("/send", (req, res) => {
    const { senderName, senderMail, receiverMail, messageContent} = req.body;
    if (!senderName || !senderMail || !receiverMail || !messageContent) {
        return res.status(400).send("Missing Parametres");
    }

    sendMail(receiverMail, senderMail, messageContent, `${senderName} has sent you a message`);
    res.send(200);
})

module.exports = router;