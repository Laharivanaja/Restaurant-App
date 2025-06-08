import {Component} from 'react'
import CartContext from '../../context/CartContext'
import './index.css'

class CartItem extends Component {
  render() {
    return (
      <CartContext.Consumer>
        {value => {
          const {incrementCartItemQuantity, decrementCartItemQuantity} = value
          const {itemDetails} = this.props
          const {dishId, dishName, dishImage, dishPrice, quantity} = itemDetails

          const onIncrement = () => {
            incrementCartItemQuantity(dishId)
          }

          const onDecrement = () => {
            decrementCartItemQuantity(dishId)
          }

          return (
            <li className="cart-item">
              <img
                src={dishImage}
                alt={dishName}
                className="cart-item-image"
                data-testid="dishImage"
              />
              <div className="cart-item-details">
                <h1 className="cart-item-title" data-testid="dishName">
                  {dishName}
                </h1>
                <div className="quantity-controller">
                  <button
                    type="button"
                    onClick={onDecrement}
                    data-testid="decrement-button"
                    className="quantity-button"
                  >
                    -
                  </button>
                  <p className="quantity" data-testid="item-quantity">
                    {quantity}
                  </p>
                  <button
                    type="button"
                    onClick={onIncrement}
                    data-testid="increment-button"
                    className="quantity-button"
                  >
                    +
                  </button>
                </div>
                <p className="cart-item-price">₹{dishPrice * quantity}</p>
              </div>
            </li>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default CartItem
