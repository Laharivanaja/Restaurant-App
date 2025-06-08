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
          const {dish_id, dish_name, dish_image, dish_price, quantity} =
            itemDetails

          const onIncrement = () => {
            incrementCartItemQuantity(dish_id)
          }

          const onDecrement = () => {
            decrementCartItemQuantity(dish_id)
          }

          return (
            <li className="cart-item">
              <img
                src={dish_image}
                alt={dish_name}
                className="cart-item-image"
                data-testid="dishImage" // Already present and good
              />
              <div className="cart-item-details">
                <h1 className="cart-item-title" data-testid="dishName">
                  {dish_name}
                </h1>
                <div className="quantity-controller">
                  <button
                    type="button"
                    onClick={onDecrement}
                    role="button"
                    data-testid="decrement-button" // Already present and good
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
                    role="button"
                    data-testid="increment-button" // Already present and good
                    className="quantity-button"
                  >
                    +
                  </button>
                </div>
                <p className="cart-item-price">₹{dish_price * quantity}</p>
              </div>
            </li>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default CartItem
