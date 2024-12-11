import { useEffect, useState } from 'react';
import 'devextreme/dist/css/dx.light.css';
import { getNominas } from '../apis/ApiNomina.js';
import { getDetalleProduccionById } from '../apis/ApiDetalleProduccion.js';
import { getEmpleadoByNomina } from '../apis/ApiEmpleadoNomina.js';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import { DateBox, NumberBox } from 'devextreme-react';
import DataGrid, { Column, Pager, Paging, FilterRow } from 'devextreme-react/data-grid';

const NominaPage = () => {
  const [nominas, setNominas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [detalleProduccion, setDetalleProduccion] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [selectedNomina, setSelectedNomina] = useState({
    nominaId: '',
    descripcion: '',
    estado: '',
    consecutivo: null,
    fechaInicio: Date(),
    fechaFin: Date(),
    periodo: Date(),
  });

  useEffect(() => {
    const fetchNominas = async () => {
      try {
        const data = await getNominas();
        setNominas(data.resultado);
      } catch (error) {
        setError('Error al cargar las nóminas: ' + error);
      } finally {
        setLoading(false);
      }
    };
    fetchNominas();
  }, []);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const { nominaId, consecutivo } = selectedNomina;
        if (nominaId && consecutivo !== null) {
          const data = await getEmpleadoByNomina(nominaId, consecutivo);
          setEmpleados(data.resultado);
        } else {
          setEmpleados([]);
        }
      } catch (error) {
        setError('Error al cargar los empleados: ' + error);
      }
    };
    fetchEmpleados();
  }, [selectedNomina]);

  useEffect(() => {
    const fetchDetalleProduccion = async () => {
      try {
        const { nominaId, consecutivo } = selectedNomina;
        if (nominaId && consecutivo !== null) {
          const data = await getDetalleProduccionById(nominaId, consecutivo);
          setDetalleProduccion(data.resultado);
        } else {
          setDetalleProduccion([]);
        }
      } catch (error) {
        setError('Error al cargar el detalle de producción: ' + error);
      }
    };
    fetchDetalleProduccion();
  }, [selectedNomina]);

  const handleSelectChange = (e) => {
    const selectedId = e.value;
    setSelectedValue(selectedId);
    const nomina = nominas.find((n) => n.nominaId === selectedId);
    if (nomina) {
      setSelectedNomina({
        nominaId: nomina.nominaId,
        descripcion: nomina.descripcion,
        estado: nomina.estado,
        consecutivo: nomina.nominaHistorico.numeroNomina,
        periodo: nomina.nominaHistorico.periodo,
        fechaInicio: nomina.nominaHistorico.fechaInicio,
        fechaFin: nomina.nominaHistorico.fechaFin,
      });
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <br />
      <h1>Procesamiento de Nómina</h1>
      <br />
      <div className="d-flex align-items-center">
        <label htmlFor="nomina" className="me-3">Nómina:</label>
        <SelectBox
          value={selectedValue}
          dataSource={nominas}
          displayExpr="descripcion"
          valueExpr="nominaId"
          onValueChanged={handleSelectChange}
          className="me-3 w-50"
        />
      </div>
      <br />
      <div className="d-flex align-items-center">
        <label htmlFor="estado" className="me-4">Estado:</label>
        <TextBox
          id="estado"
          value={selectedNomina.estado}
          disabled={true}
          className="me-3 w-50"
        />
        <label htmlFor="consecutivo" className="me-3">Consecutivo:</label>
        <NumberBox
          id="consecutivo"
          value={selectedNomina.consecutivo}
          disabled={true}
          className="flex-grow-1"
        />
      </div>
      <br />
      <div className="d-flex align-items-center">
        <label htmlFor="fechaInicio" className="me-4">Fecha Inicio:</label>
        <DateBox
          id="fechaInicio"
          value={selectedNomina.fechaInicio}
          disabled={true}
          className="me-3 w-22"
          displayFormat={"dd/MM/yyyy"}
        />
        <label htmlFor="fechaFin" className="me-3">Fecha Fin:</label>
        <DateBox
          id="fechaFin"
          value={selectedNomina.fechaFin}
          disabled={true}
          className="me-3 w-22"
          displayFormat={"dd/MM/yyyy"}
        />
        <label htmlFor="periodo" className="me-4">Periodo:</label>
        <DateBox
          id="periodo"
          value={selectedNomina.periodo}
          disabled={true}
          className="flex-grow-1"
          displayFormat={"dd/MM/yyyy"}
        />
      </div>
      <br />
      <h1 className="mt-4">Formulario de Ingreso de Detalle de Producción</h1>
      <br/>
      <div className="d-flex align-items-center">
        <label htmlFor="empleado" className="me-3">Empleado:</label>
        <SelectBox
          value={selectedEmpleado}
          dataSource={empleados}
          displayExpr="empleado.nombre"
          valueExpr="empleadoId"
          onValueChanged={(e) => setSelectedEmpleado(e.value)}
          className="me-3 w-50"
          searchEnabled={true} 
          searchMode="contains" 
          searchExpr="empleado.nombre"
        />

      </div>
      <br />
      <h1 className="mt-4">Detalle de Producción</h1>
      <DataGrid
        dataSource={detalleProduccion}
        showBorders={true}
        className="mt-4"
        columnAutoWidth={true}
        height={400}
      >
        <Paging enabled={true} />
        <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} showInfo={true} showBorders={true} />
        <FilterRow visible={true} />

        <Column dataField="empleadoId" caption="Empleado" />
        <Column dataField="empleado.nombre" caption="Nombre" />
        <Column dataField="tipoMaquinaId" caption="Tipo de Máquina" />
        <Column dataField="tipoMaquina.descripcion" caption="Nombre de Máquina" />
        <Column dataField="calibre" caption="Calibre" />
        <Column dataField="diaFecha" caption="Fecha" dataType="date" format="dd/MM/yyyy" />
        <Column dataField="cantidad" caption="Cantidad" />
        <Column dataField="horas" caption="Horas" />
        <Column dataField="monto" caption="Monto" format="###,###,##0.00" dataType="number" />
      </DataGrid>
    </div>
  );
};

export default NominaPage;
