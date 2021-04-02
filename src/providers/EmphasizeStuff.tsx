import React, { useState } from "react";
import { ColorDef } from "@bentley/imodeljs-common";
import { ColorPickerPopup } from "@bentley/ui-components";
import { Button, ButtonType, Checkbox } from "@bentley/ui-core";
import "./EmphasizeStuff.css";
import { EmphasizeElements, FeatureOverrideType, IModelApp } from "@bentley/imodeljs-frontend";
import { Id64Array } from "@bentley/bentleyjs-core";

interface EmphasisItem {
  id: number;
  query: string;
  color: ColorDef;
  focused: boolean;
  enabled: boolean;
}

interface ListItemProps {
  item: EmphasisItem;
  handleItemChange: (oldItem: EmphasisItem, newItem: EmphasisItem) => void;
}

const ListItem: React.FC<ListItemProps> = ({
  item,
  handleItemChange,
}: ListItemProps) => {
  const onColorChange = (newColor: ColorDef) => {
    const newItem = {...item, color: newColor};
    handleItemChange(item, newItem);
  }

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newItem = {...item, query: e.target.value};
    handleItemChange(item, newItem);
  }

  const onCheckBoxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newItem = {...item, enabled: e.target.checked};
    handleItemChange(item, newItem);
  }

  const inputStyle = {width: '95%', padding: '2px'};
  return (
    <li className="emphasize-element-item">
      <Checkbox className="emphasize-element-item-part" checked={item.enabled} onChange={onCheckBoxChange}/>
      <input type="text" className="emphasize-element-item-part" value={item.query} onChange={onQueryChange} autoFocus={item.focused} style={inputStyle} />
      <ColorPickerPopup className="emphasize-element-item-part" initialColor={item.color} onColorChange={onColorChange} />
    </li>
  )
}

const defaultItem: EmphasisItem = {id: 0, query: "", color: ColorDef.green, focused: false, enabled: false};

export const EmphasisList: React.FC = () => {
  const [emphasisList, setEmphasisList] = useState([{...defaultItem}]);
  const [updatingEmphasis, setUpdatingEmphasis] = useState(false);
  
  const onAddItemClicked = () => {
    setEmphasisList([...emphasisList, {...defaultItem, id: emphasisList.length}])
  }

  const handleItemChange = (oldItem: EmphasisItem, newItem: EmphasisItem) => {
    const newList = emphasisList.map((item) => item.id === newItem.id ? {...newItem, focused: true} : {...item, focused: false});
    setEmphasisList(newList);
  }

  const updateEmphasis = async () => {
    const view = IModelApp.viewManager.selectedView;
    if (undefined === view) {
      return;
    }

    const emphasize = EmphasizeElements.getOrCreate(view);
    emphasize.clearEmphasizedElements(view);

    for (const item of emphasisList) {
      if (item.enabled) {
        const idsToEmphasize: Id64Array = []
        for await (const row of view.iModel.query(item.query)) {
          const id = row.id;
          if (undefined !== id) {
            idsToEmphasize.push(id);
          }
        }
        emphasize.overrideElements(idsToEmphasize, view, item.color, FeatureOverrideType.ColorOnly, false);
      }
    }
  }

  const onApplyItemClicked = async () => {
    if (updatingEmphasis) return;

    setUpdatingEmphasis(true);
    await updateEmphasis();
    setUpdatingEmphasis(false);
  }

  const listItems = emphasisList.map((item: EmphasisItem) =>
  <ListItem key={item.id} item={item} handleItemChange={handleItemChange} />);
  const listStyle = {listStyleType: 'none', padding: 5};
  return (
    <div>
      <Button onClick={onAddItemClicked} buttonType={ButtonType.Primary}>{"Add"}</Button>
      <Button onClick={onApplyItemClicked} buttonType={ButtonType.Primary}>{"Apply Emphasis"}</Button>
      <ul style={listStyle}>
        {listItems}
      </ul>
    </div>
  );
};


