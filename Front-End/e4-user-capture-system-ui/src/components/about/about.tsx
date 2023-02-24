import React from 'react';
import { Typography } from '@mui/material';
;

 const About = () => (

    <>
        {/* <Typography
			variant="h2"
			noWrap={false}
			component="div"
			sx={{ mt: 2}}
            align='center'
		>
			Welcome to About		
		</Typography> */}
        <Typography
			variant="h4"
			noWrap
			component="div"
            align='center'
			sx={{ my: 3}}
		>
			Who's Nathi?		
		</Typography>
        <Typography
			variant='body1'
			noWrap={false}
			component="div"
            align='center'
		>
			An experienced individual with demonstrated history of working in IT and financial services industry. 
            Skilled in Software Development (Agile Methodologies, C#.Net, TDD, MVC, API, SQL, JavaScript, React, 
            Angular, TypeScript, Jquery, HTML, CSS, Applying Code principles in software development and many more). Strong research 
            professional with a Bachelor of Technology in Information Technology from Durban University of Technology.		
		</Typography>
    </>
)

export default About;