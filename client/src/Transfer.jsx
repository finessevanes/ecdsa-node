import { useState } from "react";
import * as secp from "ethereum-cryptography/secp256k1";
import * as utils from "ethereum-cryptography/utils";
import server from "./server";

function Transfer({ setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [msgHash, setMsgHash] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        amount: parseInt(sendAmount),
        recipient,
        signature: utils.toHex(signature[0]),
        recoveryBit: signature[1],
        msgHash
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex);
    }
  }

  async function sign(evt) {
    evt.preventDefault();

    // const messageHash = await secp.utils.sha256('You are signing a transaction');
    const messageHash = "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";
    setMsgHash(messageHash)
    

    try {
      const signature = await secp.sign(messageHash, privateKey, {recovered: true});
      setSignature(signature);

    } catch (ex) {
      alert(ex);
    }
  }

  return (
    <>
      <form className="container transfer" onSubmit={sign}>
        <h1>Sign Transaction</h1>
        <label>
          Private Key
          <input
            placeholder="Type an address, for example: 0x2"
            value={privateKey}
            onChange={setValue(setPrivateKey)}
          ></input>
        </label>
        <input type="submit" className="button" value="Sign" />
      </form>
      <form className="container transfer" onSubmit={transfer}>
        <h1>Send Transaction</h1>

        <label>
          Send Amount
          <input
            placeholder="1, 2, 3..."
            value={sendAmount}
            onChange={setValue(setSendAmount)}
          ></input>
        </label>

        <label>
          Recipient
          <input
            placeholder="Type an address, for example: 0x2"
            value={recipient}
            onChange={setValue(setRecipient)}
          ></input>
        </label>

        <input type="submit" className="button" value="Transfer" />
      </form>
    </>
  );
}

export default Transfer;
