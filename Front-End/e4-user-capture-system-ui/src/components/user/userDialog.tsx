import { useState, forwardRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { UserModel } from "../model/userModel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const UserFormDialog = (props: {
  openDialog: boolean;
  setOpenUserDialogCallBack: any;
  saveNewUserCallBack: any;
}) => {
  const [UserFirstName, setUserFirstName] = useState("");
  const [UserSurname, setUserSurname] = useState("");
  const [contact, setContact] = useState("");

  const handleClose = () => {
    props.setOpenUserDialogCallBack(false);
    clearDialogState();
  };

  const disableSubmitButton = (): boolean => {
    return UserFirstName === "" || UserSurname === "" || contact === ""
      ? true
      : false;
  };

  const onSubmit = () => {
    handleClose();
    let userToBeRegistered: UserModel = {
      userId: "",
      firstName: UserFirstName,
      surname: UserSurname,
      contact: contact,
    };
    clearDialogState();
    props.saveNewUserCallBack(userToBeRegistered);
  };

  const clearDialogState = (): void => {
    setUserFirstName("");
    setUserSurname("");
    setContact("");
  };

  return (
    <div>
      <Dialog
        open={props.openDialog}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Typography variant="h4" noWrap component="div" align="center">
            Register User
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="email"
                variant="standard"
                required={true}
                onChange={(event: any) => setUserFirstName(event.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="surname"
                label="Surname"
                variant="standard"
                required={true}
                onChange={(event: any) => setUserSurname(event.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="dateofbirth"
                label="Date of Birth"
                variant="standard"
                required={true}
                type="date"
                onChange={(event: any) => setContact(event.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={disableSubmitButton()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserFormDialog;
