//todos 是当前状态
//dispatch 是发动作的函数
//todosReducer 是处理动作的函数
//[] 是初始值

export const TODO_ACTIONS = {
    ADD: "add",
    TOGGLE: "toggle",
    DELETE: "delete",
    CLEAR_COMPLETED: "clearCompleted",
    CLEAR_ALL: "clearAll",
    EDIT: "edit",
};

export default function todosReducer(todos, action) {
    switch (action.type) {
        case TODO_ACTIONS.ADD:
            return [...todos, action.todo];

        case TODO_ACTIONS.TOGGLE:
            return todos.map((todo) =>
                todo.id === action.id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            );

        case TODO_ACTIONS.DELETE:
            return todos.filter((todo) => todo.id !== action.id);

        case TODO_ACTIONS.CLEAR_COMPLETED:
            return todos.filter((todo) => !todo.completed);

        case TODO_ACTIONS.CLEAR_ALL:
            return [];

        case TODO_ACTIONS.EDIT:
            return todos.map((todo) =>
                todo.id === action.id
                    ? { ...todo, text: action.text }
                    : todo
            );

        default:
            return todos;
    }
}
