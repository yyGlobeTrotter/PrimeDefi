/**
 *
 */

/**
 * @description define the user roles type
 */
export enum ROLES {
	ISSUER = "ISSUER",
	INVESTOR = "INVESTOR",
}

export enum STATUS {
	OFFERLIVE = "Raising", // offer period has started but not closed
	OFFERCLOSED = "Raised", // offer period has closed out but investment/tokens not allocated yet
	ISSUED = "Issued", // investment/tokens have been allocated and official issuance started
	CANCELLED = "Cancelled", // deal issuance has been cancelled due to insuffient fund raised, or other reasons
	REDEEMED = "Redeemed", // the end of deal lifecycle - maturity or early redemption; principle investment and any last coupons are paid out, all o/s deal tokens are destroyed
}

export enum CHAIN {
	MAINNET = "0x1",
	ROPSTEN = "0x3",
	RINKEBY = "0x4",
	GOERLI = "0x5",
	KOVAN = "0x2a",
	POLYGON = "0x89",
	MUMBAI = "0x13881",
	BSC = "0x38",
	BSC_TESTNET = "0x61",
	AVALANCHE = "0xa86a",
}
