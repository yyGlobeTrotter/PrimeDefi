import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export interface CardProps {
	title: string;
	subtitle: string;
}

const InfoCard = (props: CardProps): JSX.Element => {
	const { title, subtitle } = props;
	return (
		<Card elevation={3}>
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
