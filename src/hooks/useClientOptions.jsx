import { useEffect, useState } from 'react';
import axios from 'axios';

const useClientOptions = () => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/drops')
            .then(res => {
                const opts = res.data.data.map(c => ({
                    value: c.Id_Cliente,
                    label: c.nombre
                }));
                setOptions(opts);
            })
            .catch(err => console.error('Error al cargar clientes:', err))
            .finally(() => setLoading(false));
    }, []);

    return { options, loading };
};

export default useClientOptions;
