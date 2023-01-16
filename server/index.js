const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04955e6258803a573b3be194ea0ecba3604d8992c53126ff4db96126ead318b8c8be7a2522ce34b19b764a7e20f74d5c484b3c4613a9406ca1b2b8eb52867db488": 111,
  "041cd4a137b35a05a30a2dc98f0118da538f14fa2c0336de5bd7651689f75b6ef140c885a1ae99107d75f6893cab958753736e5af304b0875d61540c4ecab65a9c": 222,
  "04e6779ccff14865f26e40c7e9418b38a7e8a89ba70a124751696a990d4d3e6ca223704d41cc36b8986da7d416cc40b1398fc1834d3152a70da9c69e5ee804edea": 333,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get signature from client side application
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
