// IMPORTS
import { useState, useRef, useEffect } from 'react';

function App() {
	// STATE
	const [todos, setTodos] = useState(() => {
		const savedTodos = localStorage.getItem('todos');

		if (savedTodos) {
			return JSON.parse(savedTodos);
		} else {
			return [];
		}
	});
	const [inputValue, setInputValue] = useState('');
	const [editMode, setEditMode] = useState(false);
	const [currentTodo, setCurrentTodo] = useState([]);
	const [error, setError] = useState('');

	// REFS
	const inputRef = useRef(null);

	// EFFECTS
	useEffect(() => {
		inputRef.current.focus();
	}, []);

	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(todos));
	}, [todos]);
	// FUNCTIONS
	function handleInputChange(e) {
		setInputValue(e.target.value);
	}

	function handleSubmit(e) {
		e.preventDefault();

		if (Validate(inputValue)) {
			const newTodo = {
				id: Math.random(),
				text: inputValue,
				completed: false,
			};

			//setTodos([...todos, newTodo]);    *** Another way to acheive the same result
			setTodos([...todos].concat(newTodo));
			setInputValue('');
			inputRef.current.focus();
		}
	}

	function Validate(value) {
		if (value === '') {
			// alert('test');
			setError('* Add a todo is a required field.');
			return false;
		} else {
			setError('');
			return true;
		}
	}

	function handleDelete(id) {
		const removeItem = todos.filter((todo) => {
			return todo.id !== id;
		});
		setTodos(removeItem);
	}

	function handleComplete(id) {
		const completeItem = todos.map((todo) => {
			return todo.id === id
				? { ...todo, completed: !todo.completed }
				: { ...todo };
		});
		setTodos(completeItem);
	}

	function handleEditing(id) {
		const editItem = todos.map((todo) => {
			if (todo.id === id) {
				setInputValue(todo.text);
				inputRef.current.focus();
				setEditMode(true);
				setCurrentTodo(todo);
			}
			return null;
		});
	}

	function handleUpdate() {
		const updateItem = todos.map((todo) =>
			todo.id === currentTodo.id ? { ...todo, text: inputValue } : todo
		);
		setTodos(updateItem);
		setEditMode(false);
		setInputValue('');
	}

	function handleCancel() {
		setEditMode(false);
		setInputValue('');
	}

	// JSX
	return (
		<div className='container'>
			<form onSubmit={handleSubmit}>
				<div className='input-group mt-3'>
					<input
						name='inputTodo'
						type='text'
						className='form-control'
						placeholder='Add a todo...'
						value={inputValue}
						onChange={handleInputChange}
						ref={inputRef}
						// autoFocus - HTML attribute way to auto focus an element on load
					/>
					<div className='input-group-append'>
						{editMode ? (
							<div className='btn-group'>
								<button
									type='submit'
									name='btnUpdate'
									className='btn btn-success'
									onClick={handleUpdate}
								>
									Update
								</button>
								<button
									type='button'
									name='btnCancel'
									className='btn btn-danger'
									onClick={handleCancel}
								>
									Cancel
								</button>
							</div>
						) : (
							<button type='submit' className='btn btn-primary'>
								Add Todo
							</button>
						)}
					</div>
				</div>

				<span className='text-danger mb-2'>{error}</span>

				<ul className='list-group mt-3'>
					{todos.map((todo) => (
						<li
							key={todo.id}
							className='list-group-item d-flex justify-content-between align-items-center'
						>
							<input
								type='checkbox'
								className='form-check-input'
								onChange={() => handleComplete(todo.id)}
								checked={todo.completed}
							/>
							{todo.text}
							<div className='btn-group'>
								<button
									className='btn btn-success'
									type='button'
									onClick={() => handleEditing(todo.id)}
								>
									<i className='bi bi-pencil-square'></i>
								</button>
								<button
									type='button'
									className='btn btn-danger'
									onClick={() => handleDelete(todo.id)}
								>
									<i className='bi bi-trash'></i>
								</button>
							</div>
						</li>
					))}
				</ul>
			</form>
		</div>
	);
}

export default App;
