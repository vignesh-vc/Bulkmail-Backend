const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const { promises } = require("nodemailer/lib/xoauth2")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const nodemailer = require("nodemailer");

mongoose.connect("mongodb+srv://vignesh:123@cluster0.4pubgie.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function () {
    console.log("Connected to db")
}).catch(function () {
    console.log("Failed")
})

const credential = mongoose.model("credential", {}, "bulkmail")


app.post("/sendemail", function (req, res) {

    var msg = req.body.msg
    var emailList = req.body.emailList


    credential.find().then(function (data) {

console.log(data[0])
        const transporter = nodemailer.createTransport({
            service: "gmail",
    
            auth: {
                user: data[3].toJSON().user,
                pass: data[3].toJSON().pass,
            },
        });
    
        new Promise(async function (resolve, reject) {
            try {
                for (var i = 0; i < emailList.length; i++) {
                    await transporter.sendMail({
                        from: "ceit58vignesh24@gmail.com",
                        to: emailList[i],
                        subject: "A message from Bulk Mail App",
                        text: msg
                    }
    
    
                    )
                    console.log("Email send to" + emailList[i])
    
                }
    
                resolve("Success")
            }
            catch (error) {
                reject("Failed")
    
    
            }
    
        }).then(function () {
            res.send(true)
    
        }).catch(function () {
            res.send(false)
        }
        )
    
        console.log(data[0].toJSON())
    }).catch(function (error) {
        console.log(error)
    })
    
    




})

app.listen(5000, function () {
    console.log("Server Starting...")
})