import {Component} from 'react'
import './index.css'

class MenuList extends Component {
  state = {
    itemsList: [],
    cartItems: {},
    selectedCategory: 'Salads and Soup',
    restaurantName: '',
  }

  componentDidMount() {
    this.getitemsData()
  }

  getitemsData = async () => {
    const response = await fetch(
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details',
    )
    const data = await response.json()
    const restaurantData = data[0]
    const initialCartItems = {}
    restaurantData.table_menu_list.forEach(category => {
      category.category_dishes.forEach(dish => {
        initialCartItems[dish.dish_id] = 0
      })
    })

    this.setState({
      itemsList: restaurantData.table_menu_list,
      restaurantName: restaurantData.restaurant_name,
      cartItems: initialCartItems,
    })
  }

  setSelectedCategory = category => {
    this.setState({selectedCategory: category})
  }

  addToCart = dishId => {
    this.setState(prevState => ({
      cartItems: {
        ...prevState.cartItems,
        [dishId]: prevState.cartItems[dishId] + 1,
      },
    }))
  }

  removeFromCart = dishId => {
    this.setState(prevState => ({
      cartItems: {
        ...prevState.cartItems,
        [dishId]: Math.max(prevState.cartItems[dishId] - 1, 0),
      },
    }))
  }

  render() {
    const {itemsList, cartItems, selectedCategory, restaurantName} = this.state

    const items = itemsList.length ? itemsList : []

    const selectedCategoryList = items.find(
      each => each.menu_category === selectedCategory,
    ) || {
      category_dishes: [],
    }

    // Total cart items — sum of all dish quantities
    const totalCartItems = Object.values(cartItems).reduce(
      (acc, quantity) => acc + quantity,
      0,
    )

    return (
      <div className="bg-container">
        <div className="header-container">
          <h1 className="restaurant_name">{restaurantName}</h1>
          <div className="cart_items">
            <p>My Orders</p>
            <p>{totalCartItems}</p>
          </div>
        </div>

        {/* Category Buttons */}
        {items.length > 0 && (
          <ul className="category_slider">
            {items.map(each => (
              <li key={each.menu_category}>
                <button
                  onClick={() => this.setSelectedCategory(each.menu_category)}
                >
                  {each.menu_category}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Dish List */}
        {selectedCategoryList.category_dishes.map(each => {
          const isAvailable = each.dish_Availability
          const quantity = cartItems[each.dish_id] || 0

          return (
            <div className="item_container" key={each.dish_id}>
              <div
                className={`veg-nonveg-indicator ${
                  each.dish_Type === 2 ? 'non-veg' : 'veg'
                }`}
              >
                .
              </div>

              <div className="dish_text">
                <h1 className="dish_name">{each.dish_name}</h1>
                <p className="dish_price">
                  {`${each.dish_currency} ${each.dish_price}`}
                </p>
                <p className="dish_description">{each.dish_description}</p>

                {/* Always render dish_quantity */}
                <div className="add-container">
                  {isAvailable ? (
                    <>
                      <button
                        className="increase_decrease"
                        onClick={() =>
                          quantity > 0 && this.removeFromCart(each.dish_id)
                        }
                      >
                        -
                      </button>
                      <p className="dish_quantity">{quantity}</p>
                      <button
                        className="increase_decrease"
                        onClick={() => this.addToCart(each.dish_id)}
                      >
                        +
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="dish_quantity">{quantity}</p>
                      <p>Not Available</p>
                    </>
                  )}
                </div>

                {isAvailable && each.addonCat.length > 0 && (
                  <p className="customization">Customizations available</p>
                )}
              </div>

              <p className="dish_calories">{`${each.dish_calories} calories`}</p>
              <img src={each.dish_image} alt={each.dish_name} />
            </div>
          )
        })}
      </div>
    )
  }
}

export default MenuList
