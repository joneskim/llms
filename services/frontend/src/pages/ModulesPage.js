import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchModulesByCourseId, addModule } from '../services/fakeApi'; // Import functions from fakeApi

const ModulesPage = ({ courseId }) => {
  const [modules, setModules] = useState([]);
  const [newModuleName, setNewModuleName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch modules using the fake API
    const fetchModules = async () => {
      const fetchedModules = await fetchModulesByCourseId(courseId);
      setModules(fetchedModules);
    };

    fetchModules();
  }, [courseId]);

  const handleCreateModule = async () => {
    if (newModuleName) {
      const newModule = await addModule(courseId, newModuleName);
      if (newModule) {
        setModules([...modules, newModule]);
        setNewModuleName(''); // Reset input field
      }
    }
  };

  const handleOpenModule = (module) => {
    navigate(`/course/${courseId}/modules/${module.module_id}`, { state: { module } });
  };
  

  return (
    <div>
      <h2>Modules</h2>

      <div>
        {modules.length > 0 ? (
          <ul>
            {modules.map((module) => (
              <li key={module.module_id}>
                <span
                  onClick={() => handleOpenModule(module)}
                  style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                >
                  {module.module_name}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No modules available.</p>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Create a New Module</h3>
        <input
          type="text"
          placeholder="Enter module name"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
        />
        <button onClick={handleCreateModule}>Create Module</button>
      </div>
    </div>
  );
};

export default ModulesPage;
