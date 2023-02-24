import {useState, forwardRef, useEffect} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {TransitionProps} from "@mui/material/transitions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {UserModel} from "../model/userModel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import {EventType} from "../model/evenType";

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
  onSubmitButtonClickCallBack: any;
  focusUser: UserModel;
  buttonClickEventType: EventType;
}) => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [contact, setContact] = useState("");

  const handleClose = () => {
    props.setOpenUserDialogCallBack(false);
    clearDialogState();
  };

  const disableSubmitButton = (): boolean => {
    // console.log("FirstName :", firstName);
    // console.log("Surname :", surname);
    // console.log("Contact :", contact);
    return firstName === "" || surname === "" || contactIsNotValid(contact)
      ? true
      : false;
  };

  const onSubmit = () => {
    handleClose();
    let userToBeRegistered: UserModel = {
      userId: props.focusUser.userId,
      firstName: firstName,
      surname: surname,
      contact: contact,
    };
    clearDialogState();
    props.onSubmitButtonClickCallBack(userToBeRegistered);
  };

  const clearDialogState = (): void => {
    setFirstName("");
    setSurname("");
    setContact("");
  };

  const contactIsNotValid = (contact: string): boolean => {
    return (
      contact == null ||
      contact === "" ||
      isNaN(Number(contact)) ||
      contact.length != 10
    );
  };

  const getDialogTitle = (): any => {
    if (props.buttonClickEventType === EventType.update) return "Update User";
    return props.buttonClickEventType === EventType.delete
      ? "Delete this User?"
      : "Register User";
  };

  useEffect(() => {
    if (props.focusUser) {
      setFirstName(props.focusUser?.firstName);
      setSurname(props.focusUser?.surname);
      setContact(props.focusUser?.contact);
    }
  }, [props]);

  return (
    <div>
      <Dialog
        open={props.openDialog}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Typography variant="h4" noWrap component="div" align="center">
            {getDialogTitle()}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="firstname"
                label="FirstName"
                variant="standard"
                required={true}
                onChange={(event: any) => setFirstName(event.target.value)}
                // defaultValue={firstName}
                value={firstName}
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
                onChange={(event: any) => setSurname(event.target.value)}
                // defaultValue={surname}
                value={surname}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="contact"
                label="Contact"
                variant="standard"
                required={true}
                onChange={(event: any) => setContact(event.target.value)}
                // defaultValue={contact}
                value={contact}
                type="number"
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
