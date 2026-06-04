export default function TodoHeader({
    totalCount,
    completedCount,
    activeCount,
})
{
    return (
        <header className="todo-header">
            <h1>Todo 输入练习</h1>
            <p>练习受控输入框、useState、添加任务和列表渲染。</p>
            <p className="todo-stats">
                全部 {totalCount} 项 · 已完成 {completedCount} 项 · 未完成{" "}
                {activeCount} 项
            </p>
        </header>
    );
}
    