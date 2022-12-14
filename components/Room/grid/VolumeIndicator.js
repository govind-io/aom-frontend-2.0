import React from "react";
import { LinearProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "10px",
        display: "flex",
        alignItems: "flex-end",
        height: "50px",
        border: "1px solid white",
        borderRadius: "2px",
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
                width: "20px",
            }}
        >
            {volume ? (
                <VolumeUpIcon
                    sx={{
                        color: "white",
                        maxHeight: "20px",
                    }}
                />
            ) : (
                <VolumeMuteIcon
                    sx={{
                        color: "white",
                        maxHeight: "20px",
                    }}
                />
            )}

            <div className={classes.root}>
                <div
                    style={{
                        height: volume ? `${volume * 10}%` : "0%",
                        backgroundColor: "#04AA6D",
                        width: "100%",
                    }}
                ></div>
            </div>
        </div>
    );
};

export default VolumeVisualizer;
