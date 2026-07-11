/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/* eslint-disable react-hooks/exhaustive-deps */  // 添加这一行
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './App.css';







// 搜索任务模态框组件
const SearchTaskModal = ({ tasksByDate, onClose }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // 获取所有任务
  const getAllTasks = useCallback(() => {
    const allTasks = [];
    Object.entries(tasksByDate).forEach(([date, tasks]) => {
      tasks.forEach(task => {
        allTasks.push({
          ...task,
          date: date
        });
      });
    });
    return allTasks;
  }, [tasksByDate]);
  
  // 执行搜索
 // 执行搜索
const performSearch = useCallback(() => {
  // ✅ 关键修复：没有关键词时，清空结果，不显示任何任务
  if (!searchKeyword.trim()) {
    setSearchResults([]);
    return;
  }
  
  let allTasks = getAllTasks();
  
  // 关键词过滤
  const keyword = searchKeyword.trim().toLowerCase();
  allTasks = allTasks.filter(task => 
    task.text.toLowerCase().includes(keyword) ||
    (task.note && task.note.toLowerCase().includes(keyword)) ||
    (task.reflection && task.reflection.toLowerCase().includes(keyword))
  );
  
  // 分类过滤
  if (selectedCategory !== 'all') {
    allTasks = allTasks.filter(task => task.category === selectedCategory);
  }
  
  // 状态过滤
  if (selectedStatus === 'completed') {
    allTasks = allTasks.filter(task => task.done === true && task.abandoned !== true);
  } else if (selectedStatus === 'incomplete') {
    allTasks = allTasks.filter(task => task.done !== true && task.abandoned !== true);
  } else if (selectedStatus === 'abandoned') {
    allTasks = allTasks.filter(task => task.abandoned === true);
  }
  
  // 按日期倒序排序
  allTasks.sort((a, b) => b.date.localeCompare(a.date));
  
  setSearchResults(allTasks);
}, [searchKeyword, selectedCategory, selectedStatus, getAllTasks]);
  // 监听搜索条件变化
  useEffect(() => {
    performSearch();
  }, [searchKeyword, selectedCategory, selectedStatus, performSearch]);
  
  // 获取所有分类（用于筛选）
  const categories = useMemo(() => {
    const cats = new Set();
    getAllTasks().forEach(task => {
      cats.add(task.category);
    });
    return ['all', ...Array.from(cats)];
  }, [getAllTasks]);
  
  // 统计信息
  const stats = {
    total: searchResults.length,
    completed: searchResults.filter(t => t.done === true && t.abandoned !== true).length,
    incomplete: searchResults.filter(t => t.done !== true && t.abandoned !== true).length,
    abandoned: searchResults.filter(t => t.abandoned === true).length
  };
  
  // 获取任务状态样式
  const getTaskStatusIcon = (task) => {
    if (task.abandoned) {
      return <span style={{ color: '#999', fontSize: '12px' }}>❌</span>;
    }
    if (task.done) {
      return <span style={{ color: '#4caf50', fontSize: '12px' }}>✅</span>;
    }
    return <span style={{ color: '#f44336', fontSize: '12px' }}>⬜</span>;
  };
  
  // 获取分类颜色
  const getCategoryColor = (category) => {
    const colors = {
      '语文': '#FFFCE8',
      '数学': '#E8F5E9',
      '英语': '#FCE4EC',
      '通识': '#E1F5FE',
      '运动': '#E3F2FD',
      '校内': '#61A2Da'
    };
    return colors[category] || '#f0f0f0';
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '10px'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        
        {/* 标题栏 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          flexShrink: 0
        }}>
          <h3 style={{ margin: 0, color: '#61A2Da', fontSize: '16px' }}>
            🔍 搜索任务
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#999',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}
          >
            ×
          </button>
        </div>
        
        {/* 搜索输入框 */}
        <div style={{ marginBottom: '12px', flexShrink: 0 }}>
          <input
            type="text"
            placeholder="输入关键词搜索任务、备注或感想..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        {/* 筛选栏 */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '12px', 
          flexWrap: 'wrap',
          flexShrink: 0
        }}>
          {/* 分类筛选 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '16px',
              border: '1px solid #ddd',
              fontSize: '12px',
              backgroundColor: '#fff'
            }}
          >
            <option value="all">全部分类</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          {/* 状态筛选 */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '16px',
              border: '1px solid #ddd',
              fontSize: '12px',
              backgroundColor: '#fff'
            }}
          >
            <option value="all">全部状态</option>
            <option value="completed">✅ 已完成</option>
            <option value="incomplete">⬜ 未完成</option>
            <option value="abandoned">❌ 已放弃</option>
          </select>
        </div>
        
        {/* 统计信息 */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '12px',
          padding: '8px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          flexShrink: 0
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#666' }}>找到</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a73e8' }}>{stats.total}</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#666' }}>已完成</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4caf50' }}>{stats.completed}</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#666' }}>未完成</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f44336' }}>{stats.incomplete}</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#666' }}>已放弃</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#999' }}>{stats.abandoned}</div>
          </div>
        </div>
        
      
{/* 搜索结果列表 */}
<div style={{
  flex: 1,
  overflowY: 'auto',
  minHeight: 0
}}>
  {!searchKeyword.trim() ? (
    // 没有输入关键词时，显示提示
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      color: '#999',
      fontSize: '13px'
    }}>
      🔍 输入关键词开始搜索
    </div>
  ) : searchResults.length === 0 ? (
    // 有关键词但没有结果
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      color: '#999',
      fontSize: '13px'
    }}>
      没有找到匹配的任务
    </div>
  ) : (
    // 显示搜索结果
    searchResults.map((task, idx) => (
      <div
        key={`${task.id}_${idx}`}
        style={{
          padding: '12px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa',
          borderRadius: '8px',
          marginBottom: '8px'
        }}
      >


                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {/* 状态图标 */}
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    {getTaskStatusIcon(task)}
                  </div>
                  
                  {/* 主要内容 */}
                  <div style={{ flex: 1 }}>
                    {/* 任务文本 */}
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '13px',
                      color: task.done ? '#999' : '#333',
                      textDecoration: task.done ? 'line-through' : 'none',
                      marginBottom: '4px'
                    }}>
                      {task.text}
                    </div>
                    
                    {/* 元信息 */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      fontSize: '10px',
                      color: '#999',
                      marginBottom: '4px'
                    }}>
                      <span>📅 {task.date.slice(5)}</span>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '10px',
                        backgroundColor: getCategoryColor(task.category),
                        color: task.category === '校内' ? '#fff' : '#333'
                      }}>
                        {task.category}{task.subCategory ? ` / ${task.subCategory}` : ''}
                      </span>
                      {task.timeSpent > 0 && (
                        <span>⏱ {Math.floor(task.timeSpent / 60)}分钟</span>
                      )}
                    </div>
                    
                    {/* 备注预览 */}
                    {task.note && (
                      <div style={{
                        fontSize: '11px',
                        color: '#666',
                        backgroundColor: '#f5f5f5',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginTop: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                         {task.note}
                      </div>
                    )}
                    
                    {/* 感想预览 */}
                    {task.reflection && (
                      <div style={{
                        fontSize: '11px',
                        color: '#8B4513',
                        backgroundColor: '#fff9c4',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginTop: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        💡 {task.reflection}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* 关闭按钮 */}
        <div
          onClick={onClose}
          style={{
            marginTop: '12px',
            padding: '10px',
            backgroundColor: '#61A2Da',
            color: '#fff',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            flexShrink: 0
          }}
        >
          关闭
        </div>
      </div>
    </div>
  );
};

// 科目待办模态框 - 在 SubjectGuideModal 组件后面添加
const SubjectTodoModal = ({ onClose, isVisible, tasksByDate = {} }) => {
  const [forceUpdate, setForceUpdate] = useState(Date.now());
  const [activeTab, setActiveTab] = useState('数学');
  const [expandedTodoId, setExpandedTodoId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('regular');
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('subject_todo_entries_v2');
    return saved ? JSON.parse(saved) : {};
  });

  const tabs = ['数学', '语文', '英语', '其他'];

  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate(Date.now());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('subject_todo_entries_v2', JSON.stringify(todos));
  }, [todos]);

 // 在 SubjectTodoModal 组件中，修改 currentTodos 的处理逻辑
const currentTodos = todos[activeTab] || [];

// 分离重点和常规任务，并分别排序（未完成在上，已完成在下）
const getSortedTodos = (todos, isImportant) => {
  const filtered = todos.filter(todo => 
    isImportant ? todo.priority === 'important' : todo.priority !== 'important'
  );
  // 未完成的排前面，已完成的排后面
  return [...filtered.filter(t => !t.done), ...filtered.filter(t => t.done)];
};

const importantTodos = getSortedTodos(currentTodos, true);
const regularTodos = getSortedTodos(currentTodos, false);

  // 查找关联任务
  const findRelatedTasks = useCallback((keyword) => {
    if (!keyword || !tasksByDate) return [];
    
    const relatedTasks = [];
    
    const getSearchCategories = (tab) => {
      switch(tab) {
        case '数学':
          return ['数学', '校内-数学'];
        case '语文':
          return ['语文', '校内-语文'];
        case '英语':
          return ['英语', '校内-英语'];
        case '其他':
          return ['通识', '运动', '其他', '校内'];
        default:
          return [tab];
      }
    };
    
    const searchCategories = getSearchCategories(activeTab);
    
    Object.entries(tasksByDate).forEach(([date, tasks]) => {
      tasks.forEach(task => {
        if (task.done === true && task.text && task.text.includes(keyword)) {
          let taskCategory = task.category;
          if (task.category === '校内' && task.subCategory) {
            taskCategory = `校内-${task.subCategory}`;
          }
          
          const isCategoryMatch = searchCategories.some(cat => 
            taskCategory === cat || taskCategory.includes(cat)
          );
          
          if (isCategoryMatch) {
            const timeMinutes = Math.floor((task.timeSpent || 0) / 60);
            relatedTasks.push({
              id: task.id,
              text: task.text,
              date: date,
              timeMinutes: timeMinutes,
              timeDisplay: timeMinutes > 0 ? `${timeMinutes}分钟` : '未记录',
              category: task.category,
              subCategory: task.subCategory,
              note: task.note || '',
              reflection: task.reflection || ''
            });
          }
        }
      });
    });
    
    return relatedTasks.sort((a, b) => b.date.localeCompare(a.date));
  }, [tasksByDate, activeTab]);

  // 切换完成状态
  const toggleTodo = (todoId) => {
    setTodos(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).map(todo =>
        todo.id === todoId ? { ...todo, done: !todo.done } : todo
      )
    }));
  };

  // 打开添加弹窗
  const handleAddTodo = () => {
    setNewTodoTitle('');
    setSelectedPriority('regular');
    setShowAddModal(true);
  };

  // 保存待办
  const saveTodo = () => {
    if (!newTodoTitle.trim()) {
      alert('请输入待办内容');
      return;
    }
    
    const newTodo = {
      id: Date.now().toString(),
      title: newTodoTitle.trim(),
      keyword: newTodoTitle.trim(),
      createdAt: new Date().toISOString(),
      done: false,
      priority: selectedPriority
    };
    setTodos(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newTodo]
    }));
    setShowAddModal(false);
    setNewTodoTitle('');
  };

  // 编辑待办
  const handleEditTodo = (todo) => {
    const newTitle = window.prompt('编辑待办内容：', todo.title);
    if (newTitle && newTitle.trim()) {
      setTodos(prev => ({
        ...prev,
        [activeTab]: (prev[activeTab] || []).map(t =>
          t.id === todo.id ? { ...t, title: newTitle.trim(), keyword: newTitle.trim() } : t
        )
      }));
    }
  };

  // 删除待办
  const handleDeleteTodo = (todoId) => {
    if (window.confirm('确定要删除这个待办吗？')) {
      setTodos(prev => ({
        ...prev,
        [activeTab]: (prev[activeTab] || []).filter(t => t.id !== todoId)
      }));
    }
  };

  // 获取待办的关联任务和统计
  const getTodoStats = (todo) => {
    const relatedTasks = findRelatedTasks(todo.keyword || todo.title);
    const totalCount = relatedTasks.length;
    const totalMinutes = relatedTasks.reduce((sum, t) => sum + t.timeMinutes, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    
    return {
      relatedTasks,
      totalCount,
      totalMinutes,
      totalHours,
      lastPracticeDate: relatedTasks.length > 0 ? relatedTasks[0].date : null
    };
  };

  // 统计信息
  const stats = {
    total: currentTodos.length,
    completed: currentTodos.filter(t => t.done).length,
    incomplete: currentTodos.filter(t => !t.done).length
  };

  // 渲染单个待办项
  // 渲染单个待办项
const renderTodoItem = (todo) => {
  const { relatedTasks, totalCount, totalMinutes, totalHours } = getTodoStats(todo);
  const isExpanded = expandedTodoId === todo.id;
  const isImportant = todo.priority === 'important';
  const isDone = todo.done;  // 👈 获取完成状态
  
  return (
    <div
      key={todo.id}
      style={{
        backgroundColor: isDone ? '#f5f5f5' : 'white',  // 👈 完成后变灰
        borderRadius: '12px',
        border: isImportant 
          ? (isDone ? '1px solid #ddd' : '1px solid #FF6B6B')  // 👈 完成后边框变灰
          : '1px solid #e5e7eb',
        overflow: 'hidden',
        flexShrink: 0,
        marginBottom: '5px',
        opacity: isDone ? 0.7 : 1  // 👈 完成后降低透明度
      }}
    >
      {/* 主要内容行 */}
      <div
        style={{
          padding: '12px 15px',
          display: 'flex',
      
