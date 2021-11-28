import { FC } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InfoCard, { CardProps } from "../components/InfoCard";

interface BasicLayoutProps {
	title: string;
	spacing?: number;
	buttonText?: string;
	buttonOnClick?: () => void;
	cardsArray?: CardProps[];
}

const BasicLayout: FC<BasicLayoutProps> = (props) => {
	const {
		title,
		spacing = 5,
		buttonText,
		buttonOnClick,
		cardsArray,
		children,
	} = props;

	return (
		<Grid container spacing={spacing}>
			<Grid item xs={12}>
				<Grid container justifyContent="space-between">
					<Grid item>
						<Typography variant="h4">{title}</Typography>
					</Grid>
					{buttonText && (
						<Grid item>
							<Button variant="contained" onClick={buttonOnClick}>
								{buttonText}
							</Button>
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
								<Grid item xs={12} md={4} key={cardTitle}>
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
