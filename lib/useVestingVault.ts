import { useReadContract } from "wagmi";
import { vestingVaultAbi } from "./vestingVaultAbi";
import { VESTING_VAULT_ADDRESS } from "./contracts";

export function useScheduleCount(beneficiary?: `0x${string}`) {
  return useReadContract({
    address: VESTING_VAULT_ADDRESS,
    abi: vestingVaultAbi,
    functionName: "getScheduleCount",
    args: beneficiary ? [beneficiary] : undefined,
    query: {
      enabled: !!beneficiary,
    },
  });
}

export function useSchedule(
  beneficiary: `0x${string}` | undefined,
  id: bigint
) {
  return useReadContract({
    address: VESTING_VAULT_ADDRESS,
    abi: vestingVaultAbi,
    functionName: "getSchedule",
    args: beneficiary ? [beneficiary, id] : undefined,
    query: {
      enabled: !!beneficiary,
    },
  });
}