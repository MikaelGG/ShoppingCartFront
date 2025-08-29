import { useState } from "react"
import HeaderNav from '../../components/HeaderNav';
import Searcher from "../../components/Searcher";
import { Products } from "../../components/Products";
import CartMenu from "../../components/CartMenu";

export default function App() {
    const [selectedType, setSelectedType] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const totalItems = cart.length;

    // Agrega producto al carrito o suma cantidad si ya existe
    const handleAddToCart = async (product, quantity) => {
        if (quantity < 1) return;
        setCart(prev => {
            const idx = prev.findIndex(item => item.code === product.code);
            if (idx !== -1) {
                // Ya existe, suma cantidad
                const updated = [...prev];
                updated[idx].quantity += quantity;
                return updated;
            }
            // Nuevo producto
            return [...prev, { ...product, quantity }];
        });
    };

    // Cambia cantidad de un producto en el carrito
    const handleUpdateQuantity = (code, newQuantity) => {
        setCart(prev =>
            prev.map(item =>
                item.code === code
                    ? { ...item, quantity: Math.max(1, newQuantity) }
                    : item
            )
        );
    };

    // Elimina producto del carrito
    const handleRemoveFromCart = (code) => {
        setCart(prev => prev.filter(item => item.code !== code));
    };

    // Vacía el carrito (puedes usarlo tras comprar)
    const handleClearCart = () => setCart([]);

    // Nuevo: handler para buscar
    const handleSearch = () => {
        setSearchQuery(searchText);
        setSelectedType(null); // Opcional: limpia el filtro de tipo al buscar
    };

    const handleTypeChange = (type) => {
    setSelectedType(type);
    setSearchText("");      // Limpia el input de búsqueda
    setSearchQuery("");     // Limpia el filtro de búsqueda activa
};

    return (
        <div>
            <HeaderNav onCartClick={() => setCartOpen(true)} cartCount={totalItems} />
            <Searcher value={searchText} onChange={e => setSearchText(e.target.value)} onTypeChange={handleTypeChange} onSearch={handleSearch}/>
            <Products selectedType={selectedType} searchQuery={searchQuery} onAddToCart={handleAddToCart}/>
            <CartMenu
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveFromCart}
                onClear={handleClearCart}
            />
        </div>
    );
}