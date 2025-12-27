export const vestingVaultAbi = [
  {
    type: "function",
    name: "feeBps",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint16" }],
  },
  {
    type: "function",
    name: "createSchedule",
    stateMutability: "nonpayable",
    inputs: [
      { name: "beneficiary", type: "address" },
      { name: "start", type: "uint64" },
      { name: "cliff", type: "uint64" },
      { name: "duration", type: "uint64" },
      { name: "total", type: "uint128" },
      { name: "revocable", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "previewClaimable",
    stateMutability: "view",
    inputs: [
      { name: "beneficiary", type: "address" },
      { name: "id", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [
      { name: "beneficiary", type: "address" },
      { name: "id", type: "uint256" },
    ],
    outputs: [],
  },
] as const;