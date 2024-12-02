import React, { useEffect, useState } from 'react';
import { getEmpleados } from '../apis/ApiEmpleado.js';
import DataGrid, { Column, FilterRow, Paging } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';

const EmpleadoPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmpleados();
        setEmployees(data.resultado); 
      } catch (error) {
        setError('Error al cargar empleados');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <br/>
      <h1>Lista de Empleados</h1>
      <br/>
      <DataGrid dataSource={employees} showBorders={true} columnAutoWidth={true} height={400}> 
        <FilterRow visible={true} />
        <Paging defaultPageSize={10} />
        <Column dataField="empleadoId" caption="ID" width={100} />
        <Column dataField="nombre" caption="Nombre Completo" allowResizing={true}/>
        <Column dataField="puesto.descripcion" caption="Puesto" allowResizing={true}/>
        <Column dataField="nomina.descripcion" caption="Nómina" allowResizing={true}/>
        <Column dataField="estadoEmpleado.descripcion" caption="Estado" allowResizing={true}/>
        <Column dataField="salarioReferencia" caption="Salario" format="###,###,##0.00" allowResizing={true} dataType="number"/>
        <Column dataField="fechaIngreso" caption="Fecha de Ingreso" dataType="date" format="dd/MM/yyyy" allowResizing={true}/>
      </DataGrid>
    </div>
  );
};

export default EmpleadoPage;
