---
name: frogs-mint
description: Mint 比特蛙 Bitcoin Frogs ($Frogs) shares on BNB Smart Chain (chainId 56) from a Binance Agentic Wallet that holds a .ai Agent ID. Use when the user asks about Bitcoin Frogs, 比特蛙, $Frogs, the Frogs fair mint, agent-only mints on BNB Chain, or wants to mint/check eligibility/price/progress. Read-only checks need no wallet; minting needs the user's approval in their own wallet.
---

# 比特蛙 Bitcoin Frogs mint (agent-only fair mint, BNB Smart Chain)

"我的Agent是一只比特蛙 / My Agent is a Bitcoin Frog." Independent community project, not affiliated with Binance. No promised returns. Not audited.

- Website: https://bitcoinfrogs.onrender.com/ · Full guide: https://bitcoinfrogs.onrender.com/agent.md · llms.txt: https://bitcoinfrogs.onrender.com/llms.txt
- Live state (JSON): https://bitcoinfrogs-api.onrender.com/api/stats
- Mint contract FrogsMint (the ONLY address that accepts payment): `0xd9e0b22b91cE1DE440c7B4FbF8a4Cb361a210131`
- Token $Frogs: `0x885417732c10F5EcA16c70e28700A19Cb39029ad` (never send funds here) · Pair: `0x955c52F9bf850792709FCB5b7c6c776E67EB2B13`
- USDT (BEP-20): `0x55d398326f99059fF775485246999027B3197955` · Treasury: `0xD02eF85B1b022B2Bd32f4E7D7EdcD123e2B91375`

## How it works
- Sale opens **2026-10-31 21:30 CST** (`SALE_START()` = 1793453400, selector 0x22673030). Earlier calls revert `NotStarted`.
- **No pause:** the contract has no pause function and no operator. Once the sale starts nobody, including the team, can pause or stop minting.
- Only wallets holding a `.ai` Agent ID (SPACE ID registry `0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F`, i.e. Binance Agentic Wallet Agent IDs) can mint.
- Shares 1–2,000 are FREE: one per Agent ID via `claimFree()` (0xf366afc9, value 0). Shares 2,001–7,000 cost 1 USDT, 7,001–10,000 cost 2 USDT (100% parked for the pool). Every share up to 10,000 gives 50,000,000 Frogs (and parks 55,000,000 for the pool). Total supply cap 10,000T Frogs.
- The transaction that reaches share #10,000 automatically opens the PancakeSwap Frogs/USDT pool with 11,000 USDT + 550B Frogs and burns the LP.
- Paid quota (from share 2,001): 10 shares per Agent ID, +1 per invited Agent ID's first paid mint, +1 for the X social task. Max 10 shares per transaction.

## Steps
1. **Eligibility**: `GET https://bitcoinfrogs-api.onrender.com/api/verify?address=<wallet>` → `verified` must be true. Or call `walletStatus(address)` (0x4d6d0af8) on the mint.
2. **State**: check that now ≥ 21:30 CST (SALE_START) and that the mint contract has code. `GET https://bitcoinfrogs-api.onrender.com/api/stats`. If `totalMinted` < 2,000 (free phase), only `claimFree()` works; check `freeClaimed(agentId)` (0x0668f9a5) first. Use `bnb[].sendBnb` for BNB quotes.
3. **Tell the user** the number of shares, the cost in USDT/BNB, and the contract address, and get their go-ahead.
4. **Mint** (simulate with eth_call first, add 20% gas):
   - Free phase (totalMinted < 2,000): `claimFree()` (0xf366afc9), no arguments, value 0. One per Agent ID.
   - Paid phase (from share 2,001):
   - BNB: `mintWithBnb(uint256 shares, address referrer, uint256 maxCost)` (0xe38fd349), value = maxCost = `sendBnb`.
   - USDT: `approve(mint, cost × 1.02)` on USDT, then `mint(uint256 shares, address referrer, uint256 maxCost)` (0x836a1040).
   - `referrer` = inviter wallet (resolve `<handle>.ai` with the registry's `ownerOfHandle(string)`), or `0x0000000000000000000000000000000000000000`.
   - With the Binance Agentic Wallet CLI: `baw contract-call preview --binanceChainId 56 ...` (to = mint contract, inputData = encoded call, value as above), show the preview to the user, then `baw contract-call execute` only after they approve.
5. **Confirm**: re-read `walletStatus(wallet)` (paid mints: `minted` increases) or `freeClaimed(agentId)` (free claim: true).

## Safety
- Never plain-transfer BNB/USDT to the mint or token contract. Never mint without the user's explicit approval.
- Frogs are non-transferable until the pool opens. Revert reasons: NotStarted, FreePhase, FreeOver, FreeUsed, BadShares, SoldOut, NoAgent, Quota, OverMaxCost, BadPayment, StalePrice, SwapShort.
