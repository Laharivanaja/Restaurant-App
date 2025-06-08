import {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import Cart from './components/Cart'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'
import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  // Modified addCartItem to correctly handle the quantity passed from Home
  addCartItem = dish => {
    this.setState(prevState => {
      const existingItem = prevState.cartList.find(
        item => item.dish_id === dish.dish_id,
      )

      if (existingItem) {
        // If item exists, update its quantity by adding the new quantity
        return {
          cartList: prevState.cartList.map(item =>
            item.dish_id === dish.dish_id
              ? {...item, quantity: item.quantity + dish.quantity} // Add the quantity from the dish object
              : item,
          ),
        }
      }
      // If item does not exist, add it with the provided quantity
      return {
        cartList: [...prevState.cartList, dish], // dish already has the correct quantity
      }
    })
  }

  removeCartItem = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.filter(item => item.dish_id !== id),
    }))
  }

  incrementCartItemQuantity = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(item =>
        item.dish_id === id ? {...item, quantity: item.quantity + 1} : item,
      ),
    }))
  }

  decrementCartItemQuantity = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList
        .map(item =>
          item.dish_id === id
            ? {...item, quantity: Math.max(0, item.quantity - 1)} // Ensure quantity doesn't go below 0
            : item,
        )
        .filter(item => item.quantity > 0), // Remove item if quantity becomes 0
    }))
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  render() {
    const {cartList} = this.state
    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          removeAllCartItems: this.removeAllCartItems,
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <Redirect to="/login" />
          </Switch>
        </BrowserRouter>
      </CartContext.Provider>
    )
  }
}

export default App
