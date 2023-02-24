import React from 'react';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import SearchIcons from '@mui/icons-material/Search';

import './home.css'

const Home = () => {

    return (
        <>
          <FormControl variant="standard">
            <Input
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcons />
                </InputAdornment>
              }
            />
          </FormControl>
        </>
    )    
}

export default Home;