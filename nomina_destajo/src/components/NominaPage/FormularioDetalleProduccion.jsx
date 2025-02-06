// FormularioDetalleProduccion.jsx
import  { useState, useEffect } from 'react';
import SelectBox from 'devextreme-react/select-box';
import DateBox from 'devextreme-react/date-box';
import NumberBox from 'devextreme-react/number-box';
import CheckBox from 'devextreme-react/check-box';
import Button from 'devextreme-react/button';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

import { getEmpleadoByNomina } from '../../apis/ApiEmpleadoNomina.js';
import { getTipoMaquinasActivas } from '../../apis/ApiTipoMaquina.js';
import { saveDetalleProduccion } from '../../apis/ApiDetalleProduccion.js';
import { getCalibresByMaquina } from '../../apis/ApiCalibreMaquina.js';

const FormularioDetalleProduccion = ({ selectedNomina, fetchDetalleProduccion }) => {
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [selectedTipoMaquina, setSelectedTipoMaquina] = useState(null);
  const [selectedCalibre, setSelectedCalibre] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [horas, setHoras] = useState('');
  const [diaFecha, setDiaFecha] = useState(new Date().toISOString().split('T')[0]);
  const [esDoble, setEsDoble] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [tipoMaquinas, setTipoMaquinas] = useState([]);
  const [listCalibres, setListCalibres] = useState([]);

  // Cargar empleados al cambiar la nómina seleccionada
  useEffect(() => {
    const fetchEmpleados = async () => {
      if (selectedNomina && selectedNomina.nominaId && selectedNomina.consecutivo !== null) {
        try {
          const data = await getEmpleadoByNomina(
            selectedNomina.nominaId,
            selectedNomina.consecutivo
          );
          setEmpleados(data.resultado);
        } catch (error) {
          Swal.fire('Error', 'Error al cargar empleados: ' + error.message, 'error');
        }
      } else {
        setEmpleados([]);
      }
    };
    fetchEmpleados();
  }, [selectedNomina]);

  // Cargar tipos de máquina (se realiza una sola vez)
  useEffect(() => {
    const fetchTipoMaquinas = async () => {
      try {
        const data = await getTipoMaquinasActivas();
        setTipoMaquinas(data.resultado);
      } catch (error) {
        Swal.fire('Error', 'Error al cargar tipos de máquinas: ' + error.message, 'error');
      }
    };
    fetchTipoMaquinas();
  }, []);

  // Cargar calibres al seleccionar un tipo de máquina
  useEffect(() => {
    const fetchCalibres = async () => {
      if (selectedTipoMaquina) {
        try {
          const data = await getCalibresByMaquina(selectedTipoMaquina);
          setListCalibres(data.resultado);
        } catch (error) {
          Swal.fire('Error', 'Error al cargar calibres: ' + error.message, 'error');
        }
      } else {
        setListCalibres([]);
      }
    };
    fetchCalibres();
  }, [selectedTipoMaquina]);

  const handleDateChange = (e) => {
    let selectedDate = e.value;
    if (typeof selectedDate === 'string') {
      selectedDate = new Date(selectedDate);
    }
    setDiaFecha(selectedDate.toISOString().split('T')[0]);
    if (selectedDate && selectedDate.getDay() === 0) {
      setEsDoble(true);
    } else {
      setEsDoble(false);
    }
  };

  const validateForm = () => {
    if (!selectedEmpleado || !selectedTipoMaquina || !selectedCalibre || !cantidad || !horas) {
      Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
      return false;
    }
    if (selectedNomina) {
      const diaFechaObj = new Date(diaFecha);
      const fechaInicioObj = new Date(selectedNomina.fechaInicio);
      const fechaFinObj = new Date(selectedNomina.fechaFin);
      if (diaFechaObj < fechaInicioObj || diaFechaObj > fechaFinObj) {
        Swal.fire(
          'Error',
          `La fecha debe estar entre ${fechaInicioObj.toLocaleDateString()} y ${fechaFinObj.toLocaleDateString()}.`,
          'error'
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!selectedNomina) {
      Swal.fire('Error', 'Seleccione una nómina primero.', 'error');
      return;
    }
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
      EsDoble: esDoble ? 'S' : 'N',
    };
    try {
      const response = await saveDetalleProduccion(detalle);
      if (response.success) {
        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1200,
        });
        await fetchDetalleProduccion();
        // Reiniciar campos
        setCantidad('');
        setHoras('');
        setSelectedEmpleado(null);
        setSelectedTipoMaquina(null);
        setSelectedCalibre(null);
        setEsDoble(false);
      } else {
        Swal.fire('Error', response.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Ocurrió un error al guardar el detalle de producción.', 'error');
    }
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-8">
          <div className="card p-3">
            <h5 className="card-title">Ingreso de Detalle de Producción</h5>
            <form>
              <div className="d-flex align-items-center mb-3">
                <label htmlFor="empleado" className="me-4">Empleado:</label>
                <SelectBox
                  value={selectedEmpleado}
                  dataSource={empleados}
                  displayExpr="empleado.nombre"
                  valueExpr="empleadoId"
                  onValueChanged={(e) => setSelectedEmpleado(e.value)}
                  className="me-3 w-50"
                  searchEnabled={true}
                />
                <label htmlFor="diaFecha" className="me-3">Fecha:</label>
                <DateBox
                  value={diaFecha}
                  onValueChanged={handleDateChange}
                  className="me-3 w-50"
                  displayFormat="dd/MM/yyyy"
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
      </div>
    </div>
  );
};

FormularioDetalleProduccion.propTypes = {
  selectedNomina: PropTypes.object,
  fetchDetalleProduccion: PropTypes.func.isRequired,
};

export default FormularioDetalleProduccion;
