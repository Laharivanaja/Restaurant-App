import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaCartArrowDown} from 'react-icons/fa'
import './index.css'
import CartContext from '../../context/CartContext'

const Header = props => {
  const {history, restaurantName} = props

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value
        const totalItemsInCart = cartList.reduce(
          (acc, item) => acc + item.quantity,
          0,
        )

        return (
          <nav className="header-container">
            <div className="header-content">
              <Link to="/" className="restaurant-name">
                <h1 className="restaurant-heading-header">{restaurantName}</h1>
              </Link>
              <div className="header-buttons">
                <p className="my-orders-text">My Orders</p>
                <Link to="/cart" className="nav-link" data-testid="cart">
                  {' '}
                  {/* ADDED data-testid="cart" here */}
                  <button
                    type="button"
                    data-testid="cart-icon-button"
                    className="cart-button"
                  >
                    <FaCartArrowDown size={25} />
                  </button>
                  {totalItemsInCart > 0 && (
                    <span className="cart-count-badge" data-testid="cart-count">
                      {totalItemsInCart}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  className="logout-button"
                  onClick={onClickLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )
      }}
    </CartContext.Consumer>
  )
}

export default withRouter(Header)
