import ProjectsPage from './projects/ProjectsPage';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Layout>
      <div className="container">
        <ProjectsPage />
      </div>
    </Layout>
  );
}

export default App;