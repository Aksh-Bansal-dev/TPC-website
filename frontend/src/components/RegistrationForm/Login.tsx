import React from "react";
import { Formik, Form } from "formik";
import { Button, Link, Typography } from "@material-ui/core";
import { useSignupLoginStyles } from "./signupLoginStyle";
import FormikTextField from "./FormikTextField";
import * as yup from "yup";

interface LoginProps {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const validSchema = yup.object({
  email: yup
    .string()
    .required()
    .max(64)
    .matches(/^[a-zA-Z0-9]+(@iiitdmj\.ac\.in)$/, "Invalid Email"),
  password: yup
    .string()
    .required()
    .min(6)
    .matches(/[0-9]/, "Password must include atleast 1 digit"),
});

const Login: React.FC<LoginProps> = ({ setLogin }) => {
  // const classes = useStyles();
  const classes = useSignupLoginStyles();
  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validSchema}
        // validate={(values) => {
        //   const errors: Record<string, string> = {};

        //   if (values.password.length < 8) {
        //     errors.password = "Password must be atleast 8 charater long";
        //   }

        //   return errors;
        // }}
        onSubmit={(data, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          console.log(data);
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form className={classes.root} noValidate autoComplete="off">
            <FormikTextField
              label="Email"
              className={classes.input}
              name="email"
            />
            <FormikTextField
              name="password"
              label="Password"
              type="password"
              className={classes.input}
            />
            <Button
              disabled={isSubmitting}
              color="inherit"
              variant="contained"
              type="submit"
              className={classes.btn}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
      <Typography align="center" className={classes.footer}>
        No Account?
        <Link className={classes.link} onClick={() => setLogin(false)}>
          Create one
        </Link>
      </Typography>
    </>
  );
};

export default Login;