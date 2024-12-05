import { useEffect, useState } from 'react';
import 'devextreme/dist/css/dx.light.css';
import { getNominas } from '../apis/ApiNomina.js'; 
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import { DateBox, NumberBox } from 'devextreme-react';

const NominaPage = () => {
  const [nominas, setNominas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedNomina, setSelectedNomina] = useState(
    { 
      nominaId: '',
      descripcion: '',
      estado: '', 
      consecutivo: null,
      fechaInicio: Date(),
      fechaFin: Date(),
      periodo: Date()
    });

  useEffect(() => {
    const fetchNominas = async () => {
      try {
        const data = await getNominas();
        setNominas(data.resultado);
      } catch (error) {
        setError('Error al cargar las nóminas: ' + error);
      } finally {
        setLoading(false);
      }
    };
    fetchNominas();
  }, []);

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
        fechaInicio: nomina.nominaHistorico.fechaInicio ,
        fechaFin: nomina.nominaHistorico.fechaFin  
       });
    }
  };

  const handleButtonClick = () => {
    alert(`Opción seleccionada: ${selectedValue}`);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
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
          text="Mostrar Selección"
          onClick={handleButtonClick}
          className="btn-primary"
        />
      </div>
      <br/>
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
      <br/>      
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
    </div>
  );
};

export default NominaPage;
