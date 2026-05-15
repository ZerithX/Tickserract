import { Hono } from "hono";
import { login, register, forgotPassword, resetPassword } from "../controller/auth.js";

const auth = new Hono();

auth.post("/register", register);
auth.post("/login", login);
auth.post("/forgot-password", forgotPassword);
auth.post("/reset-password", resetPassword);

export default auth;
