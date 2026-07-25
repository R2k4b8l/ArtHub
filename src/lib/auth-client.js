import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },

        subscription: {
          type: "string",
        },
      },
    }),
    jwtClient(),
  ],
});

export const { signIn, signUp, signOut, useSession, updateUser, changePassword, changeEmail } = authClient;