import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Vesting Vault",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [sepolia],
  ssr: true,
});