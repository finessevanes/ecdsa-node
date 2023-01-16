const express = require("express");
const { toHex } = require("ethereum-cryptography/utils");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const secp = require("ethereum-cryptography/secp256k1");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04a669ff80acd68198b91e09a496ab56b000ce05cea15651c8b7fb9ce01d099030b73ef4bd8a1363b892bda50ca5a8e8f797a6cddcac31eca9ea9f29ecdf6b7a32": 111,
  "0481163410700a689957db5e050adcd2c5915f9cd74b255ab2a56136a24f4a1f9723a830949d74d2159b00f6dd09dc2b47eb410ae9451ee881002e4a962b99f8cc": 222,
  "04a63ecdfed822a5cf0c885eed5df1c47cce2eef3e802221fc8ab3d4e7b776cd1df286b04e1953979d009255dae72a5bf0e61d3ceac970326d79fe634400d4dc8b": 333,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async function (req, res) {
  // TODO: get signature from client side application
  const { recipient, amount, signer, msgHash } = req.body;
  // get public key
  // network errors :/
  const publicKey = await secp.recoverPublicKey(
    utf8toBytes(msgHash),
    utf8toBytes(signer[0]),
    signer[1]
  );


  // setInitialBalance(publicKey);
  // setInitialBalance(recipient);

  // if (balances[publicKey] < amount) {
  //   res.status(400).send({ message: "Not enough funds!" });
  // } else {
  //   balances[publicKey] -= amount;
  //   balances[recipient] += amount;
  //   res.send({ balance: balances[publicKey] });
  // }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
