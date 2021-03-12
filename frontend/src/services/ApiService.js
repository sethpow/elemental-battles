import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'

/*
create service component called ApiService. This will help us communicate with the blockchain.
To do this we invoke the common function takeAction which sends a transaction to the EOS blockchain
using three components from the eosjs library

 - JsonRpc - The rpc client which connects to the HTTP endpoint of an EOSIO node.
 - JsSignatureProvider - Required for signing transactions, which we create using the user’s private key. (__Using the JsSignatureProvider in the browser is not secure and should only be used for development purposes. Use a secure vault outside of the context of the webpage to ensure security when signing transactions in production)
 - Api - The client we use to communicate with an EOS blockchain node and we initialize it using the Rpc and SignatureProvider we have created

 To use the general function takeAction() we will pass in

 - action - the name of the Smart Contract action we want to invoke
 - dataValue - parameter of the Smart Contract action

To send the transaction, we invoke api.transact() and pass it a JSON parameter. Let’s look at some attributes of interest inside the JSON:
*/

// Main action call to blockchain
// takeAction: action - the name of the Smart Contract action we want to invoke, dataValue - parameter of the Smart Contract action
async function takeAction(action, dataValue) {
  const privateKey = localStorage.getItem("cardgame_key");
  // JsonRpc - The rpc client which connects to the HTTP endpoint of an EOSIO node
  const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
  // JsSignatureProvider - Required for signing transactions, which we create using the user’s private key
  const signatureProvider = new JsSignatureProvider([privateKey]);
  // Api - The client we use to communicate with an EOS blockchain node and we initialize it using the Rpc and SignatureProvider we have created
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  // Main call to blockchain after setting action, account_name and data
  try {
    // To send the transaction, we invoke api.transact() and pass it a JSON parameter
    const resultWithConfig = await api.transact({
      actions: [{
        // account - Equivalent to the contract name
        account: process.env.REACT_APP_EOS_CONTRACT_NAME,
        // name - Name of the action we want to invoke
        name: action,
        // authorization - For signing the transaction
        authorization: [{
          actor: localStorage.getItem("cardgame_account"),
          permission: 'active',
        }],
        data: dataValue,
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    return resultWithConfig;
  } catch (err) {
    throw(err)
  }
}

class ApiService {

  static getCurrentUser() {
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem("cardgame_account")) {
        return reject();
      }
      takeAction("login", { username: localStorage.getItem("cardgame_account") })
        .then(() => {
          resolve(localStorage.getItem("cardgame_account"));
        })
        .catch(err => {
          localStorage.removeItem("cardgame_account");
          localStorage.removeItem("cardgame_key");
          reject(err);
        });
    });
  }

  // We can now use ApiService.login() to trigger the corresponding “login” action in the smart contract.
  // username & key; These are stored into the browser’s localStorage so we then can use these later for signing the transaction in the takeAction function described above
  static login({ username, key }) {
    return new Promise((resolve, reject) => {
      localStorage.setItem("cardgame_account", username);
      localStorage.setItem("cardgame_key", key);
      takeAction("login", { username: username })
        .then(() => {
          resolve();
        })
        .catch(err => {
          localStorage.removeItem("cardgame_account");
          localStorage.removeItem("cardgame_key");
          reject(err);
        });
    });
  }

  static startGame() {
    return takeAction("startgame", { username: localStorage.getItem("cardgame_account") });
  }

  static playCard(cardIdx) {
    return takeAction("playcard", { username: localStorage.getItem("cardgame_account"), player_card_idx: cardIdx });
  }

  static nextRound() {
    return takeAction("nextround", { username: localStorage.getItem("cardgame_account") });
  }

  static endGame() {
    return takeAction("endgame", { username: localStorage.getItem("cardgame_account") });
  }

  static async getUserByName(username) {
    try {
      const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
      const result = await rpc.get_table_rows({
        "json": true,
        "code": process.env.REACT_APP_EOS_CONTRACT_NAME,    // contract who owns the table
        "scope": process.env.REACT_APP_EOS_CONTRACT_NAME,   // scope of the table
        "table": "users",    // name of the table as specified by the contract abi
        "limit": 1,
        "lower_bound": username,
      });
      return result.rows[0];
    } catch (err) {
      console.error(err);
    }
  }

}

export default ApiService;
