import { createProxyMiddleware } from "http-proxy-middleware";
import { ROUTE_PATHS } from "../utils/routeData";
import express from "express"
export const proxyRoute=(app:express.Application)=>{
  for(const [_route,value] of Object.entries(ROUTE_PATHS)){
    app.use(value.path,createMiddleware(value as { target: string; path: string; }));
  }
}
const createMiddleware=(value:{target:string,path:string})=>{
  return createProxyMiddleware({
    target: value.target,
    changeOrigin: true,
    pathRewrite:(pathInRewrite, _req) => {
      return `${value.path}${pathInRewrite}`
    },
    on:{
      proxyReq: (_proxyReq, req, _res) => {
        console.log(`Proxying request to: ${value.target}${req.url}`);
      },
      error:(err)=>{
        throw err
      }
    }
  })
}