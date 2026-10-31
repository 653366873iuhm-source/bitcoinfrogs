// 比特蛙 Bitcoin Frogs ($Frogs) site configuration. Addresses are final; contracts not deployed yet (site degrades gracefully).
// Sale opens 2026-10-31 21:30 CST (unix 1793453400 = FrogsMint.SALE_START) for both free and paid shares.
// Shares #1-#2,000 free (claimFree(), one per .ai Agent ID); #2,001-#7,000 = 1 USDT; #7,001-#10,000 = 2 USDT (100% parked for the pool).
window.FROGS_CONFIG = {
  chainId: 56,
  rpc: ["https://bsc-rpc.publicnode.com", "https://bsc-dataseed.bnbchain.org", "https://bsc-dataseed1.binance.org"],
  mint: "0xd9e0b22b91cE1DE440c7B4FbF8a4Cb361a210131",   // FrogsMint
  token: "0x885417732c10F5EcA16c70e28700A19Cb39029ad",  // FrogsToken ($Frogs)
  pair: "0x955c52F9bf850792709FCB5b7c6c776E67EB2B13",   // PancakeSwap Frogs/USDT pair
  usdt: "0x55d398326f99059fF775485246999027B3197955",
  agentRegistry: "0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F",
  treasury: "0xD02eF85B1b022B2Bd32f4E7D7EdcD123e2B91375",
  explorer: "https://bscscan.com",
  repo: "https://github.com/653366873iuhm-source/bitcoinfrogs",
  site: "https://bitcoinfrogs.onrender.com/",
  // Sale start (FrogsMint.SALE_START, uint256 constant): 2026-10-31 21:30 CST. Before it the site shows the pre-heat countdown.
  saleStart: 1793453400,
  // Binance Agentic Wallet QR login proxy (server/ in the repo, Render web service). The mint contract address must be in
  // its ALLOW_TO env var, otherwise mint previews are refused (USDT approve is always allowed).
  agentApi: "https://bitcoinfrogs-api.onrender.com/api/agent-wallet",
  // Same API service: /api/social (task vouchers), /api/leaderboard; pinged on page load to wake the free instance.
  api: "https://bitcoinfrogs-api.onrender.com",
  // No project X account yet -> no X link/handle and no FOLLOW task on the site. Set x: "<handle>" to add them.
  social: {
    x: "",
  },
};
