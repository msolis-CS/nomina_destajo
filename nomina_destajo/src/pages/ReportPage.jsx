import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Button } from 'devextreme-react/button'; 
import { getReporte } from '../Apis/ApiReporte'; 
import { getNominas, getConsecutivos } from '../apis/ApiNomina.js';
import {SelectBox, DateBox} from 'devextreme-react/';
import { getTipoMaquinas } from '../apis/ApiTipoMaquina.js';

const ReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState({});
  const [pdfData, setPdfData] = useState('');
  const [nominas, setNominas] = useState([]);  
  const [tipoMaquinas, setTipoMaquinas] = useState([]);  
  const [consecutivos, setConsecutivos] = useState([]);  
  const [filterAndReportData, setFilterAndReportData] = useState({
    reporte: '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    nomina: null,
    numeroNomina: null,
    tipoMaquina: null
  })
  const reportes = [
    { tipo: '1', descripcion: 'Reporte de Producción por Máquina' }
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

    function filterAndReportDataChanged(e) {
      let name = e.component.option('name')
      setFilterAndReportData((prev) => ({
        ...prev,
        [name]: e.value,
      }))
    }  

  const showReport = async (tipoReporte) => {
    setLoading(true);
    setErrors({});

    try {
      const data = await getReporte(tipoReporte);

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
     {/*} <Button
        text="Ver Reporte Tipo 1"
        onClick={() => showReport('1')}
        disabled={loading}
        type="success"
        width={200}
        height={40}
      /> */}

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
          valueExpr="nominaId"
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
        />
      </div>
      <br />
      <div className="d-flex align-items-center">
        <label htmlFor="fechaInicio" className="me-2">Fecha Inicio:</label>
        <DateBox
          id="fechaInicio"
          name='fechaInicio'
          value={filterAndReportData.fechaInicio}
          className="me-3 w-50"
          displayFormat={"dd/MM/yyyy"}
        />
        <label htmlFor="fechaFin" className="me-3">Fecha Fin:</label>
        <DateBox
          id="fechaFin"
          name='fechaFin'
          value={filterAndReportData.fechaFin}
          className="me-3 w-50"
          displayFormat={"dd/MM/yyyy"}
        />         
      </div>
      <br/>        
      <div className="d-flex align-items-center">
        <label htmlFor="tipoMaquina" className="me-3">Tipo de Máquina:</label>
        <SelectBox
          name='tipoMaquina'
          value={filterAndReportData.tipoMaquina}
          dataSource={tipoMaquinas}
          displayExpr="descripcion"
          valueExpr="tipoMaquinaId"
          onValueChanged={filterAndReportDataChanged}
          className="me-3 w-50"
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
