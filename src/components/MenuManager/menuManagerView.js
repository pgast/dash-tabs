import React from 'react';

const MenuManagerView = ({
  menu,
  addItem,
  onChange,
  editItem,
  itemEdit,
  inputItem,
  cancelEdit,
  deleteItem,
  addIsInvalid,
  saveEditItem,
  onChangeEdit,
  updateMenuDb,
  dishesIsEmpty,
  drinksIsEmpty,
  isInvalidEdit,
  saveChangesIsInvalid,
}) => (
  <>
    <h3>Dashboard Menu</h3>
    <h4>Bebidas</h4>

    {drinksIsEmpty ? 
      <h3>NO HAY BEBIDAS REGISTRADAS</h3>
    :
      <ol>
        {menu.drinks && menu.drinks.map((el, idx) => 
          <React.Fragment key={idx}>
            {(itemEdit.current !== el.name || (itemEdit.current === el.name && itemEdit.type !== 'drinks')) && 
              <li 
                className="itemCard"
                onClick={() => editItem(el, 'drinks')}
              >
                {el.name} - ${el.price} - {el.available ? "AVAILABLE" : "NOT AVAILABLE"} - {el.description}
              </li>  
            }

            {(itemEdit.current === el.name && itemEdit.type === 'drinks') &&
                <li className="itemCard_exp">
                <form onSubmit={(e) => saveEditItem(e, idx)}>
                  <input 
                    type="text"
                    name="name"
                    value={itemEdit.name}
                    placeholder="New Item Name"
                    onChange={onChangeEdit}
                    />
                  <input 
                    type="number"
                    name="price"
                    value={itemEdit.price}
                    placeholder="New Item Price"
                    onChange={onChangeEdit}
                  />
                  <input 
                    type="text"
                    name="description"
                    value={itemEdit.description}
                    placeholder="New Description"
                    onChange={onChangeEdit}
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
                  <button onClick={() => deleteItem(idx, 'drinks')}>
                    Delete Item
                  </button>
                  <button onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </li>
            }
          </ React.Fragment>
        )}
      </ol>
    }

    <h4>Comidas</h4>
    {dishesIsEmpty ?
      <h3>NO HAY COMIDAS REGISTRADAS</h3>
    :
      <ol>
        {menu.dishes && menu.dishes.map((el, idx) => 
          <React.Fragment key={idx}>
            {(itemEdit.current !== el.name || (itemEdit.current === el.name && itemEdit.type !== 'dishes')) &&
              <li 
                className="itemCard"
                onClick={() => editItem(el, 'dishes')}
              >
                {el.name} - ${el.price} - {el.available ? "AVAILABLE" : "NOT AVAILABLE"} - {el.description}
              </li>
            }

            {(itemEdit.current === el.name && itemEdit.type === 'dishes') &&
              <li className="itemCard_exp">
                <form onSubmit={(e) => saveEditItem(e, idx)}>
                  <input 
                    type="text"
                    name="name"
                    value={itemEdit.name}
                    placeholder="New Item Name"
                    onChange={onChangeEdit}
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
                    value={itemEdit.description}
                    onChange={onChangeEdit}
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
                  <button onClick={() => deleteItem(idx, 'dishes')}>
                    Delete Item
                  </button>
                  <button onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </li>
            }
          </React.Fragment>  
        )}
      </ol>
    }
    <hr />

    {/* ADD NEW ITEM FORM */}
    <form onSubmit={addItem}>
      <input 
        name="name"
        type="text"
        value={inputItem.name}
        placeholder="Item Name"
        onChange={onChange}
      />
      <input 
        name="price"
        type="number"
        value={inputItem.price}
        placeholder="price"
        onChange={onChange}
      />
      <input 
        name="description"
        type="text"
        value={inputItem.description}
        placeholder="Item Description"
        onChange={onChange}
      />
      <div>
        <input 
          name="type" 
          type="radio" 
          value="drinks" 
          onChange={onChange}
          checked={inputItem.type === "drinks"} 
          />
        <label>Bebida</label>
      </div>
      <div>
        <input 
          name="type" 
          type="radio" 
          value="dishes" 
          onChange={onChange}
          checked={inputItem.type === "dishes"}
          />
        <label>Comida</label>
      </div>
      <button disabled={addIsInvalid} type="submit">Add</button>
    </form>

    <hr/>
    {/* GUARDAR CAMBIOS, SE SUBE NUEVA VERSION DE MENU A DATABASE (?mejor manera de hacerlo) */}
    <button disabled={saveChangesIsInvalid} onClick={() => updateMenuDb(menu)} >
      <h3>SAVE CHANGES AND UPDATE</h3>
    </button>
  </>
);

export default MenuManagerView;