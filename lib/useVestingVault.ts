"use client";

import { useReadContract } from "wagmi";
import { vestingVaultAbi } from "./vestingVaultAbi";

export const VESTING_VAULT_ADDRESS =
  "0xd7cbf62e9aba341fc256226467965008251104f5";

export function useVestingVault(
  beneficiary?: `0x${string}`,
  scheduleId?: bigint
) {
  // Fee (bps)
  const { data: feeBps } = useReadContract({
    address: VESTING_VAULT_ADDRESS,
    abi: vestingVaultAbi,
    functionName: "feeBps",
  });

  // Claimable tokens
  const { data: claimable } = useReadContract({
    address: VESTING_VAULT_ADDRESS,
    abi: vestingVaultAbi,
    functionName: "previewClaimable",
    args:
      beneficiary && scheduleId !== undefined
        ? [beneficiary, scheduleId]
        : undefined,
    query: {
      enabled: !!beneficiary && scheduleId !== undefined,
    },
  });

  return {
    feeBps,
    claimable,
  };
}