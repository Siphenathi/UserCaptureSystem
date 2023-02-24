import { forwardRef } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {AlertModel} from '../model/alertModal';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

export default function CustomAlert(props: {openAlert:boolean, setOpenAlertCallBack:any, alertDetails:AlertModel}) {
  
    const handleClick = () => {
        props.setOpenAlertCallBack(false);
    };
  
    return (
      <>
        <Dialog open={props.openAlert} onClose={handleClick} TransitionComponent={Transition}>
          <Alert
            sx={{
                "& .MuiAlert-icon": {
                  color: "blue"
                }            
              }}
              variant='outlined'
              color={props.alertDetails.feedbackType}
              severity={props.alertDetails.feedbackType}
              onClose={handleClick}
              closeText="Close"
          >
            <AlertTitle>{props.alertDetails.title}!</AlertTitle>
                {props.alertDetails.description}
          </Alert>
        </Dialog>
      </>
    );
  }