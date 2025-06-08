import {Component} from 'react'
import CartContext from '../../context/CartContext'
import Header from '../Header'
import CartItem from '../CartItem'
import './index.css'

class Cart extends Component {
  renderEmptyCartView = () => (
    <div className="empty-cart-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
        alt="empty cart"
        className="empty-cart-image"
      />
      <h1>Your Cart Is Empty</h1>
    </div>
  )

  render() {
    return (
      <CartContext.Consumer>
        {value => {
          const {cartList, removeAllCartItems} = value
          const showEmptyView = cartList.length === 0

          const getTotalAmount = () =>
            cartList.reduce(
              (acc, each) => acc + each.dishPrice * each.quantity,
              0,
            )

          return (
            <div className="cart-container">
              <Header />
              <div className="cart-content">
                {showEmptyView ? (
                  this.renderEmptyCartView()
                ) : (
                  <>
                    <div className="cart-header">
                      <h1 className="cart-heading">My Cart</h1>
                      <button
                        type="button"
                        className="remove-all-button"
                        onClick={removeAllCartItems}
                        data-testid="remove-all-button"
                      >
                        Remove All
                      </button>
                    </div>
                    <ul className="cart-items-list">
                      {cartList.map(each => (
                        <CartItem key={each.dishId} itemDetails={each} />
                      ))}
                    </ul>
                    <div className="total-amount-container">
                      <h1 className="total-amount">
                        Total Amount: ₹{getTotalAmount()}
                      </h1>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default Cart
