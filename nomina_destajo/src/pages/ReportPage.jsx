import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Button } from 'devextreme-react/button'; 
import { LoadPanel } from 'devextreme-react/load-panel';  // Carga con DevExpress
import { getReporte } from '../Apis/ApiReporte'; 

const ReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfData, setPdfData] = useState('');

  const showReport = async (tipoReporte) => {
    setLoading(true);
    setError('');

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
    } catch (err) {
      setError('Error al mostrar el reporte. Intenta nuevamente.');
      console.error('Error al obtener el reporte:', err.message);
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
      <h1 className="text-center mb-4">Reportes</h1>
      <Button
        text="Ver Reporte Tipo 1"
        onClick={() => showReport('1')}
        disabled={loading}
        type="success"
        width={200}
        height={40}
      />

      {loading && (
        <div className="d-flex justify-content-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      )}

      {error && (
          <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
            <strong>¡Error! </strong>{error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
      )}
      
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
