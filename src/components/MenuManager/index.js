import React, { Component } from "react";

import MenuManagerView from './menuManagerView';

class MenuManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: { drinks: [], dishes: [] },
      itemEdit: {
        idx: '',
        type: '',
        current: '',
        name: '',
        price: '',
        available: '',
        description: '',
      },
      inputItem: {
        type: '',
        name: '',
        price: '',
        description: '',
        available: true,
      },
      error: null,
    };
  };

  componentDidMount() {
    let menu = {
      drinks: this.props.menu.drinks === 0 ? [] : this.props.menu.drinks,
      dishes: this.props.menu.dishes === 0 ? [] : this.props.menu.dishes
    };
    this.setState({ menu })
  }

  componentDidUpdate(prevProps) {
    if(this.props.menu !== prevProps.menu) {
      let menu = {
        drinks: this.props.menu.drinks === 0 ? [] : this.props.menu.drinks,
        dishes: this.props.menu.dishes === 0 ? [] : this.props.menu.dishes
      }
      this.setState({ menu });
    }
  }

  onChangeForm = event => {
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
    event.preventDefault();
    if(this.itemIsDuplicate(this.state.inputItem)) {
      this.setState({ error: "Item is duplicate" });
    } else {
      let newItem = { 
        name: this.state.inputItem.name, 
        price: parseInt(this.state.inputItem.price, 10), 
        available: this.state.inputItem.available,
        description: this.state.inputItem.description,
      };
      let newMenu = {
        drinks: [...this.state.menu.drinks],
        dishes: [...this.state.menu.dishes],
      };
      newMenu[this.state.inputItem.type].push(newItem);
      this.setState({ 
        menu: newMenu, 
        inputItem: { 
          type: '',
          name: '', 
          price: '',
          description: '', 
          available: true, 
        } 
      });
      this.props.updateMenuDb(newMenu);
    }
  };

  itemIsDuplicate(item, idx) {
    let items = [...this.state.menu[item.type]].filter((el, index) => index !== idx);
    let foundItem = items.find(el => el.name.toLowerCase() === item.name.toLowerCase());
    return foundItem === undefined ? false : true;
  };

  saveEditItem = (event, idx) => {
    event.preventDefault();
    if(this.itemIsDuplicate(this.state.itemEdit, idx)) {
      this.setState({ error: "Item is duplicate" });
    } else {
      let newItem = { 
        name: this.state.itemEdit.name, 
        price: parseInt(this.state.itemEdit.price, 10), 
        available: this.state.itemEdit.available,
        description: this.state.itemEdit.description,
      };
      let newMenu = {
        drinks: [...this.state.menu.drinks],
        dishes: [...this.state.menu.dishes],
      };
      newMenu[this.state.itemEdit.type][idx] = newItem;
      this.setState({ 
        menu: newMenu,  
        itemEdit: {
          idx: '',
          type: '',
          current: '',
          name: '',
          price: '',
          available: '',
          description: '',
        }
      });
      this.props.updateMenuDb(newMenu);
    };
  };

  editItem = (item, type, itemIdx) => {
    this.setState({ 
      itemEdit: { 
        type,
        idx: itemIdx,
        name: item.name, 
        price: item.price, 
        current: item.name, 
        available: item.available,
        description: item.description,
      } 
    });
  };

  deleteItem = (index, type) => {
    let newMenu = {
      drinks: [...this.state.menu.drinks],
      dishes: [...this.state.menu.dishes],
    };
    newMenu[type].splice(index, 1);
    if(newMenu[type].length === 0) newMenu[type] = [];
    this.setState({ 
      menu: newMenu,  
      itemEdit: {
        idx: '',
        type: '',
        current: '',
        name: '',
        price: '',
        available: '',
        description: '',
      }
    });
    this.props.updateMenuDb(newMenu);
  };

  cancelEdit = () => {
    this.setState({
      itemEdit: {
        idx: '',
        type: '',
        current: '',
        name: '',
        price: '',
        available: '',
        description: '',
      }
    })
  };

  numberIsInvalid = number => number <= 0 || number === '';

  render() {    
    const { name, price, type } = this.state.inputItem;
    const saveChangesIsInvalid = name !== '' || price !== '' || type !== '';
    const addIsInvalid = (name === '' || this.numberIsInvalid(price) || type === '') || this.state.itemEdit.current !== '';
    const isInvalidEdit = this.state.itemEdit.name === '' || this.numberIsInvalid(this.state.itemEdit.price);
    const drinksIsEmpty = this.state.menu.drinks.length === 0 ? true : false;
    const dishesIsEmpty = this.state.menu.dishes.length === 0 ? true : false;

    return (
      <MenuManagerView 
        menu={this.state.menu}
        addItem={this.addItem}
        editItem={this.editItem}
        addIsInvalid={addIsInvalid}
        deleteItem={this.deleteItem}
        cancelEdit={this.cancelEdit}
        dishesIsEmpty={dishesIsEmpty}
        drinksIsEmpty={drinksIsEmpty}
        isInvalidEdit={isInvalidEdit}
        itemEdit={this.state.itemEdit}
        onChangeForm={this.onChangeForm}
        saveEditItem={this.saveEditItem}
        onChangeEdit={this.onChangeEdit}
        inputItem={this.state.inputItem}
        saveChangesIsInvalid={saveChangesIsInvalid}
      />
    ); 
  };
};

export default MenuManager;