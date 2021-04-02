/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@bentley/imodeljs-frontend";
import { AbstractWidgetProps, StagePanelLocation, StagePanelSection, UiItemsProvider } from "@bentley/ui-abstract";
import React from "react";
import { EmphasisList } from "./EmphasizeStuff";

export class Banana implements UiItemsProvider {
  public readonly id = "Banana";

  public provideWidgets(
    stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection | undefined
  ): ReadonlyArray<AbstractWidgetProps> {
    const widgets: AbstractWidgetProps[] = [];

    const iModel = IModelApp.viewManager.selectedView?.view.iModel
    if (iModel) {
    }
    widgets.push({
      id: "bananaWidget",
      label: "BANANA!!!!",
      getWidgetContent: () => (
        <div>
          <EmphasisList />
        </div>
      )
    });
    return widgets;
  }
}