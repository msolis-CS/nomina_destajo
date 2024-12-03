import React, { useEffect, useState } from 'react';
import { getTipoMaquinas } from '../apis/ApiTipoMaquina.js';
import DataGrid, { Column, FilterRow, Paging } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';

const TipoMaquinaPage = () => {
  const [tipoMaquina, setTipoMaquina] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTipoMaquina = async () => {
      try {
        const data = await getTipoMaquinas();
        setTipoMaquina(data.resultado); 
      } catch (error) {
        setError('Error al cargar tipos de maquina');
      } finally {
        setLoading(false);
      }
    };

    fetchTipoMaquina();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <br/>
      <h1>Lista de Tipos de Maquinas</h1>
      <br/>
      <DataGrid dataSource={tipoMaquina} showBorders={true} columnAutoWidth={true} height={400}> 
        <FilterRow visible={true} />
        <Paging defaultPageSize={10} />
        <Column dataField="tipoMaquinaId" caption="Tipo de Máquina" width={150} />
        <Column dataField="descripcion" caption="Descripción" allowResizing={true}/>
        <Column dataField="activo" caption="Activo" allowResizing={true}/>        
        <Column dataField="fechaCreacion" caption="Fecha de Creación" dataType="date" format="dd/MM/yyyy" allowResizing={true}/>
        <Column dataField="fechaActualizacion" caption="Fecha de Actualización" dataType="date" format="dd/MM/yyyy" allowResizing={true}/>
      </DataGrid>
    </div>
  );
};

export default TipoMaquinaPage;
