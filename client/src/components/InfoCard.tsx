import { FC } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export interface CardProps {
	title: string;
	subtitle: string;
}

const InfoCard: FC<CardProps> = (props) => {
	const { title, subtitle } = props;
	return (
		<Card elevation={3} sx={{ borderRadius: 3 }}>
			<CardContent>
				<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
					{title}
				</Typography>
				<Typography variant="h5">
					<b>{subtitle}</b>
				</Typography>
			</CardContent>
		</Card>
	);
};

export default InfoCard;
