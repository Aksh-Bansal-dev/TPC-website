import express, { Request, Response } from "express";
import { User } from "../model/User";
const Router = express.Router();
import { compare, hash } from "bcryptjs";
import { getAccessToken, sendRefreshToken } from "../utils/tokenstuff";
import { verify } from "jsonwebtoken";

const validEmailRegex = /^[a-zA-Z0-9]+(@iiitdmj\.ac\.in)$/;

// Login
Router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const gotUser = await User.findOne({ email: email });
    if (!gotUser) {
      // Todo: correct this to incorrect input or something
      throw new Error("User not found");
    }

    const correctPass = gotUser.password;
    if (!correctPass) {
      res.json({ done: false, err: "Please login using google" });
      return;
    }
    const isValid = await compare(password, correctPass!);

    if (!isValid) {
      // Todo: correct this to incorrect input or something
      throw new Error("Incorrct password");
    } else {
      const token = getAccessToken(gotUser);
      sendRefreshToken(res, gotUser);
      res.status(200).json({
        done: true,
        accessToken: token,
      });
    }
  } catch (err) {
    console.log("my Error: " + err);
    res.json({
      done: false,
      error: err,
    });
  }
});

// Login with google
Router.get("/google-login/:token", async (req: Request, res: Response) => {
  try {
    const tempToken = req.params.token;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = verify(tempToken, process.env.JWT_SECRET!);

    if (!payload) {
      res.json({ done: false, err: "Invalid id" });
      return;
    }

    const gotUser = await User.findOne({ googleId: payload.id });
    if (!gotUser) {
      res.json({ done: false, err: "User not found" });
      return;
    }

    const token = getAccessToken(gotUser);
    sendRefreshToken(res, gotUser);
    res.status(200).json({
      done: true,
      accessToken: token,
    });
  } catch (err) {
    console.log("my Error: " + err);
    res.json({
      done: false,
      error: "Something went wrong",
    });
  }
});

// Register
Router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.json({ done: false, err: "Invalid Input" });
      return;
    }

    if (!validEmailRegex.test(email)) {
      res.json({ done: false, err: "Invalid Email" });
      return;
    }

    const existingUser = await User.findOne({ email: email }).exec();
    if (existingUser) {
      res.json({ done: false, err: "Email already exists" });
      return;
    }
    const hashedPassword = await hash(password, 12);

    const newUser = {
      username,
      email,
      password: hashedPassword,
    };

    User.create(newUser);
    res.status(200).json({ done: "true" });
  } catch (err) {
    console.log("my error: " + err);
    res.json({ done: false, error: err });
  }
});

// Reset Password
Router.post("/reset", async (req: Request, res: Response) => {
  try {
    const { email, password, newPassword } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("No user found");
    }
    const correctPassword = user.password;
    const isValid = await compare(password, correctPassword!);
    if (isValid) {
      const newPasswordHash = await hash(newPassword, 12);
      const payload = await User.updateOne(
        { _id: user._id },
        { password: newPasswordHash }
      );
      res.json(payload);
    } else {
      throw new Error("Incorrect Password");
    }
  } catch (err) {
    console.log("My Error: " + err);
    res.json({ ok: false, err: err });
  }
});

// Logout
Router.get("/logout", async (_req: Request, res: Response) => {
  try {
    // sendRefreshToken(res);
    res.cookie("jid", "", { httpOnly: true, path: "/api/refresh_token" });
    res.status(200).json({ done: true });
  } catch (err) {
    res.json({ ok: false, err: err });
  }
});

// Get User
Router.get("/get/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ done: false, err: "UserId not found" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ done: false, err: "User not found" });
    }

    return res.json({ done: true, data: user });
  } catch (err) {
    console.log("My error: " + err);
    return res.json({ done: false, err: "Something went wrong" });
  }
});

// TEST ROUTES BELOW NOT FOR PRODUCTION

// Test route to get all users
Router.get("/test", async (_, res: Response) => {
  try {
    const allUsers = await User.find({});
    res.json({ data: allUsers });
  } catch (err) {
    console.log(err);
    res.json({ done: false, err: err });
  }
});
// Delete user
Router.delete("/test/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = await User.deleteOne({ _id: id });
    res.json({ data });
  } catch (err) {
    console.log(err);
    res.json({ done: false, err: err });
  }
});
// Create Admins
Router.post("/register-admin", async (req: Request, res: Response) => {
  try {
    const { username, email, password, clubs } = req.body;
    if (!username || !email || !password || !clubs) {
      res.json({ done: false, err: "Invalid Input" });
      return;
    }

    if (!validEmailRegex.test(email)) {
      res.json({ done: false, err: "Invalid Email" });
      return;
    }

    const existingUser = await User.findOne({ email: email }).exec();
    if (existingUser) {
      res.json({ done: false, err: "Email already exists" });
      return;
    }
    const hashedPassword = await hash(password, 12);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      clubs,
    };

    User.create(newUser);
    res.status(200).json({ done: "true" });
  } catch (err) {
    console.log("my error: " + err);
    res.json({ done: false, error: "Something went wrong" });
  }
});

export default Router;
