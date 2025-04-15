import { BigInt } from "@graphprotocol/graph-ts";
import {
    ItemListed, ItemBought, ItemCanceled
} from "../generated/NFTMarketPlace/NFTMarketPlace"

export function handleItemListed(event: ItemListed): void{}
export function handleItemBought(event: ItemBought):void{}
export function handleItemCanceled(event: ItemCanceled):void{}