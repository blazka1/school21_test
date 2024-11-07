import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Form, Button, Table } from 'react-bootstrap';

function App() {
    const [email, setEmail] = useState('');
    const [query, setQuery] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [entries, setEntries] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isCountrySelected, setIsCountrySelected] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        if (query && !isCountrySelected) {
            axios.get(`http://127.0.0.1:8000/api/countries?query=${query}`)
                .then(response => {
                    setCountries(response.data);
                    setShowDropdown(true);
                })
                .catch(error => {
                    console.error('Ошибка при загрузке стран:', error);
                });
        } else {
            setShowDropdown(false);
        }
    }, [query, isCountrySelected]);

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setQuery(country);
        setShowDropdown(false);
        setIsCountrySelected(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:8000/api/add', {
            email: email,
            country: selectedCountry
        })
            .then(response => {
                console.log('Запись добавлена:', response.data);
                fetchEntries();
            })
            .catch(error => {
                console.error('Ошибка при добавлении записи:', error);
            });
    };

    const fetchEntries = () => {
        axios.get('http://127.0.0.1:8000/api/entries')
            .then(response => {
                setEntries(response.data);
            })
            .catch(error => {
                console.error('Ошибка при загрузке записей:', error);
            });
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    return (
        <div className="container mt-5">
            <h1>Добавить Email и Страну</h1>

            <Form onSubmit={handleSubmit}>
                <div className="col-lg-3">
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Введите email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                </div>

                <div className="col-lg-3" ref={dropdownRef}>
                    <Form.Group controlId="formCountry">
                        <Form.Label>Страна</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Начните вводить страну"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setIsCountrySelected(false);
                            }}
                            onFocus={() => !isCountrySelected && setShowDropdown(true)}
                        />

                        {showDropdown && (
                            <div className="dropdown-menu show">
                                {countries.map((country, index) => (
                                    <div
                                        key={index}
                                        className="dropdown-item"
                                        onMouseDown={() => handleCountrySelect(country.value)}
                                    >
                                        {country.value}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Form.Group>
                </div>

                <Button className="mt-2" variant="primary" type="submit">
                    Добавить
                </Button>
            </Form>

            <h2 className="mt-5">Список Записей</h2>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Страна</th>
                    <th>Дата и время добавления</th>
                </tr>
                </thead>
                <tbody>
                {entries.map((entry, index) => (
                    <tr key={index}>
                        <td>{entry.email}</td>
                        <td>{entry.country}</td>
                        <td>{new Date(entry.created_at).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default App;
