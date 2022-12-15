import React from "react";
import { LinearProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "12px",
        display: "flex",
        alignItems: "flex-end",
        height: "30px",
        position: "absolute",
        top: "3px"
    },
}));

const VolumeVisualizer = ({ volume }) => {
    const classes = useStyles();

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                position: "relative"
            }}
        >
            <KeyboardVoiceOutlinedIcon sx={{ color: "#04AA6D", fontSize: "50px" }} />

            <div className={classes.root}>
                <div
                    style={{
                        height: volume ? `${volume * 10}%` : "0%",
                        backgroundColor: "#04AA6D",
                        width: "100%",
                        borderRadius: "5px"
                    }}
                ></div>
            </div>
        </div>
    );
};

export default VolumeVisualizer;
