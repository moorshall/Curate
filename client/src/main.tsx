import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={clerkPubKey}>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </ClerkProvider>
    </React.StrictMode>
);

// const domain = import.meta.env.VITE_AUTH0_DOMAIN;
// const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
// const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
// <Auth0Provider
// domain={domain}
// clientId={clientId}
// authorizationParams={{
//     redirect_uri: redirectUri,
// }}
// ></Auth0Provider>
