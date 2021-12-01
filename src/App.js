import React, { useEffect, useState, Fragment } from "react";
import ReactDOM from "react-dom";

import logo from "./logo.svg";
import "./App.css";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
import "react-bootstrap-typeahead/css/Typeahead.css";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import GaugeChart from "react-gauge-chart";
//import LoadingButton from "@mui/lab/LoadingButton";
import Loader from "react-loader-spinner";
import { AirportOptions, AirlineOptions } from "./Data.js";
import Switch from "@mui/material/Switch";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { dark } from "@mui/material/styles/createPalette";
import HelpIcon from "@mui/icons-material/Help";
// import { Link } from 'react-router-dom';

// import Image from "material-ui-image";
const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
  });
   
      const theme = createTheme();
const airline_options = AirlineOptions;
const airport_options = AirportOptions;
const ngrok_url = "https://e374-34-66-238-70.ngrok.io"; //"https://5d3b-35-239-124-170.ngrok.io"; //"https://cc6f-34-83-40-166.ngrok.io";

const selectFieldDict = {
  origin: { options: airport_options, label: "Origin", id: "origin" },
  destination: { options: airport_options, label: "Destination", id: "destination" },
  airline: { options: airline_options, label: "Airline", id: "airline" }
};

//https://www.npmjs.com/package/react-gauge-chart
const SpeedometerChart = ({ percent, textColor }) => {
  return (
    <GaugeChart
      id="gauge-chart5"
      textColor={textColor}
      nrOfLevels={420}
      arcsLength={[0.3, 0.5, 0.2]}
      colors={["#5BE12C", "#F5CD19", "#EA4228"]}
      percent={percent || 0}
      arcPadding={0.02}
    />
  );
};

const getFlightDelay = ({ setResponse, url, setLoading,setError}) => {
  const options = {
    url: url,
    method: "GET"
    // headers: {
    //   Accept: "application/json",
    //   "Content-Type": "application/json;charset=UTF-8",
    //   // "Access-Control-Allow-Headers": "Content-Type",
    //   "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    //   "Access-Control-Allow-Methods": "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT ",
    //   "Access-Control-Allow-Origin": "*"
    // }
  };
  axios(options).then(response => {
    const responseResult = { data: response.data, status: response.status };
    console.log({ responseResult });
    setResponse(responseResult);
    setLoading(false);
  }).catch(
    function (error) {
      console.log({error})
      setLoading(false);
      setError(true)
    }
  )
};

const createURLFromForm = ({ formData }) => {
  const origin = formData.origin.value;
  const destination = formData.destination.value;
  const airline = formData.airline.value;
  //https://1lztwfbikg.execute-api.us-east-2.amazonaws.com/prod/flightdelay?origin=ORD&destination=SAN&airline=NK
  // const url = `https://1lztwfbikg.execute-api.us-east-2.amazonaws.com/prod/flightdelay?origin=${origin}&destination=${destination}&airline=${airline}`;
  // const url = `https://cors-anywhere.herokuapp.com/https://1lztwfbikg.execute-api.us-east-2.amazonaws.com/prod/flightdelay?origin=${origin}&destination=${destination}&airline=${airline}`;
  const base_url = "https://30z23scool.execute-api.us-east-2.amazonaws.com/prod";
  const url = `${base_url}?origin=${origin}&destination=${destination}&airline=${airline}`;
  //https://cors-anywhere.herokuapp.com/https://1lztwfbikg.execute-api.us-east-2.amazonaws.com/prod/flightdelay?origin=ORD&destination=SAN&airline=NK
  //const url = `${ngrok_url}/delay_frequency/origin=${origin}&destination=${destination}&airline=${airline}`;
  console.log({ url });
  return url;
};
const LoadingScreen = () => {
  return (
    <Grid container spacing={2} direction="column" alignItems="center" justify="center">
      <Grid item xs={12}>
        <Loader
          type={"ThreeDots" || "TailSpin"}
          color="#00BFFF"
          height={100}
          width={175}
          // timeout={3000} //3 secs
        />
      </Grid>
    </Grid>
  );
};

const percentFormat = num => {
  try {
    return parseInt(num*100)/100;
  } catch (err) {
    console.log({ err });
    return 0;
  }
};
const percentageGet = response => {
  try {
    return percentFormat(response.data.flight_delay_percentage);
  } catch (err) {
    console.log({response,err})
    return 0;
  }
};

const ChartScreen = ({ response, themeToggle }) => {
  const num = percentageGet(response); //response.data.flight_delay_percentage; //* 100;
  return (
    <Grid container spacing={2} direction="column" alignItems="center" justify="center">
      <Grid item xs={12}>
        <Tooltip title="Percent of airline's flights delayed 20 or more minutes on this route.">
          <IconButton>
            Route Delay Indicator
            <InfoIcon />
          </IconButton>
        </Tooltip>
        <SpeedometerChart percent={num} textColor={themeToggle ? "white" : "black"} />
      </Grid>
    </Grid>
  );
};
const ErrorScreen = () => {
  return (
    <Grid container spacing={2} direction="column" alignItems="center" justify="center">
      <Grid item xs={12}>
        Error: Not Found
      </Grid>
    </Grid>
  );
};

const LoadingGraph = ({ loading, response, themeToggle ,error}) => {
  const loadingResponse =  <Fragment>{loading ? <LoadingScreen /> : <ChartScreen response={response} themeToggle={themeToggle} />}</Fragment>;
  return error?<ErrorScreen/>:loadingResponse;
};
const App = () => {
  const [formData, setFormdata] = useState({
    origin: { value: "", label: "" },
    destination: { value: "", label: "" },
    airline: { value: "", label: "" }
  });
  const [response, setResponse] = useState({ data: { flight_delay_percentage: 0 }, response: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [themeToggle, setThemeToggle] = useState(false);
  const handleSubmit = event => {
    event.preventDefault();
    console.log({ formData });
    setLoading(true);
    setError(false)
    const url = createURLFromForm({ formData });
    getFlightDelay({ setResponse, url, setLoading,setError });
  };
  const TypeAheadSelect = ({ options, label, id }) => {
    return (
      <Autocomplete
        disablePortal
        value={formData[id].label}
        onChange={(event, newValue) => {
          const clonedData = { ...formData };
          clonedData[id] = newValue || { value: "", label: "" };
          setFormdata(clonedData);
        }}
        id={id}
        options={options}
        renderInput={params => <TextField {...params} label={label} />}
      />
    );
  };

  const AirLineSelect = () => {
    return <TypeAheadSelect {...selectFieldDict["airline"]} />;
  };

  const OriginSelect = () => {
    return <TypeAheadSelect {...selectFieldDict["origin"]} />;
  };

  const DestinationSelect = () => {
    return <TypeAheadSelect {...selectFieldDict["destination"]} />;
  };

  return (
    <ThemeProvider theme={themeToggle ? darkTheme : theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "white" }}>
            <Avatar alt="Remy Sharp" src="/images/suit_case_logo.ico" />
          </Avatar>
          <Typography component="h1" variant="h5">
            Flight Advisor
            {/* {response.data || "Flight Advisor"} */}
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {/* <Grid item xs={12}>
                <TypeHeadSelect />
              </Grid> */}
              <Grid item xs={12}>
                <AirLineSelect />
              </Grid>
              <Grid item xs={12} sm={6}>
                <OriginSelect />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DestinationSelect />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Submit
            </Button>

            <LoadingGraph response={response} error={error} loading={loading} themeToggle={themeToggle} />
            <Grid 
              justify="space-between"
              container spacing={2}>
              <Grid item xs={6} sm={6}>
                <Switch
                  checked={themeToggle}
                  onChange={event => {
                    setThemeToggle(event.target.checked);
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
              {/* <IconButton>
                  <a href="https://flight-advisor.com/contact/">
            <HelpIcon />
            </a>
          </IconButton> */}


              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
