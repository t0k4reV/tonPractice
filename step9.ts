import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal } from "@ton/ton";
import * as dotenv from "dotenv";

dotenv.config();

async function main() { 
  const mnemonic = process.env.MNEMONIC_PHRASE || "";
  if (!mnemonic) { 
    console.error('mnemonic phrase not found in .env file')
    return;  
  }
  const key = await mnemonicToWalletKey(mnemonic.split(" "))
  const wallet = WalletContractV4.create({publicKey: key.publicKey, workchain: 0});

  // initialize ton rpc client on testnet

  const endpoint = await getHttpEndpoint({network: "testnet"});
  const client = new TonClient({ endpoint });

  if (!await client.isContractDeployed(wallet.address)) { 
    return console.log("wallet is not deployed")
  }
  
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
        value: "0.05", // 0.05 TON
        body: "Hello", // optional comment
        bounce: false,
      })
    ]
  });
  
  // wait until confirmed

  let currentSeqno = seqno;
  while (currentSeqno == seqno) { 
    console.log("waiting for transaction to confirm...");
    await sleep();
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms)); 
};


