import type { ISalas } from "../interfaces/salas.interfaces";

interface FiltrosCarteleraProps {
    salas: ISalas[];
    salaFiltro: string;
    categoriaFiltro: string;
    onSalaChange: (sala: string) => void;
    onCategoriaChange: (categoria: string) => void;
}

const categorias = ["todas", "terror", "accion", "comedia", "suspenso"];

export const FiltrosCartelera = ({
    salas,
    salaFiltro,
    categoriaFiltro,
    onSalaChange,
    onCategoriaChange
}: FiltrosCarteleraProps) => {
    return (
        <div className="filters-container">
            <div className="filter-group">
                <label htmlFor="sala-filtro">Filtrar por Sala:</label>
                <select
                    id="sala-filtro"
                    value={salaFiltro}
                    onChange={(e) => onSalaChange(e.target.value)}
                    className="filter-select"
                >
                    <option value="todas">Todas las Salas</option>
                    {salas.map((sala) => (
                        <option key={sala.idSalas} value={sala.idSalas}>
                            Sala {sala.idSalas} ({sala.asientos} asientos)
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="categoria-filtro">Filtrar por Categoría:</label>
                <select
                    id="categoria-filtro"
                    value={categoriaFiltro}
                    onChange={(e) => onCategoriaChange(e.target.value)}
                    className="filter-select"
                >
                    {categorias.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat === "todas" ? "Todas las Categorías" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

