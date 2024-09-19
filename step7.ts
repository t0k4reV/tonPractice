import { mnemonicToWalletKey } from "@ton/crypto";
import { mnemonicIndexesToBytes } from "@ton/crypto/dist/mnemonic/mnemonic";
import { WalletContractV4 } from "@ton/ton";
import * as dotenv from "dotenv";

dotenv.config();

async function main() { 
    
    const mnemonic = process.env.MNEMONIC_PHRASE || "";
    if (!mnemonic) {
        console.error('mnemonic phrase not found in .env file');
        return;
    }

    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({publicKey: key.publicKey, workchain: 0});

    // print wallet address
    console.log(wallet.address.toString({ testOnly: true}));

    //print wallet workchain
    console.log("workchain:", wallet.address.workChain);
}

main();