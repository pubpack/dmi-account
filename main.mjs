import { createWallet } from "./wallet.mjs";
import fetch from "node-fetch";
import fs from "node:fs";

const PROXY_ADDRESS_POP = process.env.PROXY_ADDRESS_POP
const MAX_CONNECTION = Math.min(process.env.MAX_CONNECTION || 10, 50)

function makeAccount() {
  return fetch(PROXY_ADDRESS_POP)
    .then((res) => res.json())
    .then((res) => {
      const proxyaddr = `http://${res.proxy}`;
      return createWallet(null, proxyaddr)
        .then((res) => {
          const { account, privateKey, publicKey, hash } = res;
          const data = `${account}, ${privateKey}, ${publicKey}, ${hash}\n`;
          fs.appendFile("./out/account.csv", data, { encoding: "utf-8" }, (err) => {
            if (err) {
              console.log(err);
            }
          });
          console.log(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
}

async function main() {
  //   for (let count = 0; count < 2000; count++) {
  //     await makeAccount();
  //     // console.log('-----')
  //   }
  while (true) {
    const allPromise = Array(MAX_CONNECTION).fill(0).map(()=> makeAccount())
    await Promise.all(allPromise)
    // await makeAccount();
  }
}

main();
