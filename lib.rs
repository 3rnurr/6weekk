use anchor_lang::prelude::*;

declare_id!("AYDshepyVM9Ta7Lep1heBJfbbAyDPuuzozWxKz9XWCou");

#[program]
pub mod profile {
    use super::*;

    pub fn initialize_profile(
        ctx: Context<InitializeProfile>,
        username: String,
        age: u8,
        bio: String,
    ) -> Result<()> {
        let profile = &mut ctx.accounts.profile;

        profile.owner = ctx.accounts.user.key();
        profile.username = username;
        profile.age = age;
        profile.bio = bio;

        Ok(())
    }

    pub fn update_profile(
        ctx: Context<UpdateProfile>,
        username: String,
        age: u8,
        bio: String,
    ) -> Result<()> {
        let profile = &mut ctx.accounts.profile;

        profile.username = username;
        profile.age = age;
        profile.bio = bio;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeProfile<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 4 + 50 + 1 + 4 + 200,
        seeds = [b"profile", user.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, Profile>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(
        mut,
        seeds = [b"profile", user.key().as_ref()],
        bump,
        has_one = owner
    )]
    pub profile: Account<'info, Profile>,

    pub user: Signer<'info>,

    /// CHECK: проверяется через has_one
    pub owner: UncheckedAccount<'info>,
}

#[account]
pub struct Profile {
    pub owner: Pubkey,
    pub username: String,
    pub age: u8,
    pub bio: String,
}