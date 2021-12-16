export type TaskState = 'loading' | 'success' | 'error';

export interface Task {
  state: TaskState;
  file: File;
  id: string;
  cancel: () => boolean;
}

export type TaskCancel = () => boolean;

export interface State {
  tasks: Task[];
  uploaded: number;
  uploadsCount: number;
  uploading: boolean;
}

const genID = (() => {
  let x = 0;
  return () => (x++).toString();
})();

const createTask = (file: File, cancel: TaskCancel): Task => ({
  id: genID(),
  state: 'loading',
  file,
  cancel,
});

export const listeners: Array<(state: State) => void> = [];

export const defaultState = {
  tasks: [],
  uploaded: 0,
  uploadsCount: 0,
  uploading: false,
};

let state: State = defaultState;

const startUploading = (uploadsCount: number) => {
  state = {
    ...state,
    uploaded: state.uploading ? state.uploaded : 0,
    uploadsCount: state.uploading ? state.uploadsCount + uploadsCount : uploadsCount,
    uploading: true,
  };
  listeners.forEach((listener) => listener(state));
};

const doneUploading = () => {
  state = {
    ...state,
    uploading: false,
  };
  listeners.forEach((listener) => listener(state));
};

const newTask = (file: File, cancel: TaskCancel) => {
  const t = createTask(file, cancel);
  state = {
    ...state,
    tasks: [t, ...state.tasks],
  };
  listeners.forEach((listener) => listener(state));
  return t;
};

const completeTask = (id: string) => {
  const { tasks } = state;
  state = {
    ...state,
    // push complete task to the back
    tasks: tasks
      .map((task) => (task.id === id ? { ...task, state: 'success' } : task))
      .sort((a, b) => {
        if (a.state < b.state) return -1;
        if (a.state > b.state) return 1;
        return 0;
      }) as Task[],
    uploaded: state.uploaded + 1,
  };
  listeners.forEach((listener) => listener(state));
};

const failTask = (id: string) => {
  const { tasks } = state;
  state = {
    ...state,
    tasks: tasks.map((task) => (task.id === id ? { ...task, state: 'error' } : task)),
  };
  listeners.forEach((listener) => listener(state));
};

const clearTasks = () => {
  state = {
    ...state,
    tasks: [],
    uploaded: 0,
    uploadsCount: 0,
    uploading: false,
  };
  listeners.forEach((listener) => listener(state));
};

export const task = {
  start: startUploading,
  done: doneUploading,
  new: newTask,
  complete: completeTask,
  fail: failTask,
  clear: clearTasks,
};

export default task;
