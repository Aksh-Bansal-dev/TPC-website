import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Paper, Theme, Typography } from "@material-ui/core";
import Login from "./Login";
import Signup from "./Signup";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: "4vh",
      fontWeight: "bold",
      fontSize: "1.4rem",
    },
    main: {
      width: "30vw",
      [theme.breakpoints.down("sm")]: {
        width: "90vw",
      },
    },
  })
);

const RegistrationForm: React.FC = () => {
  const classes = useStyles();
  const [login, setLogin] = useState(false);

  return (
    <Paper className={classes.main}>
      <Typography className={classes.title} align="center">
        {login ? "Login" : "Sign Up"}
      </Typography>
      {login ? <Login setLogin={setLogin} /> : <Signup setLogin={setLogin} />}
    </Paper>
  );
};

export default RegistrationForm;