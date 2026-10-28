# Shark Bridge fit for ContractPlay

Reviewed October 28, 2026. This comparison uses ContractPlay's [README](../../README.md) and [roadmap](../../TODO.md), plus Shark Bridge's public product pages and manuals. It is based on published documentation, not hands-on product testing.

## What Shark Bridge documents

- The Shark Bridge Game supports play against robots or friends and is offered for Windows, Mac, iPhone, and iPad. Its product page says users can open hands shared by a teacher. ([Game page](https://www.thesharkbridgecompany.com/shark-bridge-game))
- Its manuals document importing PBN and LIN deals into the Deal Library, then selecting a deal and choosing Replay or Play. ([Importing PBN/LIN](https://www.thesharkbridgecompany.com/shark-bridge-game/how-to-load-hands-on-a-table-in-shark-online-club))
- It lists Standard American 5-Card Major, 2/1 Game Force, and ACOL among its robot bidding systems. ([Robot convention card](https://www.thesharkbridgecompany.com/shark-bridge-game/shark-robot-convention-card))
- Its website also offers online club games, lessons, and a Teacher's Console that supports PBN/LIN files and classroom play. ([Company home](https://www.thesharkbridgecompany.com/), [Teacher's Console](https://www.thesharkbridgecompany.com/teachers-console))

## Fit against ContractPlay

| ContractPlay need | Published Shark Bridge support | Fit |
| --- | --- | --- |
| Play bridge against bots on Windows | Windows app and robot play | Strong |
| Import and play PBN deals | PBN/LIN import and deal replay | Strong, though the documented route is through Deal Library |
| SAYC / 2/1 practice | Standard American 5-card major and 2/1GF listed | Strong at the system-selection level; exact convention coverage is not independently verified |
| Play with other people | Play with friends and online club games | Strong |
| Automatically save the current and previous hands so they can be replayed later | ContractPlay documents autosave and up to 25 completed hands; I found no confirmation of equivalent automatic recent-hand history in Shark Bridge's reviewed pages | Key requirement not confirmed for Shark Bridge |
| Switch from human control to bots at any point and let them finish the active deal | Shark documents robot play, but the pages reviewed do not confirm an in-progress handoff from human to bot | Key requirement not confirmed for Shark Bridge |
| Teaching / classroom tools | Teacher's Console, shared hands, classroom tables | Shark has broader documented classroom features |
| ContractPlay's take-back, hand review, and legal-card hints | Not established by the reviewed Shark pages | Unknown / not confirmed |
| ContractPlay's open-source and locally controlled implementation | Not established by the reviewed Shark pages | Not a demonstrated match |
| ContractPlay's own online multiplayer and delivery roadmap | Shark offers online play and multiple clients | Potential substitute for the user need, but not a codebase or product requirement match |

## Recommendation

If the main goal is to import bridge deals, practice bidding and play against robots on Windows, and use SAYC or 2/1, Shark Bridge appears to cover much of it. Two key requirements remain unconfirmed in the reviewed Shark documentation: automatic saving/replaying of recent hands and the ability to hand control from a human to bots at any point during an active deal. Its PBN guide directs users to **Deal Library → Import Pbn/Lin**, then select a deal and choose **Replay** or **Play**; this is replay of imported deals and does not establish automatic recent-hand history or mid-deal bot takeover.

Automatic recent-hand history and mid-deal bot takeover are concrete reasons to keep ContractPlay in consideration unless Shark Bridge can demonstrate those features. ContractPlay's roadmap now records bot takeover as a requirement to implement. Test Shark's import path, recent-hand workflow, and bot handoff before deciding whether it replaces ContractPlay; the site alone cannot establish those details.
