import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import API from "../config/AxiosConfig";
import GlobalModal from "../components/GlobalModal";
import "./css/ShippingAddresses.css";
import Swal from "sweetalert2";

export default function ShippingAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    country: "",
    postalCode: "",
    fullName: "",
    phone: "",
    idClient: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [form, setForm] = useState({ address: "", city: "", postalCode: "" });
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
    fetchCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const tokdecoded = jwtDecode(token);
      console.log(tokdecoded);
      const response = await API.get(
        "/api/shipping-addresses/ShippAdd" + "?idClient=" + tokdecoded.ID
      );
      console.log(response);
      // Asegurar que response.data sea siempre un array
      const addressesData = Array.isArray(response.data) ? response.data : [];
      setAddresses(addressesData);
    } catch (error) {
      console.error("Error fetching addresses", error);
      setError(
        "Error al cargar las direcciones. Por favor, intenta de nuevo más tarde."
      );
      // En caso de error, establecer un array vacío
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      // Usar la API de countriesnow.space que es más confiable
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries"
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.msg || "Error al obtener países");
      }

      // Asegurar que data.data sea siempre un array
      const countriesData = Array.isArray(data.data) ? data.data : [];

      const countriesList = countriesData
        .map((country) => ({
          name: country.country,
          code:
            country.iso2 ||
            country.iso3 ||
            country.country.substring(0, 2).toUpperCase(),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setCountries(countriesList);
    } catch (error) {
      console.error("Error fetching countries:", error);
      // Fallback a lista estática en caso de error
      const fallbackCountries = [
        { name: "Colombia", code: "CO" },
        { name: "Argentina", code: "AR" },
        { name: "Brasil", code: "BR" },
        { name: "México", code: "MX" },
        { name: "España", code: "ES" },
        { name: "Estados Unidos", code: "US" },
        { name: "Canadá", code: "CA" },
        { name: "Chile", code: "CL" },
        { name: "Perú", code: "PE" },
        { name: "Venezuela", code: "VE" },
        { name: "Ecuador", code: "EC" },
        { name: "Uruguay", code: "UY" },
        { name: "Paraguay", code: "PY" },
        { name: "Bolivia", code: "BO" },
        { name: "Francia", code: "FR" },
        { name: "Alemania", code: "DE" },
        { name: "Italia", code: "IT" },
        { name: "Reino Unido", code: "GB" },
        { name: "Portugal", code: "PT" },
        { name: "Países Bajos", code: "NL" },
        { name: "Bélgica", code: "BE" },
        { name: "Suiza", code: "CH" },
        { name: "Austria", code: "AT" },
        { name: "Suecia", code: "SE" },
        { name: "Noruega", code: "NO" },
        { name: "Dinamarca", code: "DK" },
        { name: "Finlandia", code: "FI" },
        { name: "Polonia", code: "PL" },
        { name: "República Checa", code: "CZ" },
        { name: "Hungría", code: "HU" },
        { name: "Rumania", code: "RO" },
        { name: "Bulgaria", code: "BG" },
        { name: "Grecia", code: "GR" },
        { name: "Turquía", code: "TR" },
        { name: "Rusia", code: "RU" },
        { name: "Ucrania", code: "UA" },
        { name: "China", code: "CN" },
        { name: "Japón", code: "JP" },
        { name: "Corea del Sur", code: "KR" },
        { name: "India", code: "IN" },
        { name: "Tailandia", code: "TH" },
        { name: "Singapur", code: "SG" },
        { name: "Malasia", code: "MY" },
        { name: "Indonesia", code: "ID" },
        { name: "Filipinas", code: "PH" },
        { name: "Vietnam", code: "VN" },
        { name: "Australia", code: "AU" },
        { name: "Nueva Zelanda", code: "NZ" },
        { name: "Sudáfrica", code: "ZA" },
        { name: "Egipto", code: "EG" },
        { name: "Marruecos", code: "MA" },
        { name: "Nigeria", code: "NG" },
        { name: "Kenia", code: "KE" },
        { name: "Israel", code: "IL" },
        { name: "Emiratos Árabes Unidos", code: "AE" },
        { name: "Arabia Saudí", code: "SA" },
        { name: "Catar", code: "QA" },
        { name: "Kuwait", code: "KW" },
        { name: "Bahrein", code: "BH" },
        { name: "Omán", code: "OM" },
        { name: "Jordania", code: "JO" },
        { name: "Líbano", code: "LB" },
        { name: "Irán", code: "IR" },
        { name: "Irak", code: "IQ" },
        { name: "Pakistán", code: "PK" },
        { name: "Bangladesh", code: "BD" },
        { name: "Sri Lanka", code: "LK" },
        { name: "Nepal", code: "NP" },
        { name: "Bután", code: "BT" },
        { name: "Myanmar", code: "MM" },
        { name: "Camboya", code: "KH" },
        { name: "Laos", code: "LA" },
        { name: "Mongolia", code: "MN" },
        { name: "Kazajistán", code: "KZ" },
        { name: "Uzbekistán", code: "UZ" },
        { name: "Kirguistán", code: "KG" },
        { name: "Tayikistán", code: "TJ" },
        { name: "Turkmenistán", code: "TM" },
        { name: "Afganistán", code: "AF" },
        { name: "Georgia", code: "GE" },
        { name: "Armenia", code: "AM" },
        { name: "Azerbaiyán", code: "AZ" },
        { name: "Bielorrusia", code: "BY" },
        { name: "Lituania", code: "LT" },
        { name: "Letonia", code: "LV" },
        { name: "Estonia", code: "EE" },
        { name: "Moldavia", code: "MD" },
        { name: "Eslovaquia", code: "SK" },
        { name: "Eslovenia", code: "SI" },
        { name: "Croacia", code: "HR" },
        { name: "Bosnia y Herzegovina", code: "BA" },
        { name: "Serbia", code: "RS" },
        { name: "Montenegro", code: "ME" },
        { name: "Macedonia del Norte", code: "MK" },
        { name: "Albania", code: "AL" },
        { name: "Kosovo", code: "XK" },
        { name: "Malta", code: "MT" },
        { name: "Chipre", code: "CY" },
        { name: "Islandia", code: "IS" },
        { name: "Irlanda", code: "IE" },
        { name: "Luxemburgo", code: "LU" },
        { name: "Liechtenstein", code: "LI" },
        { name: "Mónaco", code: "MC" },
        { name: "San Marino", code: "SM" },
        { name: "Vaticano", code: "VA" },
        { name: "Andorra", code: "AD" },
      ];
      setCountries(
        fallbackCountries.sort((a, b) => a.name.localeCompare(b.name))
      );
    }
  };

  const fetchRegions = async (countryName) => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: countryName }),
        }
      );
      const data = await response.json();

      if (!data || data.error || !data.data?.states) {
        throw new Error(data.msg || "No se encontraron regiones");
      }

      const regionsList = data.data.states.map((state) => ({
        name: state.name,
        code: state.state_code || state.name.substring(0, 3).toUpperCase(),
      }));

      setRegions(regionsList);
    } catch (error) {
      console.error("Error fetching regions:", error);
      setRegions([]);
    }
  };

  const fetchCities = async (countryName, regionName) => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: countryName,
            state: regionName,
          }),
        }
      );
      const data = await response.json();

      if (!data || data.error || !Array.isArray(data.data)) {
        throw new Error(data.msg || "No se encontraron ciudades");
      }

      setCities(data.data.map((city) => ({ name: city, code: city })));
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    }
  };

  useEffect(() => {
    if (selectedCountry) {
      console.log("Buscando regiones de:", selectedCountry);
      fetchRegions(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedRegion) {
      console.log("Buscando ciudades en:", selectedCountry, selectedRegion);
      fetchCities(selectedCountry, selectedRegion);
    }
  }, [selectedRegion, selectedCountry]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    setSelectedRegion("");
    setCities([]);
    setFormData((prev) => ({
      ...prev,
      country: countryName || "",
      region: "",
      city: "",
    }));
    // fetchRegions(selectedCountry);
  };

  const handleRegionChange = (e) => {
    const regionName = e.target.value;
    setSelectedRegion(regionName);
    setFormData((prev) => ({
      ...prev,
      region: regionName || "",
      city: "",
    }));
    // fetchCities(selectedCountry, selectedRegion);
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      city: cityName || "",
    }));
  };

  const handleOpenModal = (address = null) => {
    setEditAddress(address);
    setForm(
      address ? { ...address } : { address: "", city: "", postalCode: "" }
    );
    setModalOpen(true);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokdecoded = jwtDecode(token);
      formData.idClient = tokdecoded.ID;
      await API.post("/api/shipping-addresses", formData).then((response) => {
        setAddresses((prev) => [...prev, response.data]);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Shipping Address saved succesfully",
          showConfirmButton: false,
          timer: 2000,
        });
      });
      setModalOpen(false);
      setFormData({
        addressLine1: "",
        addressLine2: "",
        city: "",
        region: "",
        country: "",
        postalCode: "",
        fullName: "",
        phone: "",
        idClient: "",
      });
      setSelectedCountry("");
      setSelectedRegion("");
      setCities([]);
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar dirección?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/api/shipping-addresses/${id}`);
          setAddresses((prev) => prev.filter((addr) => addr.id !== id));
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Dirección eliminada exitosamente",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Error eliminando dirección:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la dirección. Por favor, intenta de nuevo más tarde.",
          });
        }
      }
    });
  };

  return (
    <>
      <div className="addresses-container">
        <h1>Direcciones de envío</h1>

        <button onClick={() => handleOpenModal()} className="add-address-btn">
          Agregar dirección de envío
        </button>

        <div className="address-list">
          {loading ? (
            <div className="loading">
              <p>Cargando direcciones...</p>
            </div>
          ) : error ? (
            <div className="error-message-box">
              <p>{error}</p>
              <button onClick={fetchAddresses} className="retry-btn">
                Reintentar
              </button>
            </div>
          ) : Array.isArray(addresses) && addresses.length > 0 ? (
            addresses.map((address, index) => (
              <div key={index} className="address-card">
                <h3>{address.fullName}</h3>
                <p className="line">{address.addressLine1}</p>
                {address.addressLine2 && (
                  <p className="line">{address.addressLine2}</p>
                )}
                <p className="line">
                  {address.city}, {address.region}, {address.country}
                </p>
                {address.postalCode && (
                  <p className="line">Código postal: {address.postalCode}</p>
                )}
                <p className="line">Teléfono: {address.phone}</p>
                <button onClick={() => handleOpenModal(address)}>✏️</button>
                <button onClick={() => handleDelete(address.id)}>🗑️</button>
              </div>
            ))
          ) : (
            <div className="no-addresses">
              <p>No tienes direcciones de envío registradas.</p>
              <p>
                Haz clic en "Agregar dirección de envío" para crear tu primera
                dirección.
              </p>
            </div>
          )}
        </div>
      </div>

      <GlobalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editAddress ? "Editar dirección" : "Agregar dirección"}
      >
        <form onSubmit={handleSubmit} className="address-form-grid">
          <div className="form-column">
            <div className="form-group">
              <label>Nombre completo *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Dirección línea 1 *</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Dirección línea 2 (Opcional)</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label>País *</label>
              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                required
              >
                <option value="">Seleccionar país</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            {regions.length > 0 && (
              <div className="form-group">
                <label>Región *</label>
                <select
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  required
                >
                  <option value="">Seleccionar región</option>
                  {regions.map((region) => (
                    <option key={region.code} value={region.name}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {cities.length > 0 && (
              <div className="form-group">
                <label>Ciudad *</label>
                <select
                  value={formData.city}
                  onChange={handleCityChange}
                  required
                >
                  <option value="">Seleccionar ciudad</option>
                  {cities.map((city) => (
                    <option key={city.code} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Código postal (Opcional)</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              Guardar Dirección
            </button>
          </div>
        </form>
      </GlobalModal>
    </>
  );
}
