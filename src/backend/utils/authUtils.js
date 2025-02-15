import { Response } from "miragejs";
import { jwtDecode } from "jwt-decode";

export const requiresAuth = function (request) {
  const encodedToken = request.requestHeaders.authorization;
  const decodedToken = jwtDecode(encodedToken, import.meta.env.VITE_JWT_SECRET);

  if (decodedToken) {
    const user = this.db.users.findBy({ email: decodedToken.email });
    return user;
  }

  return new Response(
    401,
    {},
    { errors: ["The token is invalid. Unauthorized access error."] }
  );
};
