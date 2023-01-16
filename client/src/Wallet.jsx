import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils"

function Wallet({ publicKey, setPublicKey, balance, setBalance, privateKey, setPrivateKey }) {

  async function handleChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const _publicKey = secp.getPublicKey(privateKey)
    setPublicKey(toHex(_publicKey))
    if (publicKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${publicKey}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Private Key
        <input placeholder="Type an address, for example: 0x1" value={privateKey} onChange={handleChange}></input>
      </label>
      <div className="address">Public Key: {publicKey.slice(0,10)}... </div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
