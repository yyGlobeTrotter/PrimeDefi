import { FC } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InfoCard, { CardProps } from "../components/InfoCard";

interface BasicLayoutProps {
	title: string;
	buttonText?: string;
	cardsArray?: CardProps[];
	children?: FC;
}

const BasicLayout: FC<BasicLayoutProps> = (props) => {
	const { title, buttonText, cardsArray, children } = props;
	return (
		<Grid container spacing={5}>
			<Grid item xs={12}>
				<Grid container justifyContent="space-between">
					<Grid item>
						<Typography variant="h4">{title}</Typography>
					</Grid>
					{buttonText && (
						<Grid item>
							<Button variant="contained">{buttonText}</Button>
						</Grid>
					)}
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<Grid container spacing={3}>
					{cardsArray &&
						cardsArray.map((card) => {
							const { title: cardTitle, subtitle } = card;
							return (
								<Grid item xs={12} md={4}>
									<InfoCard title={cardTitle} subtitle={subtitle} />
								</Grid>
							);
						})}
				</Grid>
			</Grid>
			<Grid item xs={12}>
				{children}
			</Grid>
		</Grid>
	);
};

export default BasicLayout;
