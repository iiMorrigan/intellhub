import TaskItem from './TaskItem';

// TaskList's job is simple: given an array of tasks, render one
// TaskItem per task. This is the classic React "list" pattern using
// tasks.map(). map() walks through every item in the array and turns
// it into a piece of JSX — here, a <TaskItem />. Each item needs a
// unique `key` prop (task.id) so React can efficiently track which
// item is which when the list changes (e.g. after a delete).
function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return <div className="empty-state">No tasks match here yet. Try adjusting your filters.</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
