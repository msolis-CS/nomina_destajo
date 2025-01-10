import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getTipoMaquinas, saveTipoMaquina, updateTipoMaquina, deleteTipoMaquina } from '../apis/ApiTipoMaquina.js';
import DataGrid, { Column, FilterRow, Paging } from 'devextreme-react/data-grid';
import Swal from 'sweetalert2';
import 'devextreme/dist/css/dx.light.css';

const TipoMaquinaPage = () => {
  const [tipoMaquina, setTipoMaquina] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErrors] = useState({})
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); 
  const [newTipoMaquina, setNewTipoMaquina] = useState({
    tipoMaquinaId: '',
    descripcion: '',
    activo: 'S',
  });

  useEffect(() => {
    const fetchTipoMaquina = async () => {
      try {
        const data = await getTipoMaquinas();
        setTipoMaquina(data.resultado);
      } catch (error) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            fetchTiposMaquina: 'Error al cargar la tabla de los tipos de máquina: ' + error.message,
          }));
      } finally {
        setLoading(false);
      }
    };

    fetchTipoMaquina();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTipoMaquina({ ...newTipoMaquina, [name]: value });
  };

  const handleSave = async () => {
    console.log(newTipoMaquina)

    try {
      if (isEditMode) {
        const response = await updateTipoMaquina(newTipoMaquina.tipoMaquinaId, newTipoMaquina);
        
        if(response.success){
            Swal.fire({
            position: "top-center",
            icon: "success",
            title: response.message,
            showConfirmButton: false,
            timer: 1200
          });
        } else {
          Swal.fire('Error', response.message, 'error');
        }
        
      } else {
        const response = await saveTipoMaquina(newTipoMaquina);        

        if (response.success) {
          Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: response.message,
            showConfirmButton: false,
            timer: 1200,
          });        

        } else {
          Swal.fire('Error', response.message, 'error');
        }
      }
      const data = await getTipoMaquinas();
      setTipoMaquina(data.resultado);
      
      setNewTipoMaquina({ tipoMaquinaId: '', descripcion: '', activo: 'S' });
      setModalVisible(false);
      setIsEditMode(false);      
    } catch (error) {
      if (isEditMode) {
        Swal.fire('Error', error.message || 'No se pudo actualizar el tipo de máquina.', 'error');
      } else {
        Swal.fire('Error', error.message || 'No se pudo guardar el tipo de máquina.', 'error');
      }

    }
  };

  const handleDelete = async (id) => {
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
        Swal.fire({
          title: 'Eliminando...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
  
        const response = await deleteTipoMaquina(id);
  
        if (response.success) {
          Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: response.message,
            showConfirmButton: false,
            timer: 1200,
          });
  
          const data = await getTipoMaquinas();
          setTipoMaquina(data.resultado);;
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'No se pudo eliminar el tipo de máquina.', 'error');
    }
  };
  

  const handleEdit = (id) => {
    const tipo = tipoMaquina.find(item => item.tipoMaquinaId === id);
    setNewTipoMaquina(tipo); 
    setIsEditMode(true); 
    setModalVisible(true); 
  };

  const handleCancel = async() =>{
    setNewTipoMaquina ({
      tipoMaquinaId: '',
      descripcion: '',
      activo: 'S',
     
    })
    setModalVisible(false);
    setIsEditMode(false);
  } 
  
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
            {Object.values(error).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      
      <br />
      <h1>Lista de Tipos de Maquinas</h1>
      <br />
      <button className="btn btn-primary" onClick={() => setModalVisible(true)}>
        Agregar Tipo de Máquina
      </button>
      <br />
      <br />
      <DataGrid dataSource={tipoMaquina} showBorders={true} columnAutoWidth={true} height={400}>
        <FilterRow visible={true} />
        <Paging defaultPageSize={10} />
        <Column dataField="tipoMaquinaId" caption="Tipo de Máquina" width={150} />
        <Column dataField="descripcion" caption="Descripción" allowResizing={true} />
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
                  onClick={() => handleEdit(data.tipoMaquinaId)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDelete(data.tipoMaquinaId)}
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
                <h5 className="modal-title">{isEditMode ? 'Editar Tipo de Máquina' : 'Agregar Tipo de Máquina'}</h5>
                <button type="button" className="btn-close" onClick={() => setModalVisible(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tipo de Máquina ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tipoMaquinaId"
                    value={newTipoMaquina.tipoMaquinaId}
                    onChange={handleInputChange}
                    placeholder="Ingrese el ID"
                    disabled={isEditMode} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    name="descripcion"
                    value={newTipoMaquina.descripcion}
                    onChange={handleInputChange}
                    placeholder="Ingrese la Descripción"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Activo</label>
                  <select
                    className="form-select"
                    name="activo"
                    value={newTipoMaquina.activo}
                    onChange={handleInputChange}
                  >
                    <option value="S">Sí</option>
                    <option value="N">No</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancelar
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

export default TipoMaquinaPage;
