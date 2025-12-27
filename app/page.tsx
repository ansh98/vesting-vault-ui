"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { vestingVaultAbi } from "@/lib/vestingVaultAbi";

const VESTING_VAULT_ADDRESS =
  "0xd7cbf62e9aba341fc256226467965008251104f5";

export default function Page() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const [beneficiary, setBeneficiary] = useState("");
  const [totalTokens, setTotalTokens] = useState("");
  const [startDate, setStartDate] = useState("");
  const [cliffDate, setCliffDate] = useState("");
  const [duration, setDuration] = useState("");
  const [revocable, setRevocable] = useState(true);
  const [scheduleId, setScheduleId] = useState("0");

  const { data: feeBps } = useReadContract({
    address: VESTING_VAULT_ADDRESS,
    abi: vestingVaultAbi,
    functionName: "feeBps",
  });

  const { data: claimable } = useReadContract({
    address: VESTING_VAULT_ADDRESS,
    abi: vestingVaultAbi,
    functionName: "previewClaimable",
    args: address ? [address, BigInt(scheduleId)] : undefined,
  });

  const handleCreateSchedule = () => {
    if (!beneficiary || !totalTokens || !startDate || !cliffDate || !duration) {
      alert("Fill all fields");
      return;
    }

    const start = Math.floor(new Date(startDate).getTime() / 1000);
    const cliff = Math.floor(new Date(cliffDate).getTime() / 1000);

    writeContract({
      address: VESTING_VAULT_ADDRESS,
      abi: vestingVaultAbi,
      functionName: "createSchedule",
      args: [
        beneficiary,
        BigInt(start),
        BigInt(cliff),
        BigInt(duration),
        parseUnits(totalTokens, 18),
        revocable,
      ],
    });
  };

  const handleClaim = () => {
    writeContract({
      address: VESTING_VAULT_ADDRESS,
      abi: vestingVaultAbi,
      functionName: "claim",
      args: [address!, BigInt(scheduleId)],
    });
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Vesting Vault (Sepolia)</h1>

      {!isConnected && <p>Connect wallet</p>}

      {isConnected && (
        <>
          <p><strong>Wallet:</strong> {address}</p>
          <p><strong>Contract:</strong> {VESTING_VAULT_ADDRESS}</p>
          <p><strong>Fee:</strong> {feeBps?.toString()} bps</p>

          <hr />

          <h2>Create Vesting Schedule (Admin)</h2>

          <input placeholder="Beneficiary" onChange={e => setBeneficiary(e.target.value)} />
          <input placeholder="Total tokens" onChange={e => setTotalTokens(e.target.value)} />
          <input type="date" onChange={e => setStartDate(e.target.value)} />
          <input type="date" onChange={e => setCliffDate(e.target.value)} />
          <input placeholder="Duration (seconds)" onChange={e => setDuration(e.target.value)} />

          <label>
            <input type="checkbox" checked={revocable} onChange={e => setRevocable(e.target.checked)} />
            Revocable
          </label>

          <br /><br />
          <button onClick={handleCreateSchedule} disabled={isPending}>
            Create Schedule
          </button>

          <hr />

          <h2>Claim Tokens</h2>

          <input
            placeholder="Schedule ID"
            value={scheduleId}
            onChange={e => setScheduleId(e.target.value)}
          />

          <p>Claimable: {claimable?.toString() ?? "0"} tokens</p>

          {claimable === 0n && (
            <p style={{ opacity: 0.7 }}>
              No tokens available. Vesting may be fully claimed or cliff not reached.
            </p>
          )}

          <button onClick={handleClaim} disabled={isPending}>
            Claim
          </button>
        </>
      )}
    </main>
  );
}