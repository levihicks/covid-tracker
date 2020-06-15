import { useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Layout from "../components/layout";
import ErrorModal from "../components/errorModal";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Avatar from "@material-ui/core/Avatar";
import fetch from "node-fetch";

interface Country {
  name: string;
  slug: string;
  confirmed: number;
  deaths: number;
  recovered: number;
}

enum TableColumn {
  Country = "name",
  Confirmed = "confirmed",
  Deaths = "deaths",
  Recovered = "recovered",
}

export default function App({
  countriesList,
  errorMsg,
}: {
  countriesList: Country[];
  errorMsg: string | null;
}) {
  let [ascending, setAscending] = useState(true);
  let [sortedBy, setSortedBy] = useState(TableColumn["Country"]);
  let [countries, setCountries] = useState([...countriesList]);

  const categorySelectHandler = (colChanged, col) => {
    console.log(colChanged, col);
    let ascendingResult = colChanged ? true : !ascending;
    setAscending(ascendingResult);
    let newCountries = [...countries];
    newCountries.sort((a, b) => (a[col] < b[col] ? -1 : 1));
    ((ascendingResult && col !== "name") ||
      (!ascendingResult && col === "name")) &&
      newCountries.reverse();
    setCountries(newCountries);
    colChanged && setSortedBy(col);
  };

  return (
    <Layout>
      {errorMsg && <ErrorModal errorMsg={errorMsg}></ErrorModal>}
      <Paper elevation={3}>
        <Grid container spacing={2} justify="space-around" alignItems="center">
          <Grid item>
            <Avatar
              style={{ height: "200px", width: "200px" }}
              src="/covid.jpg"
              alt="Illustration of a man being tested for COVID-19"
            />
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Grid item xs={12}>
                <Typography variant="h2">
                  Stay up to date on COVID-19.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  Get the latest numbers on the COVID-19 pandemic in every
                  country, updated regularly.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <TableContainer style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            {Object.keys(TableColumn).map((cat) => (
              <TableCell className={TableColumn[cat]}>
                <TableSortLabel
                  direction={ascending ? "asc" : "desc"}
                  onClick={() => {
                    categorySelectHandler(
                      sortedBy !== TableColumn[cat],
                      TableColumn[cat]
                    );
                  }}
                >
                  {cat}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableHead>
          <TableBody>
            {countries.map((c) => (
              <TableRow>
                <TableCell>
                  <Link href="/[country]" as={`/${c.slug}`}>
                    <a>{c.name}</a>
                  </Link>
                </TableCell>
                <TableCell>{c.confirmed}</TableCell>
                <TableCell>{c.deaths}</TableCell>
                <TableCell>{c.recovered}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let errorMsg = null;
  let data = [];
  try {
    const res = await fetch(`https://api.covid19api.com/summary`);
    data = await res.json();
  } catch (e) {
    errorMsg = e.message;
  }
  let countriesList = data["Countries"].map((c) => {
    return {
      name: c["Country"],
      slug: c["Slug"],
      confirmed: c["TotalConfirmed"],
      deaths: c["TotalDeaths"],
      recovered: c["TotalRecovered"],
    };
  });
  return {
    props: { countriesList, errorMsg },
  };
};
