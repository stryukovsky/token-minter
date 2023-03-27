import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TokenMinter } from "../target/types/token_minter";
import { getAssociatedTokenAddress } from "@solana/spl-token";

describe("token-minter", () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.TokenMinter as Program<TokenMinter>;
    const mint = anchor.web3.Keypair.generate();

    it("should be initialized", async () => {
        await program.methods.initialize().accounts({
            mint: mint.publicKey,
        }).signers([mint]).rpc();
    });

    it("should initialize token account", async () => {
        const tokenAccount = await getAssociatedTokenAddress(mint.publicKey, anchor.getProvider().publicKey);
        await program.methods.initializeAccount().accounts({
            tokenAccount: tokenAccount,
            mint: mint.publicKey
        }).rpc();
    });

    it("should mint", async () => {
        const amount = new anchor.BN(100);
        const tokenAccount = await getAssociatedTokenAddress(mint.publicKey, anchor.getProvider().publicKey);
        await program.methods.mintTokens(amount).accounts({
            tokenAccount,
            mint: mint.publicKey
        }).rpc();
    });
});
