import { Button, ButtonType } from "@bentley/ui-core";
import React from "react";

import styles from "./Header.module.scss";

interface HeaderProps {
  handleLogin: () => void;
  handleLogout: () => void;
  loggedIn: boolean;
  contextId: string;
  handleContextIdChange: React.ChangeEventHandler<HTMLInputElement>;
  iModelId: string;
  handleiModelIdChange: React.ChangeEventHandler<HTMLInputElement>;
  handleConnectToiModel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  loggedIn,
  handleLogin,
  handleLogout,
  contextId,
  handleContextIdChange,
  iModelId,
  handleiModelIdChange,
  handleConnectToiModel,
}: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.button}
          onClick={handleLogin}
          buttonType={ButtonType.Primary}
          disabled={loggedIn}
        >
          {"Sign In"}
        </Button>
        <Button
          className={styles.button}
          onClick={handleLogout}
          buttonType={ButtonType.Primary}
          disabled={!loggedIn}
        >
          {"Sign Out"}
        </Button>
        <br/>
        Context Id: <input type="text" value={contextId} onChange={handleContextIdChange} />
        iModel Id: <input type="text" value={iModelId} onChange={handleiModelIdChange} />
        <Button className={styles.button} onClick={handleConnectToiModel} buttonType={ButtonType.Primary}>{"Connect"}</Button>
      </div>
    </header>
  );
};
