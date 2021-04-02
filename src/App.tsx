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
    const urlParams = new URLSearchParams(window.location.search.toLowerCase());
    setiModelId (urlParams.get("imodelid") ?? "");
    setContextId(urlParams.get("contextid") ?? "");
  }, [isLoggingIn]);


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

  useEffect(() => {
    if (isAuthorized && iModelId !== "" && contextId !== "") {
      setIsConnected(true);
    }
  }, [isAuthorized, iModelId, contextId]);

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

  const updateUrl = (iModelId: string, contextId: string) => {
    const urlParams = new URLSearchParams(window.location.search.toLowerCase());
    if (urlParams.get("imodelid") !== iModelId || urlParams.get("contextid") !== contextId) {
      urlParams.set("imodelid", iModelId);
      urlParams.set("contextid", contextId);
      const newUrl = `${window.location.protocol}//${window.location.host}/?${urlParams.toString()}`;
      window.history.replaceState({}, document.title, newUrl);
    }
  }

  const oniModelChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setiModelId(e.target.value);
  }

  const onConnectClick = async () => {
    updateUrl(iModelId, contextId);
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
        <span>Enter context and iModel Ids then click Connect</span>
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
