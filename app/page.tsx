"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { vestingVaultAbi } from "@/lib/vestingVaultAbi";

const VESTING_VAULT_ADDRESS =
  "0xd7cbf62e9aba341fc256226467965008251104f5" as const;

export default function Page() {
  const { address, isConnected } = useAccount();

  const [beneficiary, setBeneficiary] = useState("");
  const [totalTokens, setTotalTokens] = useState("");
  const [startDate, setStartDate] = useState("");
  const [cliffDate, setCliffDate] = useState("");
  const [duration, setDuration] = useState("");
  const [revocable, setRevocable] = useState(true);

  const { writeContract, isPending } = useWriteContract();

  const { data: feeBps } = useReadContract({
    address: VESTING_VAULT_ADDRESS,
    abi: vestingVaultAbi,
    functionName: "feeBps",
  });

  const handleCreateSchedule = () => {
    if (
      !beneficiary ||
      !totalTokens ||
      !startDate ||
      !cliffDate ||
      !duration
    ) {
      alert("Fill all fields");
      return;
    }

    const startTimestamp = Math.floor(
      new Date(startDate).getTime() / 1000
    );
    const cliffTimestamp = Math.floor(
      new Date(cliffDate).getTime() / 1000
    );

    if (cliffTimestamp < startTimestamp) {
      alert("Cliff must be after start");
      return;
    }

    writeContract({
      address: VESTING_VAULT_ADDRESS,
      abi: vestingVaultAbi,
      functionName: "createSchedule",
      args: [
        beneficiary as `0x${string}`,
        BigInt(startTimestamp),
        BigInt(cliffTimestamp),
        BigInt(duration),
        parseUnits(totalTokens, 18),
        revocable,
      ],
    });
  };

  return (
    <main style={{ padding: 24, maxWidth: 600 }}>
      <h1>Vesting Vault (Sepolia)</h1>

      <ConnectButton />

      {isConnected && (
        <>
          <p>
            <strong>Wallet:</strong> {address}
          </p>
          <p>
            <strong>Contract:</strong> {VESTING_VAULT_ADDRESS}
          </p>
          <p>
            <strong>Fee:</strong> {feeBps?.toString()} bps
          </p>

          <hr />

          <h2>Create Vesting Schedule (Admin)</h2>

          <input
            placeholder="Beneficiary address"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
          />

          <br />

          <input
            placeholder="Total tokens (e.g. 100)"
            value={totalTokens}
            onChange={(e) => setTotalTokens(e.target.value)}
          />

          <br />

          <label>Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <br />

          <label>Cliff date</label>
          <input
            type="date"
            value={cliffDate}
            onChange={(e) => setCliffDate(e.target.value)}
          />

          <br />

          <input
            placeholder="Duration (seconds)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <br />

          <label>
            <input
              type="checkbox"
              checked={revocable}
              onChange={(e) => setRevocable(e.target.checked)}
            />{" "}
            Revocable
          </label>

          <br />
          <br />

          <button onClick={handleCreateSchedule} disabled={isPending}>
            {isPending ? "Creating..." : "Create Schedule"}
          </button>
        </>
      )}
    </main>
  );
}