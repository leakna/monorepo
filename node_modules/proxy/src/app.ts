
import express from "express";
import { proxyRoute } from "./middlewares/proxyRoute";
import { checkAuthenticate, checkAuthorize, checkRequestRoute } from "@/src/middlewares/checkRoute";
import { globalErrorHandler } from "./middlewares/global-errror-handler";
import cookieParser from 'cookie-parser';
const app = express();
app.use(cookieParser())
app.use(checkRequestRoute)
app.use(checkAuthenticate)
app.use(checkAuthorize)
proxyRoute(app)


//@ts-ignore
app.use(globalErrorHandler);

export default app;
