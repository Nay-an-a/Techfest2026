import { Check, ListTodo, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const TASKS_KEY = 'techfest_tasks';

function readTasks() {
  const storedTasks = localStorage.getItem(TASKS_KEY);
  if (storedTasks === null) return [];
  const parsedTasks = JSON.parse(storedTasks);
  if (!Array.isArray(parsedTasks) || parsedTasks.some(task =>
    typeof task.id !== 'string' || typeof task.text !== 'string' || typeof task.completed !== 'boolean'
  )) {
    throw new Error('Saved task data has an invalid format. Clear browser storage to start a fresh list.');
  }
  return parsedTasks;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setTasks(readTasks());
    } catch (storageError) {
      setError(storageError instanceof Error ? storageError.message : 'Could not read saved tasks.');
    } finally {
      setLoaded(true);
    }
  }, []);

  const persistTasks = nextTasks => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(nextTasks));
      setTasks(nextTasks);
      setError('');
      return true;
    } catch {
      setError('Could not save tasks to browser storage. Check your browser storage settings and try again.');
      return false;
    }
  };

  const addTask = event => {
    event.preventDefault();
    const text = input.trim();
    if (!text) {
      setError('Enter a task before adding it.');
      return;
    }
    if (persistTasks([...tasks, { id: crypto.randomUUID(), text, completed: false }])) setInput('');
  };

  const toggleTask = taskId => {
    persistTasks(tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = taskId => {
    persistTasks(tasks.filter(task => task.id !== taskId));
  };

  const clearCorruptTasks = () => {
    try {
      localStorage.removeItem(TASKS_KEY);
      setTasks([]);
      setError('');
    } catch {
      setError('Could not clear saved tasks. Check your browser storage settings and try again.');
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <section className="task-manager panel" aria-labelledby="tasksHeading">
      <div className="task-heading">
        <div className="task-heading-icon"><ListTodo size={20} /></div>
        <div>
          <span className="eyebrow">ONE THING AT A TIME</span>
          <h2 id="tasksHeading">Organizer task list</h2>
        </div>
        <span className="task-progress">{completedCount}/{tasks.length} done</span>
      </div>
      <form className="task-add-form" onSubmit={addTask}>
        <label className="sr-only" htmlFor="newTask">New task</label>
        <input id="newTask" value={input} onChange={event => setInput(event.target.value)} placeholder="Add a task to the list..." maxLength={160} />
        <button className="button button-primary" type="submit"><Plus size={17} /> Add task</button>
      </form>
      {error && <div className="storage-error" role="alert">{error}{error.includes('invalid format') && <button className="text-button" type="button" onClick={clearCorruptTasks}>Clear saved task data</button>}</div>}
      {!loaded ? <div className="task-empty">Loading saved tasks…</div> : tasks.length === 0 ? (
        <div className="task-empty"><strong>Your list starts here.</strong><p>Add a task above and keep the fest moving.</p></div>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li className={`task-row ${task.completed ? 'completed' : ''}`} key={task.id}>
              <button className="task-check" type="button" aria-pressed={task.completed} aria-label={`${task.completed ? 'Mark incomplete' : 'Mark complete'}: ${task.text}`} onClick={() => toggleTask(task.id)}>{task.completed && <Check size={14} />}</button>
              <span>{task.text}</span>
              <button className="icon-button task-remove" type="button" aria-label={`Delete task: ${task.text}`} onClick={() => deleteTask(task.id)}><Trash2 size={15} /></button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
