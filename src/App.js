import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Products from "./Products";
import Product from "./Product";
import Specs from "./Specs";
import Checkout from "./Checkout";

export default function App() {
    return (

        <BrowserRouter basename="/Glasses-site">
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/specs" element={<Specs />} />
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
        </BrowserRouter>
    );
}