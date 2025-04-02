import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/store", "/welcome"], // Allow these routes to be accessed without authentication
});

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
