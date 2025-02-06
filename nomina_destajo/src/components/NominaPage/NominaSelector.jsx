// NominaSelector.jsx
import { useState } from 'react';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import NumberBox from 'devextreme-react/number-box';
import DateBox from 'devextreme-react/date-box';
import Button from 'devextreme-react/button';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

import {
  updateAplicarDetalleProduccionInSoftland,
  updateDesaplicarDetalleProduccionInSoftland,
} from '../../apis/ApiDetalleProduccion.js';
import { updateEstadoNomina } from '../../apis/ApiNomina.js';

const NominaSelector = ({ nominas, selectedNomina, setSelectedNomina, fetchDetalleProduccion }) => {
  const [selectedValue, setSelectedValue] = useState(null);

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

  const AplicarNomina = async () => {
    if (!selectedNomina || !selectedNomina.nominaId) {
      showAlert('error', 'Seleccione la nómina.', true, 0);
      return;
    }
    showLoading("Procesando...");
    try {
      const result = await updateAplicarDetalleProduccionInSoftland(
        selectedNomina.nominaId,
        selectedNomina.consecutivo
      );
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
      Swal.fire('Error', error.message || 'Ocurrió un error al aplicar la nómina.', 'error');
    }
  };

  const DesaplicarNomina = async () => {
    if (!selectedNomina || !selectedNomina.nominaId) {
      showAlert('error', 'Seleccione la nómina.', true, 0);
      return;
    }
    showLoading("Procesando...");
    try {
      const result = await updateDesaplicarDetalleProduccionInSoftland(
        selectedNomina.nominaId,
        selectedNomina.consecutivo
      );
      if (result.success) {
        showAlert('success', result.message, false, 1200);
        await fetchDetalleProduccion();
      } else {
        showAlert('error', result.message, true, 0);
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Ocurrió un error al desaplicar la nómina.', 'error');
    }
  };

  return (
    <div className="mt-3">
      <div className="d-flex align-items-center mb-3">
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
      {selectedNomina && (
        <>
          <div className="d-flex align-items-center mb-3">
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
          <div className="d-flex align-items-center mb-3">
            <label htmlFor="fechaInicio" className="me-4">Fecha Inicio:</label>
            <DateBox
              id="fechaInicio"
              value={selectedNomina.fechaInicio}
              disabled={true}
              className="me-3 w-22"
              displayFormat="dd/MM/yyyy"
            />
            <label htmlFor="fechaFin" className="me-3">Fecha Fin:</label>
            <DateBox
              id="fechaFin"
              value={selectedNomina.fechaFin}
              disabled={true}
              className="me-3 w-22"
              displayFormat="dd/MM/yyyy"
            />
            <label htmlFor="periodo" className="me-4">Periodo:</label>
            <DateBox
              id="periodo"
              value={selectedNomina.periodo}
              disabled={true}
              className="flex-grow-1"
              displayFormat="dd/MM/yyyy"
            />
          </div>
        </>
      )}
    </div>
  );
};

NominaSelector.propTypes = {
  nominas: PropTypes.array.isRequired,
  selectedNomina: PropTypes.object,
  setSelectedNomina: PropTypes.func.isRequired,
  fetchDetalleProduccion: PropTypes.func.isRequired,
};

export default NominaSelector;
