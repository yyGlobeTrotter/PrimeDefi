/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useEffect, useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { navigate } from "@reach/router";
import Deal from "../contracts/Deal.json";

export interface DealCardProps {
	deal?: string;
	index: number;
}

const DealCard: FC<DealCardProps> = (props) => {
	const { index } = props;
	const { Moralis, isInitialized } = useMoralis();
	const { abi } = Deal;

	const {
		fetch: getIssuerMetadataByISIN,
		data: issuerMetadata,
		isLoading: getIssuerMetadataByISINLoading,
		isFetching: getIssuerMetadataByISINFetching,
	} = useWeb3ExecuteFunction({
		abi,
		functionName: "getIssuerMetaDataByISIN",
		contractAddress: "0x7af9B4e4006478160569BF956aE2241F49C43104",
		params: {
			_ISIN: "TEST",
		},
	});

	const {
		fetch: getIssuanceStateName,
		data: deal,
		isLoading: getIssuanceStateNameLoading,
		isFetching: getIssuanceStateNameFetching,
	} = useWeb3ExecuteFunction({
		abi,
		functionName: "getIssuanceStateNameRateDatesDetailsByISIN",
		contractAddress: "0x7af9B4e4006478160569BF956aE2241F49C43104",
		params: {
			_ISIN: "TEST",
		},
	});

	const { fetch: getIssuanceSizePriceTotal, data: issuanceSizePriceTotal } =
		useWeb3ExecuteFunction({
			abi,
			functionName: "getIssuanceSizePriceTotalBidDetailsByISIN",
			contractAddress: "0x7af9B4e4006478160569BF956aE2241F49C43104",
			params: {
				_ISIN: "TEST",
			},
		});

	const isLodingAndFetchingData = useMemo(
		() =>
			getIssuerMetadataByISINFetching ||
			getIssuerMetadataByISINLoading ||
			getIssuanceStateNameFetching ||
			getIssuanceStateNameLoading,
		[
			getIssuerMetadataByISINFetching,
			getIssuerMetadataByISINLoading,
			getIssuanceStateNameFetching,
			getIssuanceStateNameLoading,
		],
	);

	useEffect(() => {
		getIssuerMetadataByISIN();
		getIssuanceStateName();
		getIssuanceSizePriceTotal();
	}, [
		getIssuerMetadataByISIN,
		getIssuanceStateName,
		getIssuanceSizePriceTotal,
	]);

	return (
		<Card elevation={3} sx={{ borderRadius: 3 }}>
			<CardActionArea>
				<CardContent>
					{isLodingAndFetchingData ? (
						<>
							<Skeleton animation="wave" height={40} />
							<Skeleton animation="wave" height={40} />
							<Skeleton animation="wave" height={40} />
							<Skeleton animation="wave" height={40} />
							<Skeleton animation="wave" height={40} />
						</>
					) : (
						<>
							<Typography gutterBottom variant="h5" component="div">
								NVIDIA-{index} CORP.DL- NOTES 2021 (20/40)
							</Typography>
							<Divider />
							<Grid container spacing={2} marginY={1} marginBottom={2}>
								<Grid item xs={6}>
									<Typography variant="h6">Issuer</Typography>
									<Typography>
										{
											// @ts-ignore
											issuerMetadata?.issuerName === ""
												? "Credit Suisse"
												: // @ts-ignore
												  issuerMetadata?.issuerName
										}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant="h6">Credit Rating</Typography>
									<Typography>
										{
											// @ts-ignore
											issuerMetadata?.creditRating === ""
												? "AAA"
												: // @ts-ignore
												  issuerMetadata?.creditRating
										}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant="h6">Interest Rate</Typography>
									<Typography>
										{
											// @ts-ignore
											Moralis.Units.FromWei(deal?.interestRate, 3)
										}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography variant="h6">Term</Typography>
									<Typography>
										{
											// @ts-ignore
											deal?.term
										}{" "}
										days
									</Typography>
								</Grid>
							</Grid>
							<LinearProgress variant="determinate" value={0} />
							<Typography variant="body2" marginTop={2} align="right">
								USDC{" "}
								{
									// @ts-ignore
									issuanceSizePriceTotal?.totalInvestorBid
								}
								/
								{
									// @ts-ignore
									issuanceSizePriceTotal?.minSize
								}{" "}
								(
								{
									// @ts-ignore
									parseInt(issuanceSizePriceTotal?.totalInvestorBid, 10) /
										// @ts-ignore
										parseInt(issuanceSizePriceTotal?.minSize, 10)
								}
								%)
							</Typography>
						</>
					)}
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Button
					size="small"
					color="primary"
					fullWidth
					variant="contained"
					sx={{ mb: 2 }}
					disabled={isLodingAndFetchingData}
					onClick={() =>
						Moralis.User.current()?.attributes?.isInvestor
							? navigate("/bidding")
							: navigate("/deal/view/1")
					}
				>
					{isInitialized && Moralis.User.current()?.attributes?.isInvestor
						? "BID"
						: "EDIT"}
				</Button>
			</CardActions>
		</Card>
	);
};

export default DealCard;
