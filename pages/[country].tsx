import { GetServerSideProps } from "next";
import Layout from "../components/layout";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import fetch from "node-fetch";

enum InfoCategories {
  confirmed = "black",
  active = "#1C5D99",
  deaths = "#639FAB",
  recovered = "#BBCDE5",
}

export default function App({ name, totals }) {
  return (
    <Layout>
      <Grid container justify="space-evenly" direction="row">
        <Grid item xs={12}>
          <Typography
            variant="h2"
            style={{
              textAlign: "left",
              borderBottom: "2px solid black",
              marginBottom: "50px",
            }}
          >
            {name}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          {Object.keys(InfoCategories).map((c) => (
            <>
              <Typography variant="h3" style={{ color: InfoCategories[c] }}>
                {totals[totals.length - 1][c]}
              </Typography>
              <Typography variant="h6" style={{ color: InfoCategories[c] }}>
                {c.replace(c[0], c[0].toUpperCase())}
              </Typography>
            </>
          ))}
        </Grid>
        <Grid item xs={9}>
          <Grid container>
            {Object.keys(InfoCategories).map((c) => {
              return (
                <Grid
                  item
                  xs={6}
                  style={{ marginBottom: "25px", paddingRight: "10px" }}
                >
                  <ResponsiveContainer
                    width="100%"
                    height={300}
                    style={{ margin: "none" }}
                  >
                    <AreaChart data={totals}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        dataKey={c}
                        fill={InfoCategories[c]}
                        stroke="black"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(
    `https://api.covid19api.com/total/country/${context.params.country}`
  );
  const countryData = await res.json();
  const name = countryData[0]["Country"];
  const totals = countryData.map((c) => {
    return {
      confirmed: c["Confirmed"],
      deaths: c["Deaths"],
      recovered: c["Recovered"],
      active: c["Active"],
      date: c["Date"].split("T")[0].slice(5),
    };
  });

  return {
    props: { name, totals },
  };
};
