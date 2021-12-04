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
const Login = () => {
  const paperStyle = {
    padding: 20,
    maxHeight: "70vh",
    width: 280,
    margin: "40px auto",
  };

  const avatarStyle = {
    backgroundColor: "#4ca953",
  };

  const btnStyle = {
    marginTop: 10,
  };

  const textfieldStyle = {
    marginTop: 10,
  };
  return (
    <>
      <Grid>
        <Paper elevation={3} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockIcon></LockIcon>
            </Avatar>
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
          <Button
            style={btnStyle}
            variant="contained"
            type="submit"
            color="primary"
            fullWidth>
            Sign in
          </Button>
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
