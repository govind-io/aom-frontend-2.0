export const VolumeIndicatorStyle = (customContainerStyle, customIconStyle, volume) => ({
    main: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        position: "relative",
        background: "#FFFFFF 0% 0% no-repeat padding-box",
        borderRadius: "50%",
        opacity: "0.88",
        backdropFilter: "blur(4px)",
        ...customContainerStyle,
      },
    keyVolume: [{ color: "#04AA6D", fontSize: "30px" }, customIconStyle],
    volumeContainer: {
        width: "17%",
        display: "flex",
        alignItems: "flex-end",
        height: "36%",
        position: "absolute",
        top: "20%",
      },
      mainVolume: {
        height: volume ? `${volume * 10}%` : "0%",
        backgroundColor: "#04AA6D",
        width: "100%",
        borderRadius: "5px",
      }
})
    
