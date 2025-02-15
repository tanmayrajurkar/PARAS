import { v4 as uuid } from "uuid";
import { Response } from "miragejs";
import jwtEncode from "jwt-encode"; 

const sign = jwtEncode;

export const signupHandler = function (schema, request) {
  const { email, password, name } = JSON.parse(request.requestBody);
  try {
    const foundUser = schema.users.findBy({ email: email});
    if (foundUser) {
      return new Response(
        422,
        {},
        {
          errors: ["Unprocessable Entity. Email Already Exists."],
        }
      );
    }

    const _id = uuid();

    const newUser = {
      _id,
      email,
      password,
      name,
    };
    const createdUser = schema.users.create(newUser);

    //Creating a JWT token with the user's ID and email
    const encodedToken = sign(
      { _id, email },
      import.meta.env.VITE_JWT_SECRET
    );
    return new Response(201, {}, { createdUser, encodedToken });
  } catch (error) {
    return new Response(
      500,
      {},
      {
        error,
      }
    );
  }
};

export const loginHandler = function (schema, request) {
  const { email, password } = JSON.parse(request.requestBody);
  try {
    const foundUser = schema.users.findBy({ email: email });
    if (!foundUser) {
      return new Response(
        404,
        {},
        {
          errors: [
            "The email you entered is not Registered. Not Found error",
          ],
        }
      );
    }
    if (password === foundUser.password) {
      const encodedToken = sign(
        { _id: foundUser._id, email},
        import.meta.env.VITE_JWT_SECRET
      );
      return new Response(200, {}, { foundUser, encodedToken });
    }
    return new Response(
      401,
      {},
      {
        errors: [
          "The credentials you entered are invalid. Unauthorized access error.",
        ],
      }
    );
  } catch (error) {
    return new Response(
      500,
      {},
      {
        error,
      }
    );
  }
};


export const guestLoginHandler = function (schema) {
  const guestUserId = "guestId"
  const guestUser = {
    _id: guestUserId,
    email: "guestuser@example.com",
    name: "Guest User",
  };


  const existingUser = schema.users.findBy({ email: guestUser.email });
  if (!existingUser) {
    schema.users.create(guestUser);
  }

  const encodedToken = sign(
    { _id: guestUser._id, email: guestUser.email },
    import.meta.env.VITE_JWT_SECRET
  );

  return new Response(200, {}, { foundUser: guestUser, encodedToken });
};
