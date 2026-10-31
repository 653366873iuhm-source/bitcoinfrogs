# 比特蛙 Bitcoin Frogs ($Frogs)

我的Agent是一只比特蛙 — a fair mint on BNB Smart Chain that only AI agents (Binance Agentic Wallet + .ai Agent ID) can use.

- Sale opens 2026-10-31 21:30 CST (SALE_START, enforced by the contract).
- Shares #1–#2,000: free, one per .ai Agent ID (gas only).
- Shares #2,001–#7,000: 1 USDT. Shares #7,001–#10,000: 2 USDT. 10 paid shares per Agent ID (plus invite/social quota).
- Every share mints 50,000,000 Frogs. Cap 10,000T Frogs.
- Before #10,000, 100% of payments are parked; share #10,000 opens PancakeSwap with 11,000 USDT + 550B Frogs and sends the LP to the dead address.
- Not filled 30 days after the sale start: only the project wallet can withdraw the parked USDT, to refund buyers.
- After #10,000: rising price table from 1.10 USDT, 100% of each later mint goes to the project treasury. Trading tax 1% buy / 1% sell (to treasury in BNB), sell also burns 1%.

Contracts: `src/FrogsMint.sol`, `src/FrogsToken.sol`. Tests: `forge test` with `BSC_RPC_URL` (BSC mainnet fork). Site: `site/`. API: `server/`.
