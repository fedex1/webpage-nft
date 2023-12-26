const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
// const { Web3Storage, File, Blob } = require("web3.storage");
// import { NFTStorage, File, Blob } from 'nft.storage';
const nft = require('nft.storage');
require("dotenv").config()

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

async function main() {
  console.log(`web nft step 0`);
  const WebNft = await hre.ethers.getContractFactory("RYNFT");
  console.log(`web nft step 1:${WebNft}`);

  const webNft = await WebNft.deploy(process.env.OWNER_ADDRESS);
  // const webNft = await WebNft.deploy(process.env.PRIVATE_KEY);
  console.log(`web nft step 2:${webNft}`);

  await webNft.deployed();

  console.log("web nft deployed to:", webNft.address);

  const html = await fs.readFileSync(
    path.join(__dirname, "..", "assets", "index.html")
  );

  console.log(`QQQ: html: ${html}`);

// const storage = new nft.NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDliODc4YzZEMEQ1NDU4MDBjQzMzRjA2NTRCZGNFYTU5QjY3MURmOUMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwMzQzOTcyMzI2NCwibmFtZSI6InVwbG9hZDEifQ.OeT2fdEaU4s3XV_v0IM1bJcX-HqDs20J3fDz8ipahhw' });
const storage = new nft.NFTStorage({ token: process.env.NFT_STORAGE_KEY});
  // const storage = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJlMTM4YUQ1RmNFMkZBZTM1MTYyZERBYzc2RjFGY0IxQzNmMjA5N0QiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjU0MTY3NTA5ODIsIm5hbWUiOiJTdHJlYW1GaSB0ZXN0In0.ozLCEZhE-AhP2rAWmt162sLn3TbGM-AIeZAoqwXhoP0", });
  console.log(`QQQ: storage: ${storage}`);

  const blob1 = new nft.Blob([html]);
  console.log(`QQQ: blob1: ${blob1}`);

  const cid = await storage.storeBlob(blob1);
  console.log(`QQQ: cid: ${cid}`);

  // const url = `https://${cid}.ipfs.w3s.link`;
  const url = `ipfs://${cid}`;

  const metadata = {
    name: "RY Test web NFT",
    description: "This is a test description",
    animation_url: url,
  };

  const blob = new nft.Blob([JSON.stringify(metadata)], {
    type: "application/json",
  });

  const metadataCid = await storage.storeBlob(new nft.File([blob], "metadata.json"));
  console.log(`QQQ: metadataCid: ${metadataCid}`);

  const txn = await webNft.functions.safeMint(
    // "0xb05e879CA443eaDce5d2d7D5B256cb8624a46FbA",
    // webNft.address,
    process.env.OWNER_ADDRESS,

    // `https://${metadataCid}.ipfs.w3s.link/metadata.json`
    `ipfs://${metadataCid}/metadata.json`
  );

  await txn.wait();
  console.log("NFT minted!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
