const express = require("express");
const { toHex } = require("ethereum-cryptography/utils");

const secp = require("ethereum-cryptography/secp256k1");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "049031dad6b920dc4d9c4b8646bb7a900853a8428ee39dff13332f9bf6f6e145bb4aa2ad979c5f1cda0d6df605f36648e8014231e7089c9710ea5071523749ef86": 111,
  "04115fe7c1f520805121e7c8befb21bad720c896fde0ef7e501bcb15049e6f63e45c6fd42cf5043e824d9ab1f4621f15983961027da2a29b479846b86a0bb40518": 222,
  "04643cb963f6fb2667238d2d869ddcd7010865aa82601cd8f30dbe93a372cc1d22644e6a826978341078945828dd23dec353708e0e6b4e9eede6764903e10b29e6": 333,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async function (req, res) {
  // TODO: get signature from client side application
  const { recipient, amount, signature, recoveryBit, msgHash } = req.body;
  // get public key

  const publicKey = await secp.recoverPublicKey(
    msgHash,
    signature,
    recoveryBit
  );

  setInitialBalance(publicKey);
  setInitialBalance(recipient);

  if (balances[publicKey] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[publicKey] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[publicKey] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
