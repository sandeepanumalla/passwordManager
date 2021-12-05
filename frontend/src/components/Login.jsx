import React from "react";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
  Link,
} from "@material-ui/core";
import LockIcon from "@mui/icons-material/Lock";
import MailIcon from "@mui/icons-material/Mail";
// import undrawImage from "./undraw_sign_in_re_o58h.svg";

const Login = () => {
  const paperStyle = {
    padding: 20,
    maxHeight: "70vh",
    width: 280,
    margin: "40px auto",
    borderRadius: "25px",
  };

  const avatarStyle = {
    backgroundColor: "#4ca953",
  };

  const btnStyle = {
    margin: 10,
    borderRadius: "25px",
    width: 150,
  };

  const textfieldStyle = {
    marginTop: 10,
  };

  const undrawStyle = {
    backgroundImage: 'url("./undraw_sign_in_re_o58h.svg")',
  };
  return (
    <>
      <Grid>
        <Paper elevation={4} style={paperStyle}>
          <Grid align="center" style={undrawStyle}>
            {/* <Avatar style={avatarStyle}>
              <LockIcon></LockIcon>
            </Avatar> */}
            <img src="D:/password manager/frontend/src/components/undraw_sign_in_re_o58h.svg"></img>
          </Grid>
          <h2>Sign in</h2>
          <TextField
            style={textfieldStyle}
            id="standard-basic"
            fullWidth
            label="Your Email"
            variant="standard"
            required
          />

          <TextField
            style={textfieldStyle}
            id="standard-basic"
            fullWidth
            label="Password"
            type="password"
            variant="standard"
            required
          />
          <FormControlLabel
            control={<Checkbox name="checkedB" color="primary" />}
            label="Remember me"
          />
          <Grid>
            <Button
              style={btnStyle}
              variant="contained"
              type="submit"
              color="primary">
              log in
            </Button>
          </Grid>

          <Typography>
            <Link href="#">Forgot password?</Link>
          </Typography>
          <Typography>
            Don't have an acount?
            <Link href="#">Sign up</Link>
          </Typography>
        </Paper>
      </Grid>
    </>
  );
};

export default Login;
