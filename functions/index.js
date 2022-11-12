const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");

admin.initializeApp();

const app = express();
const db = admin.firestore();

app.get("/", async (req, res) => {
  const snapshot = await db.collection("products").get();
  const product = [];

  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    product.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(product));
});

app.get("/:id", async (req, res) => {
  const snapshot = await db.collection("products").doc(req.params.id).get();
  const productId = snapshot.id;
  const productData = snapshot.data();

  res.status(200).send(JSON.stringify({id: productId, ...productData}));
});

app.put("/:id", async (req, res) => {
  const body = req.body;

  await db.collection("products").doc(req.params.id).update(body);

  res.status(200).send();
});

app.delete("/:id", async (req, res) => {
  await db.collection("products").doc(req.params.id).delete();

  res.status(200).send();
});

app.post("/", async (req, res) => {
  const product = req.body;

  await db.collection("products").add(product);

  res.status(201).send();
});

exports.products = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
