import React from 'react'
import { Typography } from '@mui/material';
import Link from '@mui/material/Link';

 const Contact = () => (
    <>
        <Typography
			variant="h4"
			noWrap={false}
			component="div"
			sx={{ my: 3 }}
            align='center'
		>
			Contact		
		</Typography>
        <Typography
			variant="h5"
			noWrap
			component="div"
            align='center'
		>
			Name : Siphenathi		
		</Typography>
        <Typography
			variant="h5"
			noWrap
			component="div"
            align='center'
		>
			Surname : Pantshwa		
		</Typography>
        <Typography
			variant="h5"
			noWrap
			component="div"
            align='center'
		>
			Contact  : 0780329830		
		</Typography>
        <Typography
			variant="h5"
			noWrap={false}
			component="div"
            align='center'
		>
			email  : spantshwa.lukho@gmail.com		
		</Typography>
        <Typography
			variant="h5"
			noWrap={false}
			component="div"
            align='center'
		>
			For more  :
            <Link href="https://www.siphenathi-pantshwa.co.za" 
                underline="hover"
                target="_blank"
                rel="noopener">
                click here
            </Link>
		</Typography>
    </>
 )

export default Contact;