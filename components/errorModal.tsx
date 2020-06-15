import { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const ErrorModal = ({ errorMsg }: { errorMsg: string | null }) => {
	const [open, setOpen] = useState(true);

	return (
		<Dialog onClose={() => setOpen(false)} open={open}>
			<DialogTitle>Error:</DialogTitle>
			<DialogContent dividers>
				<Typography variant="body1">{errorMsg}</Typography>
			</DialogContent>
			<DialogActions>
				<Button
					color="secondary"
					disableElevation
					onClick={() => setOpen(false)}
				>
					Okay
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ErrorModal;
