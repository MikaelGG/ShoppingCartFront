import { useState } from "react"
import Searcher from "../../components/Searcher";
import { Products } from "../../components/Products";


export default function App() {
    const [selectedType, setSelectedType] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

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
            <Searcher value={searchText} onChange={e => setSearchText(e.target.value)} onTypeChange={handleTypeChange} onSearch={handleSearch}/>
            <Products selectedType={selectedType} searchQuery={searchQuery} />
        </div>
    );
}