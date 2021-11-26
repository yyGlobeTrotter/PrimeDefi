/**
 *
 */

/**
 * @description define the user roles type
 */
enum ROLES {
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

export default ROLES;
