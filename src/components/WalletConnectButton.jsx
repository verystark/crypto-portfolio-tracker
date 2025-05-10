import { useState } from "react";
import { ethers } from "ethers";
import { ERC20_ABI } from "../utils/erc20ABI";

export default function WalletConnectButton() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null)

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      setWalletAddress(address);

      const balance = await provider.getBalance(address);
      setEthBalance(ethers.formatEther(balance));

      const tokenAddress = "0xc8388e437031b09b2c61fc4277469091382a1b13";
      
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const rawBalance = await tokenContract.balanceOf(address);
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();
      const formatted = Number(rawBalance.toString()) / 10 ** Number(decimals.toString());

      setTokenBalance({ symbol, formatted });

    } else {
      alert("MetaMask not found. Please install it.");
    }
  }
  
  return (
    <div>
      {walletAddress ? (
        <div>
          <p><strong>Address:</strong> {walletAddress}</p>
          <p><strong>$ETH Balance</strong> {ethBalance} ETH</p>
          
          {tokenBalance && (
            <p><strong>${tokenBalance.symbol} Balance:</strong> {tokenBalance.formatted}</p>
          )}
        </div>
      ) : (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}