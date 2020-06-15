import Head from "next/head";
import Link from "next/link";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Container maxWidth="lg">
        <Toolbar style={{ marginBottom: "20px" }}></Toolbar>
        <Head>
          <title>Covid-19 Tracker</title>
        </Head>
        <AppBar position="fixed">
          <Toolbar>
            <Link href="/">
              <Typography style={{ cursor: "pointer" }} variant="h6">
                Covid Tracker
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>
        {children}
      </Container>
    </>
  );
};

export default Layout;
