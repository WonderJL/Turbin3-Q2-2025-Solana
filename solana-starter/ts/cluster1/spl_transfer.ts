import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("92zxLmVwXPtqc9BwoHtpxqtbRfN38j2jYiUMxmRr7BCF");

// Recipient address
const to = new PublicKey("9zw63htc6Y7zCph4pWD2cW7sxf69Q5r22CJAKE3A3UVe");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        )
    

        // Get the token account of the toWallet address, and if it does not exist, create it
        const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        )

        console.log(`Sender token account: ${senderTokenAccount.address}`);
        console.log(`Receiver token account: ${receiverTokenAccount.address}`);

        // Transfer the new token to the "toTokenAccount" we just created

        const transferTx = await transfer(
            connection,
            keypair,
            senderTokenAccount.address,
            receiverTokenAccount.address,
            keypair.publicKey,
            1000000n
        )
        console.log(`Your transfer txid: ${transferTx}`);
        console.log(`You have successfully transferred 1 token to ${to.toBase58()}`);
        console.log(`You have successfully transferred 1 token to ${receiverTokenAccount.address.toBase58()}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();