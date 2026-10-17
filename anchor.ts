import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Profile } from "../target/types/profile";
import type { Profile } from "../target/types/profile";

describe("profile", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Profile as anchor.Program<Profile>;
  
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.profile as Program<Profile>;

  it("Update profile", async () => {
    const user = anchor.getProvider().wallet.publicKey;

    const [profilePda] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("profile"),
          user.toBuffer(),
        ],
        program.programId
      );

    console.log("Profile PDA:", profilePda.toBase58());

    // Получаем существующий профиль
    let profile =
      await program.account.profile.fetch(
        profilePda,
        "confirmed"
      );

    console.log("Before update:");
    console.log("Username:", profile.username);
    console.log("Age:", profile.age);
    console.log("Bio:", profile.bio);

    // Обновляем профиль
    const tx = await program.methods
      .updateProfile(
        "Ernur Web3",
        21,
        "Solana & Rust developer"
      )
      .accounts({
        profile: profilePda,
        user: user,
        owner: user,
      })
      .rpc();

    await anchor
      .getProvider()
      .connection
      .confirmTransaction(tx, "confirmed");

    // Проверяем результат
    profile =
      await program.account.profile.fetch(
        profilePda,
        "confirmed"
      );

    console.log("After update:");
    console.log("Username:", profile.username);
    console.log("Age:", profile.age);
    console.log("Bio:", profile.bio);
  });
});