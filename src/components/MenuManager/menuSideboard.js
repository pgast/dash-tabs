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
      {itemEdit.name === '' && (
        <form onSubmit={addItem}>
          <input 
            name="name"
            type="text"
            value={inputItem.name}
            placeholder="Item Name"
            onChange={onChangeForm}
          />
          <input 
            name="price"
            type="number"
            value={inputItem.price}
            placeholder="price"
            onChange={onChangeForm}
          />
          <input 
            name="description"
            type="text"
            value={inputItem.description}
            placeholder="Item Description"
            onChange={onChangeForm}
          />
          <div>
            <input 
              name="type" 
              type="radio" 
              value="drinks" 
              onChange={onChangeForm}
              checked={inputItem.type === "drinks"} 
              />
            <label>Bebida</label>
          </div>
          <div>
            <input 
              name="type" 
              type="radio" 
              value="dishes" 
              onChange={onChangeForm}
              checked={inputItem.type === "dishes"}
              />
            <label>Comida</label>
          </div>
          <button disabled={addIsInvalid} type="submit">Add</button>
        </form>
      )}

      {itemEdit.name !== '' && (
        <div>
          <form onSubmit={(e) => saveEditItem(e, itemEdit.idx)}>
            <input 
              type="text"
              name="name"
              value={itemEdit.name}
              onChange={onChangeEdit}
              placeholder="New Item Name"
              />
            <input 
              type="number"
              name="price"
              value={itemEdit.price}
              onChange={onChangeEdit}
              placeholder="New Item Price"
            />
            <input 
              type="text"
              name="description"
              onChange={onChangeEdit}
              value={itemEdit.description}
              placeholder="New Description"
            />
            <div>
              <input 
                name="available" 
                type="checkbox" 
                onChange={onChangeEdit}
                checked={itemEdit.available} 
                />
              <label>Is item available?</label>
            </div>
            <button disabled={isInvalidEdit} type="submit">
              Save Changes
            </button>
          </form>
          <div>
            <button onClick={() => deleteItem(itemEdit.idx, itemEdit.type)}>
              Delete Item
            </button>
            <button onClick={cancelEdit}>
              Cancel
            </button>
          </div>
      </div>
      )}
    </div>
  )
}

export default MenuSideboard;