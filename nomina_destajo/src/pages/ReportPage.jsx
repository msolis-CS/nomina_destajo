import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Button } from 'devextreme-react/button'; 
import { getReporte } from '../Apis/ApiReporte'; 
import { getNominas, getConsecutivos } from '../apis/ApiNomina.js';
import { getEmpleadoByNomina } from '../apis/ApiEmpleadoNomina.js';
import {SelectBox, DateBox} from 'devextreme-react/';
import { getTipoMaquinas } from '../apis/ApiTipoMaquina.js';

const ReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState({});
  const [pdfData, setPdfData] = useState('');
  const [nominas, setNominas] = useState([]);  
  const [tipoMaquinas, setTipoMaquinas] = useState([]);  
  const [consecutivos, setConsecutivos] = useState([]); 
  const [disableTipoMaquina, setDisableTipoMaquina] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [disableEmpleado, setDisableEmpleado] = useState(false); 
  const [filterAndReportData, setFilterAndReportData] = useState({
    reporte: '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    nomina: null,
    numeroNomina: null,
    tipoMaquina: null,
    empleado: null
  })
  const reportes = [
    { tipo: '1', descripcion: 'Reporte de Producción por Máquina' },
    { tipo: '2', descripcion: 'Reporte Producción por Empleado' }
  ]

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
      const fetchTipoMaquina = async () => {
        try {
          const data = await getTipoMaquinas();
          setTipoMaquinas(data.resultado);
        } catch (error) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            fetchTipoMaquina: 'Error al cargar los tipos de máquinas: ' + error.message,
          }));
        } finally {
          setLoading(false);
        }
      };
      fetchTipoMaquina();
    }, []);

    useEffect(() => {
        const fetchConsecutivos = async () => {
          try {
            if (filterAndReportData.nomina  !== null) {
              const data = await getConsecutivos(filterAndReportData.nomina);
              setConsecutivos(data.resultado);
            } else {
              setConsecutivos([]);
            }
          } catch (error) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              fetchConsecutivos: 'Error al cargar los consecutivos: ' + error.message,
            }));
          } finally {
            setLoading(false);
          }          
        };
        fetchConsecutivos();
      }, [filterAndReportData.nomina]);

      useEffect(() => {
        const fetchEmpleados = async () => {
            if (!filterAndReportData.nomina || !filterAndReportData.numeroNomina) {
                setEmpleados([]);
                return;
            }
            try {
                const data = await getEmpleadoByNomina(filterAndReportData.nomina, filterAndReportData.numeroNomina);
                setEmpleados(data.resultado);
            } catch (error) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    fetchEmpleados: 'Error al cargar los empleados: ' + (error.message || "Error desconocido."),
                }));
            } finally {
                setLoading(false);
            }
        };
        fetchEmpleados();
    }, [filterAndReportData.nomina, filterAndReportData.numeroNomina]);

    function filterAndReportDataChanged(e) {
      let name = e.component.option('name');
      let value = e.value;
    
      setFilterAndReportData((prev) => {
        let updatedData = {
          ...prev,
          [name]: value
        };
    

        if (name === 'tipoReporte') {
          updatedData.tipoMaquina = value === '2' ? null : prev.tipoMaquina;
          updatedData.empleado = value === '1' ? null : prev.empleado;

          setDisableTipoMaquina(value === '2');
          setDisableEmpleado(value === '1');
        }
    
        return updatedData;
      });
    }

  const showReport = async () => {
    setLoading(true);
    setErrors({});

    try {
      const data = await getReporte(filterAndReportData.tipoReporte,filterAndReportData.fechaInicio.toISOString().split('T')[0],filterAndReportData.fechaFin.toISOString().split('T')[0],filterAndReportData.nomina,filterAndReportData.numeroNomina,filterAndReportData.tipoMaquina, filterAndReportData.empleado);

      if (data.success && data.base64Pdf) {
        setPdfData(data.base64Pdf); 
        Swal.fire({
          title: 'Éxito!',
          text: 'El reporte se generó correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      } else {
        throw new Error('El reporte no se generó correctamente.');
      }
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al generar el reporte.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Reportes</h1>
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
            {Object.values(error).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      <div className="d-flex align-items-center">
          <label htmlFor="reportes" className="me-4">Reportes:</label>
          <SelectBox
              name='tipoReporte'
              value={filterAndReportData.tipoReporte}
              dataSource={reportes}
              displayExpr="descripcion"
              valueExpr="tipo"
              onValueChanged={filterAndReportDataChanged}
              className="me-3 w-50"
          />
        </div>
      <br/>
        
      <div className="d-flex align-items-center">
        <label htmlFor="nomina" className="me-4">Nómina:</label>
        <SelectBox
          name='nomina'
          value={filterAndReportData.nomina}
          dataSource={nominas}
          displayExpr="descripcion"
          valueExpr="nominaId"
          onValueChanged={filterAndReportDataChanged}
          className="me-3 w-50"
          showClearButton={true}
          searchEnabled={true}
        />
        <label htmlFor="consecutivo" className="me-4">Consecutivo:</label>
          <SelectBox
          name='numeroNomina'
          value={filterAndReportData.numeroNomina}
          dataSource={consecutivos}
          displayExpr="numeroNomina"
          valueExpr="numeroNomina"
          onValueChanged={filterAndReportDataChanged}
          className="me-3 w-50"
          showClearButton={true}
          searchEnabled={true}
        />
      </div>
      <br />
      <div className="d-flex align-items-center">
        <label htmlFor="fechaInicio" className="me-2">Fecha Inicio:</label>
        <DateBox
          id="fechaInicio"
          name='fechaInicio'
          value={filterAndReportData.fechaInicio}
          onValueChanged={filterAndReportDataChanged}
          className="me-3 w-50"
          displayFormat={"dd/MM/yyyy"}
        />
        <label htmlFor="fechaFin" className="me-3">Fecha Fin:</label>
        <DateBox
          id="fechaFin"
          name='fechaFin'
          value={filterAndReportData.fechaFin}
          onValueChanged={filterAndReportDataChanged}
          className="me-3 w-50"
          displayFormat={"dd/MM/yyyy"}
        />         
      </div>
      <br/>        
      <div className="d-flex align-items-center">
        <label htmlFor="tipoMaquina" className="me-2">Tipo de Máquina:</label>
        <SelectBox
            name='tipoMaquina'
            value={filterAndReportData.tipoMaquina}
            dataSource={tipoMaquinas}
            displayExpr="descripcion"
            valueExpr="tipoMaquinaId"
            onValueChanged={filterAndReportDataChanged}
            className="me-3 w-50"
            disabled={disableTipoMaquina}
            showClearButton={true}
            searchEnabled={true}
          />
        <label htmlFor="empleado" className="me-3">Empleado:</label>
        <SelectBox
          name='empleado'
          value={filterAndReportData.empleado}
          dataSource={empleados.map((empleado) => {
            const nombreConId = `${empleado.empleado.nombre} (${empleado.empleadoId})`;
            return {
              ...empleado,
              nombreConId, 
            };
          })}
          displayExpr="nombreConId"
          valueExpr="empleadoId"
          onValueChanged={filterAndReportDataChanged}
          className="me-3 w-50"
          disabled={disableEmpleado}
          showClearButton={true}
          searchEnabled={true}
        />
        </div>
        <br/>
        <div>
          <Button
            text="Imprimir"
            onClick={() => showReport()}
            disabled={loading}
            type="success"
            width={200}
            height={40}
          /> 
        </div>

      {pdfData && (
        <div>
          <h2 className="mt-4">Reporte Generado</h2>
          <embed
            src={`data:application/pdf;base64,${pdfData}`}
            width="100%"
            height="600px"
            type="application/pdf"
          />
        </div>
      )}
    </div>
  );
};

export default ReportPage;
