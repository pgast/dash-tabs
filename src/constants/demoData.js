export const demoOrders = {
  current: [],
  past: [
    {
      cost: 35,
      end: '',
      items: {
        dishes: [{ name: 'name', qty: 2 }, { name: 'ne', qty: 25 }],
        drinks: [{ name: 'coke', qty: 3 }, { name: 'water', qty: 3 }],
      },
      ready: true,
      start: '',
      table: 34
    }
  ],
};

export const demoMenu = {
  dishes: [
    { 
      available: true, 
      description: "desc",
      name: "name",
      price: 33,
    },
    { 
      available: true, 
      description: "desc",
      name: "name",
      price: 33,
    },
    { 
      available: true, 
      description: "desc",
      name: "name",
      price: 33,
    },
  ],
  drinks: [
    {
      available: true,
      description: 'sfsd',
      name: 'sdf',
      price: 23
    },
    {
      available: true,
      description: 'sfsd',
      name: 'sdf',
      price: 23
    },
    {
      available: true,
      description: 'sfsd',
      name: 'sdf',
      price: 23
    },
  ],
};

export const demoUser = {
  email: "DemoSession",
  tables: '',
  username: 'DemoSession', 
};