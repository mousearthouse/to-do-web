import { useState, useEffect } from 'react';
import './App.css';
import TaskCard from './TaskCard';

class Task implements TaskData {
  desc: string;
  done: boolean;
  constructor(desc: string = "new task") {
    this.desc = desc;
    this.done = false;
  }
}

const App: React.FC = () => {
  const [list, setList] = useState<Array<Task>>([]);
  useEffect(() => {
    async function loadTasksFromFile() {
      try {
        const response = await fetch('/tasks.json');
        const tasks = await response.json();
        setList(tasks);
      } catch (error) {
        console.error('Ошибка при загрузке tasks.json:', error);
      }
    }
    loadTasksFromFile();
  }, []);

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const tasks = JSON.parse(content);
        setList(tasks);
      };
      reader.readAsText(file);
    }
  }

  function handleAddBtn() {
    const newTask = new Task('New Task');
    const updatedList = [...list, newTask];
    setList(updatedList);
  }

  function handleChange(index: number) {
    const updatedList = [...list];
    updatedList[index].done = !updatedList[index].done;
    setList(updatedList);
  }

  function handleEdit(index: number, newDesc: string) {
    const updatedList = [...list];
    updatedList[index].desc = newDesc; // Обновляем описание задачи
    setList(updatedList); // Обновляем состояние
  }

  function handleDelete(index: number) {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
  }

  function handleSaveToFile() {
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  return (
    <>
      <div className="tasks">
        <button onClick={handleAddBtn}>Add new task</button>
        <button className="save" onClick={handleSaveToFile}>Save to JSON</button>
        <input type="file" accept=".json" onChange={handleFileUpload} />
      </div>

      <div className="tasksContainer">
        {list.length > 0 ? (
          list.map((newTask, index) => (
            <TaskCard
              key={index}
              desc={newTask.desc}
              done={newTask.done}
              handleChange={() => handleChange(index)}
              handleDelete={() => handleDelete(index)}
              handleEdit={(newDesc) => handleEdit(index, newDesc)}
            />
          ))
        ) : (
          <h1>пока ничего нет</h1>
        )}
      </div>
    </>
  );
}

export default App;
