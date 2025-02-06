// DetalleProduccionGrid.jsx

import DataGrid, { Column, Paging, FilterRow, Summary, TotalItem } from 'devextreme-react/data-grid';
import CheckBox from 'devextreme-react/check-box';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

import { deleteDetalleProduccion } from '../../apis/ApiDetalleProduccion';

const DetalleProduccionGrid = ({ detalleProduccion, fetchDetalleProduccion }) => {
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
        Swal.fire({
          title: 'Eliminando...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const response = await deleteDetalleProduccion(id);
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
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'No se pudo eliminar el detalle de producción.', 'error');
    }
  };

  return (
    <div>
      <h1 className="mt-4">Detalle de Producción</h1>
      <DataGrid
        dataSource={detalleProduccion}
        showBorders={true}
        className="mt-4"
        columnAutoWidth={true}
        height={400}
      >
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
            <CheckBox value={data.esDoble === 'S'} readOnly />
          )}
        />
        <Column
          allowResizing={true}
          caption="Acciones"
          width={150}
          cellRender={({ data }) => (
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
          )}
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
            valueFormat={{ type: 'fixedPoint', precision: 2 }}
          />
          <TotalItem
            column="horas"
            summaryType="sum"
            displayFormat="{0}"
            valueFormat={{ type: 'fixedPoint', precision: 2 }}
          />
          <TotalItem
            column="monto"
            summaryType="sum"
            displayFormat="C${0}"
            valueFormat={{ type: 'fixedPoint', precision: 2 }}
          />
        </Summary>
      </DataGrid>
    </div>
  );
};

DetalleProduccionGrid.propTypes = {
  detalleProduccion: PropTypes.array.isRequired,
  fetchDetalleProduccion: PropTypes.func.isRequired,
};

export default DetalleProduccionGrid;
