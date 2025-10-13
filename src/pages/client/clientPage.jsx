import { Route, Routes } from "react-router-dom";

import NotFound from "../../components/404";
import Footer from "../../components/footer";
import ProductPage from "./productPage";
import ProductOverview from "./productOverview";
import ReviewsPage from "../reviewsPage";
import HomePage from "../homePage";
import ContactUsPage from "../contactUsPage";
import CartPage from "./cart";
import Navbar from "../../components/nav";
import CheckoutPage from "./checkoutPage";



export default function ClientWebPage(){
    return (
        <div className=" ">
            <Navbar/>
            <div className="">
                <Routes>
                    <Route path = "/" element={<HomePage/>}/>
                    <Route path = "/product" element={<ProductPage/>}/>
                    <Route path = "/reviews" element={<ReviewsPage/>}/>
                    <Route path = "/contactUs" element={<ContactUsPage/>}/>
                    <Route path = "/overview/:productId" element={<ProductOverview/>}/>
                    <Route path = "/*" element={<NotFound/>}/> 
                    <Route path = "/cart" element={<CartPage/>}/>
                    <Route path="/checkout" element={<CheckoutPage/>}/>
   
                </Routes>
              
            </div>
             <Footer/>
        </div>
    );
}