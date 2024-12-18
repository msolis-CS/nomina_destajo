import { useEffect, useState } from 'react';
import 'devextreme/dist/css/dx.light.css';
import { getNominas } from '../apis/ApiNomina.js';
import { getDetalleProduccionByNomina, saveDetalleProduccion, deleteDetalleProduccion } from '../apis/ApiDetalleProduccion.js';
import { getEmpleadoByNomina } from '../apis/ApiEmpleadoNomina.js';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import { DateBox, NumberBox } from 'devextreme-react';
import DataGrid, { Column, Paging, FilterRow } from 'devextreme-react/data-grid';
import Swal from 'sweetalert2';

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

  // Datos para el formulario de ingreso de producción
  const [cantidad, setCantidad] = useState('');
  const [horas, setHoras] = useState('');
  const [monto, setMonto] = useState(0);

  const handleDelete = async (detalle) => {
    const { id } = detalle;

    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteDetalleProduccion(id);
        Swal.fire('Eliminado', 'El detalle de producción se eliminó correctamente.', 'success');
        await fetchDetalleProduccion();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el detalle de producción: ' + error, 'error');
      }
    }
  };

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
          const data = await getDetalleProduccionByNomina(nominaId, consecutivo);
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

  const handleSubmit = async () => {
    if (!selectedEmpleado || !cantidad || !horas) {
      Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
      return;
    }

    const newMonto = parseFloat((cantidad * horas).toFixed(2));
    setMonto(newMonto);

    const detalle = {
      nominaId: selectedNomina.nominaId,
      numeroNomina: selectedNomina.consecutivo,
      empleadoId: selectedEmpleado,
      tipoMaquinaId: "C001",  // Esto lo puedes ajustar según lo necesario
      calibre: "0.5",  // Puedes actualizar este valor si es necesario
      cantidad: cantidad,
      horas: horas,
      monto: newMonto, // Usar el monto calculado
      diaFecha: new Date().toLocaleDateString('en-CA'),
    };

    console.log(detalle)
    try {
      const result = await saveDetalleProduccion(detalle);
      if (result.success) {
        Swal.fire('Éxito', 'El detalle de producción se guardó correctamente.', 'success');
        
        // Refrescar la tabla llamando a la API para obtener los detalles actualizados
        await fetchDetalleProduccion();

        setCantidad('');
        setHoras('');
        setMonto(0);
        setSelectedEmpleado(null); // Limpiar el empleado seleccionado
      } else {
        Swal.fire('Error', 'No se pudo guardar el detalle de producción.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al guardar el detalle de producción: ' + error, 'error');
    }
  };

  const fetchDetalleProduccion = async () => {
    const { nominaId, consecutivo } = selectedNomina;
    if (nominaId && consecutivo !== null) {
      try {
        const data = await getDetalleProduccionByNomina(nominaId, consecutivo);
        setDetalleProduccion(data.resultado);
      } catch (error) {
        Swal.fire('Error', 'No se pudo obtener el detalle de producción: ' + error, 'error');
      }
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
      {/* Display selectedNomina details */}
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
      <br/>
      <div className="d-flex align-items-center">
        <label htmlFor="cantidad" className="me-4">Cantidad:</label>
        <NumberBox
          id="cantidad"
          value={cantidad}
          onValueChanged={(e) => setCantidad(e.value)}
          className="me-3 w-50"
        />
        <label htmlFor="horas" className="me-3">Horas:</label>
        <NumberBox
          id="horas"
          value={horas}
          onValueChanged={(e) => setHoras(e.value)}
          className="me-3 w-50"
        />
      </div>
      <br/>
      <div className="d-flex align-items-center">
        <label htmlFor="monto" className="me-3">Monto:</label>
        <NumberBox
          id="monto"
          value={monto}
          disabled={true}
          className="me-3 w-50"
        />
      </div>
      <br/>
      <button onClick={handleSubmit} className="btn btn-success mt-3">Guardar Detalle de Producción</button>

      <h1 className="mt-4">Detalle de Producción</h1>
      <DataGrid dataSource={detalleProduccion} showBorders={true} className="mt-4" columnAutoWidth={true} height={400}>
        <FilterRow visible={true} />
        <Paging defaultPageSize={5} />
        <Column dataField="id" caption="Id" allowResizing={true} visible={false} />
        <Column dataField="empleadoId" caption="Empleado" width={80} />
        <Column dataField="empleado.nombre" caption="Nombre" allowResizing={true} />
        <Column dataField="tipoMaquinaId" caption="Tipo de Máquina" allowResizing={true} />
        <Column dataField="tipoMaquina.descripcion" caption="Nombre de Máquina" allowResizing={true} />
        <Column dataField="calibre" caption="Calibre" allowResizing={true} />
        <Column dataField="diaFecha" caption="Fecha" dataType="date" format="dd/MM/yyyy" allowResizing={true} />
        <Column dataField="cantidad" caption="Cantidad" allowResizing={true} />
        <Column dataField="horas" caption="Horas" allowResizing={true} />
        <Column dataField="monto" caption="Monto" format="###,###,##0.00" dataType="number" allowResizing={true} />
        <Column
          allowResizing={true}
          caption="Acciones"
          width={150}
          cellRender={({ data }) => {
            return (
              <div>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => console.log('Editar:', data)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDelete(data)}
                >
                  Eliminar
                </button>
              </div>
            );
          }}
        />
      </DataGrid>
    </div>
  );
};

export default NominaPage;
