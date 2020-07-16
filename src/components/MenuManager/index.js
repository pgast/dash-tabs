import React, { Component } from "react";


const style = {
  item: {
    border: '1px solid black',
    padding: '8px',
    margin: '1rem',
    display: 'flex',
  }
}

class MenuManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: { drinks: [], dishes: [] },
      itemEdit: {
        type: '',
        current: '',
        newName: '',
        newPrice: '',
        available: '',
      },
      inputItem: {
        type: '',
        name: '',
        price: '',
        available: true,
      }
    };
  };

  componentDidMount() {
    this.setState({ menu: this.props.menu})
  }

  componentDidUpdate(prevProps) {
    if(this.props.menu !== prevProps.menu) {
      this.setState({ menu: this.props.menu });
    }
  }

  onChange = event => {
    let newInputItem = {...this.state.inputItem};
    newInputItem[event.target.name] = event.target.value;
    this.setState({ inputItem: newInputItem });
  };

  onChangeEdit = event => {
    let newEditItem = {...this.state.itemEdit};

    if(event.target.name === 'available') {
      newEditItem[event.target.name] = !newEditItem[event.target.name];
    } else {
      newEditItem[event.target.name] = event.target.value;
    }

    this.setState({ itemEdit: newEditItem });

  };

  addItem = (event) => {
    // IMMUTABLE ADD ITEM
    event.preventDefault();
    let newItem = { 
      name: this.state.inputItem.name, 
      price: parseInt(this.state.inputItem.price, 10), 
      available: this.state.inputItem.available 
    };

    let newMenu = {
      drinks: [...this.state.menu.drinks],
      dishes: [...this.state.menu.dishes],
    };

    if(this.state.inputItem.type === 'drink') {
      if(!newMenu.drinks) newMenu.drinks = [];
      newMenu.drinks.push(newItem);
    } else {
      if(!newMenu.dishes) newMenu.dishes = [];
      newMenu.dishes.push(newItem);
    }

    this.setState({ 
      menu: newMenu, 
      inputItem: { 
        type: '',
        name: '', 
        price: '', 
        available: true, 
      } 
    });



    // event.preventDefault();
    // let newItem = { 
    //   name: this.state.inputItem.name, 
    //   price: parseInt(this.state.inputItem.price, 10), 
    //   available: this.state.inputItem.available 
    // };
    // let newMenu = {...this.state.menu};

    // if(this.state.inputItem.type === 'drink') {
    //   if(!newMenu.drinks) newMenu.drinks = [];
    //   newMenu.drinks.push(newItem);
    // } else {
    //   if(!newMenu.dishes) newMenu.dishes = [];
    //   newMenu.dishes.push(newItem);
    // }

    // this.setState({ 
    //   menu: newMenu, 
    //   inputItem: { 
    //     type: '',
    //     name: '', 
    //     price: '', 
    //     available: true, 
    //   } 
    // });
  };

  saveEditItem = (event, idx) => {
    // IMMUTABLE SAVE EDIT ITEM
    event.preventDefault();
    let newItem = { 
      name: this.state.itemEdit.newName, 
      price: parseInt(this.state.itemEdit.newPrice, 10), 
      available: this.state.itemEdit.available, 
    };
    let newMenu = {
      drinks: [...this.state.menu.drinks],
      dishes: [...this.state.menu.dishes],
    };

    newMenu[this.state.itemEdit.type][idx] = newItem;

    this.setState({ 
      menu: newMenu,  
      itemEdit: {
        type: '',
        current: '',
        newName: '',
        newPrice: '',
        available: '',
      }
    });

    // event.preventDefault();
    // let newItem = { 
    //   name: this.state.itemEdit.newName, 
    //   price: parseInt(this.state.itemEdit.newPrice, 10), 
    //   available: this.state.itemEdit.available, 
    // };
    // let newMenu = {...this.state.menu};
    // newMenu[this.state.itemEdit.type][idx] = newItem;

    // this.setState({ 
    //   menu: newMenu,  
    //   itemEdit: {
    //     type: '',
    //     current: '',
    //     newName: '',
    //     newPrice: '',
    //     available: '',
    //   }
    // });
  };

  editItem = (item, type) => {
    this.setState({ 
      itemEdit: { 
        type,
        current: item.name, 
        newName: item.name, 
        newPrice: item.price, 
        available: item.available,
      } 
    });
  };

  deleteItem = (index, type) => {
    // IMMUTABLE DELETE ITEM
    let newMenu = {
      drinks: [...this.state.menu.drinks],
      dishes: [...this.state.menu.dishes],
    };
    newMenu[type].splice(index, 1);
    if(newMenu[type].length === 0) newMenu[type] = 0;

    this.setState({ 
      menu: newMenu,  
      itemEdit: {
        type: '',
        current: '',
        newName: '',
        newPrice: '',
        available: '',
      }
    });

    // let newMenu = {...this.state.menu};
    // newMenu[type].splice(index, 1);

    // if(newMenu[type].length === 0) newMenu[type] = 0;

    // this.setState({ 
    //   menu: newMenu,  
    //   itemEdit: {
    //     type: '',
    //     current: '',
    //     newName: '',
    //     newPrice: '',
    //     available: '',
    //   }
    // });
  };

  cancelEdit = () => {
    this.setState({
      itemEdit: {
        type: '',
        current: '',
        newName: '',
        newPrice: '',
        available: '',
      }
    })
  };

  numberIsInvalid = number => number <= 0 || number === '';

  render() {
    const { name, price, type } = this.state.inputItem;
    const isInvalid = name === '' || this.numberIsInvalid(price) || type === '';

    const { newName, newPrice, current } = this.state.itemEdit;
    const isInvalidEdit = newName === '' || this.numberIsInvalid(newPrice);

    const { drinks, dishes } = this.state.menu;

    const drinksIsEmpty = drinks === 0 ? true : false;
    const dishesIsEmpty = dishes === 0 ? true : false;

    return (
      <>
        <h3 onClick={() => console.log(this.state)}>Dashboard Menu</h3>
        <h4>Bebidas</h4>

        {drinksIsEmpty ? 
          <h3>NO HAY BEBIDAS REGISTRADAS</h3>
        :
          <ol>
            {drinks && drinks.map((el, idx) => 
              <React.Fragment key={idx}>
                {current !== el.name ? 
                  <li 
                    style={style.item} 
                    onClick={() => this.editItem(el, 'drinks')}
                  >
                    {el.name} - ${el.price} - {el.available ? "AVAILABLE" : "NOT AVAILABLE"}
                  </li>
                  :
                  <li style={style.item}>
                    <form onSubmit={(e) => this.saveEditItem(e, idx)}>
                      <input 
                        type="text"
                        name="newName"
                        value={newName}
                        placeholder="New Item Name"
                        onChange={this.onChangeEdit}
                        />
                      <input 
                        type="number"
                        name="newPrice"
                        value={newPrice}
                        placeholder="New Item Price"
                        onChange={this.onChangeEdit}
                      />
                      <input 
                        name="available" 
                        type="checkbox" 
                        onChange={this.onChangeEdit}
                        checked={this.state.itemEdit.available} 
                        />
                      <label>Is item available?</label>
                      <button disabled={isInvalidEdit} type="submit">
                        Save Changes
                      </button>
                    </form>
                    <button onClick={() => this.deleteItem(idx, 'drinks')}>
                      Delete Item
                    </button>
                    <button onClick={this.cancelEdit}>
                      Cancel
                    </button>
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
            {dishes && dishes.map((el, idx) => 
              <React.Fragment key={idx}>
                {current !== el.name ?
                  <li 
                    style={style.item} 
                    onClick={() => this.editItem(el, 'dishes')}
                  >
                    {el.name} - ${el.price} - {el.available ? "AVAILABLE" : "NOT AVAILABLE"}
                  </li>
                  :
                  <li style={style.item}>
                    <form onSubmit={(e) => this.saveEditItem(e, idx)}>
                      <input 
                        type="text"
                        name="newName"
                        value={newName}
                        placeholder="New Item Name"
                        onChange={this.onChangeEdit}
                        />
                      <input 
                        type="number"
                        name="newPrice"
                        value={newPrice}
                        onChange={this.onChangeEdit}
                        placeholder="New Item Price"
                      />
                      <input 
                        name="available" 
                        type="checkbox" 
                        onChange={this.onChangeEdit}
                        checked={this.state.itemEdit.available} 
                        />
                      <label>Is item available?</label>
                      <button disabled={isInvalidEdit} type="submit">
                        Save Changes
                      </button>
                    </form>
                      <button onClick={() => this.deleteItem(idx, 'dishes')}>
                        Delete Item
                      </button>
                      <button onClick={this.cancelEdit}>
                        Cancel
                      </button>
                  </li>
                }
              </React.Fragment>  
            )}
          </ol>
        }
        <hr />

        {/* ADD NEW ITEM FORM */}
        <form onSubmit={this.addItem}>
          <input 
            name="name"
            type="text"
            value={name}
            placeholder="Item Name"
            onChange={this.onChange}
          />
          <input 
            name="price"
            type="number"
            value={price}
            placeholder="price"
            onChange={this.onChange}
          />
          <div>
            <input 
              name="type" 
              type="radio" 
              value="drink" 
              onChange={this.onChange}
              checked={type === "drink"} 
              />
            <label>Bebida</label>
          </div>
          <div>
            <input 
              name="type" 
              type="radio" 
              value="dish" 
              onChange={this.onChange}
              checked={type === "dish"}
              />
            <label>Comida</label>
          </div>
          <button disabled={isInvalid} type="submit">Add</button>
        </form>

        <hr/>
        {/* GUARDAR CAMBIOS, SE SUBE NUEVA VERSION DE MENU A DATABASE (?mejor manera de hacerlo) */}
        <div onClick={() => this.props.updateDb(this.state.menu)} style={{ background: 'black', color: 'white' }}>
          <h3>SAVE CHANGES AND UPDATE</h3>
        </div>
      </>
    )
  }
}

export default MenuManager;

// ON CHANGE FUNCTION HANDLER BOTH FOR INPUT ITEM Y EDIT CURRENT ITEM