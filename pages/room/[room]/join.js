import PageWraper from "../../../components/Common/PageWraper";
import HomeHeader from "../../../components/Home/Header";
import JoinRoomPage from "../../../components/Room/Join/JoinRoomPage";
import MetaTagsGenerator from "../../../Utils/ComponentUtilities/MetaTagsGenerator";
import metaTags from "../../../Content/metaTags.json";
import { Grid } from "@mui/material";

export default function Join() {
  return (
    <PageWraper HeaderContent={<HomeHeader />}>
      <MetaTagsGenerator metaTags={metaTags["/"]} />
      <Grid
        container
        sx={{
          height: "100%",
          padding: "50px 100px",
        }}
        alignItems={"center"}
        justifyContent="center"
      >
        <JoinRoomPage />
      </Grid>
    </PageWraper>
  );
}
