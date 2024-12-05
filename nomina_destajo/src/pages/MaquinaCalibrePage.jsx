import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getMaquinasCalibre, saveMaquinaCalibre, updateMaquinaCalibre, deleteMaquinaCalibre } from '../apis/ApiCalibreMaquina.js';
import { getTipoMaquinasActivas } from '../apis/ApiTipoMaquina.js'; 
import DataGrid, { Column, FilterRow, Paging } from 'devextreme-react/data-grid';
import Swal from 'sweetalert2';
import 'devextreme/dist/css/dx.light.css';

const MaquinaCalibrePage = () => {
  const [maquinaCalibre, setMaquinaCalibre] = useState([]);
  const [tiposMaquina, setTiposMaquina] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); 
  const [newMaquinaCalibre, setNewMaquinaCalibre] = useState({
    tipoMaquinaId: '',
    calibre: '',
    activo: 'S',
    coeficiente: null,
    peso: null
  });

  useEffect(() => {
    const fetchMaquinaCalibre = async () => {
      try {
        const data = await getMaquinasCalibre();
        setMaquinaCalibre(data.resultado);
      } catch (error) {
        setError('Error al cargar el detalle de calibre por máquina: ' + error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTiposMaquina = async () => {
      try {
        const data = await getTipoMaquinasActivas(); 
        setTiposMaquina(data.resultado);
      } catch (error) {
        setError('Error al cargar los tipos de máquina: ' + error);
      }
    };

    fetchMaquinaCalibre();
    fetchTiposMaquina();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaquinaCalibre({ ...newMaquinaCalibre, [name]: value });
  };

  const handleCancel = async() =>{
    setNewMaquinaCalibre({
      tipoMaquinaId: '',
      calibre: '',
      activo: 'S',
      coeficiente: null,
      peso: null      
    })
    setModalVisible(false);
    setIsEditMode(false);
  }

  const handleSave = async () => {
    console.log('Saving:', newMaquinaCalibre); 
    if (!newMaquinaCalibre.tipoMaquinaId) {
      Swal.fire('Error', 'Debe seleccionar un tipo de máquina', 'error');
      return;
    }
    try {
      if (isEditMode) {
        await updateMaquinaCalibre(newMaquinaCalibre.tipoMaquinaId, newMaquinaCalibre.calibre, newMaquinaCalibre);
        Swal.fire("Detalle de calibre por máquina actualizado con éxito");
      } else {
        await saveMaquinaCalibre(newMaquinaCalibre);
        Swal.fire("Detalle de calibre por máquina guardado con éxito");
      }

      setNewMaquinaCalibre({ tipoMaquinaId: '', calibre: '', activo: 'S', coeficiente: null, peso: null });
      setModalVisible(false);
      setIsEditMode(false);

      const data = await getMaquinasCalibre();
      setMaquinaCalibre(data.resultado);
    } catch (error) {
      if (isEditMode) {
        Swal.fire("Error al actualizar el detalle de calibre por máquina: " + error);
      } else {
        Swal.fire("Error al guardar el detalle de calibre por máquina: " + error);
      }
    }
  };

  const handleDelete = async (idTipoMaquina, calibre) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
      });

      if (result.isConfirmed) {
        await deleteMaquinaCalibre(idTipoMaquina, calibre);
        Swal.fire('Eliminado', 'Detalle de calibre por máquina eliminado con éxito', 'success');
        const data = await getMaquinasCalibre();
        setMaquinaCalibre(data.resultado);
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el detalle de calibre por máquina: ' + error, 'error');
    }
  };

  const handleEdit = (idTipoMaquina, calibre) => {
    const tipo = maquinaCalibre.find(
      (item) => item.tipoMaquinaId === idTipoMaquina && item.calibre === calibre
    );   
  
    setNewMaquinaCalibre(tipo);
    setIsEditMode(true);
    setModalVisible(true);
  };
  

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <br />
      <h1>Lista de Calibres por Máquina</h1>
      <br />
      <button className="btn btn-primary" onClick={() => setModalVisible(true)}>
        Agregar un Calibre de Máquina
      </button>
      <br />
      <br />
      <DataGrid dataSource={maquinaCalibre} showBorders={true} columnAutoWidth={true} height={400}>
        <FilterRow visible={true} />
        <Paging defaultPageSize={10} />
        <Column dataField="tipoMaquinaId" caption="Id Tipo de Máquina" width={100} />
        <Column dataField="tipoMaquina.descripcion" caption="Tipo de Máquina" allowResizing={true} />
        <Column dataField="calibre" caption="Calibre" allowResizing={true} />
        <Column dataField="coeficiente" caption="Coeficiente" allowResizing={true} />
        <Column dataField="activo" caption="Activo" allowResizing={true} 
                calculateDisplayValue={(rowData) => {
                  return rowData.activo === 'S' ? 'Sí' : 'No';
                }}
        />
        <Column
          dataField="fechaCreacion"
          caption="Fecha de Creación"
          dataType="date"
          format="dd/MM/yyyy HH:mm:ss a"
          allowResizing={true}
        />
        <Column
          dataField="fechaActualizacion"
          caption="Fecha de Actualización"
          dataType="date"
          allowResizing={true}
          calculateDisplayValue={(rowData) => {
            const fecha = new Date(rowData.fechaActualizacion);
            if (fecha.getFullYear() === 1 || isNaN(fecha)) {
              return 'No disponible'; 
            }            
            return format(fecha, 'dd/MM/yyyy HH:mm:ss a');
          }}
        />
        <Column
          caption="Acciones"
          width={150}
          cellRender={({ data }) => {
            return (
              <div>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEdit(data.tipoMaquinaId, data.calibre)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDelete(data.tipoMaquinaId, data.calibre)}
                >
                  Eliminar
                </button>
              </div>
            );
          }}
        />
      </DataGrid>

      {modalVisible && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditMode ? 'Editar Detalle de Calibre de la Máquina' : 'Agregar Detalle de Calibre a la Máquina'}</h5>
                <button type="button" className="btn-close" onClick={() => setModalVisible(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tipo de Máquina</label>
                    <select
                    className="form-select"
                    name="tipoMaquinaId"
                    onChange={handleInputChange}
                    disabled={isEditMode} 
                    value={newMaquinaCalibre.tipoMaquinaId}
                    >
                    <option value="">Seleccione un tipo de máquina</option>
                    {tiposMaquina.map((tipo) => (
                        <option key={tipo.tipoMaquinaId} value={tipo.tipoMaquinaId}> 
                        {tipo.descripcion}
                        </option>)
                    )}
                    </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Calibre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="calibre"
                    value={newMaquinaCalibre.calibre}
                    onChange={handleInputChange}
                    placeholder="Ingrese el Calibre"
                    disabled={isEditMode} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Coeficiente</label>
                  <input
                    type="number"
                    className="form-control"
                    name="coeficiente"
                    value={newMaquinaCalibre.coeficiente || 0}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese el Coeficiente"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Peso</label>
                  <input
                    type="number"
                    className="form-control"
                    name="peso"
                    value={newMaquinaCalibre.peso || 0}
                    onChange={handleInputChange}
                    placeholder="Ingrese el Peso"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Activo</label>
                  <select
                    className="form-select"
                    name="activo"
                    value={newMaquinaCalibre.activo}
                    onChange={handleInputChange}
                  >
                    <option value="S">Sí</option>
                    <option value="N">No</option>
                  </select>
                </div>                
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  {isEditMode ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaquinaCalibrePage;
