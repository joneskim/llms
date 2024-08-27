import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ModulePage = ({ module }) => {
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams(); // Extract courseId and moduleId from the route parameters

  const handleCreateQuiz = () => {
    navigate(`/course/${courseId}/modules/${moduleId}/create-quiz`, { state: { module } });
  };

  return (
    <div>
      <h2>{module.module_name}</h2>
      <p>This is the content for {module.module_name}.</p>

      <button onClick={handleCreateQuiz}>Create Quiz for this Module</button>
    </div>
  );
};

export default ModulePage;
