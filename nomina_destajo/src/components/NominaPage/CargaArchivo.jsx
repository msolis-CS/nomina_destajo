// CargaArchivo.jsx
import  { useState } from 'react';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import Swal from 'sweetalert2';
import { uploadExcel } from '../../apis/ApiDetalleProduccion.js';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';

const CargaArchivo = ({ fetchDetalleProduccion }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.event.currentTarget.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire('Error', 'Selecciona un archivo.', 'error');
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
        Swal.fire('Error', response.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'No se pudo subir el archivo', 'error');
    }
  };

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ['Nomina', 'Consecutivo', 'Cod Empleado', 'Tipo Maquina', 'Calibre', 'Fecha', 'Cantidad', 'Horas', 'Doble'],
      ['Texto', 'Texto', 'Texto', 'Texto', 'Texto', 'Fecha Corta', 'Numero', 'Numero', 'Texto (S o N)'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
    XLSX.writeFile(wb, 'Plantilla_Detalle_Produccion.xlsx');
  };

  return (
    <div className="mt-3">
      <div className="card p-3">
        <h5 className="card-title">Carga de Archivo</h5>
        <div className="row align-items-center">
          <div className="col-md-12">
            <TextBox
              value=""
              readOnly
              className="form-control"
              inputAttr={{
                type: 'file',
                accept: '.xlsx, .xls',
                style: { display: 'none' },
              }}
              onValueChanged={handleFileChange}
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
  );
};

CargaArchivo.propTypes = {
  fetchDetalleProduccion: PropTypes.func.isRequired,
};

export default CargaArchivo;
