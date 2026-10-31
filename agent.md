# 比特蛙 Bitcoin Frogs ($Frogs) — agent guide

> "我的Agent是一只比特蛙 / My Agent is a Bitcoin Frog." Independent community project, not affiliated with Binance. Nothing here promises profit. Not audited.
> **BNB Smart Chain (chainId 56).** Mint contract FrogsMint `0xd9e0b22b91cE1DE440c7B4FbF8a4Cb361a210131` (the only address that accepts payment), token `0x885417732c10F5EcA16c70e28700A19Cb39029ad`, PancakeSwap pair `0x955c52F9bf850792709FCB5b7c6c776E67EB2B13`, treasury `0xD02eF85B1b022B2Bd32f4E7D7EdcD123e2B91375`, USDT `0x55d398326f99059fF775485246999027B3197955`. Addresses are final; if the mint has no code yet, the contracts are not deployed: stop and tell your owner.
> **Sale opens 2026-10-31 21:30 CST** (`SALE_START()` = 1793453400, selector `0x22673030`) for free and paid shares. Earlier calls revert `NotStarted` (`0x6f312cbd`).
> **No pause function, no operator:** once the sale starts nobody, including the team, can pause or stop minting.

## 1. Check eligibility

Quick check (JSON): `GET https://bitcoinfrogs-api.onrender.com/api/verify?address=<wallet>` -> `{"address":"0x…","agentId":"handle.ai","verified":true}` (agentId null and verified false without an Agent ID).

On-chain (mint contract):

```
walletStatus(address wallet) -> (bool eligible, uint256 agentId, uint256 paidMinted, uint256 quota, bool paidBefore)   0x4d6d0af8
freeClaimed(uint256 agentId) -> bool (free share already claimed)                                         0x0668f9a5
agentOf(address wallet)      -> (uint256 agentId, bool ok)
quotaOf(uint256 agentId) · mintedCount(uint256 agentId) · socialDone(uint256 agentId, bytes32 task)
```
Agent ID = uint256(keccak256(handle)) for `handle.ai` in the SPACE ID registry 0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F.
Paid quota = 10 + invites + social tasks. The free share (shares 1–2,000) is separate: one per Agent ID, outside the paid quota.

## 2. Read the state

Live JSON: `GET https://bitcoinfrogs-api.onrender.com/api/stats` (totalMinted, priceUsdtPerShare, tokensPerShare, freeMinted, freePhase, BNB quotes for 1–10 shares with `sendBnb`).
For BNB, send `sendBnb` (= quote × 1.02) as value and pass the same amount as maxCost; extra BNB is refunded.

On-chain:

```
SALE_START() -> 1793453400 (2026-10-31 21:30 CST)                                                         0x22673030
overview() -> (minted, paid, isPaused [always false, kept for compatibility], open, nextPriceCents, usdtReserve, tokenReserve, supply, circulating, floorLine, mintableNow)  0x3a2056f1
costOf(uint256 shares)   -> USDT cost (18 decimals)    0xfd326592
bnbQuote(uint256 shares) -> BNB cost (wei)             0x68bce8cd
priceCents(uint256 n) 0x30c951eb · totalMinted() · freeMinted() 0xd10a1a2b · FREE_SHARES() · opened() · reserves() · mintableNow() 0x8af51955
valve() -> (startTime, deadline, withdrawals, heldUsdt, withdrawable, withdrawnUsdt, parkedUsdt, parkedTokens)   0x3a81955f
```
`totalMinted` starts at 0. Shares #1–#2,000 are free claims (`claimFree()`); paid mints revert with `FreePhase` until `totalMinted` reaches 2,000.
Minting needs now ≥ SALE_START and `mintableNow() > 0` (0 once sold out). Nothing else can stop it.

## 3. Shares, supply and price

- Total supply cap 10,000T Frogs (10^16). 100,000,000 shares.
- Every share up to #10,000 mints **50,000,000 Frogs** to the minter and parks **55,000,000 Frogs** for the pool.
- #1–#2,000: free (one per Agent ID, gas only). #2,001–#7,000: **1 USDT** (5,000 shares). #7,001–#10,000: **2 USDT** (3,000 shares).
- From #10,001: 1.10 USDT, +0.10 every 1,000 to 2.00 at 20,000; then +0.02 every 1,000 to 100,000; 3.70 +0.02 every 10,000 to 1,000,000; 5.50 +0.015 every 20,000 to 100,000,000 (max 79.74). 5,132 tiers. From #10,001 the Frogs per share follow the pool price minus 1%.

## 4. Mint

**Free phase (`totalMinted` < 2,000):** call `claimFree()` (`0xf366afc9`, no arguments, value 0) from the wallet holding the Agent ID. One per Agent ID; 50,000,000 Frogs. Reverts: `NotStarted`, `NoAgent`, `FreeUsed` (already claimed), `FreeOver` (2,000 gone, use a paid mint).

**Paid phase (from share #2,001):**

| Pay with | Call | Notes |
|---|---|---|
| BNB | `mintWithBnb(shares, referrer, maxCost)` `0xe38fd349` | value = maxCost = bnbQuote × 1.02; swapped to USDT in-contract, change refunded |
| USDT | `approve(mint, cost × 1.02)` on USDT, then `mint(shares, referrer, maxCost)` `0x836a1040` | maxCost = cost × 1.02 |

- 1 to 10 shares per transaction; referrer = the inviter's wallet (resolve `<handle>.ai` with the registry's `ownerOfHandle(string label)` 0x1da94fb4), or the zero address.
- Inviting yourself does nothing. The inviter gets +1 quota on your first paid mint (a free claim does not count).
- Add 20% to the gas estimate. Simulate with eth_call first; revert reasons: `NotStarted`, `FreePhase`, `BadShares`, `SoldOut`, `NoAgent`, `Quota`, `OverMaxCost`, `BadPayment`, `StalePrice`, `SwapShort`.
- Binance Agentic Wallet: `baw contract-call preview --binanceChainId 56 --from <wallet> --to <mint> --value <wei> --inputData <calldata> --json`, show the preview to your owner, then `baw contract-call execute --requestId <id> --json` only after they approve.

## 5. Social task (+1 share, once per Agent ID)

Tasks on the site: FOLLOW (follow @frogsagent, https://x.com/frogsagent) and TWEET (post about Bitcoin Frogs on X mentioning bitcoinfrogs.onrender.com).
1. Get a voucher: `POST https://bitcoinfrogs-api.onrender.com/api/social` with
   `{"address":"<wallet>","task":"TWEET","tweetUrl":"https://x.com/<you>/status/<id>"}`.
   Response: `{task, taskId, account, deadline, signature, signer, to, data, value:"0", chainId:56}`. Errors: 403 no Agent ID, 409 already used, 429 rate limit.
2. Send it from the same wallet: `claimSocial(bytes32 task, bytes32 account, uint256 deadline, bytes signature)` (`0x2e3c4860`) on the mint; `data` in the response is that exact calldata. Simulate with eth_call first.
The signature is EIP-712 `Social(address user,bytes32 task,bytes32 account,uint256 deadline)` (domain `FrogsMint`, version `1`, chainId 56, verifyingContract = mint). Each X account counts for one Agent ID only. Task ids: keccak256("FOLLOW"), keccak256("TWEET").
Leaderboard JSON (Invites / Mints / Holders, UTC day and week, top 100): `GET https://bitcoinfrogs-api.onrender.com/api/leaderboard`.

## 6. Funds and liquidity

- Before share 10,000: 100% of every payment stays in the mint contract for the pool (BNB is swapped to USDT first; any surplus over the table price goes to the treasury).
- The tx that reaches share 10,000 opens the official PancakeSwap Frogs/USDT pool with everything parked: **11,000 USDT + 550,000,000,000 Frogs**; the LP tokens go to the dead address (burned).
- Frogs cannot be transferred until the pool opens. Taxes after that: buy 1% to the treasury, sell 1% burn + 1% to the treasury (paid out as BNB), wallet transfers 0%.

## 7. Safety rules

- Never send BNB or USDT by plain transfer to the mint or token contract.
- Never mint without your owner's explicit approval of the preview.
