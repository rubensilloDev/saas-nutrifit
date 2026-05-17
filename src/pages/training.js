/* 
  Lógica funcional para el Registro de Entrenamiento - NutriFit Systems
  Gestión de creación de rutinas y registro de sesiones en LocalStorage.
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const routineCreatorSection = document.getElementById('routine-creator');
    const btnShowCreator = document.getElementById('btn-show-creator');
    const btnCancelCreator = document.getElementById('btn-cancel-creator');
    const creatorTitle = document.getElementById('creator-title');
    const btnSubmitRoutine = document.getElementById('btn-submit-routine');
    const editRoutineIdInput = document.getElementById('edit-routine-id');

    const formCreateRoutine = document.getElementById('form-create-routine');
    const btnAddExercise = document.getElementById('btn-add-exercise-builder');
    const exerciseBuilderList = document.getElementById('exercise-builder-list');

    const selectRoutine = document.getElementById('select-routine');
    const workoutSessionList = document.getElementById('workout-session-list');
    const btnSaveWorkout = document.querySelector('.btn-finish-session');
    const workoutFooterActions = document.getElementById('workout-footer-actions');
    const routinesCountBadge = document.getElementById('routines-count');
    const timerDisplay = document.getElementById('workout-timer');

    // --- ESTADO LOCAL ---
    let routines = JSON.parse(localStorage.getItem('nutrifit_routines')) || [];
    let workoutLogs = JSON.parse(localStorage.getItem('nutrifit_workout_logs')) || [];
    let timerInterval = null;
    let secondsElapsed = 0;

    // --- INICIALIZACIÓN ---
    updateRoutineSelector();
    renderRoutinesList();

    // --- FUNCIONALIDAD: TOGGLE BÓVEDA ---
    const btnToggleVault = document.getElementById('btn-toggle-vault');
    const routinesListContainer = document.getElementById('routines-list-container');
    if (btnToggleVault && routinesListContainer) {
        btnToggleVault.addEventListener('click', () => {
            routinesListContainer.classList.toggle('vault-collapsed');
            btnToggleVault.classList.toggle('vault-collapsed');
        });
    }

    // --- FUNCIONALIDAD: CONTROL DEL CREADOR ---

    btnShowCreator.addEventListener('click', () => {
        resetCreatorForm();
        routineCreatorSection.style.display = 'block';
        btnShowCreator.style.display = 'none';
        if (exerciseBuilderList.innerHTML.trim() === '') {
            addExerciseToBuilder();
        }
    });

    btnCancelCreator.addEventListener('click', () => {
        routineCreatorSection.style.display = 'none';
        btnShowCreator.style.display = 'block';
    });

    function resetCreatorForm() {
        formCreateRoutine.reset();
        exerciseBuilderList.innerHTML = '';
        editRoutineIdInput.value = '';
        creatorTitle.innerHTML = '<i class="ri-add-circle-line"></i> Crear Nueva Rutina';
        btnSubmitRoutine.textContent = 'Guardar Rutina';
    }

    function addExerciseToBuilder(data = null) {
        const exerciseCount = exerciseBuilderList.querySelectorAll('.exercise-build-item').length + 1;
        const exerciseHTML = `
            <div class="exercise-build-item">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h3 style="margin: 0;">Ejercicio ${exerciseCount}</h3>
                    <button type="button" class="btn-remove-ex" style="background:none; border:none; color: #ff5252; cursor:pointer;"><i class="ri-delete-bin-line"></i></button>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label>Nombre del Ejercicio</label>
                        <input type="text" class="input-ex-name" placeholder="Ej: Press de Banca" value="${data ? data.name : ''}">
                    </div>
                    <div class="form-col">
                        <label>Series x Repeticiones</label>
                        <input type="text" class="input-ex-sets" placeholder="Ej: 3 x 10-12" value="${data ? data.planned : ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Notas Técnicas / Objetivo</label>
                    <textarea class="input-ex-notes" placeholder="Ej: Centrarse en la fase excéntrica...">${data ? data.notes : ''}</textarea>
                </div>
            </div>
        `;
        exerciseBuilderList.insertAdjacentHTML('beforeend', exerciseHTML);

        const lastEx = exerciseBuilderList.lastElementChild;
        lastEx.querySelector('.btn-remove-ex').addEventListener('click', () => {
            lastEx.remove();
        });
    }

    btnAddExercise.addEventListener('click', () => addExerciseToBuilder());

    formCreateRoutine.addEventListener('submit', (e) => {
        e.preventDefault();
        const routineName = document.getElementById('routine-name').value;
        const editId = editRoutineIdInput.value;

        if (!routineName) return showToast('Ponle un nombre a la rutina', 'ri-error-warning-line');

        const exercises = [];
        exerciseBuilderList.querySelectorAll('.exercise-build-item').forEach(item => {
            const name = item.querySelector('.input-ex-name').value;
            if (name) {
                exercises.push({
                    name: name,
                    planned: item.querySelector('.input-ex-sets').value,
                    notes: item.querySelector('.input-ex-notes').value
                });
            }
        });

        if (exercises.length === 0) return showToast('Añade al menos un ejercicio', 'ri-error-warning-line');

        if (editId) {
            const index = routines.findIndex(r => r.id == editId);
            if (index !== -1) {
                routines[index].name = routineName;
                routines[index].exercises = exercises;
            }
        } else {
            const newRoutine = {
                id: Date.now(),
                name: routineName,
                exercises: exercises
            };
            routines.push(newRoutine);
        }

        localStorage.setItem('nutrifit_routines', JSON.stringify(routines));

        showToast(editId ? 'Rutina actualizada' : 'Rutina guardada');
        resetCreatorForm();
        routineCreatorSection.style.display = 'none';
        btnShowCreator.style.display = 'block';

        // RE-RENDERIZADO CRÍTICO
        updateRoutineSelector();
        renderRoutinesList();
    });

    // --- FUNCIONALIDAD: LISTADO DE BÓVEDA ---
    function renderRoutinesList() {
        const container = document.getElementById('routines-list-container');
        if (!container) return;

        if (routinesCountBadge) {
            routinesCountBadge.textContent = routines.length;
        }

        if (routines.length === 0) {
            container.innerHTML = '<div style="grid-column: span 12; text-align: center; padding: 40px; opacity: 0.5;"><p>No tienes rutinas en la bóveda todavía.</p></div>';
            return;
        }

        container.innerHTML = '';
        routines.forEach(routine => {
            const routineEl = document.createElement('div');
            routineEl.className = 'routine-item';
            routineEl.innerHTML = `
                <div class="routine-summary">
                    <div>
                        <h4 style="margin:0;">${routine.name}</h4>
                        <span class="meta">${routine.exercises.length} Ejercicios</span>
                    </div>
                    <button class="btn-play-routine" title="Empezar esta rutina">
                        <i class="ri-play-fill"></i>
                    </button>
                </div>
                <div class="routine-details-mini">
                    <ul>
                        ${routine.exercises.slice(0, 3).map(ex => `
                            <li>
                                <span class="ex-name">${ex.name}</span>
                                <span class="ex-plan">${ex.planned}</span>
                            </li>
                        `).join('')}
                        ${routine.exercises.length > 3 ? `<li style="justify-content: center; opacity: 0.5; font-size: 0.8rem; border:none;">+ ${routine.exercises.length - 3} más...</li>` : ''}
                    </ul>
                </div>
                <div class="routine-card-footer">
                    <button class="btn-text btn-edit" data-id="${routine.id}" style="font-size: 0.8rem;"><i class="ri-edit-line"></i> Editar</button>
                    <button class="btn-text btn-delete" data-id="${routine.id}" style="color: #ff5252; font-size: 0.8rem;"><i class="ri-delete-bin-line"></i> Eliminar</button>
                </div>
            `;

            // Listeners corregidos
            routineEl.querySelector('.btn-play-routine').addEventListener('click', () => {
                selectRoutine.value = routine.id;
                selectRoutine.dispatchEvent(new Event('change'));
                document.querySelector('.session-console').scrollIntoView({ behavior: 'smooth' });
            });

            routineEl.querySelector('.btn-edit').addEventListener('click', () => startEditRoutine(routine.id));
            routineEl.querySelector('.btn-delete').addEventListener('click', () => deleteRoutine(routine.id));

            container.appendChild(routineEl);
        });
    }

    function startEditRoutine(id) {
        const routine = routines.find(r => r.id == id);
        if (!routine) return;
        resetCreatorForm();
        editRoutineIdInput.value = routine.id;
        document.getElementById('routine-name').value = routine.name;
        creatorTitle.innerHTML = '<i class="ri-edit-line"></i> Editando Rutina';
        btnSubmitRoutine.textContent = 'Actualizar Rutina';
        routine.exercises.forEach(ex => addExerciseToBuilder(ex));
        routineCreatorSection.style.display = 'block';
        btnShowCreator.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteRoutine(id) {
        if (!confirm('¿Seguro que quieres eliminar esta rutina?')) return;
        routines = routines.filter(r => r.id != id);
        localStorage.setItem('nutrifit_routines', JSON.stringify(routines));
        showToast('Rutina eliminada', 'ri-delete-bin-line');
        updateRoutineSelector();
        renderRoutinesList();
    }

    // --- FUNCIONALIDAD: CONSOLA DE SESIÓN ---

    function updateRoutineSelector() {
        if (!selectRoutine) return;
        selectRoutine.innerHTML = '<option value="">-- Selecciona una rutina para empezar --</option>';
        routines.forEach(routine => {
            const option = document.createElement('option');
            option.value = routine.id;
            option.textContent = routine.name;
            selectRoutine.appendChild(option);
        });
    }

    if (selectRoutine) {
        selectRoutine.addEventListener('change', (e) => {
            const routineId = e.target.value;
            if (!routineId) {
                workoutSessionList.innerHTML = '<div class="empty-session-state"><i class="ri-mickey-line"></i><p>Selecciona una rutina para cargar la consola de entrenamiento</p></div>';
                if (workoutFooterActions) workoutFooterActions.style.display = 'none';
                stopTimer();
                return;
            }
            const selectedRoutine = routines.find(r => r.id == routineId);
            renderWorkoutSession(selectedRoutine);
            if (workoutFooterActions) workoutFooterActions.style.display = 'block';
            startTimer();
        });
    }

    function startTimer() {
        stopTimer();
        secondsElapsed = 0;
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            secondsElapsed++;
            updateTimerDisplay();
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) clearInterval(timerInterval);
    }

    function updateTimerDisplay() {
        if (!timerDisplay) return;
        const hrs = Math.floor(secondsElapsed / 3600);
        const mins = Math.floor((secondsElapsed % 3600) / 60);
        const secs = secondsElapsed % 60;
        timerDisplay.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function renderWorkoutSession(routine) {
        if (!workoutSessionList) return;
        workoutSessionList.innerHTML = '';
        routine.exercises.forEach((ex, index) => {
            const exCard = `
                <div class="logging-exercise-card" data-exercise-index="${index}">
                    <div class="exercise-header">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin:0;">${ex.name}</h3>
                            <span class="ex-plan-badge" style="background: var(--primary); color:white; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight:700;">${ex.planned}</span>
                        </div>
                        ${ex.notes ? `<p class="technical-notes"><strong>Tip:</strong> ${ex.notes}</p>` : ''}
                    </div>

                    <div class="sets-stack">
                        ${renderSetRow(1)}
                        <button type="button" class="btn-text btn-add-set" data-ex-index="${index}">+ Añadir Serie</button>
                    </div>
                </div>
            `;
            workoutSessionList.insertAdjacentHTML('beforeend', exCard);
        });

        workoutSessionList.querySelectorAll('.btn-add-set').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stack = e.target.closest('.sets-stack');
                const setNumber = stack.querySelectorAll('.set-card').length + 1;
                const temp = document.createElement('div');
                temp.innerHTML = renderSetRow(setNumber);
                const newCard = temp.firstElementChild;
                stack.insertBefore(newCard, e.target);
                attachCheckmarkEvents(newCard);
            });
        });

        workoutSessionList.querySelectorAll('.set-card').forEach(card => attachCheckmarkEvents(card));
    }

    function renderSetRow(number) {
        return `
            <div class="set-card">
                <div class="set-card-header">
                    <span class="set-number">Serie ${number}</span>
                    <button type="button" class="checkmark-btn"><i class="ri-check-line"></i></button>
                </div>
                <div class="set-card-fields">
                    <div class="set-field">
                        <label>Peso (kg)</label>
                        <input type="number" class="log-weight" placeholder="0">
                    </div>
                    <div class="set-field">
                        <label>Reps</label>
                        <input type="number" class="log-reps" placeholder="0">
                    </div>
                    <div class="set-field">
                        <label>RIR</label>
                        <select class="log-rir">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3+</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    function attachCheckmarkEvents(row) {
        const btn = row.querySelector('.checkmark-btn');
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            row.classList.toggle('completed');
            if (btn.classList.contains('active')) {
                showToast('Serie completada', 'ri-check-double-line');
            }
        });
    }

    // --- FUNCIONALIDAD: HISTORIAL (Modern Log Style) ---
    const historyListContainer = document.getElementById('history-list-container');
    const filterButtons = document.querySelectorAll('.btn-filter');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderWorkoutHistory(parseInt(btn.dataset.filter));
        });
    });

    function renderWorkoutHistory(daysFilter = 7) {
        if (!historyListContainer) return;
        const now = new Date();
        const filteredLogs = workoutLogs.filter(log => {
            const logDate = new Date(log.date);
            const diffDays = Math.ceil(Math.abs(now - logDate) / (1000 * 60 * 60 * 24));
            return diffDays <= daysFilter;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filteredLogs.length === 0) {
            historyListContainer.innerHTML = '<div style="text-align: center; padding: 40px; opacity: 0.5;"><p>No hay entrenamientos en este período.</p></div>';
            return;
        }

        historyListContainer.innerHTML = '';
        filteredLogs.forEach(log => {
            const dateObj = new Date(log.date);
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = dateObj.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
            const totalSets = log.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

            // Crear resumen de ejercicios (nombres)
            const exSummary = log.exercises.map(ex => ex.name).join(', ');

            const cardHTML = `
                <div class="history-card">
                    <div class="history-card-top">
                        <div class="history-date-badge">
                            <span class="day">${day}</span>
                            <span class="month">${month}</span>
                        </div>
                        <div class="history-card-title">
                            <h4>${log.routineName}</h4>
                            <span class="history-exercises-summary">${exSummary}</span>
                        </div>
                    </div>
                    <div class="history-metrics-row">
                        <div class="h-metric">
                            <i class="ri-list-check-3"></i>
                            <span>${totalSets}<span class="label">Series</span></span>
                        </div>
                        <div class="h-metric">
                            <i class="ri-attachment-line"></i>
                            <span>${log.exercises.length}<span class="label">Ejercicios</span></span>
                        </div>
                        <div class="h-metric">
                            <i class="ri-timer-line"></i>
                            <span>${log.duration || '--:--'}</span>
                        </div>
                    </div>
                </div>
            `;
            historyListContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    renderWorkoutHistory(7);

    if (btnSaveWorkout) {
        btnSaveWorkout.addEventListener('click', () => {
            const routineId = selectRoutine.value;
            if (!routineId) return showToast('Selecciona una rutina para registrar', 'ri-error-warning-line');

            const sessionData = {
                id: Date.now(),
                date: new Date().toISOString(),
                routineName: selectRoutine.options[selectRoutine.selectedIndex].text,
                duration: timerDisplay.textContent,
                exercises: []
            };

            workoutSessionList.querySelectorAll('.logging-exercise-card').forEach(card => {
                const exName = card.querySelector('h3').textContent;
                const sets = [];
                card.querySelectorAll('.set-card').forEach(cardEl => {
                    const weight = cardEl.querySelector('.log-weight').value;
                    const reps = cardEl.querySelector('.log-reps').value;
                    if (weight && reps) {
                        sets.push({
                            weight: weight,
                            reps: reps,
                            rir: cardEl.querySelector('.log-rir').value,
                            completed: cardEl.classList.contains('completed')
                        });
                    }
                });
                if (sets.length > 0) sessionData.exercises.push({ name: exName, sets: sets });
            });

            if (sessionData.exercises.length === 0) return showToast('Registra al menos una serie', 'ri-error-warning-line');

            workoutLogs.push(sessionData);
            localStorage.setItem('nutrifit_workout_logs', JSON.stringify(workoutLogs));
            showToast('¡Sesión Sincronizada!', 'ri-trophy-line');
            stopTimer();
            selectRoutine.value = '';
            selectRoutine.dispatchEvent(new Event('change'));
            renderWorkoutHistory(7);
            document.querySelector('.recent-workouts').scrollIntoView({ behavior: 'smooth' });
        });
    }

    function showToast(message, icon = 'ri-checkbox-circle-line') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
});
