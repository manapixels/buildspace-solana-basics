const anchor = require('@project-serum/anchor');

const { SystemProgram } = anchor.web3;

const main = async () => {
    console.log("🚀 Starting test...")

    const provider = anchor.Provider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.Myepicproject;

    // Create an account keypair for our program to use.
    const baseAccount = anchor.web3.Keypair.generate();

    let tx = await program.rpc.startStuffOff({
        accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
    });

    console.log("📝 Your transaction signature", tx);

    // Fetch data from the account.
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count', account.totalGifs.toString())

    await program.rpc.addGif("insert_a_giphy_link_here", {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          vote: new anchor.BN(0)
        },
    });

    // update account
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count', account.totalGifs.toString())

    console.log('👀 GIF List', account)

    // Vote for a gif
    await program.rpc.vote(new anchor.BN(0), true, {
        accounts: {
          baseAccount: baseAccount.publicKey,
        },
    });

    // update account
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);

    console.log('👀 GIF List', account)


}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();