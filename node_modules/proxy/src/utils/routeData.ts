import configs from "../config";
export interface NestedRouteParams {
  path: string;
  target?: string;
  methods?: {
    [method: string]: {
      authentication: boolean;
      roles?: string[]; // Optional: Roles that are allowed
    };
  };
  nestedRoutes?: NestedRouteParams[];
}

interface RouteParams {
  [main: string]: NestedRouteParams;
}
export const ROUTE_PATHS: RouteParams = {
  auth: {
    path: "/auth",
    target: configs.serviceRoute,
    nestedRoutes: [
      {
        path: "/signup",
        methods: {
          POST: {
            authentication: false,
          },
        },
      },
      {
        path: "/verify",
        methods: {
          POST: {
            authentication: false,
          },
        },
      },
      {
        path: "/signin",
        methods: {
          POST: {
            authentication: false,
          },
        },
      },
    
      {
        path: "/google/login",
        nestedRoutes: [
          {
            path: "/",
            methods: {
              POST: {
                authentication: false,
              },
            },
          },
          {
            path: "/callback",
            methods: {
              GET: {
                authentication: false,
              },
            },
          },
        ],
      }
    ],
  },
  product: {
    path: "/v1",
    target: configs.serviceRoute,
    nestedRoutes: [
      {
        path: "/products",
        methods: {
          GET: {
            authentication: false,
            roles:["user","admin"]
          },
          POST: {
            authentication: true,
            roles: ["user", "admin"],
          },
        },
      },
      {
        path: "/products/:id",
        methods: {
          GET: {
            authentication: false,
          },
          PUT: {
            authentication: true,
            roles: ["user", "admin"],
          },
          DELETE: {
            authentication: true,
            roles: ["user", "admin"],
          },
        },
      },
    ],
  },
};
