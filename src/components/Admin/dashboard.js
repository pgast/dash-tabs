import React, { Component } from "react";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: {},
      itemEdit: {
        current: '',
        newName: '',
        newPrice: '',
        type: ''
      },
      inputItem: {
        name: '',
        price: '',
        type: ''
      }
    };
  };

  componentDidUpdate(prevProps) {
    if (this.props.menu !== prevProps.menu) {
      let menu = this.props.menu;

      if (prevProps.menu.comidas === 0) {
        menu.comidas = [];
      }

      if (prevProps.menu.bebidas === 0) {
        menu.bebidas = [];
      }
      
      // this.setState({ menu: this.props.menu });
      this.setState({ menu });
    }

    // CREAR ARRAYS DE BEBIDAS Y COMIDAS SI LLEGAN CON VALOR DE 0
  }

  onChange = event => {
    let newInputItem = {...this.state.inputItem};
    newInputItem[event.target.name] = event.target.value;
    this.setState({ inputItem: newInputItem });
  };

  onChangeEdit = event => {
    let newEditItem = {...this.state.itemEdit};
    newEditItem[event.target.name] = event.target.value;
    this.setState({ itemEdit: newEditItem });
  };

  addItem = (event) => {
    event.preventDefault();
    let newItem = { name: this.state.inputItem.name, price: this.state.inputItem.price };
    let newMenu = {...this.state.menu};

    if(!newMenu.bebidas) newMenu.bebidas = [];
    if(!newMenu.comidas) newMenu.comidas = [];

    if(this.state.inputItem.type === 'bebida') {
      newMenu.bebidas.push(newItem);
    } else {
      newMenu.comidas.push(newItem);
    }

    this.setState({ 
      menu: newMenu, 
      inputItem: { 
        name: '', 
        price: '', 
        type: '' 
      } 
    });
  };

  saveEditItem = (event, idx) => {
    event.preventDefault();
    let newItem = { name: this.state.itemEdit.newName, price: this.state.itemEdit.newPrice };
    let newMenu = {...this.state.menu};
    newMenu[this.state.itemEdit.type][idx] = newItem;

    this.setState({ 
      menu: newMenu,  
      itemEdit: {
        current: '',
        newName: '',
        newPrice: '',
        type: ''
      }
    });
  };

  editItem = (item, type) => {
    this.setState({ 
      itemEdit: { 
        current: item.name, 
        newName: item.name, 
        newPrice: item.price, 
        type 
      } 
    });
  };

  deleteItem = (index, type) => {
    let newMenu = {...this.state.menu};
    newMenu[type].splice(index, 1);

    this.setState({ 
      menu: newMenu,  
      itemEdit: {
        current: '',
        newName: '',
        newPrice: '',
        type: ''
      }
    });
  };

  cancelEdit = () => {
    this.setState({
      itemEdit: {
        current: '',
        newName: '',
        newPrice: '',
        type: ''
      }
    })
  };

  render() {
    const { name, price, type } = this.state.inputItem;
    const isInvalid = name === '' || price === '' || type === '';

    const { newName, newPrice, current } = this.state.itemEdit;
    const isInvalidEdit = newName === '' || newPrice === '';

    const { bebidas, comidas } = this.state.menu;

    return (
      <>
        <h3 onClick={() => console.log(this.state)}>Dashboard Menu</h3>
        <h4>Bebidas</h4>
        <ol>
          {bebidas && bebidas.map((el, idx) => 
            <React.Fragment key={idx}>
              {current !== el.name ? 
                <li onClick={() => this.editItem(el, 'bebidas')}>{el.name} - ${el.price}</li>
                :
                <li>
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
                    <button disabled={isInvalidEdit} type="submit">Save Changes</button>
                  </form>
                  <button onClick={() => this.deleteItem(idx, 'bebidas')}>Delete Item</button>
                  <button onClick={this.cancelEdit}>Cancel</button>
                </li>
              }
            </ React.Fragment>
          )}
        </ol>

        <h4>Comidas</h4>
        <ol>
          {comidas && comidas.map((el, idx) => 
            <React.Fragment key={idx}>
              {current !== el.name ?
                <li onClick={() => this.editItem(el, 'comidas')}>{el.name} - ${el.price}</li>
                :
                <li>
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
                    <button disabled={isInvalidEdit} type="submit">Save Changes</button>
                  </form>
                    <button onClick={() => this.deleteItem(idx, 'comidas')}>Delete Item</button>
                    <button onClick={this.cancelEdit}>Cancel</button>
                </li>
              }
            </React.Fragment>  
          )}
        </ol>
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
              value="bebida" 
              onChange={this.onChange}
              checked={type === "bebida"} 
              />
            <label>Bebida</label>
          </div>
          <div>
            <input 
              name="type" 
              type="radio" 
              value="comida" 
              onChange={this.onChange}
              checked={type === "comida"}
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

export default Dashboard;

// ON CHANGE FUNCTION HANDLER BOTH FOR INPUT ITEM Y EDIT CURRENT ITEM