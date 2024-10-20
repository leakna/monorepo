import { NextFunction, Request, Response } from "express";
import { NestedRouteParams, ROUTE_PATHS } from "../utils/routeData";
import {
  AuthenticationError,
  NotFoundError,
} from "../utils/errors/error-class";
import { jwtDecode } from "jwt-decode";
//function
const findConfigRoute = (
  routePath: NestedRouteParams | any,
  reqPath: string
): any => {
  // Normalize path and ensure there's a leading slash
  const trimmedPath = reqPath.replace(/\/+$/, ""); // Remove trailing slash, if any

  const requestSegments = trimmedPath.split("/").filter(Boolean); // Split and remove empty segments
  const routeSegments = routePath.path.split("/").filter(Boolean);

  if (routeSegments.length > requestSegments.length) {
    return null; // Path is too short to match this route
  }
  if(routeSegments.length==0&&requestSegments.length>0)
    return null

  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const requestSegment = requestSegments[i];
    console.log(routeSegment, " and ", requestSegment);

    if (routeSegment.startsWith(":")) {
      continue;
    }

    if (routeSegment !== requestSegment) {
      return null; // Static segment mismatch
    }
  }

  //find the remaining path after matching the base path
  if (routePath.nestedRoutes) {
    const remainingPath = `/${requestSegments
      .slice(routeSegments.length)
      .join("/")}`;
    //if any nested routes match the remaining path
    for (const nestedRouteConfig of routePath.nestedRoutes) {

      const nestedResult = findConfigRoute(nestedRouteConfig, remainingPath);
      if (nestedResult) {
        return nestedResult;
      }
    }
  }

  // If no nested route matches, return the current routeConfig
  return routePath;
};

//middleware
//for check request route if it exist or not and the method is allowed in that route or not
export const checkRequestRoute = (
  req: Request | any,
  _res: Response,
  next: NextFunction
) => {
  const { path, method } = req;
  let configRoute = null;
  for (const key in ROUTE_PATHS) {
    configRoute = findConfigRoute(ROUTE_PATHS[key], path);
    if (configRoute) break;
  }
  if (!configRoute) throw new NotFoundError("Route not found ");

  const matchRoute = configRoute.methods?.[method];
  if (!matchRoute) {
    throw new NotFoundError(`Method ${method} is not for route ${path}`);
  }
  req.configRoute = configRoute;
  req.matchRoute = matchRoute;
  next();
};

export const checkAuthenticate = (
  req: Request | any,
  _res: Response,
  next: NextFunction
) => {
  const { matchRoute } = req;
  if (matchRoute.authentication) {
    const { access_token, id_token } = req.cookies;

    if (!access_token) {
      throw new AuthenticationError("Authentication failed, no cookies found");
    }
    const userPayload = jwtDecode(id_token);
    req.currentUser = userPayload;
    next();
  }
  next();
};

export const checkAuthorize = (
  req: Request | any,
  _res: Response,
  next: NextFunction
) => {
  const { currentUser, matchRoute } = req;

  if(matchRoute.role){
    if (
      !matchRoute.roles.includes(currentUser["custom:role"])
    ) {
      throw new AuthenticationError("Authentication failed, not authorized");
    }
  }
  next()
};
