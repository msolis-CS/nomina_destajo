import { useEffect, useState } from 'react';
import 'devextreme/dist/css/dx.light.css';
import { getNominas, updateEstadoNomina } from '../apis/ApiNomina.js';
import {
  getDetalleProduccionByNomina, 
  saveDetalleProduccion, 
  updateDetalleProduccion, 
  deleteDetalleProduccion, 
  updateAplicarDetalleProduccionInSoftland, 
  updateDesaplicarDetalleProduccionInSoftland,
  uploadExcel,
  deleteMultipleDetallesProduccion
} from '../apis/ApiDetalleProduccion.js';
import { getEmpleadoByNomina } from '../apis/ApiEmpleadoNomina.js';
import { getTipoMaquinasActivas } from '../apis/ApiTipoMaquina.js';
import { getCalibresByMaquina } from '../apis/ApiCalibreMaquina.js';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import { Button, DateBox, NumberBox } from 'devextreme-react';
import DataGrid, { Column, Paging, FilterRow, Summary, TotalItem, Selection } from 'devextreme-react/data-grid';
import Swal from 'sweetalert2';
import CheckBox from 'devextreme-react/check-box';
import * as XLSX from 'xlsx';

const NominaPage = () => {
  // Estados para datos generales y formularios
  const [nominas, setNominas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [tipoMaquinas, setTipoMaquinas] = useState([]);
  const [listCalibres, setCalibres] = useState([]);
  const [detalleProduccion, setDetalleProduccion] = useState([]);
  const [error, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [selectedTipoMaquina, setSelectedTipoMaquina] = useState(null);
  const [esDoble, setEsDoble] = useState(false);
  const [selectedCalibre, setSelectedCalibre] = useState(null);
  const [selectedNomina, setSelectedNomina] = useState({
    nominaId: '',
    descripcion: '',
    estado: '',
    consecutivo: null,
    fechaInicio: Date(),
    fechaFin: Date(),
    periodo: Date(),
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [file, setFile] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [horas, setHoras] = useState('');
  const [diaFecha, setDiaFecha] = useState(new Date().toLocaleDateString('en-CA'));

  // Estados para el modal de edición del detalle de producción
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [editingDetalle, setEditingDetalle] = useState(null);

  // ----------------------- Manejo de archivo -----------------------
  const handleFileChange = (event) => {
    setFile(event.event.currentTarget.files[0]);
  };

  // ----------------------- useEffect para cargar datos -----------------------
  useEffect(() => {
    const fetchNominas = async () => {
      try {
        const data = await getNominas();
        setNominas(data.resultado);
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          fetchNominas: 'Error al cargar las nóminas: ' + error.message,
        }));
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
        setErrors((prevErrors) => ({
          ...prevErrors,
          fetchEmpleados: 'Error al cargar los empleados: ' + error.message,
        }));
      }
    };
    fetchEmpleados();
  }, [selectedNomina]);

  useEffect(() => {
    const fetchTipoMaquinas = async () => {
      try {
        const data = await getTipoMaquinasActivas();
        setTipoMaquinas(data.resultado);
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          fetchTipoMaquinas: 'Error al cargar los tipos de máquinas: ' + error.message,
        }));
      }
    };
    fetchTipoMaquinas();
  }, []);

  useEffect(() => {
    const fetchCalibres = async () => {
      if (selectedTipoMaquina) {
        try {
          const data = await getCalibresByMaquina(selectedTipoMaquina);
          setCalibres(data.resultado);
        } catch (error) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            fetchCalibres: 'Error al cargar los calibres: ' + error.message,
          }));
        } finally {
          setLoading(false);
        }
      } else {
        setCalibres([]);
      }
    };
    fetchCalibres();
  }, [selectedTipoMaquina]);

  useEffect(() => {
    fetchDetalleProduccion();
  }, [selectedNomina]);

  // ----------------------- Funciones de carga y utilidades -----------------------
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

  const showAlert = (icon, title, confirm, timer) => {
    Swal.fire({
      position: 'top-center',
      icon: icon,
      title: title,
      showConfirmButton: confirm,
      timer: timer,
    });
  };

  const showLoading = (title) => {
    Swal.fire({
      title: title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  // ----------------------- Funciones para carga y aplicación de datos -----------------------
  const handleUpload = async () => {
    if (file == null) {
      Swal.fire('Error', `Selecciona un archivo.`, 'error');
      return;
    }

    try {
      const response = await uploadExcel(file);
      if (response.success) {
        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1200,
        });
        setFile(null);
        await fetchDetalleProduccion();
      } else {
        showAlert('error', response.message, true, 0);
      }
    } catch (error) { 
      Swal.fire('Error', error.message || 'No se pudo subir el archivo', 'error');
    }
  };

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ["Nomina", "Consecutivo", "Cod Empleado", "Tipo Maquina", "Calibre", "Fecha", "Cantidad", "Horas", "Doble"], 
      ["Texto", "Texto", "Texto", "Texto", "Texto", "Fecha Corta", "Número", "Número", "Texto (S o N)"], 
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    XLSX.writeFile(wb, "Plantilla_Detalle_Produccion.xlsx");
  };

  const validateForm = () => {
    if (!selectedEmpleado || !selectedTipoMaquina || !selectedCalibre || !cantidad || !horas) {
      Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
      return false;
    }
    const diaFechaObj = new Date(diaFecha).toLocaleDateString('en-CA');
    const fechaInicioObj = new Date(selectedNomina.fechaInicio).toLocaleDateString('en-CA');
    const fechaFinObj = new Date(selectedNomina.fechaFin).toLocaleDateString('en-CA');

    if (diaFechaObj < fechaInicioObj || diaFechaObj > fechaFinObj) {
      Swal.fire('Error', `La fecha debe estar entre ${fechaInicioObj} y ${fechaFinObj}.`, 'error');
      return false;
    }
    return true;
  };  

  const handleDateChange = (e) => {
    let selectedDate = e.value;
    if (typeof selectedDate === "string") {
      selectedDate = new Date(selectedDate.replace(/-/g, '/')); 
    }
    setDiaFecha(selectedDate);

    if (selectedDate && selectedDate.getDay() === 0) {
      setEsDoble(true);
    } else {
      setEsDoble(false);
    }
  };

  // ----------------------- Funciones de eliminación y cambio de selección -----------------------
  const handleDelete = async (detalle) => {
    const { id } = detalle;
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    try {
      if (result.isConfirmed) {
        showLoading("Eliminando...");
        const response = await deleteDetalleProduccion(id);
        if (response.success) {
          showAlert('success', response.message, false, 1200);
          await fetchDetalleProduccion();
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'No se pudo eliminar el detalle de producción.', 'error');
    } 
  };
  
  const handleSelectionChange = (e) => {
    setSelectedRowKeys(e.selectedRowKeys);
  };

  const handleDeleteMultiple = async () => {
    if (selectedRowKeys.length === 0) {
      //alert("Seleccione al menos un registro.");
      return;
    }

    const result = await Swal.fire({
      title: `¿Está seguro de eliminar ${selectedRowKeys.length} registros?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    try {
      if (result.isConfirmed) {
        showLoading("Eliminando...");
        const response = await deleteMultipleDetallesProduccion(selectedRowKeys);
        if (response.success) {
        showAlert('success', response.message, false, 1200);
        setDetalleProduccion(detalleProduccion.filter(d => !selectedRowKeys.includes(d.id)));
        setSelectedRowKeys([]); 
          await fetchDetalleProduccion();
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'No se pudo eliminar los registros de detalle de producción.', 'error');
    } 
  };

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
        fechaInicio: nomina.fechaInicio,
        fechaFin: nomina.fechaFin,
      });
    }
  };

  const AplicarNomina = async () => {
    if (!selectedNomina.nominaId) {
      showAlert('error', 'Seleccione la nómina.', true, 0);
      return;
    }

    showLoading("Procesando...");
    try {
      const result = await updateAplicarDetalleProduccionInSoftland(selectedNomina.nominaId, selectedNomina.consecutivo);
      if (result.success) {
        const response = await updateEstadoNomina(selectedNomina.nominaId);
        if (response.success) {
          showAlert('success', result.message, false, 1500);
          await fetchDetalleProduccion();
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      } else {
        showAlert('error', result.message, true, 0);
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Ocurrió un error al aplicar los datos de producción a la nómina.', 'error');
    }
  };

  const DesaplicarNomina = async () => {
    if (!selectedNomina.nominaId) {
      showAlert('error', 'Seleccione la nómina.', true, 0);
      return;
    }
    showLoading("Procesando...");
    try {
      const result = await updateDesaplicarDetalleProduccionInSoftland(selectedNomina.nominaId, selectedNomina.consecutivo);
      if (result.success) {
        showAlert('success', result.message, false, 1200);
        await fetchDetalleProduccion();
      } else {
        showAlert('error', result.message, true, 0);
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Ocurrió un error al desaplicar los datos de producción a la nómina.', 'error');
    }
  };

  // ----------------------- Funciones para guardar nuevo registro -----------------------
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const detalle = {
      nominaId: selectedNomina.nominaId,
      numeroNomina: selectedNomina.consecutivo,
      empleadoId: selectedEmpleado,
      tipoMaquinaId: selectedTipoMaquina,
      calibre: selectedCalibre,
      cantidad: cantidad,
      horas: horas,
      monto: 0,
      diaFecha: diaFecha,
      EsDoble: esDoble ? 'S' : 'N'
    };

    try {
      const response = await saveDetalleProduccion(detalle);
      if (response.success) {
        showAlert('success', response.message, false, 1200);
        await fetchDetalleProduccion();

        setCantidad('');
        setHoras('');
        setSelectedTipoMaquina(null);
        setCalibres(null);
        setEsDoble(false);
      } else {
        Swal.fire('Error', response.message, 'error');
      }      
    } catch (error) {
      Swal.fire('Error', error.message || 'Ocurrió un error al guardar el detalle de producción.', 'error');
    }
  };

  // ----------------------- Funciones para editar registro -----------------------
  const handleEditDetalle = (detalle) => {
    setEditingDetalle({
      id: detalle.id,
      nominaId: detalle.nominaId,
      numeroNomina: detalle.numeroNomina,
      empleadoId: detalle.empleadoId,
      tipoMaquinaId: detalle.tipoMaquinaId,
      calibre: detalle.calibre,
      cantidad: detalle.cantidad,
      horas: detalle.horas,
      diaFecha: detalle.diaFecha,
      esDoble: detalle.esDoble === "S",
    });
    setModalDetalleVisible(true);
  };

  const handleSaveEditDetalle = async () => {
    try {
      const detalle = {
        id: editingDetalle.id,
        tipoMaquinaId: editingDetalle.tipoMaquinaId,
        calibre: editingDetalle.calibre,
        cantidad: editingDetalle.cantidad,
        horas: editingDetalle.horas,
        esDoble: editingDetalle.esDoble ? 'S' : 'N'
      };

      const response = await updateDetalleProduccion(detalle.id, detalle);
      if (response.success) {
        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1200,
        });
        await fetchDetalleProduccion();
      } else {
        Swal.fire('Error', response.message, 'error');
      }
      setModalDetalleVisible(false);
      setEditingDetalle(null);
    } catch (error) {
      Swal.fire('Error', error.message || 'No se pudo actualizar el detalle de producción.', 'error');
    }
  };

  const handleCancelEditDetalle = () => {
    setModalDetalleVisible(false);
    setEditingDetalle(null);
  };

  return (
    <div className="container">
      {loading && (
        <div className="d-flex justify-content-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      )}

      {Object.keys(error).length > 0 && (
        <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
          <strong>Errores:</strong>
          <ul>
            {Object.values(error).map((errorMsg, index) => (
              <li key={index}>{errorMsg}</li>
            ))}
          </ul>
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

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
        <Button
          type="default"
          text="Aplicar"
          onClick={AplicarNomina}
          className="me-3 w-5"
        />
        <Button
          type="danger"
          text="Desaplicar" 
          onClick={DesaplicarNomina}
          className="me-3 w-5"         
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
      <h1>Ingreso de Detalle de Producción</h1>
      <br />
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-8">
            <div className="card p-3">
              <h5 className="card-title">Formulario</h5>
              <form>
                <div className="d-flex align-items-center mb-3">
                  <label htmlFor="empleado" className="me-4">Empleado:</label>
                  <SelectBox
                    value={selectedEmpleado}
                    dataSource={empleados.map((empleado) => {
                      const nombreConId = `${empleado.empleado.nombre} (${empleado.empleadoId})`;
                      return {
                        ...empleado,
                        nombreConId, 
                      };
                    })}
                    displayExpr="nombreConId"
                    valueExpr="empleadoId"
                    onValueChanged={(e) => setSelectedEmpleado(e.value)}
                    className="me-3 w-50"
                    searchEnabled={true}
                    showClearButton={true}
                  />

                  <label htmlFor="diaFecha" className="me-3">Fecha:</label>
                  <DateBox
                    value={diaFecha}
                    onValueChanged={handleDateChange}
                    className="me-3 w-50"
                    displayFormat={"dd/MM/yyyy"}
                  />
                </div>
                <div className="d-flex align-items-center mb-3">
                  <label htmlFor="tipoMaquina" className="me-2">Tipo Máquina:</label>
                  <SelectBox
                    value={selectedTipoMaquina}
                    dataSource={tipoMaquinas}
                    displayExpr="descripcion"
                    valueExpr="tipoMaquinaId"
                    onValueChanged={(e) => setSelectedTipoMaquina(e.value)}
                    className="me-3 w-50"
                    searchEnabled={true}
                    showClearButton={true}
                  />
                  <label htmlFor="calibre" className="me-3">Calibre:</label>
                  <SelectBox
                    value={selectedCalibre}
                    dataSource={listCalibres}
                    displayExpr="calibre"
                    valueExpr="calibre"
                    onValueChanged={(e) => setSelectedCalibre(e.value)}
                    className="me-3 w-50"
                    searchEnabled={true}
                    showClearButton={true}
                  />
                </div>
                <div className="d-flex align-items-center mb-3">
                  <label htmlFor="cantidad" className="me-2">Cantidad:</label>
                  <NumberBox
                    value={cantidad}
                    onValueChanged={(e) => setCantidad(e.value)}
                    className="me-3 w-50"
                  />
                  <label htmlFor="horas" className="me-3">Horas:</label>
                  <NumberBox
                    value={horas}
                    onValueChanged={(e) => setHoras(e.value)}
                    className="me-3 w-50"
                  />
                </div>
                <div className="d-flex align-items-center mb-3">
                  <label htmlFor="esDoble" className="me-2">¿Es Doble?</label>
                  <CheckBox
                    value={esDoble}
                    onValueChanged={(e) => setEsDoble(e.value)}
                    className="me-3 w-50"
                  />
                </div>
                <Button
                  type="success"
                  text="Guardar Detalle"
                  onClick={handleSubmit}
                  stylingMode="contained"
                />
              </form>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">
              <h5 className="card-title">Carga de Archivo</h5>
              <div className="row align-items-center">
                <div className="col-md-12">
                  <TextBox
                    value=""
                    readOnly
                    className="form-control"
                    inputAttr={{
                      type: "file",
                      accept: ".xlsx, .xls",
                      style: { display: "none" },
                    }}
                    onChange={handleFileChange}
                  />
                </div>
                <div className="md-4 mt-2">
                  <Button
                    text="Subir Archivo"
                    type="success"
                    stylingMode="contained"
                    onClick={handleUpload}
                  />
                </div>
                <div className="mt-3">
                  <Button
                    text="Descargar Plantilla"
                    type="default"
                    stylingMode="contained"
                    onClick={handleDownloadTemplate} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h1 className="mt-4">Detalle de Producción</h1>
      <DataGrid
          dataSource={detalleProduccion}
          showBorders={true}
          className="mt-4"
          columnAutoWidth={true}
          height={400}
          keyExpr="id" 
          selectedRowKeys={selectedRowKeys} 
          onSelectionChanged={handleSelectionChange}
        >
          
        <Selection mode="multiple" /> 
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
        <Column 
          dataField="monto" 
          caption="Monto" 
          format="###,###,##0.00" 
          dataType="number" 
          allowResizing={true} 
        />
        <Column
          dataField="esDoble"
          caption="Pago doble"
          allowResizing={true}
          alignment="center"
          cellRender={({ data }) => (
            <CheckBox
              value={data.esDoble === "S"}
              readOnly
            />
          )}
        />
        <Column
          allowResizing={true}
          caption="Acciones"
          width={150}
          cellRender={({ data }) => {
            return (
              <div>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEditDetalle(data)}
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
        <Summary>
          <TotalItem
            column="diaFecha"
            summaryType="custom"
            displayFormat="Totales:"
            alignment="left"
          />
          <TotalItem
            column="cantidad"
            summaryType="sum"
            displayFormat="{0}"
            valueFormat={{
              type: 'fixedPoint',
              precision: 2,
            }}
          />
          <TotalItem
            column="horas"
            summaryType="sum"
            displayFormat="{0}"
            valueFormat={{
              type: 'fixedPoint',
              precision: 2,
            }} 
          />
          <TotalItem
            column="monto"
            summaryType="sum"
            displayFormat="C${0}"
            valueFormat={{
              type: 'fixedPoint',
              precision: 2,
            }}
          />
        </Summary>
      </DataGrid>

      <button 
        className="btn btn-danger mt-2" 
        onClick={handleDeleteMultiple}
        disabled={selectedRowKeys.length === 0} 
      >
        Eliminar Seleccionados
      </button>


      {/* Modal para editar el detalle de producción */}
      {modalDetalleVisible && editingDetalle && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Detalle de Producción</h5>
                <button type="button" className="btn-close" onClick={handleCancelEditDetalle}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Empleado</label>
                  <SelectBox
                    value={editingDetalle.empleadoId}
                    dataSource={empleados}
                    displayExpr="empleado.nombre"
                    valueExpr="empleadoId"
                    onValueChanged={(e) => setEditingDetalle({ ...editingDetalle, empleadoId: e.value })}
                    className="w-100"
                    searchEnabled={true}
                    disabled={true} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha</label>
                  <DateBox
                    value={editingDetalle.diaFecha}
                    onValueChanged={(e) => setEditingDetalle({ ...editingDetalle, diaFecha: e.value })}
                    className="w-100"
                    displayFormat={"dd/MM/yyyy"}
                    disabled={true} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tipo Máquina</label>
                  <SelectBox
                    value={editingDetalle.tipoMaquinaId}
                    dataSource={tipoMaquinas}
                    displayExpr="descripcion"
                    valueExpr="tipoMaquinaId"
                    onValueChanged={(e) => setEditingDetalle({ ...editingDetalle, tipoMaquinaId: e.value })}
                    className="w-100"
                    searchEnabled={true}
                    disabled={true} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Calibre</label>
                  <TextBox
                    value={editingDetalle.calibre}
                    onValueChanged={(e) => setEditingDetalle({ ...editingDetalle, calibre: e.value })}
                    className="w-100"
                    disabled={true} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cantidad</label>
                  <NumberBox
                    value={editingDetalle.cantidad}
                    onValueChanged={(e) => setEditingDetalle({ ...editingDetalle, cantidad: e.value })}
                    className="w-100"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Horas</label>
                  <NumberBox
                    value={editingDetalle.horas}
                    onValueChanged={(e) => setEditingDetalle({ ...editingDetalle, horas: e.value })}
                    className="w-100"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">¿Es Doble?</label>
                  <CheckBox
                    value={editingDetalle.esDoble}
                    onValueChanged={(e) => setEditingDetalle({ ...editingDetalle, esDoble: e.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelEditDetalle}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveEditDetalle}>
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NominaPage;
