import "./App.css";

function App() {
  return (
    <div className="app-container">
      <main className="container py-20">
        <div className="card text-center">
          <h1 className="text-4xl font-bold text-blue-700">
            Bienvenido a ServiYa
          </h1>

          <p className="mt-4 text-gray-600">
            Sistema de gestión y contratación
            de servicios a domicilio.
          </p>

          <button className="btn-primary mt-6">
            Explorar servicios
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;