import './App.css';
import { useState } from 'react';

export interface TaskCardProps {
    desc: string;
    done: boolean;
    handleChange: () => void;
    handleDelete: () => void;
    handleEdit: (newDesc: string) => void;
}

const TaskCard = ({ desc, done, handleChange, handleDelete, handleEdit }: TaskCardProps) => {

    const [isEditing, setIsEditing] = useState(false); 
    const [newDesc, setNewDesc] = useState(desc);

    const toggleEdit = () => setIsEditing(!isEditing);

    const handleSave = () => {
    handleEdit(newDesc); // Передаем новое описание в функцию handleEdit
    toggleEdit(); // Выходим из режима редактирования
  };
  return (
    <div key={desc} className="task_card">
      {isEditing ? (
        <>
          <input 
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)} // Обновляем новое описание
          />
          <button onClick={handleSave}>Сохранить</button>
        </>
      ) : (
        <>
          <h3>{desc}</h3>
          <input
            type="checkbox"
            checked={done}
            onChange={handleChange}
          />
          <button onClick={toggleEdit}>✍️</button>
        </>
      )}
      <button onClick={handleDelete} className="delete-btn">❌</button>
    </div>
  );
};

export default TaskCard;