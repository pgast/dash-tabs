import React from 'react';

const MenuSideboard = ({ 
  addItem,
  itemEdit,
  inputItem,
  cancelEdit,
  deleteItem,
  onChangeForm,
  addIsInvalid,
  onChangeEdit,
  saveEditItem,
  isInvalidEdit,
}) => {
  return (
    <div className="menuSideboard">
      {(itemEdit.name === '' && itemEdit.idx === '') && (
        <>
          <div className="menuSideboard_view">
            <h3>NEW ITEM</h3>
            <div className="menuSideboard_addItemForm">
              <div className="inputGroup">
                <h4>Name</h4>
                <input 
                  name="name"
                  type="text"
                  value={inputItem.name}
                  onChange={onChangeForm}
                />
              </div>
              <div className="inputGroup">
                <h4>Cost</h4>
                <div>
                  <h4>$</h4>
                  <input 
                    name="price"
                    type="number"
                    value={inputItem.price}
                    onChange={onChangeForm}
                  />
                </div>
              </div>
              <div className="inputGroup">
                <h4>Description</h4>
                <textarea 
                  rows="3" 
                  cols="50" 
                  form="usrform"  
                  name="description"
                  value={inputItem.description}
                  onChange={onChangeForm}
                />
              </div>
              <div className="inputGroup">
                <h4>Type</h4>
                <div>
                  <div>Drink</div>
                  <input 
                    name="type" 
                    type="radio" 
                    value="drinks" 
                    onChange={onChangeForm}
                    checked={inputItem.type === "drinks"} 
                    />
                </div>
                <div>
                  <div>Dish</div>
                  <input 
                    name="type" 
                    type="radio" 
                    value="dishes" 
                    onChange={onChangeForm}
                    checked={inputItem.type === "dishes"}
                    />
                </div>
              </div>
            </div>
          </div>
          <div className="menuSideboard_actionButtons">
            <div 
              onClick={addIsInvalid ? null : addItem}
              className={addIsInvalid ? "btn btn_disabled" : "btn"}
              >
                ADD ITEM
              </div>
          </div>
        </>
      )}
      {itemEdit.idx !== '' && (
        <>
          <div className="menuSideboard_view">
            <h3>EDITING ITEM</h3>
            <div className="menuSideboard_editItemForm">
              <div className="inputGroup">
                <h4>Name</h4>
                <input 
                  type="text"
                  name="name"
                  value={itemEdit.name}
                  onChange={onChangeEdit}
                  />
              </div>
              <div className="inputGroup">
                <h4>Cost</h4>
                <div>
                  <h4>$</h4>
                  <input 
                    type="number"
                    name="price"
                    value={itemEdit.price}
                    onChange={onChangeEdit}
                  />
                </div>
              </div>
              <div className="inputGroup">
                <h4>Description</h4>
                <textarea 
                  rows="3" 
                  cols="50" 
                  form="usrform"  
                  name="description"
                  value={itemEdit.description}
                  onChange={onChangeEdit}
                />
              </div>
              <div className="inputGroup">
                <label>Is item available?</label>
                <input 
                  name="available" 
                  type="checkbox" 
                  onChange={onChangeEdit}
                  checked={itemEdit.available} 
                  />
              </div>
            </div>
          </div>
          <div className="menuSideboard_actionButtons">
            <div 
              onClick={isInvalidEdit ? null : (e) => saveEditItem(e, itemEdit.idx)}
              className={isInvalidEdit ? "btn btn_disabled" : "btn"}
            >
              SAVE
            </div>
            <div
              onClick={() => deleteItem(itemEdit.idx, itemEdit.type)}
              className="btn btn_secondary"
            >
              DELETE
            </div>
            <div
              onClick={cancelEdit}
              className="btn btn_secondary"
            >
              CANCEL
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MenuSideboard;