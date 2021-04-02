import "./App.scss";

import { Viewer } from "@bentley/itwin-viewer-react";
import React, { useEffect, useState } from "react";

import AuthorizationClient from "./AuthorizationClient";
import { Header } from "./Header";
import { Banana } from "./providers/Banana";

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    AuthorizationClient.oidcClient
      ? AuthorizationClient.oidcClient.isAuthorized
      : false
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [contextId, setContextId] = useState("");
  const [iModelId, setiModelId] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initOidc = async () => {
      if (!AuthorizationClient.oidcClient) {
        await AuthorizationClient.initializeOidc();
      }

      try {
        // attempt silent signin
        await AuthorizationClient.signInSilent();
        setIsAuthorized(AuthorizationClient.oidcClient.isAuthorized);
      } catch (error) {
        // swallow the error. User can click the button to sign in
      }
    };
    initOidc().catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (isLoggingIn && isAuthorized) {
      setIsLoggingIn(false);
    }
  }, [isAuthorized, isLoggingIn]);

  const onLoginClick = async () => {
    setIsLoggingIn(true);
    await AuthorizationClient.signIn();
  };

  const onLogoutClick = async () => {
    setIsLoggingIn(false);
    await AuthorizationClient.signOut();
    setIsAuthorized(false);
  };

  const onContextIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setContextId(e.target.value);
  }

  const oniModelChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setiModelId(e.target.value);
  }

  const onConnectClick = async () => {
    setIsConnected(true);
  }

  return (
    <div className="viewer-container">
      <Header
        handleLogin={onLoginClick}
        loggedIn={isAuthorized}
        handleLogout={onLogoutClick}
        contextId={contextId}
        handleContextIdChange={onContextIdChange}
        iModelId={iModelId}
        handleiModelIdChange={oniModelChange}
        handleConnectToiModel={onConnectClick}
      />
      {isLoggingIn ? (
        <span>"Logging in...."</span>
      ) : !isConnected ? (
        <span>"Entery context and iModel Ids then click Connect</span>
      ) : (
        isAuthorized && (
          <Viewer
            contextId={contextId}
            iModelId={iModelId}
            authConfig={{ oidcClient: AuthorizationClient.oidcClient }}
            uiProviders={[new Banana()]}
          />
        )
      )}
    </div>
  );
};

export default App;
