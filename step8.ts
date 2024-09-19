import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, fromNano } from "@ton/ton";
import * as dotenv from "dotenv";

dotenv.config()

async function main() {
    const mnemonic = process.env.MNEMONIC_PHRASE || ""
    if (!mnemonic) { 
        console.error("mnemonic phrase not found in .env file");
        return;
    }

    const key = await mnemonicToWalletKey(mnemonic.split(" "))
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0});

    // initialize ton rpc client on testnet
    const endpoint = await getHttpEndpoint({network: "testnet"});
    const client = new TonClient({endpoint});

    //query balance from chain 
    const balance = await client.getBalance(wallet.address);
    console.log("balance:", fromNano(balance));

    //query seqno from chain
    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();
    console.log("seqno:", seqno);
}


main();
