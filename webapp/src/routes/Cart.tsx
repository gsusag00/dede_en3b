import CartItem from "../components/CartItem";
import { ICartItem } from "../shared/shareddtypes";
import { Wrapper } from "./Cart.styles";
import Grid from "@mui/material/Grid";
import { StyledButton } from './Product.styles';
import { isLoggedIn} from "../api/api";
import { Link } from "react-router-dom";

type CartProps = {
  cart: ICartItem[];
}


const Cart = (props:CartProps) => {
  const calculateTotal = (items: ICartItem[]) =>
    items.reduce((acc, item) => acc + item.units * item.product.price, 0);
  
  // let navigate = useNavigate();

  const checkOut = async () => {
  
      var obj = await isLoggedIn();
      console.log("¿Is user logged in? " + obj.isLoggedIn);
      if (!obj.isLoggedIn) {
        //navigate('/login'); //Careful navigate is commented.
      } 
    
  };
        
  return (
    <Wrapper>
      <h2>Your Cart</h2>
      {props.cart.length === 0 ? <p>No items in cart.</p> : null}
      {props.cart.map((item) => (
        <CartItem
          key={item.product._id.toString()}
          item={item}
        />
      ))}
      <Grid>
        <h2 className="total-text">Total:  {calculateTotal(props.cart).toFixed(2)} €</h2>
        
        <Link to="/shipping/payment"><StyledButton onClick={checkOut}>Check out</StyledButton></Link>
      </Grid>
          </Wrapper>
  );
};

export default Cart;

