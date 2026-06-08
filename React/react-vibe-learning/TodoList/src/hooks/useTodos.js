import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import todosReducer, { TODO_ACTIONS } from "../reducers/todosReducer.js";

function getInitialTodos() {
    const savedTodos = localStorage.getItem("todos");

    if (!savedTodos) {
        return [];
    }

    try {
        return JSON.parse(savedTodos);
    } catch {
        return [];
    }
}

export default function useTodos() {
    const [todoText, setTodoText] = useState("");
    const [todos, dispatch] = useReducer(todosReducer, undefined, getInitialTodos);
    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const editInputRef = useRef(null);

    useEffect(() => {
        if (editingId !== null && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [editingId]);

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const handleTodoTextChange = useCallback((event) => {
        setTodoText(event.target.value);
    }, []);

    function handleAddTodo() {
        const nextTodo = todoText.trim();

        if (nextTodo === "") {
            return;
        }
        const newTodo = {
            id: Date.now(),
            text: nextTodo,
            completed: false,
        };

        dispatch({ type: TODO_ACTIONS.ADD, todo: newTodo });
        setTodoText(""); // 添加完后清空输入框
    }

    function handleTodoKeyDown(event) {
        if (event.key === "Enter") {
            handleAddTodo();
        }
    }

    function handleToggleTodo(id) {
        dispatch({ type: TODO_ACTIONS.TOGGLE, id });
    }

    const handleDeleteTodo = useCallback((id) => {
        dispatch({ type: TODO_ACTIONS.DELETE, id });
    }, []);

    function handleClearCompleted() {
        dispatch({ type: TODO_ACTIONS.CLEAR_COMPLETED });
    }

    function handleClearAllTodos() {
        const shouldClear = window.confirm("确定要清空全部任务吗？");

        if (!shouldClear) {
            return;
        }

        dispatch({ type: TODO_ACTIONS.CLEAR_ALL });
    }

    function handleStartEditing(todo) {
        setEditingId(todo.id);
        setEditingText(todo.text);
    }

    function handleEditingTextChange(event) {
        setEditingText(event.target.value);
    }

    function handleSaveEditing(id) {
        const nextEditingText = editingText.trim();
        if (nextEditingText === "") {
            return;
        }

        dispatch({ type: TODO_ACTIONS.EDIT, id, text: nextEditingText });
        setEditingId(null);
        setEditingText("");
    }

    function handleCancelEditing() {
        setEditingId(null);
        setEditingText("");
    }

    function handleEditKeyDown(event, id) {
        if (event.key === "Enter") {
            handleSaveEditing(id);
        }
        if (event.key === "Escape") {
            handleCancelEditing();
        }
    }

    const todoStats = useMemo(() => {
        const totalCount = todos.length;
        const completedCount = todos.filter((todo) => todo.completed).length;
        const activeCount = totalCount - completedCount;
        return { totalCount, completedCount, activeCount };
    }, [todos]);

    const { totalCount, completedCount, activeCount } = todoStats;

    const visibleTodos = useMemo(() => {
        return todos.filter((todo) => {
            if (filter === "active") {
                return !todo.completed;
            }
            if (filter === "completed") {
                return todo.completed;
            }
            return true;
        });
    }, [todos, filter]);

    let emptyMessage = "还没有任务，先添加一条吧。";

    if (todos.length > 0 && filter === "active" && activeCount === 0) {
        emptyMessage = "没有未完成任务。";
    }

    if (todos.length > 0 && filter === "completed" && completedCount === 0) {
        emptyMessage = "没有已完成任务。";
    }

    const hasCompletedTodos = completedCount > 0;

    return {
        todoText,
        todos,
        filter,
        editingId,
        editingText,
        editInputRef,
        totalCount,
        completedCount,
        activeCount,
        visibleTodos,
        emptyMessage,
        hasCompletedTodos,
        setFilter,
        handleTodoTextChange,
        handleAddTodo,
        handleTodoKeyDown,
        handleToggleTodo,
        handleDeleteTodo,
        handleClearCompleted,
        handleClearAllTodos,
        handleStartEditing,
        handleEditingTextChange,
        handleSaveEditing,
        handleCancelEditing,
        handleEditKeyDown,
    };
}
