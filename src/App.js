import "./App.css";
import Web3 from "web3";
import { useState, useEffect } from "react";
import Token from "./contracts/Token.json";
import Bank from "./contracts/Bank.json";

function App() {
  const [warning, setWarning] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [balance, setBalance] = useState("");
  const [contracts, setContracts] = useState({});

  useEffect(() => {
    const loadBlockchain = async () => {
      //this checks if user is using metamask
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        const netId = await web3.eth.net.getId();
        const accounts = await web3.eth.getAccounts();
        // const accounts = await window.ethereum.request({
        //   method: "eth_requestAccounts",
        // });
        const balance = await web3.eth.getBalance(accounts[0]);
        setCurrentUser(accounts[0]);
        setBalance(balance);

        const token = new web3.eth.Contract(
          Token.abi,
          Token.networks[netId].address
        );
        const bank = new web3.eth.Contract(
          Bank.abi,
          Bank.networks[netId].address
        );
        const contas = await web3.eth.getAccounts();

        const deposit = await bank.methods.etherAmount(contas[0]).call();
        console.log("deposit:", deposit);

        setContracts((contracts) => ({
          ...contracts,
          token: token,
          bank: bank,
        }));

        console.log(contas);
      } else {
        console.log("install metamask metamask");
        setWarning(true);
      }
    };

    loadBlockchain();
  }, []);

  const deposit = async (amount) => {
    try {
      await contracts.bank.methods
        .deposit()
        .send({ value: amount.toString(), from: currentUser });
    } catch (e) {
      console.log("Error, deposit: ", e);
    }
  };

  const withdraw = async () => {
    try {
      await contracts.bank.methods.withdraw().send({ from: currentUser });
    } catch (e) {
      console.log("Error, deposit: ", e);
    }
  };

  return (
    <div className="App">
      {!warning ? (
        <div>
          <p>current User: {currentUser}</p>
          <p>current balance: {balance}</p>

          <button
            onClick={() => {
              let amount = 0.1 * 10 ** 18; //convert to wei
              deposit(amount);
            }}
          >
            Borrow
          </button>
          <br />
          <br />
          <button
            onClick={() => {
              // let amount = 0.1 * 10 ** 18; //convert to wei
              withdraw();
            }}
          >
            Withdraw
          </button>
        </div>
      ) : (
        <h1>INSTALL METAMASK</h1>
      )}
    </div>
  );
}

export default App;
