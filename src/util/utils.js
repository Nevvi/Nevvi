import React from 'react';
import {Box, Typography} from "@mui/material";

export function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <span
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{pt: 1}}>
                    <Typography component={"span"}>{children}</Typography>
                </Box>
            )}
        </span>
    );
}