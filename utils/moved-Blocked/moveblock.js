const { Network, network } = require("hardhat");

async function sleep(timeInMs) {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
}
async function MoveBlock(amount, sleepAmount = 0) {
  for (let i = 0; i < sleepAmount; i++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
    if (sleepAmount) {
      await sleep(sleepAmount);
    }
  }
}
