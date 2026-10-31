// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {BscConfig} from "./BscConfig.sol";
import {FrogsMint} from "../src/FrogsMint.sol";

/// @notice Bitcoin Frogs: plain CREATE from the deployer EOA (no rights after deploy; no pause function). Sale opens at SALE_START.
contract DeployV2 is Script {
    function run() external {
        vm.startBroadcast();
        require(msg.sender == BscConfig.DEPLOYER, "wrong deployer");
        FrogsMint m = new FrogsMint(BscConfig.params(BscConfig.SOCIAL_SIGNER));
        vm.stopBroadcast();
        console2.log("mint", address(m));
        console2.log("token", address(m.token()));
        console2.log("pair", address(m.pair()));
    }
}
