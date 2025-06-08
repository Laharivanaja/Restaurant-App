import {Component} from 'react'
import Header from '../Header'
import './index.css'
import CartContext from '../../context/CartContext'

const API_URL =
  'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
const API_STATUS = {
  SUCCESS: 'SUCCESS',
  LOADING: 'LOADING',
  FAILURE: 'FAILURE',
  INITIAL: 'INITIAL',
}

class Home extends Component {
  state = {
    itemsList: [],
    selectedCategory: 'Salads and Soup',
    restaurantName: '',
    apiStatus: API_STATUS.INITIAL,
    dishQuantities: {}, // Track quantities for dishes not yet in cart
  }

  componentDidMount() {
    this.getItemsData()
  }

  getItemsData = async () => {
    this.setState({apiStatus: API_STATUS.LOADING})
    try {
      const response = await fetch(API_URL)

      if (response.ok) {
        const data = await response.json()
        const restaurantData = data[0]

        // Initialize dish quantities to 0 for all dishes
        const dishQuantities = {}
        restaurantData.table_menu_list.forEach(category => {
          category.category_dishes.forEach(dish => {
            dishQuantities[dish.dish_id] = 0
          })
        })

        this.setState({
          itemsList: restaurantData.table_menu_list,
          restaurantName: restaurantData.restaurant_name,
          apiStatus: API_STATUS.SUCCESS,
          dishQuantities,
        })
      } else {
        this.setState({apiStatus: API_STATUS.FAILURE})
      }
    } catch (error) {
      this.setState({apiStatus: API_STATUS.FAILURE})
    }
  }

  setSelectedCategory = category => {
    this.setState({selectedCategory: category})
  }

  updateDishQuantity = (dishId, change) => {
    this.setState(prevState => {
      const currentQuantity = prevState.dishQuantities[dishId] || 0
      const newQuantity = Math.max(0, currentQuantity + change)
      return {
        dishQuantities: {
          ...prevState.dishQuantities,
          [dishId]: newQuantity,
        },
      }
    })
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-button"
        onClick={this.getItemsData}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <div className="loader">
        <p>...</p>
      </div>
    </div>
  )

  renderSuccessView = () => {
    const {
      itemsList,
      selectedCategory,
      restaurantName,
      dishQuantities,
    } = this.state
    const items = itemsList.length ? itemsList : []

    const selectedCategoryList = items.find(
      each => each.menu_category === selectedCategory,
    ) || {
      category_dishes: [],
    }

    return (
      <CartContext.Consumer>
        {value => {
          const {addCartItem} = value

          const onClickAddToCart = dish => {
            const quantityToAdd = dishQuantities[dish.dish_id] || 0
            if (quantityToAdd > 0) {
              // Pass the dish and the quantity chosen to addCartItem
              addCartItem({...dish, quantity: quantityToAdd})
              // Reset dish quantity after adding to cart
              this.setState(prevState => ({
                dishQuantities: {
                  ...prevState.dishQuantities,
                  [dish.dish_id]: 0,
                },
              }))
            }
          }

          const onIncrement = dishId => {
            this.updateDishQuantity(dishId, 1)
          }

          const onDecrement = dishId => {
            this.updateDishQuantity(dishId, -1)
          }

          return (
            <div className="home-container">
              <Header restaurantName={restaurantName} />
              <div className="home-content">
                <ul className="category-slider">
                  {items.map(each => (
                    <li key={each.menu_category}>
                      <button
                        type="button"
                        onClick={() =>
                          this.setSelectedCategory(each.menu_category)
                        }
                        className={`category-button ${
                          selectedCategory === each.menu_category
                            ? 'active'
                            : ''
                        }`}
                        data-testid={`category-button-${each.menu_category}`}
                      >
                        {each.menu_category}
                      </button>
                    </li>
                  ))}
                </ul>
                <hr className="category-separator" />
                {selectedCategoryList.category_dishes.map(each => {
                  const quantity = dishQuantities[each.dish_id] || 0

                  return (
                    <div className="item-container" key={each.dish_id}>
                      <div
                        className={`veg-nonveg-indicator ${
                          each.dish_Type === 2 ? 'non-veg' : 'veg'
                        }`}
                      >
                        .
                      </div>
                      <div className="dish-text">
                        <h1 className="dish-name">{each.dish_name}</h1>
                        <p className="dish-price">{`${each.dish_currency} ${each.dish_price}`}</p>
                        <p className="dish-description">
                          {each.dish_description}
                        </p>

                        {each.dish_Availability ? (
                          <div>
                            <div className="quantity-container">
                              <button
                                type="button"
                                className="quantity-button"
                                onClick={() => onDecrement(each.dish_id)}
                                data-testid={`decrement-button-${each.dish_id}`}
                              >
                                -
                              </button>
                              <p
                                className="quantity-count"
                                data-testid={`dish-quantity-${each.dish_id}`}
                              >
                                {quantity}
                              </p>
                              <button
                                type="button"
                                className="quantity-button"
                                onClick={() => onIncrement(each.dish_id)}
                                data-testid={`increment-button-${each.dish_id}`}
                              >
                                +
                              </button>
                            </div>

                            {quantity > 0 && (
                              <button
                                type="button"
                                className="add-to-cart-button"
                                onClick={() => onClickAddToCart(each)}
                                data-testid={`add-to-cart-button-${each.dish_id}`}
                              >
                                ADD TO CART
                              </button>
                            )}

                            {each.addonCat.length > 0 && (
                              <p className="customization">
                                Customizations available
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="not-available">Not Available</p>
                        )}
                      </div>
                      <p className="dish-calories">{`${each.dish_calories} calories`}</p>
                      <img
                        src={each.dish_image}
                        alt={each.dish_name}
                        className="dish-image"
                        data-testid="dish-image"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }}
      </CartContext.Consumer>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case API_STATUS.LOADING:
        return this.renderLoadingView()
      case API_STATUS.SUCCESS:
        return this.renderSuccessView()
      case API_STATUS.FAILURE:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default Home
